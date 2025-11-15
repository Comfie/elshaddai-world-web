import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Calendar, Mail, Phone, Search, CheckCircle2, X } from 'lucide-react';
import { getMinistries, getMinistryStats } from '@/lib/actions/ministries';
import { Skeleton } from '@/components/ui/skeleton';

async function MinistriesContent({ searchParams }: { searchParams: { search?: string } }) {
  const { ministries, total } = await getMinistries({
    search: searchParams.search,
  });
  const stats = await getMinistryStats();

  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ministries</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMinistries}</div>
            <p className="text-xs text-muted-foreground">All ministries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMinistries}</div>
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
            <p className="text-xs text-muted-foreground">Across all ministries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Events</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withUpcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Upcoming events</p>
          </CardContent>
        </Card>
      </div>

      {/* Ministries List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ministries & Departments</CardTitle>
              <CardDescription>
                Manage church ministries and departments ({total} total)
              </CardDescription>
            </div>
            <Link href="/admin/ministries/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Ministry
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <form action="/admin/ministries" method="get" className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search ministries by name or description..."
                defaultValue={searchParams.search}
                className="pl-10"
              />
            </div>
          </form>

          {ministries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No ministries found</p>
              <Link href="/admin/ministries/new">
                <Button>Create First Ministry</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ministries.map((ministry: any) => (
                <Link key={ministry.id} href={`/admin/ministries/${ministry.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg">{ministry.name}</CardTitle>
                        {ministry.isActive ? (
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                      {ministry.description && (
                        <CardDescription className="line-clamp-2">
                          {ministry.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {ministry.leader && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Leader:</span>
                          <span className="font-medium">{ministry.leader.name}</span>
                        </div>
                      )}

                      {ministry.contactEmail && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground truncate">
                            {ministry.contactEmail}
                          </span>
                        </div>
                      )}

                      {ministry.contactPhone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{ministry.contactPhone}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground border-t">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{ministry._count.members} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{ministry._count.events} events</span>
                        </div>
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

export default function MinistriesPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ministries & Departments</h1>
        <p className="text-muted-foreground">
          Manage church ministries, departments, and their leaders
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <MinistriesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
