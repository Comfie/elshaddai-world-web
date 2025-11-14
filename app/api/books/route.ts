import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { BookCategory } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const books = await prisma.book.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has permission (SUPER_ADMIN or ADMIN)
    if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const book = await prisma.book.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        author: body.author,
        description: body.description,
        shortDescription: body.shortDescription,
        isbn: body.isbn,
        publisher: body.publisher,
        publishedDate: body.publishedDate ? new Date(body.publishedDate) : null,
        edition: body.edition,
        pageCount: body.pageCount,
        language: body.language,
        price: body.price,
        currency: body.currency,
        amazonUrl: body.amazonUrl,
        coverImageUrl: body.coverImageUrl,
        samplePdfUrl: body.samplePdfUrl,
        category: body.category as BookCategory,
        tags: body.tags || [],
        isFeatured: body.isFeatured || false,
        displayOrder: body.displayOrder || 0,
        isAvailable: body.isAvailable !== false,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
