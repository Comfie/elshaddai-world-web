import { prisma } from '@/lib/db/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar, Tag, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

async function getContactMessages() {
  return await prisma.contactMessage.findMany({
    orderBy: [
      { status: 'asc' }, // NEW messages first
      { createdAt: 'desc' },
    ],
    take: 100,
  });
}

export default async function ContactMessagesPage() {
  const messages = await getContactMessages();

  const stats = {
    total: messages.length,
    new: messages.filter((m) => m.status === 'NEW').length,
    inProgress: messages.filter((m) => m.status === 'IN_PROGRESS').length,
    responded: messages.filter((m) => m.status === 'RESPONDED').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-500';
      case 'IN_PROGRESS':
        return 'bg-yellow-500';
      case 'RESPONDED':
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
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-600 mt-2">Manage and respond to contact form submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Messages</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>New</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.new}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Responded</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.responded}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
          <CardDescription>Click on a message to view details and respond</CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No contact messages yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Link
                  key={message.id}
                  href={`/admin/contact-messages/${message.id}`}
                  className="block"
                >
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{message.name}</h3>
                          <Badge variant="outline" className={`${getStatusColor(message.status)} text-white text-xs`}>
                            {message.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {getCategoryLabel(message.category)}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-1">{message.subject}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 ml-4 flex-shrink-0" />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {message.email}
                      </div>
                      {message.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {message.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(message.createdAt), 'PPp')}
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
