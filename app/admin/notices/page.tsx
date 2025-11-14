import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Bell, AlertCircle, Clock, Search } from 'lucide-react';
import { getNotices, getNoticeStats } from '@/lib/actions/notices';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

async function NoticesContent({ searchParams }: { searchParams: { search?: string } }) {
  const { notices, total } = await getNotices({
    search: searchParams.search,
  });
  const stats = await getNoticeStats();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'NORMAL':
        return 'bg-blue-500';
      case 'LOW':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'URGENT':
        return 'bg-red-500';
      case 'EVENT':
        return 'bg-green-500';
      case 'PRAYER':
        return 'bg-purple-500';
      case 'MINISTRY':
        return 'bg-blue-500';
      case 'YOUTH':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notices</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotices}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Notices</CardTitle>
            <Bell className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeNotices}</div>
            <p className="text-xs text-muted-foreground">Currently visible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.urgentNotices}</div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringNotices}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Notices List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notices & Announcements</CardTitle>
              <CardDescription>
                Manage church announcements ({total} total)
              </CardDescription>
            </div>
            <Link href="/admin/notices/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Notice
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <form action="/admin/notices" method="get" className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search notices by title, content, or summary..."
                defaultValue={searchParams.search}
                className="pl-10"
              />
            </div>
          </form>

          {notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No notices found</p>
              <Link href="/admin/notices/new">
                <Button>Create First Notice</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <Link key={notice.id} href={`/admin/notices/${notice.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${getPriorityColor(notice.priority)} text-white`}>
                              {notice.priority}
                            </Badge>
                            <Badge className={`${getCategoryColor(notice.category)} text-white`}>
                              {formatCategory(notice.category)}
                            </Badge>
                            {!notice.isActive && (
                              <Badge variant="outline">Inactive</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{notice.title}</CardTitle>
                          <CardDescription className="mt-1">
                            Published {format(new Date(notice.publishDate), 'MMM dd, yyyy')}
                            {notice.expiryDate && (
                              <span> • Expires {format(new Date(notice.expiryDate), 'MMM dd, yyyy')}</span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {notice.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {notice.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                        <span>By {notice.createdByName}</span>
                        <span>•</span>
                        <span>Target: {formatCategory(notice.targetAudience)}</span>
                        {notice.displayOnWebsite && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">Public</Badge>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}

export default function NoticesPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notices & Announcements</h1>
        <p className="text-muted-foreground">
          Manage church announcements and communications
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <NoticesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
