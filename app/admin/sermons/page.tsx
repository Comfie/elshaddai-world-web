import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/db';
import { SermonCard } from './sermon-card';

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
        <SermonCard key={sermon.id} sermon={sermon} />
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
