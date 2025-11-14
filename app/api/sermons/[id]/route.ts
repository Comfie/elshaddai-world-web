import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { SermonCategory } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sermon = await prisma.sermon.findUnique({
      where: { id: params.id },
    });

    if (!sermon) {
      return NextResponse.json(
        { error: 'Sermon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(sermon);
  } catch (error) {
    console.error('Error fetching sermon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sermon' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const body = await request.json();

    const sermon = await prisma.sermon.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        preacher: body.preacher,
        sermonDate: new Date(body.sermonDate),
        series: body.series,
        topic: body.topic,
        scripture: body.scripture,
        videoUrl: body.videoUrl,
        audioUrl: body.audioUrl,
        notesUrl: body.notesUrl,
        thumbnailUrl: body.thumbnailUrl,
        category: body.category as SermonCategory,
        tags: body.tags || [],
        isFeatured: body.isFeatured || false,
      },
    });

    return NextResponse.json(sermon);
  } catch (error) {
    console.error('Error updating sermon:', error);
    return NextResponse.json(
      { error: 'Failed to update sermon' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    await prisma.sermon.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Sermon deleted successfully' });
  } catch (error) {
    console.error('Error deleting sermon:', error);
    return NextResponse.json(
      { error: 'Failed to delete sermon' },
      { status: 500 }
    );
  }
}
