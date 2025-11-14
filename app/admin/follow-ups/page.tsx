import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, ClipboardList, Clock, CheckCircle2, AlertTriangle, Search } from 'lucide-react';
import { getFollowUps, getFollowUpStats } from '@/lib/actions/follow-ups';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isPast } from 'date-fns';

async function FollowUpsContent({ searchParams }: { searchParams: { search?: string } }) {
  const { followUps, total } = await getFollowUps({
    search: searchParams.search,
  });
  const stats = await getFollowUpStats();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500 text-white';
      case 'HIGH':
        return 'bg-orange-500 text-white';
      case 'NORMAL':
        return 'bg-blue-500 text-white';
      case 'LOW':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500 text-white';
      case 'IN_PROGRESS':
        return 'bg-blue-500 text-white';
      case 'COMPLETED':
        return 'bg-green-500 text-white';
      case 'CANCELLED':
        return 'bg-gray-500 text-white';
      case 'NO_RESPONSE':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatReason = (reason: string) => {
    return reason.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFollowUps}</div>
            <p className="text-xs text-muted-foreground">All follow-ups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Not started</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Follow-ups List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Follow-ups</CardTitle>
              <CardDescription>
                Track and manage member follow-ups ({total} total)
              </CardDescription>
            </div>
            <Link href="/admin/follow-ups/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Follow-up
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <form action="/admin/follow-ups" method="get" className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search follow-ups by member name or notes..."
                defaultValue={searchParams.search}
                className="pl-10"
              />
            </div>
          </form>

          {followUps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No follow-ups found</p>
              <Link href="/admin/follow-ups/new">
                <Button>Create First Follow-up</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {followUps.map((followUp: any) => {
                const isOverdue = isPast(new Date(followUp.dueDate)) &&
                  (followUp.status === 'PENDING' || followUp.status === 'IN_PROGRESS');

                return (
                  <Link
                    key={followUp.id}
                    href={`/admin/follow-ups/${followUp.id}`}
                    className="block"
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Member Avatar */}
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={followUp.member.photoUrl || undefined} />
                            <AvatarFallback>
                              {followUp.member.firstName[0]}{followUp.member.lastName[0]}
                            </AvatarFallback>
                          </Avatar>

                          {/* Main Content */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium">
                                  {followUp.member.firstName} {followUp.member.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {formatReason(followUp.reason)}
                                  {followUp.reason === 'OTHER' && followUp.reasonOther &&
                                    `: ${followUp.reasonOther}`
                                  }
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={getPriorityColor(followUp.priority)}>
                                  {followUp.priority}
                                </Badge>
                                <Badge className={getStatusColor(followUp.status)}>
                                  {followUp.status}
                                </Badge>
                                {isOverdue && (
                                  <Badge className="bg-red-500 text-white">OVERDUE</Badge>
                                )}
                              </div>
                            </div>

                            {followUp.initialNotes && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {followUp.initialNotes}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                Assigned to: {followUp.assignedToName}
                              </span>
                              <span>•</span>
                              <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                                Due: {format(new Date(followUp.dueDate), 'MMM dd, yyyy')}
                              </span>
                              {followUp.method && (
                                <>
                                  <span>•</span>
                                  <span>{formatReason(followUp.method)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
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
      <div className="grid gap-4 md:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}

export default function FollowUpsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Follow-ups</h1>
        <p className="text-muted-foreground">
          Track and manage member follow-ups and pastoral care
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <FollowUpsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
