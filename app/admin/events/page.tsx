import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, Users, Clock, Search, Video } from 'lucide-react';
import { getEvents, getEventStats } from '@/lib/actions/events';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

async function EventsContent({ searchParams }: { searchParams: { search?: string } }) {
  const { events, total } = await getEvents({
    search: searchParams.search,
    upcoming: true,
  });
  const stats = await getEventStats();

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'SERVICE':
        return 'bg-blue-500';
      case 'PRAYER_MEETING':
        return 'bg-purple-500';
      case 'CONFERENCE':
        return 'bg-green-500';
      case 'OUTREACH':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatEventType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonthEvents}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredEvents}</div>
            <p className="text-xs text-muted-foreground">Highlighted events</p>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Events</CardTitle>
              <CardDescription>
                Manage church events and activities ({total} total)
              </CardDescription>
            </div>
            <Link href="/admin/events/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <form action="/admin/events" method="get" className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search events by title, description, or location..."
                defaultValue={searchParams.search}
                className="pl-10"
              />
            </div>
          </form>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No events found</p>
              <Link href="/admin/events/new">
                <Button>Create First Event</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Link key={event.id} href={`/admin/events/${event.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">
                            {event.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {format(new Date(event.eventDate), 'EEEE, MMM dd, yyyy')}
                          </CardDescription>
                        </div>
                        <Badge className={`${getEventTypeColor(event.eventType)} text-white shrink-0`}>
                          {formatEventType(event.eventType)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {event.startTime && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {event.startTime}
                            {event.endTime && ` - ${event.endTime}`}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {event.isOnline ? (
                          <>
                            <Video className="h-4 w-4" />
                            <span>Online Event</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">{event.location}</span>
                          </>
                        )}
                      </div>

                      {event.ministry && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{event.ministry.name}</span>
                        </div>
                      )}

                      {event.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        {event.isFeatured && (
                          <Badge variant="outline" className="text-xs">
                            Featured
                          </Badge>
                        )}
                        {event.requiresRSVP && (
                          <Badge variant="outline" className="text-xs">
                            RSVP Required
                          </Badge>
                        )}
                        {event.displayOnWebsite && (
                          <Badge variant="outline" className="text-xs">
                            Public
                          </Badge>
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

export default function EventsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground">
          Manage church events and activities
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <EventsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
