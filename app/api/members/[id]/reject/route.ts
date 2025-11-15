import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

// DELETE - Reject and delete a pending member registration
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get the member
    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    if (member.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending registrations can be rejected' },
        { status: 400 }
      );
    }

    // Delete the member registration
    await prisma.member.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Member registration rejected and removed',
    });
  } catch (error) {
    console.error('Error rejecting member:', error);
    return NextResponse.json(
      { error: 'Failed to reject member registration' },
      { status: 500 }
    );
  }
}
