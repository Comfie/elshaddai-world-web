import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { BookCategory } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const book = await prisma.book.update({
      where: { id },
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

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}
