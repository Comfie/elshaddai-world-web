import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  status: z.enum(['SUBMITTED', 'PRAYING', 'ANSWERED', 'CLOSED']).optional(),
  hasTestimony: z.boolean().optional(),
  testimony: z.string().optional().nullable(),
  markAsPrayed: z.boolean().optional(), // Special action to increment prayer count
});

// GET - Get single prayer request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'LEADER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const prayerRequest = await prisma.prayerRequest.findUnique({
      where: { id },
    });

    if (!prayerRequest) {
      return NextResponse.json({ error: 'Prayer request not found' }, { status: 404 });
    }

    return NextResponse.json(prayerRequest);
  } catch (error) {
    console.error('Error fetching prayer request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prayer request' },
      { status: 500 }
    );
  }
}

// PATCH - Update prayer request
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    const updateData: any = {};

    if (validatedData.status) {
      updateData.status = validatedData.status;
    }

    if (validatedData.hasTestimony !== undefined) {
      updateData.hasTestimony = validatedData.hasTestimony;
    }

    if (validatedData.testimony !== undefined) {
      updateData.testimony = validatedData.testimony;
      if (validatedData.testimony) {
        updateData.testimonyDate = new Date();
      }
    }

    // Special action: mark as prayed
    if (validatedData.markAsPrayed && session) {
      const prayerRequest = await prisma.prayerRequest.findUnique({
        where: { id },
        select: { prayedBy: true, prayerCount: true },
      });

      if (prayerRequest) {
        const prayedBy = prayerRequest.prayedBy as string[];
        if (!prayedBy.includes(session.user.id)) {
          updateData.prayedBy = [...prayedBy, session.user.id];
          updateData.prayerCount = prayerRequest.prayerCount + 1;
        }
      }
    }

    const updatedRequest = await prisma.prayerRequest.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating prayer request:', error);
    return NextResponse.json(
      { error: 'Failed to update prayer request' },
      { status: 500 }
    );
  }
}

// DELETE - Delete prayer request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.prayerRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting prayer request:', error);
    return NextResponse.json(
      { error: 'Failed to delete prayer request' },
      { status: 500 }
    );
  }
}
