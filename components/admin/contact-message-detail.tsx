'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar, Tag, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  category: string;
  status: string;
  assignedTo: string | null;
  response: string | null;
  respondedAt: Date | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function ContactMessageDetail({ message }: { message: ContactMessage }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState(message.status);
  const [response, setResponse] = useState(message.response || '');

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/contact/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        toast.success('Status updated successfully');
        router.refresh();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveResponse = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/contact/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response }),
      });

      if (res.ok) {
        toast.success('Response saved successfully');
        router.refresh();
      } else {
        toast.error('Failed to save response');
      }
    } catch (error) {
      console.error('Error saving response:', error);
      toast.error('An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/contact/${message.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Message deleted successfully');
        router.push('/admin/contact-messages');
      } else {
        toast.error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('An error occurred');
    } finally {
      setIsDeleting(false);
    }
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
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/contact-messages">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Messages
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Contact Message</h1>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Message Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{message.subject}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={`${getStatusColor(status)} text-white`}>
                      {status}
                    </Badge>
                    <Badge variant="outline">
                      <Tag className="h-3 w-3 mr-1" />
                      {getCategoryLabel(message.category)}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{message.message}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Sender Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Name:</span>
                    <span>{message.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline">
                      {message.email}
                    </a>
                  </div>
                  {message.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${message.phone}`} className="text-blue-600 hover:underline">
                        {message.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Received: {format(new Date(message.createdAt), 'PPpp')}</span>
                  </div>
                </div>
              </div>

              {message.respondedAt && (
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    Responded on {format(new Date(message.respondedAt), 'PPpp')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Response Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Response</CardTitle>
              <CardDescription>Add or update your response to this message</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={6}
                  placeholder="Type your response here..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                />
                <Button onClick={handleSaveResponse} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Response'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Update message status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['NEW', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'].map((s) => (
                  <Button
                    key={s}
                    variant={status === s ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => handleUpdateStatus(s)}
                    disabled={isUpdating}
                  >
                    <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(s)}`} />
                    {s.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {message.ipAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Technical Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">IP Address:</span>
                  <br />
                  {message.ipAddress}
                </div>
                {message.userAgent && (
                  <div>
                    <span className="font-medium">User Agent:</span>
                    <br />
                    <span className="break-all">{message.userAgent}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
