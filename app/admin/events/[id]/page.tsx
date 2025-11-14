import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Edit, MapPin, Calendar, Clock, Users, Video, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getEventById } from '@/lib/actions/events';

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-500';
      case 'IN_PROGRESS':
        return 'bg-green-500';
      case 'COMPLETED':
        return 'bg-gray-500';
      case 'CANCELLED':
        return 'bg-red-500';
      case 'POSTPONED':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            <p className="text-muted-foreground">Event Details</p>
          </div>
        </div>
        <Link href={`/admin/events/${event.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Event Information</CardTitle>
                  <CardDescription>
                    Created by {event.createdBy.name}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={`${getEventTypeColor(event.eventType)} text-white`}>
                    {formatEventType(event.eventType)}
                  </Badge>
                  <Badge className={`${getStatusColor(event.status)} text-white`}>
                    {event.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              )}

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Date</h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <p className="text-sm">
                      {format(new Date(event.eventDate), 'EEEE, MMMM dd, yyyy')}
                    </p>
                  </div>
                  {event.endDate && (
                    <p className="text-sm text-muted-foreground ml-6">
                      to {format(new Date(event.endDate), 'MMMM dd, yyyy')}
                    </p>
                  )}
                </div>

                {!event.isAllDay && (event.startTime || event.endTime) && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Time</h4>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <p className="text-sm">
                        {event.startTime}
                        {event.endTime && ` - ${event.endTime}`}
                      </p>
                    </div>
                  </div>
                )}

                {event.isAllDay && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Duration</h4>
                    <p className="text-sm">All Day Event</p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Location</h4>
                {event.isOnline ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <p className="text-sm">Online Event</p>
                    </div>
                    {event.onlineLink && (
                      <a
                        href={event.onlineLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline ml-6"
                      >
                        Join Online Meeting
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <div>
                      <p className="text-sm">{event.location}</p>
                      {event.address && (
                        <p className="text-sm text-muted-foreground">{event.address}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {(event.ministry || event.group) && (
                <>
                  <Separator />
                  <div className="grid gap-4 md:grid-cols-2">
                    {event.ministry && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Ministry</h4>
                        <p className="text-sm">{event.ministry.name}</p>
                      </div>
                    )}
                    {event.group && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Group</h4>
                        <p className="text-sm">{event.group.name}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Attendance */}
          {event.attendance && event.attendance.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attendance ({event.attendance.length})</CardTitle>
                <CardDescription>Members who attended this event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {event.attendance.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {record.member.firstName} {record.member.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {record.member.email || record.member.phone}
                        </p>
                      </div>
                      {record.present ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Featured</span>
                {event.isFeatured ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Display on Website</span>
                {event.displayOnWebsite ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Requires RSVP</span>
                {event.requiresRSVP ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Recurring Event</span>
                {event.isRecurring ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* RSVP Details */}
          {event.requiresRSVP && (
            <Card>
              <CardHeader>
                <CardTitle>RSVP Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.maxAttendees && (
                  <div>
                    <p className="text-sm text-muted-foreground">Max Attendees</p>
                    <p className="text-lg font-semibold">{event.maxAttendees}</p>
                  </div>
                )}

                {event.registrationDeadline && (
                  <div>
                    <p className="text-sm text-muted-foreground">Registration Deadline</p>
                    <p className="text-sm">
                      {format(new Date(event.registrationDeadline), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p>{format(new Date(event.createdAt), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p>{format(new Date(event.updatedAt), 'MMM dd, yyyy')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
