'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SermonCategory } from '@prisma/client';

export default function NewSermonPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    preacher: 'Apostle Charles Magaiza',
    sermonDate: new Date().toISOString().split('T')[0],
    series: '',
    topic: '',
    scripture: '',
    videoUrl: '',
    audioUrl: '',
    notesUrl: '',
    thumbnailUrl: '',
    category: 'SUNDAY_SERVICE' as SermonCategory,
    tags: '',
    isFeatured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const extractYouTubeThumbnail = (url: string) => {
    // Extract YouTube video ID and generate thumbnail URL
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
    }
    return '';
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, videoUrl: url }));

    // Auto-generate thumbnail if it's a YouTube URL
    if (url && !formData.thumbnailUrl) {
      const thumbnail = extractYouTubeThumbnail(url);
      if (thumbnail) {
        setFormData((prev) => ({ ...prev, thumbnailUrl: thumbnail }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        sermonDate: new Date(formData.sermonDate).toISOString(),
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        series: formData.series || null,
        topic: formData.topic || null,
        scripture: formData.scripture || null,
        videoUrl: formData.videoUrl || null,
        audioUrl: formData.audioUrl || null,
        notesUrl: formData.notesUrl || null,
        thumbnailUrl: formData.thumbnailUrl || null,
        description: formData.description || null,
      };

      const response = await fetch('/api/sermons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create sermon');
      }

      router.push('/admin/sermons');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/sermons">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Sermon</h1>
          <p className="text-gray-600">Add a sermon to the library</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sermon Information</CardTitle>
                <CardDescription>Basic details about the sermon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="The Power of Faith"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preacher *
                    </label>
                    <input
                      type="text"
                      name="preacher"
                      value={formData.preacher}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sermon Date *
                    </label>
                    <input
                      type="date"
                      name="sermonDate"
                      value={formData.sermonDate}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="SUNDAY_SERVICE">Sunday Service</option>
                      <option value="MIDWEEK_SERVICE">Midweek Service</option>
                      <option value="SPECIAL_EVENT">Special Event</option>
                      <option value="CONFERENCE">Conference</option>
                      <option value="SERIES">Series</option>
                      <option value="GUEST_SPEAKER">Guest Speaker</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Series
                    </label>
                    <input
                      type="text"
                      name="series"
                      value={formData.series}
                      onChange={handleChange}
                      placeholder="Faith Series"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      placeholder="Faith, Prayer, Healing..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scripture Reference
                    </label>
                    <input
                      type="text"
                      name="scripture"
                      value={formData.scripture}
                      onChange={handleChange}
                      placeholder="John 3:16-18"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Brief description of the sermon message..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="faith, prayer, healing (comma-separated)"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate tags with commas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Links</CardTitle>
                <CardDescription>
                  YouTube/Facebook video links, audio, and sermon notes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Youtube className="inline h-4 w-4 mr-1" />
                    Video URL (YouTube / Facebook / Vimeo)
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleVideoUrlChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste the full YouTube, Facebook, or Vimeo video URL
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audio URL
                  </label>
                  <input
                    type="url"
                    name="audioUrl"
                    value={formData.audioUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Link to audio-only version
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sermon Notes URL (PDF)
                  </label>
                  <input
                    type="url"
                    name="notesUrl"
                    value={formData.notesUrl}
                    onChange={handleChange}
                    placeholder="https://.../sermon-notes.pdf"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Link to downloadable sermon notes
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleChange}
                    placeholder="Auto-filled for YouTube videos"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-generated for YouTube videos, or paste custom thumbnail URL
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {formData.thumbnailUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Thumbnail Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.thumbnailUrl}
                      alt="Sermon thumbnail"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Control how the sermon appears</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                    Featured Sermon
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Featured sermons appear at the top of the sermons page
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-900 hover:bg-blue-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Sermon
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
