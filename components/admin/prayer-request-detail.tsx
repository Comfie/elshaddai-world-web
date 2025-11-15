'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, Tag, ArrowLeft, Trash2, AlertTriangle, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface PrayerRequest {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  isAnonymous: boolean;
  category: string;
  request: string;
  isUrgent: boolean;
  isPublic: boolean;
  shareWithPastors: boolean;
  shareWithLeaders: boolean;
  status: string;
  prayedBy: string[];
  prayerCount: number;
  hasTestimony: boolean;
  testimony: string | null;
  testimonyDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function PrayerRequestDetail({ request }: { request: PrayerRequest }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState(request.status);
  const [testimony, setTestimony] = useState(request.testimony || '');

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/prayer-requests/${request.id}`, {
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

  const handleMarkAsPrayed = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/prayer-requests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAsPrayed: true }),
      });

      if (res.ok) {
        toast.success('Marked as prayed');
        router.refresh();
      } else {
        toast.error('Failed to mark as prayed');
      }
    } catch (error) {
      console.error('Error marking as prayed:', error);
      toast.error('An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveTestimony = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/prayer-requests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testimony,
          hasTestimony: testimony.length > 0,
        }),
      });

      if (res.ok) {
        toast.success('Testimony saved successfully');
        router.refresh();
      } else {
        toast.error('Failed to save testimony');
      }
    } catch (error) {
      console.error('Error saving testimony:', error);
      toast.error('An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this prayer request? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/prayer-requests/${request.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Prayer request deleted successfully');
        router.push('/admin/prayer-requests');
      } else {
        toast.error('Failed to delete prayer request');
      }
    } catch (error) {
      console.error('Error deleting prayer request:', error);
      toast.error('An error occurred');
    } finally {
      setIsDeleting(false);
    }
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
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/prayer-requests">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Prayer Requests
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Prayer Request</h1>
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
        {/* Main Prayer Request Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{request.isAnonymous ? 'Anonymous Request' : request.name || 'No name provided'}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={`${getStatusColor(status)} text-white`}>
                      {status}
                    </Badge>
                    <Badge variant="outline">
                      <Tag className="h-3 w-3 mr-1" />
                      {getCategoryLabel(request.category)}
                    </Badge>
                    {request.isUrgent && (
                      <Badge variant="outline" className="bg-red-500 text-white">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        URGENT
                      </Badge>
                    )}
                    {request.isPublic && (
                      <Badge variant="outline" className="bg-purple-500 text-white">
                        Public
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Prayer Request</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{request.request}</p>
              </div>

              {!request.isAnonymous && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    {request.name && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Name:</span>
                        <span>{request.name}</span>
                      </div>
                    )}
                    {request.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">
                          {request.email}
                        </a>
                      </div>
                    )}
                    {request.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${request.phone}`} className="text-blue-600 hover:underline">
                          {request.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{request.prayerCount}</span> {request.prayerCount === 1 ? 'prayer' : 'prayers'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Submitted {format(new Date(request.createdAt), 'PPpp')}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button onClick={handleMarkAsPrayed} disabled={isUpdating} variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  {isUpdating ? 'Updating...' : 'I Prayed for This'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Testimony Section */}
          <Card>
            <CardHeader>
              <CardTitle>Testimony / Answer to Prayer</CardTitle>
              <CardDescription>Record how God answered this prayer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  value={testimony}
                  onChange={(e) => setTestimony(e.target.value)}
                  rows={6}
                  placeholder="Share the testimony or how this prayer was answered..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                />
                <Button onClick={handleSaveTestimony} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Testimony'}
                </Button>
                {request.testimonyDate && (
                  <p className="text-xs text-gray-500">
                    Last updated: {format(new Date(request.testimonyDate), 'PPpp')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Update prayer status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['SUBMITTED', 'PRAYING', 'ANSWERED', 'CLOSED'].map((s) => (
                  <Button
                    key={s}
                    variant={status === s ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => handleUpdateStatus(s)}
                    disabled={isUpdating}
                  >
                    <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(s)}`} />
                    {s}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Anonymous:</span>
                <Badge variant={request.isAnonymous ? 'default' : 'outline'}>
                  {request.isAnonymous ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Public:</span>
                <Badge variant={request.isPublic ? 'default' : 'outline'}>
                  {request.isPublic ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Share with Pastors:</span>
                <Badge variant={request.shareWithPastors ? 'default' : 'outline'}>
                  {request.shareWithPastors ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Share with Leaders:</span>
                <Badge variant={request.shareWithLeaders ? 'default' : 'outline'}>
                  {request.shareWithLeaders ? 'Yes' : 'No'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
