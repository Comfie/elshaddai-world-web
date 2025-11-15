'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Video, Edit, Trash2, Star, Calendar, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

interface SermonCardProps {
  sermon: {
    id: string;
    title: string;
    preacher: string;
    sermonDate: Date;
    scripture: string | null;
    category: string;
    series: string | null;
    description: string | null;
    thumbnailUrl: string | null;
    videoUrl: string | null;
    audioUrl: string | null;
    notesUrl: string | null;
    isFeatured: boolean;
  };
}

function getVideoType(url: string | null): 'youtube' | 'facebook' | 'other' {
  if (!url) return 'other';
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return 'facebook';
  }
  return 'other';
}

export function SermonCard({ sermon }: SermonCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const videoType = getVideoType(sermon.videoUrl);
  const isFacebook = videoType === 'facebook';

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/sermons/${sermon.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete sermon');
      }

      router.refresh();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting sermon:', error);
      alert('Failed to delete sermon. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className={`relative aspect-video ${isFacebook && !sermon.thumbnailUrl ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gray-900'}`}>
          {sermon.thumbnailUrl ? (
            <img
              src={sermon.thumbnailUrl}
              alt={sermon.title}
              className="object-cover w-full h-full"
            />
          ) : isFacebook ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <svg className="h-16 w-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-white text-sm font-medium">Facebook Video</span>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Video className="h-16 w-16 text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Play className="h-12 w-12 text-white" />
          </div>
          {sermon.isFeatured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-yellow-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(sermon.sermonDate), 'MMM d, yyyy')}</span>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
              {sermon.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{sermon.preacher}</p>
            {sermon.scripture && (
              <p className="text-sm text-blue-600 font-medium mt-1">{sermon.scripture}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {sermon.category.replace('_', ' ')}
            </Badge>
            {sermon.series && (
              <Badge variant="outline" className="text-xs">
                {sermon.series}
              </Badge>
            )}
          </div>

          {sermon.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {sermon.description}
            </p>
          )}

          <div className="flex gap-2 text-xs text-gray-500">
            {sermon.videoUrl && (
              <span className="flex items-center gap-1">
                <Video className="h-3 w-3" />
                Video
              </span>
            )}
            {sermon.audioUrl && (
              <span className="flex items-center gap-1">
                <Play className="h-3 w-3" />
                Audio
              </span>
            )}
            {sermon.notesUrl && (
              <span>Notes</span>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Link href={`/admin/sermons/${sermon.id}/edit`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the sermon "{sermon.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
