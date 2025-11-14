import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { SermonCategory } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const sermons = await prisma.sermon.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { sermonDate: 'desc' },
      ],
    });

    return NextResponse.json(sermons);
  } catch (error) {
    console.error('Error fetching sermons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sermons' },
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

    if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const sermon = await prisma.sermon.create({
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

    return NextResponse.json(sermon, { status: 201 });
  } catch (error) {
    console.error('Error creating sermon:', error);
    return NextResponse.json(
      { error: 'Failed to create sermon' },
      { status: 500 }
    );
  }
}
