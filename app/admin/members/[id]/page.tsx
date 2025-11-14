import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Church, Users, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMemberById } from '@/lib/actions/members';

export default async function MemberPage({ params }: { params: { id: string } }) {
  const member = await getMemberById(params.id);

  if (!member) {
    notFound();
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'VISITOR':
        return 'bg-gray-500';
      case 'NEW_CONVERT':
        return 'bg-green-500';
      case 'MEMBER':
        return 'bg-blue-500';
      case 'LEADER':
        return 'bg-purple-500';
      case 'PASTOR':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatMembershipType = (type: string) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/members">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {member.firstName} {member.lastName}
            </h1>
            <p className="text-muted-foreground">Member Profile</p>
          </div>
        </div>
        <Link href={`/admin/members/${member.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32">
                {member.photoUrl && <AvatarImage src={member.photoUrl} />}
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials(member.firstName, member.lastName)}
                </AvatarFallback>
              </Avatar>

              <h2 className="mt-4 text-2xl font-bold">
                {member.firstName} {member.lastName}
              </h2>

              <div className="mt-2 space-y-2">
                <Badge className={`${getMembershipColor(member.membershipType)} text-white`}>
                  {formatMembershipType(member.membershipType)}
                </Badge>
                <Badge variant="outline">
                  {member.status}
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="w-full space-y-3 text-left">
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
                )}

                {member.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}

                {(member.city || member.province) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{[member.city, member.province].filter(Boolean).join(', ')}</span>
                  </div>
                )}

                {member.ministry && (
                  <div className="flex items-center gap-2 text-sm">
                    <Church className="h-4 w-4 text-muted-foreground" />
                    <span>{member.ministry.name}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="followups">Follow-ups ({member.followUps.length})</TabsTrigger>
              <TabsTrigger value="attendance">Attendance ({member.attendance.length})</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <p className="text-sm">
                        {member.dateOfBirth
                          ? format(new Date(member.dateOfBirth), 'MMMM dd, yyyy')
                          : 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gender</p>
                      <p className="text-sm">{member.gender || 'Not provided'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Marital Status</p>
                      <p className="text-sm">{member.maritalStatus ? formatMembershipType(member.maritalStatus) : 'Not provided'}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Joined</p>
                      <p className="text-sm">
                        {format(new Date(member.joinDate), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm">{member.phone}</p>
                    </div>

                    {member.alternatePhone && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Alternate Phone</p>
                        <p className="text-sm">{member.alternatePhone}</p>
                      </div>
                    )}

                    {member.email && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-sm">{member.email}</p>
                      </div>
                    )}

                    {member.address && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p className="text-sm">
                          {[member.address, member.city, member.province, member.postalCode]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Spiritual Journey</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    {member.baptized ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Baptized</p>
                      {member.baptized && member.baptismDate && (
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(member.baptismDate), 'MMMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>

                  {member.salvationDate && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Salvation Date</p>
                      <p className="text-sm">
                        {format(new Date(member.salvationDate), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {member.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{member.notes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Follow-ups Tab */}
            <TabsContent value="followups" className="space-y-4">
              {member.followUps.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground mb-4">No follow-ups yet</p>
                    <Link href="/admin/follow-ups/new">
                      <Button>Create Follow-up</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                member.followUps.map((followUp) => (
                  <Card key={followUp.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{formatMembershipType(followUp.reason)}</CardTitle>
                        <Badge variant="outline">{followUp.status}</Badge>
                      </div>
                      <CardDescription>
                        Assigned to {followUp.assignedTo.name} • Due {format(new Date(followUp.dueDate), 'MMM dd, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    {followUp.initialNotes && (
                      <CardContent>
                        <p className="text-sm">{followUp.initialNotes}</p>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="space-y-4">
              {member.attendance.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">No attendance records</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {member.attendance.map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between border-b pb-2 last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {formatMembershipType(record.serviceType)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(record.serviceDate), 'MMMM dd, yyyy')}
                            </p>
                          </div>
                          {record.present ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
