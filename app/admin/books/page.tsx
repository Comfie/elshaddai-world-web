import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, BookOpen, Edit, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';
import Image from 'next/image';

async function getBooks() {
  return await prisma.book.findMany({
    orderBy: [
      { isFeatured: 'desc' },
      { displayOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });
}

export default async function BooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Books</h1>
          <p className="text-gray-600">Manage Apostle Charles Magaiza's published books</p>
        </div>
        <Link href="/admin/books/new">
          <Button className="bg-blue-900 hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </Link>
      </div>

      <Suspense fallback={<BooksSkeleton />}>
        <BooksList />
      </Suspense>
    </div>
  );
}

async function BooksList() {
  const books = await getBooks();

  if (books.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No books yet</h3>
          <p className="text-gray-600 text-center mb-4">
            Get started by adding your first book
          </p>
          <Link href="/admin/books/new">
            <Button className="bg-blue-900 hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-[2/3] bg-gray-100">
            {book.coverImageUrl ? (
              <Image
                src={book.coverImageUrl}
                alt={book.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="h-16 w-16 text-gray-400" />
              </div>
            )}
            {book.isFeatured && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-yellow-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
            )}
            {!book.isAvailable && (
              <div className="absolute top-2 left-2">
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                {book.title}
              </h3>
              {book.subtitle && (
                <p className="text-sm text-gray-600 line-clamp-1">{book.subtitle}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">{book.author}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {book.category.replace('_', ' ')}
              </Badge>
              {book.price && (
                <Badge variant="outline" className="text-xs">
                  {book.currency} {book.price.toString()}
                </Badge>
              )}
            </div>

            {book.shortDescription && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {book.shortDescription}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <Link href={`/admin/books/${book.id}/edit`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Link href={`/admin/books/${book.id}/delete`}>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="text-xs text-gray-500">
              Added {format(new Date(book.createdAt), 'MMM d, yyyy')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BooksSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-[2/3] bg-gray-200 animate-pulse" />
          <CardContent className="p-4 space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
