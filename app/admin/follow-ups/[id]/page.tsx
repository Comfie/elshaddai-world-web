import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format, isPast } from 'date-fns';
import { ArrowLeft, Edit, User, Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getFollowUpById } from '@/lib/actions/follow-ups';

export default async function FollowUpPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const followUp = await getFollowUpById(id);

  if (!followUp) {
    notFound();
  }

  const isOverdue = isPast(new Date(followUp.dueDate)) &&
    (followUp.status === 'PENDING' || followUp.status === 'IN_PROGRESS');

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/follow-ups">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Follow-up: {followUp.member.firstName} {followUp.member.lastName}
            </h1>
            <p className="text-muted-foreground">Follow-up Details</p>
          </div>
        </div>
        <Link href={`/admin/follow-ups/${followUp.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Follow-up
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Follow-up Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Follow-up Information</CardTitle>
                  <CardDescription>
                    {formatReason(followUp.reason)}
                    {followUp.reason === 'OTHER' && followUp.reasonOther &&
                      `: ${followUp.reasonOther}`
                    }
                  </CardDescription>
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
            </CardHeader>
            <CardContent className="space-y-4">
              {followUp.initialNotes && (
                <div>
                  <h3 className="font-semibold mb-2">Initial Notes</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {followUp.initialNotes}
                  </p>
                </div>
              )}

              {followUp.followUpNotes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Follow-up Notes</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {followUp.followUpNotes}
                    </p>
                  </div>
                </>
              )}

              {followUp.outcome && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Outcome</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {followUp.outcome}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Assigned to:</span>
                  <span className="text-sm font-medium">{followUp.assignedToName}</span>
                </div>

                {followUp.method && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Contact method:</span>
                    <span className="text-sm font-medium">{formatReason(followUp.method)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Due date:</span>
                  <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                    {format(new Date(followUp.dueDate), 'MMM dd, yyyy')}
                    {isOverdue && ' (Overdue)'}
                  </span>
                </div>

                {followUp.completedAt && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">Completed:</span>
                    <span className="text-sm font-medium">
                      {format(new Date(followUp.completedAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </div>

              {followUp.requiresFollowUp && followUp.nextFollowUpDate && (
                <>
                  <Separator />
                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                        Requires Another Follow-up
                      </h3>
                    </div>
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      Next follow-up scheduled for:{' '}
                      {format(new Date(followUp.nextFollowUpDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Member Info */}
          <Card>
            <CardHeader>
              <CardTitle>Member</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/admin/members/${followUp.member.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={followUp.member.photoUrl || undefined} />
                  <AvatarFallback>
                    {followUp.member.firstName[0]}{followUp.member.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {followUp.member.firstName} {followUp.member.lastName}
                  </p>
                  {followUp.member.email && (
                    <p className="text-sm text-muted-foreground">
                      {followUp.member.email}
                    </p>
                  )}
                  {followUp.member.phone && (
                    <p className="text-sm text-muted-foreground">
                      {followUp.member.phone}
                    </p>
                  )}
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {formatReason(followUp.member.membershipType)}
                  </Badge>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Assigned User */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned To</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{followUp.assignedTo.name}</p>
                {followUp.assignedTo.email && (
                  <p className="text-sm text-muted-foreground">
                    {followUp.assignedTo.email}
                  </p>
                )}
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
                <p>{format(new Date(followUp.createdAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p>{format(new Date(followUp.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
