import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Users, Mail, Phone, Calendar, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMinistryById } from '@/lib/actions/ministries';

export default async function MinistryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ministry = await getMinistryById(id);

  if (!ministry) {
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
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/ministries">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{ministry.name}</h1>
            <p className="text-muted-foreground">Ministry Details</p>
          </div>
        </div>
        <Link href={`/admin/ministries/${ministry.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Ministry
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Ministry Information */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Ministry Information</CardTitle>
                </div>
                {ministry.isActive ? (
                  <Badge className="bg-green-500 text-white">Active</Badge>
                ) : (
                  <Badge variant="outline">Inactive</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ministry.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {ministry.description}
                  </p>
                </div>
              )}

              {(ministry.contactEmail || ministry.contactPhone || ministry.meetingSchedule) && (
                <>
                  {ministry.description && <Separator />}
                  <div className="space-y-3">
                    {ministry.contactEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${ministry.contactEmail}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {ministry.contactEmail}
                        </a>
                      </div>
                    )}

                    {ministry.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${ministry.contactPhone}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {ministry.contactPhone}
                        </a>
                      </div>
                    )}

                    {ministry.meetingSchedule && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{ministry.meetingSchedule}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Members */}
          {ministry.members && ministry.members.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Members ({ministry.members.length})</CardTitle>
                <CardDescription>Active members in this ministry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ministry.members.map((member: any) => (
                    <Link
                      key={member.id}
                      href={`/admin/members/${member.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src={member.photoUrl || undefined} />
                        <AvatarFallback>
                          {member.firstName[0]}{member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.email || member.phone}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Events */}
          {ministry.events && ministry.events.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Latest events for this ministry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ministry.events.map((event: any) => (
                    <Link
                      key={event.id}
                      href={`/admin/events/${event.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.eventDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`${getEventTypeColor(event.eventType)} text-white text-xs`}>
                          {formatEventType(event.eventType)}
                        </Badge>
                        <Badge className={`${getStatusColor(event.status)} text-white text-xs`}>
                          {event.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Leader */}
          {ministry.leader && (
            <Card>
              <CardHeader>
                <CardTitle>Ministry Leader</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">{ministry.leader.name}</p>
                    {ministry.leader.email && (
                      <a
                        href={`mailto:${ministry.leader.email}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {ministry.leader.email}
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Members</span>
                </div>
                <span className="text-lg font-semibold">{ministry._count.members}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Events</span>
                </div>
                <span className="text-lg font-semibold">{ministry._count.events}</span>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p>{format(new Date(ministry.createdAt), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p>{format(new Date(ministry.updatedAt), 'MMM dd, yyyy')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
