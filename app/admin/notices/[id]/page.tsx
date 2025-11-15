import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Bell, AlertCircle, Calendar, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getNoticeById } from '@/lib/actions/notices';

export default async function NoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notice = await getNoticeById(id);

  if (!notice) {
    notFound();
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'NORMAL':
        return 'bg-blue-500';
      case 'LOW':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'URGENT':
        return 'bg-red-500';
      case 'EVENT':
        return 'bg-green-500';
      case 'PRAYER':
        return 'bg-purple-500';
      case 'MINISTRY':
        return 'bg-blue-500';
      case 'YOUTH':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/notices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{notice.title}</h1>
            <p className="text-muted-foreground">Notice Details</p>
          </div>
        </div>
        <Link href={`/admin/notices/${notice.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Notice
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Notice Content */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Notice Content</CardTitle>
                  <CardDescription>
                    Created by {notice.createdByName}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={`${getPriorityColor(notice.priority)} text-white`}>
                    {notice.priority}
                  </Badge>
                  <Badge className={`${getCategoryColor(notice.category)} text-white`}>
                    {formatCategory(notice.category)}
                  </Badge>
                  {!notice.isActive && (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {notice.summary && (
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    {notice.summary}
                  </p>
                </div>
              )}

              {notice.summary && <Separator />}

              <div>
                <h3 className="font-semibold mb-2">Full Content</h3>
                <p className="text-sm whitespace-pre-wrap">
                  {notice.content}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing Info */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Publish Date</span>
                </div>
                <p className="text-sm font-medium">
                  {format(new Date(notice.publishDate), 'MMM dd, yyyy')}
                </p>
              </div>

              {notice.expiryDate && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span>Expiry Date</span>
                  </div>
                  <p className="text-sm font-medium">
                    {format(new Date(notice.expiryDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              )}

              <Separator />

              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span>Target Audience</span>
                </div>
                <p className="text-sm font-medium">
                  {formatCategory(notice.targetAudience)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <Badge variant={notice.isActive ? "default" : "secondary"}>
                  {notice.isActive ? 'Yes' : 'No'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Display on Website</span>
                <Badge variant={notice.displayOnWebsite ? "default" : "secondary"}>
                  {notice.displayOnWebsite ? 'Yes' : 'No'}
                </Badge>
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
                <p>{format(new Date(notice.createdAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p>{format(new Date(notice.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
