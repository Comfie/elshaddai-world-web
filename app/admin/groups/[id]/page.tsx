import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Users, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getGroupById } from '@/lib/actions/groups';

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = await getGroupById(id);

  if (!group) {
    notFound();
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'SERVICE':
        return 'bg-blue-500';
      case 'PRAYER_MEETING':
        return 'bg-purple-500';
      case 'BIBLE_STUDY':
        return 'bg-green-500';
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

  const activeMembers = group.members.filter((m: any) => m.status === 'ACTIVE');
  const isAtCapacity = group.maxMembers && activeMembers.length >= group.maxMembers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/groups">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
            <p className="text-muted-foreground">Group Details</p>
          </div>
        </div>
        <Link href={`/admin/groups/${group.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Group
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Group Information */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Group Information</CardTitle>
                  {group.ministry && (
                    <CardDescription>{group.ministry.name}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  {group.isActive ? (
                    <Badge className="bg-green-500 text-white">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                  {isAtCapacity && (
                    <Badge className="bg-orange-500 text-white">At Capacity</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {group.description}
                  </p>
                </div>
              )}

              {(group.leaderName || group.meetingDay || group.meetingTime || group.meetingLocation) && (
                <>
                  {group.description && <Separator />}
                  <div className="space-y-3">
                    {group.leaderName && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Leader:</span>
                        <span className="text-sm font-medium">{group.leaderName}</span>
                      </div>
                    )}

                    {(group.meetingDay || group.meetingTime) && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {group.meetingDay && group.meetingDay}
                          {group.meetingDay && group.meetingTime && ' at '}
                          {group.meetingTime && group.meetingTime}
                        </span>
                      </div>
                    )}

                    {group.meetingLocation && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{group.meetingLocation}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Members */}
          {group.members && group.members.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Members ({activeMembers.length}{group.maxMembers && `/${group.maxMembers}`})</CardTitle>
                <CardDescription>Active members in this group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeMembers.map((member: any) => (
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
          {group.events && group.events.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Latest events for this group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.events.map((event: any) => (
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
                <span className="text-lg font-semibold">
                  {activeMembers.length}
                  {group.maxMembers && `/${group.maxMembers}`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Events</span>
                </div>
                <span className="text-lg font-semibold">{group._count.events}</span>
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
                <p>{format(new Date(group.createdAt), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p>{format(new Date(group.updatedAt), 'MMM dd, yyyy')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
