import Link from 'next/link';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, ClipboardList, Calendar, Bell, Plus, TrendingUp, UserPlus, AlertCircle } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getMemberStats } from '@/lib/actions/members';

async function DashboardContent() {
  // Fetch stats from database
  const [memberStats, followUps, events, notices] = await Promise.all([
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
      value: events.toString(),
      description: 'Next 30 days',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      href: '/admin/events',
    },
    {
      title: 'Active Notices',
      value: notices.toString(),
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

      {/* Phase 2 Completion Notice */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-green-900 dark:text-green-100">🎉 Phase 2 Complete!</CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Members Management is now fully functional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              ✅ What's Working Now:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-200">
              <li>Add, edit, view, and delete members</li>
              <li>Search and filter members</li>
              <li>Member profile with tabs (Details, Follow-ups, Attendance)</li>
              <li>Live statistics on dashboard</li>
              <li>Quick action buttons</li>
              <li>Beautiful, modern UI with shadcn/ui</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              🚀 Ready to Test:
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              You can now add members, edit their information, and view detailed profiles.
              The dashboard shows real-time statistics from your database.
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
