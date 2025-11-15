import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Calendar, Mail, Phone, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

async function getPendingRegistrations() {
  return await prisma.member.findMany({
    where: {
      status: 'PENDING',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function PendingRegistrationsPage() {
  const registrations = await getPendingRegistrations();

  const getMembershipTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getMembershipTypeColor = (type: string) => {
    switch (type) {
      case 'VISITOR':
        return 'bg-orange-500';
      case 'NEW_CONVERT':
        return 'bg-green-500';
      case 'MEMBER':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pending Registrations</h1>
        <p className="text-gray-600 mt-2">Review and approve new member registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Pending</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{registrations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Visitors</CardDescription>
            <CardTitle className="text-3xl text-orange-600">
              {registrations.filter((r) => r.membershipType === 'VISITOR').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>New Converts</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {registrations.filter((r) => r.membershipType === 'NEW_CONVERT').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Registrations List */}
      <Card>
        <CardHeader>
          <CardTitle>Awaiting Approval</CardTitle>
          <CardDescription>Click on a registration to review and approve/reject</CardDescription>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No pending registrations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <Link
                  key={registration.id}
                  href={`/admin/pending-registrations/${registration.id}`}
                  className="block"
                >
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {registration.firstName} {registration.lastName}
                          </h3>
                          <Badge variant="outline" className={`${getMembershipTypeColor(registration.membershipType)} text-white text-xs`}>
                            {getMembershipTypeLabel(registration.membershipType)}
                          </Badge>
                          <Badge variant="outline" className="bg-orange-500 text-white text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            PENDING
                          </Badge>
                        </div>
                        {registration.notes && (
                          <p className="text-sm text-gray-600 line-clamp-2 mt-2">{registration.notes}</p>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 ml-4 flex-shrink-0" />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                      {registration.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {registration.email}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {registration.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Registered {format(new Date(registration.createdAt), 'PPp')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
