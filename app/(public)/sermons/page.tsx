'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Video, Play, Calendar, BookOpen, Search, Filter, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function SermonsPage() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    fetchSermons();
  }, []);

  useEffect(() => {
    filterSermons();
  }, [searchQuery, selectedCategory, sermons]);

  const fetchSermons = async () => {
    try {
      const response = await fetch('/api/sermons');
      const data = await response.json();
      setSermons(data);
      setFilteredSermons(data);
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterSermons = () => {
    let filtered = [...sermons];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (sermon) =>
          sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sermon.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sermon.scripture?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sermon.topic?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter((sermon) => sermon.category === selectedCategory);
    }

    setFilteredSermons(filtered);
  };

  const categories = [
    { value: 'ALL', label: 'All Sermons' },
    { value: 'SUNDAY_SERVICE', label: 'Sunday Service' },
    { value: 'MIDWEEK_SERVICE', label: 'Midweek Service' },
    { value: 'SPECIAL_EVENT', label: 'Special Event' },
    { value: 'CONFERENCE', label: 'Conference' },
    { value: 'SERIES', label: 'Series' },
    { value: 'GUEST_SPEAKER', label: 'Guest Speaker' },
  ];

  const featuredSermons = filteredSermons.filter((s) => s.isFeatured);
  const regularSermons = filteredSermons.filter((s) => !s.isFeatured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Video className="h-16 w-16 mx-auto mb-6 text-blue-300" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Sermon Library
            </h1>
            <p className="text-lg leading-8 text-blue-100">
              Watch and listen to transformative messages from Apostle Charles Magaiza.
              Explore our archive of Sunday services, midweek teachings, and special events.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sermons by title, topic, scripture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={selectedCategory === cat.value ? 'bg-blue-900 hover:bg-blue-800' : ''}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredSermons.length} {filteredSermons.length === 1 ? 'sermon' : 'sermons'}
          </div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {isLoading ? (
            <SermonsSkeleton />
          ) : filteredSermons.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No sermons found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Sermons */}
              {featuredSermons.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <h2 className="text-3xl font-bold text-gray-900">Featured Sermons</h2>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {featuredSermons.map((sermon) => (
                      <SermonCard key={sermon.id} sermon={sermon} />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Sermons */}
              {regularSermons.length > 0 && (
                <div>
                  {featuredSermons.length > 0 && (
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">All Sermons</h2>
                  )}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {regularSermons.map((sermon) => (
                      <SermonCard key={sermon.id} sermon={sermon} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SermonCard({ sermon }: { sermon: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <Link href={`/sermons/${sermon.id}`}>
        <div className="relative aspect-video bg-gray-900">
          {sermon.thumbnailUrl ? (
            <img
              src={sermon.thumbnailUrl}
              alt={sermon.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Video className="h-16 w-16 text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="h-16 w-16 text-white" />
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
      </Link>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(sermon.sermonDate), 'MMM d, yyyy')}</span>
        </div>

        <Link href={`/sermons/${sermon.id}`}>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
            {sermon.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600">{sermon.preacher}</p>

        {sermon.scripture && (
          <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {sermon.scripture}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {sermon.category.replace('_', ' ')}
          </Badge>
          {sermon.series && (
            <Badge variant="secondary" className="text-xs">
              {sermon.series}
            </Badge>
          )}
        </div>

        {sermon.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {sermon.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function SermonsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
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
