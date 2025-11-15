import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, Tag, ExternalLink, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

async function getPrayerRequests() {
  return await prisma.prayerRequest.findMany({
    orderBy: [
      { isUrgent: 'desc' },
      { status: 'asc' },
      { createdAt: 'desc' },
    ],
    take: 100,
  });
}

export default async function PrayerRequestsPage() {
  const requests = await getPrayerRequests();

  const stats = {
    total: requests.length,
    submitted: requests.filter((r) => r.status === 'SUBMITTED').length,
    praying: requests.filter((r) => r.status === 'PRAYING').length,
    answered: requests.filter((r) => r.status === 'ANSWERED').length,
    urgent: requests.filter((r) => r.isUrgent).length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-blue-500';
      case 'PRAYING':
        return 'bg-yellow-500';
      case 'ANSWERED':
        return 'bg-green-500';
      case 'CLOSED':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Prayer Requests</h1>
        <p className="text-gray-600 mt-2">Pray for and manage prayer requests from the community</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>New</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.submitted}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Praying</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.praying}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Answered</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.answered}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Urgent</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.urgent}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Prayer Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>All Prayer Requests</CardTitle>
          <CardDescription>Click on a request to view details and update status</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No prayer requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Link
                  key={request.id}
                  href={`/admin/prayer-requests/${request.id}`}
                  className="block"
                >
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {request.isAnonymous ? 'Anonymous' : request.name || 'No name provided'}
                          </h3>
                          <Badge variant="outline" className={`${getStatusColor(request.status)} text-white text-xs`}>
                            {request.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {getCategoryLabel(request.category)}
                          </Badge>
                          {request.isUrgent && (
                            <Badge variant="outline" className="bg-red-500 text-white text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              URGENT
                            </Badge>
                          )}
                          {request.hasTestimony && (
                            <Badge variant="outline" className="bg-purple-500 text-white text-xs">
                              Has Testimony
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{request.request}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 ml-4 flex-shrink-0" />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                      {!request.isAnonymous && request.email && (
                        <div className="flex items-center gap-1">
                          {request.email}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {request.prayerCount} {request.prayerCount === 1 ? 'prayer' : 'prayers'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(request.createdAt), 'PPp')}
                      </div>
                      {request.isPublic && (
                        <Badge variant="outline" className="text-xs">
                          Public
                        </Badge>
                      )}
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
