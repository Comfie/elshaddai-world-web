import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Calendar, MapPin, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { getGroups, getGroupStats } from '@/lib/actions/groups';
import { Skeleton } from '@/components/ui/skeleton';

async function GroupsContent({ searchParams }: { searchParams: { search?: string } }) {
  const { groups, total } = await getGroups({
    search: searchParams.search,
  });
  const stats = await getGroupStats();

  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGroups}</div>
            <p className="text-xs text-muted-foreground">All groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeGroups}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">Across all groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Capacity</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.atCapacity}</div>
            <p className="text-xs text-muted-foreground">Groups at max capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Groups List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Small Groups</CardTitle>
              <CardDescription>
                Manage church small groups, bible studies, and fellowship groups ({total} total)
              </CardDescription>
            </div>
            <Link href="/admin/groups/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Group
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <form action="/admin/groups" method="get" className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search groups by name, leader, or description..."
                defaultValue={searchParams.search}
                className="pl-10"
              />
            </div>
          </form>

          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No groups found</p>
              <Link href="/admin/groups/new">
                <Button>Create First Group</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groups.map((group: any) => (
                <Link key={group.id} href={`/admin/groups/${group.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        {group.isActive ? (
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                      {group.description && (
                        <CardDescription className="line-clamp-2">
                          {group.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {group.leaderName && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Leader:</span>
                          <span className="font-medium">{group.leaderName}</span>
                        </div>
                      )}

                      {group.ministry && (
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="secondary" className="text-xs">
                            {group.ministry.name}
                          </Badge>
                        </div>
                      )}

                      {(group.meetingDay || group.meetingTime) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {group.meetingDay && group.meetingDay}
                            {group.meetingDay && group.meetingTime && ' • '}
                            {group.meetingTime && group.meetingTime}
                          </span>
                        </div>
                      )}

                      {group.meetingLocation && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{group.meetingLocation}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>
                            {group._count.members}
                            {group.maxMembers && `/${group.maxMembers}`} members
                          </span>
                        </div>
                        {group._count.events > 0 && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{group._count.events} events</span>
                          </div>
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

export default function GroupsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Small Groups</h1>
        <p className="text-muted-foreground">
          Manage small groups, bible studies, and fellowship groups
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <GroupsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
