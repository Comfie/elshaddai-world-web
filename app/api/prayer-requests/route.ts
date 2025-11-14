import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const prayerRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  category: z.enum([
    'GENERAL',
    'HEALTH',
    'FAMILY',
    'FINANCIAL',
    'EMPLOYMENT',
    'SPIRITUAL',
    'SALVATION',
    'DIRECTION',
    'OTHER',
  ]).default('GENERAL'),
  request: z.string().min(10, 'Prayer request must be at least 10 characters'),
  isUrgent: z.boolean().default(false),
  isPublic: z.boolean().default(false),
  shareWithPastors: z.boolean().default(true),
  shareWithLeaders: z.boolean().default(false),
});

// GET - List prayer requests (admin only, or public ones)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get('public') === 'true';

    let where: any = {};

    if (publicOnly || !session) {
      // Public prayer wall - only show public, non-anonymous requests
      where = {
        isPublic: true,
        status: { not: 'CLOSED' },
      };
    } else if (session.user.role === 'LEADER') {
      // Leaders see requests shared with leaders
      where = {
        OR: [
          { shareWithLeaders: true },
          { shareWithPastors: true },
        ],
      };
    }
    // SUPER_ADMIN and ADMIN see all requests (no where clause)

    const prayerRequests = await prisma.prayerRequest.findMany({
      where,
      orderBy: [
        { isUrgent: 'desc' },
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
      take: 100,
    });

    return NextResponse.json(prayerRequests);
  } catch (error) {
    console.error('Error fetching prayer requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prayer requests' },
      { status: 500 }
    );
  }
}

// POST - Create new prayer request (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = prayerRequestSchema.parse(body);

    // If anonymous, clear personal info
    if (validatedData.isAnonymous) {
      validatedData.name = undefined;
      validatedData.email = undefined;
      validatedData.phone = undefined;
    }

    const prayerRequest = await prisma.prayerRequest.create({
      data: {
        name: validatedData.name || null,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        isAnonymous: validatedData.isAnonymous,
        category: validatedData.category,
        request: validatedData.request,
        isUrgent: validatedData.isUrgent,
        isPublic: validatedData.isPublic,
        shareWithPastors: validatedData.shareWithPastors,
        shareWithLeaders: validatedData.shareWithLeaders,
        status: 'SUBMITTED',
        prayerCount: 0,
        prayedBy: [],
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your prayer request has been received. Our prayer team will pray for you.',
        id: prayerRequest.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating prayer request:', error);
    return NextResponse.json(
      { error: 'Failed to submit prayer request' },
      { status: 500 }
    );
  }
}
