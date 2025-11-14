import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Download, ExternalLink, Calendar, BookOpen, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';
import Image from 'next/image';

async function getBook(id: string) {
  const book = await prisma.book.findUnique({
    where: { id },
  });

  if (!book || !book.isAvailable) {
    return null;
  }

  return book;
}

async function getRelatedBooks(categoryId: string, currentBookId: string) {
  return await prisma.book.findMany({
    where: {
      category: categoryId as any,
      id: { not: currentBookId },
      isAvailable: true,
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    return {
      title: 'Book Not Found',
    };
  }

  return {
    title: `${book.title} by ${book.author} | El Shaddai World Ministries`,
    description: book.shortDescription || book.description.substring(0, 160),
  };
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  const relatedBooks = await getRelatedBooks(book.category, book.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Breadcrumb & Back */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <Link
            href="/books"
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Link>
        </div>
      </section>

      {/* Book Detail */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Book Cover - Left Side */}
            <div className="lg:col-span-2">
              <div className="sticky top-8">
                <Card className="overflow-hidden">
                  <div className="relative aspect-[2/3] bg-gray-100">
                    {book.coverImageUrl ? (
                      <Image
                        src={book.coverImageUrl}
                        alt={book.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="h-24 w-24 text-gray-400" />
                      </div>
                    )}
                    {book.isFeatured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <a
                      href={book.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button size="lg" className="w-full bg-blue-900 hover:bg-blue-800 text-lg">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Buy on Amazon
                      </Button>
                    </a>

                    {book.samplePdfUrl && (
                      <a
                        href={book.samplePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button variant="outline" size="lg" className="w-full border-blue-600 text-blue-600">
                          <Download className="h-5 w-5 mr-2" />
                          Download Sample
                        </Button>
                      </a>
                    )}

                    {book.price && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-1">Price</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {book.currency} {book.price.toString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Book Information - Right Side */}
            <div className="lg:col-span-3 space-y-8">
              {/* Title & Author */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <h2 className="text-2xl text-gray-700 mb-4">{book.subtitle}</h2>
                )}
                <p className="text-xl text-gray-700 font-medium">by {book.author}</p>
              </div>

              {/* Tags & Category */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-900">
                  {book.category.replace('_', ' ')}
                </Badge>
                {book.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">About This Book</h3>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {book.description}
                  </p>
                </div>
              </div>

              {/* Book Details */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Book Details</h3>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {book.isbn && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">ISBN</dt>
                        <dd className="text-sm text-gray-900 mt-1">{book.isbn}</dd>
                      </div>
                    )}
                    {book.publisher && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Publisher</dt>
                        <dd className="text-sm text-gray-900 mt-1">{book.publisher}</dd>
                      </div>
                    )}
                    {book.publishedDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Published</dt>
                        <dd className="text-sm text-gray-900 mt-1">
                          {format(new Date(book.publishedDate), 'MMMM d, yyyy')}
                        </dd>
                      </div>
                    )}
                    {book.edition && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Edition</dt>
                        <dd className="text-sm text-gray-900 mt-1">{book.edition}</dd>
                      </div>
                    )}
                    {book.pageCount && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Pages</dt>
                        <dd className="text-sm text-gray-900 mt-1">{book.pageCount}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Language</dt>
                      <dd className="text-sm text-gray-900 mt-1">{book.language}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Books */}
          {relatedBooks.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">More Books You May Like</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedBooks.map((relatedBook) => (
                  <Link key={relatedBook.id} href={`/books/${relatedBook.id}`}>
                    <Card className="hover:shadow-xl transition-shadow">
                      <div className="relative aspect-[3/4] bg-gray-100">
                        {relatedBook.coverImageUrl && (
                          <Image
                            src={relatedBook.coverImageUrl}
                            alt={relatedBook.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {relatedBook.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{relatedBook.author}</p>
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
