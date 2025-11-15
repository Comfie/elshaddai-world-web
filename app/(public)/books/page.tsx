import { Suspense } from 'react';
import Link from 'next/link';
import { BookOpen, Star, ExternalLink, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/db';
import Image from 'next/image';

async function getBooks() {
  return await prisma.book.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: [
      { isFeatured: 'desc' },
      { displayOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });
}

export const metadata = {
  title: 'Books by Apostle Charles Magaiza | El Shaddai World Ministries',
  description: 'Explore transformative books by Apostle Charles Magaiza. Available on Amazon.',
};

export default async function BooksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-blue-300" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Books by Apostle Charles Magaiza
            </h1>
            <p className="text-lg leading-8 text-blue-100">
              Discover life-changing wisdom and biblical insights through our collection of books.
              Each book is written to inspire, educate, and transform your spiritual journey.
            </p>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Suspense fallback={<BooksSkeleton />}>
            <BooksGrid />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

async function BooksGrid() {
  const books = await getBooks();

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No books available yet</h3>
        <p className="text-gray-600">Check back soon for new releases</p>
      </div>
    );
  }

  // Separate featured and regular books
  const featuredBooks = books.filter(book => book.isFeatured);
  const regularBooks = books.filter(book => !book.isFeatured);

  return (
    <div className="space-y-16">
      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900">Featured Books</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Books */}
      {regularBooks.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {featuredBooks.length > 0 ? 'All Books' : 'Our Collection'}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {regularBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BookCard({ book, featured = false }: { book: any; featured?: boolean }) {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      <Link href={`/books/${book.id}`}>
        <div className={`relative ${featured ? 'aspect-[2/3]' : 'aspect-[3/4]'} bg-gray-100 overflow-hidden`}>
          {book.coverImageUrl ? (
            <Image
              src={book.coverImageUrl}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-16 w-16 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <CardContent className="p-5 space-y-3">
        <div>
          <Link href={`/books/${book.id}`}>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
              {book.title}
            </h3>
          </Link>
          {book.subtitle && (
            <p className="text-sm text-gray-600 line-clamp-1 mt-1">{book.subtitle}</p>
          )}
          <p className="text-sm text-gray-700 font-medium mt-1">{book.author}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {book.category.replace('_', ' ')}
          </Badge>
          {book.price && (
            <Badge variant="secondary" className="text-xs">
              {book.currency} {book.price.toString()}
            </Badge>
          )}
        </div>

        {book.shortDescription && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {book.shortDescription}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <Link href={`/books/${book.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
              View Details
            </Button>
          </Link>
          <a
            href={book.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button size="sm" className="w-full bg-blue-900 hover:bg-blue-800">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Buy Now
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function BooksSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
          <CardContent className="p-5 space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-16 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
