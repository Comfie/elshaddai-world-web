import Link from 'next/link';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Users, ClipboardList, Calendar, Bell, Plus, TrendingUp, UserPlus, AlertCircle, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getMemberStats } from '@/lib/actions/members';
import { format } from 'date-fns';

async function DashboardContent() {
  // Fetch stats from database
  const [memberStats, followUps, eventsCount, noticesCount, upcomingEvents, recentNotices] = await Promise.all([
    getMemberStats(),
    prisma.followUp.count({
      where: {
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
    }),
    prisma.event.count({
      where: {
        eventDate: {
          gte: new Date(),
          lte: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
        status: 'SCHEDULED',
      },
    }),
    prisma.notice.count({
      where: {
        isActive: true,
        publishDate: { lte: new Date() },
        OR: [
          { expiryDate: null },
          { expiryDate: { gte: new Date() } },
        ],
      },
    }),
    // Fetch upcoming events
    prisma.event.findMany({
      where: {
        eventDate: { gte: new Date() },
        status: 'SCHEDULED',
      },
      include: {
        ministry: { select: { name: true } },
      },
      orderBy: { eventDate: 'asc' },
      take: 5,
    }),
    // Fetch recent active notices
    prisma.notice.findMany({
      where: {
        isActive: true,
        publishDate: { lte: new Date() },
        OR: [
          { expiryDate: null },
          { expiryDate: { gte: new Date() } },
        ],
      },
      orderBy: { publishDate: 'desc' },
      take: 5,
    }),
  ]);

  const stats = [
    {
      title: 'Total Members',
      value: memberStats.totalMembers.toString(),
      description: `${memberStats.activeMembers} active`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      href: '/admin/members',
    },
    {
      title: 'Pending Follow-ups',
      value: followUps.toString(),
      description: 'Tasks requiring attention',
      icon: ClipboardList,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      href: '/admin/follow-ups',
    },
    {
      title: 'Upcoming Events',
      value: eventsCount.toString(),
      description: 'Next 30 days',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      href: '/admin/events',
    },
    {
      title: 'Active Notices',
      value: noticesCount.toString(),
      description: 'Current announcements',
      icon: Bell,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      href: '/admin/notices',
    },
  ];

  return (
    <>
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/members/new">
              <Button className="w-full" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </Link>
            <Link href="/admin/follow-ups/new">
              <Button className="w-full" variant="outline">
                <ClipboardList className="h-4 w-4 mr-2" />
                Create Follow-up
              </Button>
            </Link>
            <Link href="/admin/events/new">
              <Button className="w-full" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </Link>
            <Link href="/admin/notices/new">
              <Button className="w-full" variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                New Notice
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Growth Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Growth This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">New Members</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{memberStats.newThisMonth}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Added this month
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Visitors</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {memberStats.visitors}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Need follow-up
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {followUps > 0 ? (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Pending Follow-ups</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {followUps}
                    </p>
                  </div>
                  <Link href="/admin/follow-ups">
                    <Button variant="link" className="px-0 h-auto text-xs">
                      View all follow-ups →
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <p className="text-sm text-muted-foreground">
                    All caught up! No pending follow-ups.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events & Notices Widgets */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Upcoming Events
              </CardTitle>
              <Link href="/admin/events">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming events</p>
                <Link href="/admin/events/new">
                  <Button variant="link" className="text-xs">
                    Create an event →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event: any) => (
                  <Link
                    key={event.id}
                    href={`/admin/events/${event.id}`}
                    className="block p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.eventDate), 'MMM dd, yyyy')}
                          {event.startTime && ` • ${event.startTime}`}
                        </p>
                        {event.ministry && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.ministry.name}
                          </p>
                        )}
                      </div>
                      <Badge className="bg-green-500 text-white text-xs">
                        {event.eventType.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-600" />
                Active Notices
              </CardTitle>
              <Link href="/admin/notices">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentNotices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No active notices</p>
                <Link href="/admin/notices/new">
                  <Button variant="link" className="text-xs">
                    Create a notice →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentNotices.map((notice: any) => (
                  <Link
                    key={notice.id}
                    href={`/admin/notices/${notice.id}`}
                    className="block p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">{notice.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(notice.publishDate), 'MMM dd, yyyy')}
                          {notice.expiryDate &&
                            ` • Expires ${format(new Date(notice.expiryDate), 'MMM dd')}`
                          }
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Badge
                          className={
                            notice.priority === 'URGENT' ? 'bg-red-500 text-white' :
                            notice.priority === 'HIGH' ? 'bg-orange-500 text-white' :
                            'bg-blue-500 text-white'
                          }
                          style={{ fontSize: '10px', padding: '2px 6px' }}
                        >
                          {notice.priority}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Phase 3 Completion Notice */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">🎉 Phase 3 Complete!</CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Events, Notices & Ministries Management is now fully functional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              ✅ What's Working Now:
            </h3>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Events Management</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-blue-700 dark:text-blue-300">
                  <li>Create & edit events</li>
                  <li>Event calendar & scheduling</li>
                  <li>RSVP tracking</li>
                  <li>Event statistics</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Notices & Announcements</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-blue-700 dark:text-blue-300">
                  <li>Create & manage notices</li>
                  <li>Priority & categories</li>
                  <li>Target audiences</li>
                  <li>Expiry management</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Ministries Management</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-blue-700 dark:text-blue-300">
                  <li>Create & manage ministries</li>
                  <li>Assign leaders</li>
                  <li>Member tracking</li>
                  <li>Ministry events</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🚀 Ready to Test:
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              You can now manage all aspects of church events, announcements, and ministries.
              The dashboard shows real-time statistics and upcoming events/notices.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-40" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to El Shaddai World Ministries Admin Portal
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
