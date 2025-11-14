import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Video, Edit, Trash2, Star, Calendar, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';

async function getSermons() {
  return await prisma.sermon.findMany({
    orderBy: [
      { isFeatured: 'desc' },
      { sermonDate: 'desc' },
    ],
    take: 50,
  });
}

export default async function SermonsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sermons</h1>
          <p className="text-gray-600">Manage sermon library and video archives</p>
        </div>
        <Link href="/admin/sermons/new">
          <Button className="bg-blue-900 hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" />
            Add Sermon
          </Button>
        </Link>
      </div>

      <Suspense fallback={<SermonsSkeleton />}>
        <SermonsList />
      </Suspense>
    </div>
  );
}

async function SermonsList() {
  const sermons = await getSermons();

  if (sermons.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Video className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No sermons yet</h3>
          <p className="text-gray-600 text-center mb-4">
            Get started by adding your first sermon
          </p>
          <Link href="/admin/sermons/new">
            <Button className="bg-blue-900 hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Sermon
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sermons.map((sermon) => (
        <Card key={sermon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-video bg-gray-900">
            {sermon.thumbnailUrl ? (
              <img
                src={sermon.thumbnailUrl}
                alt={sermon.title}
                className="object-cover w-full h-full"
              />
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
              <Link href={`/admin/sermons/${sermon.id}/delete`}>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SermonsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-video bg-gray-200 animate-pulse" />
          <CardContent className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
