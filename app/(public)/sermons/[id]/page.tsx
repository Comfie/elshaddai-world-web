import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, BookOpen, Download, Play, Video as VideoIcon, User, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';

async function getSermon(id: string) {
  return await prisma.sermon.findUnique({
    where: { id },
  });
}

async function getRelatedSermons(category: string, currentSermonId: string) {
  return await prisma.sermon.findMany({
    where: {
      category: category as any,
      id: { not: currentSermonId },
    },
    take: 3,
    orderBy: { sermonDate: 'desc' },
  });
}

function extractYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const sermon = await getSermon(params.id);

  if (!sermon) {
    return { title: 'Sermon Not Found' };
  }

  return {
    title: `${sermon.title} | El Shaddai World Ministries`,
    description: sermon.description || `Watch ${sermon.title} by ${sermon.preacher}`,
  };
}

export default async function SermonDetailPage({ params }: { params: { id: string } }) {
  const sermon = await getSermon(params.id);

  if (!sermon) {
    notFound();
  }

  const relatedSermons = await getRelatedSermons(sermon.category, sermon.id);
  const youtubeId = sermon.videoUrl ? extractYouTubeId(sermon.videoUrl) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <Link
            href="/sermons"
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sermons
          </Link>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {youtubeId ? (
                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title={sermon.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </Card>
              ) : sermon.thumbnailUrl ? (
                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-gray-900">
                    <img src={sermon.thumbnailUrl} alt={sermon.title} className="object-cover w-full h-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <VideoIcon className="h-20 w-20 text-white opacity-80" />
                    </div>
                  </div>
                </Card>
              ) : null}

              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{sermon.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <span>{sermon.preacher}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span>{format(new Date(sermon.sermonDate), 'MMMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-900">{sermon.category.replace('_', ' ')}</Badge>
                  {sermon.series && <Badge variant="secondary">{sermon.series}</Badge>}
                  {sermon.topic && <Badge variant="outline">{sermon.topic}</Badge>}
                  {sermon.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {sermon.scripture && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <BookOpen className="h-6 w-6 text-blue-700 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">Scripture Reference</p>
                          <p className="text-lg font-semibold text-blue-800">{sermon.scripture}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {sermon.description && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">About This Message</h3>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{sermon.description}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Actions</h3>
                  {sermon.videoUrl && (
                    <a href={sermon.videoUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" size="lg" className="w-full">
                        <Play className="h-5 w-5 mr-2" />
                        Watch on YouTube
                      </Button>
                    </a>
                  )}
                  {sermon.audioUrl && (
                    <a href={sermon.audioUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" size="lg" className="w-full">
                        <Play className="h-5 w-5 mr-2" />
                        Listen to Audio
                      </Button>
                    </a>
                  )}
                  {sermon.notesUrl && (
                    <a href={sermon.notesUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" size="lg" className="w-full">
                        <Download className="h-5 w-5 mr-2" />
                        Download Notes
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Details</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date</dt>
                      <dd className="text-sm text-gray-900 mt-1">{format(new Date(sermon.sermonDate), 'EEEE, MMMM d, yyyy')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Preacher</dt>
                      <dd className="text-sm text-gray-900 mt-1">{sermon.preacher}</dd>
                    </div>
                    {sermon.series && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Series</dt>
                        <dd className="text-sm text-gray-900 mt-1">{sermon.series}</dd>
                      </div>
                    )}
                    {sermon.topic && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Topic</dt>
                        <dd className="text-sm text-gray-900 mt-1">{sermon.topic}</dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>

          {relatedSermons.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">More Sermons</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedSermons.map((relatedSermon) => (
                  <Link key={relatedSermon.id} href={`/sermons/${relatedSermon.id}`}>
                    <Card className="hover:shadow-xl transition-shadow">
                      <div className="relative aspect-video bg-gray-900">
                        {relatedSermon.thumbnailUrl && (
                          <img src={relatedSermon.thumbnailUrl} alt={relatedSermon.title} className="object-cover w-full h-full" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{relatedSermon.title}</h3>
                        <p className="text-sm text-gray-600">{format(new Date(relatedSermon.sermonDate), 'MMM d, yyyy')}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
