import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// POST - Approve a pending member registration
export async function POST(
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
        { error: 'Only pending registrations can be approved' },
        { status: 400 }
      );
    }

    // Update member status to ACTIVE
    const approvedMember = await prisma.member.update({
      where: { id },
      data: {
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Member registration approved successfully',
      member: approvedMember,
    });
  } catch (error) {
    console.error('Error approving member:', error);
    return NextResponse.json(
      { error: 'Failed to approve member registration' },
      { status: 500 }
    );
  }
}
