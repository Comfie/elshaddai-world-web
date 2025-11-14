'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { FollowUpReason, ContactMethod, FollowUpStatus, Priority } from '@prisma/client';
import { z } from 'zod';

// Validation schema for follow-up
const followUpSchema = z.object({
  memberId: z.string().min(1, 'Member is required'),
  assignedToId: z.string().min(1, 'Assigned to is required'),
  assignedToName: z.string().min(1, 'Assigned to name is required'),
  reason: z.nativeEnum(FollowUpReason),
  reasonOther: z.string().optional().nullable(),
  priority: z.nativeEnum(Priority).default('NORMAL'),
  method: z.nativeEnum(ContactMethod).optional().nullable(),
  status: z.nativeEnum(FollowUpStatus).default('PENDING'),
  dueDate: z.date(),
  completedAt: z.date().optional().nullable(),
  initialNotes: z.string().optional().nullable(),
  followUpNotes: z.string().optional().nullable(),
  outcome: z.string().optional().nullable(),
  requiresFollowUp: z.boolean().default(false),
  nextFollowUpDate: z.date().optional().nullable(),
});

export type FollowUpFormData = z.infer<typeof followUpSchema>;

export async function getFollowUps(params?: {
  search?: string;
  status?: FollowUpStatus;
  priority?: Priority;
  assignedToId?: string;
  memberId?: string;
  overdue?: boolean;
  skip?: number;
  take?: number;
}) {
  try {
    const where: any = {};

    if (params?.search) {
      where.OR = [
        { assignedToName: { contains: params.search, mode: 'insensitive' } },
        { initialNotes: { contains: params.search, mode: 'insensitive' } },
        { followUpNotes: { contains: params.search, mode: 'insensitive' } },
        {
          member: {
            OR: [
              { firstName: { contains: params.search, mode: 'insensitive' } },
              { lastName: { contains: params.search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.priority) {
      where.priority = params.priority;
    }

    if (params?.assignedToId) {
      where.assignedToId = params.assignedToId;
    }

    if (params?.memberId) {
      where.memberId = params.memberId;
    }

    if (params?.overdue) {
      where.dueDate = { lt: new Date() };
      where.status = { in: ['PENDING', 'IN_PROGRESS'] };
    }

    const [followUps, total] = await Promise.all([
      prisma.followUp.findMany({
        where,
        include: {
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              photoUrl: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [
          { status: 'asc' },
          { dueDate: 'asc' },
        ],
        skip: params?.skip || 0,
        take: params?.take || 50,
      }),
      prisma.followUp.count({ where }),
    ]);

    return { followUps, total };
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    throw new Error('Failed to fetch follow-ups');
  }
}

export async function getFollowUpById(id: string) {
  try {
    const followUp = await prisma.followUp.findUnique({
      where: { id },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            photoUrl: true,
            membershipType: true,
            status: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return followUp;
  } catch (error) {
    console.error('Error fetching follow-up:', error);
    throw new Error('Failed to fetch follow-up');
  }
}

export async function createFollowUp(data: FollowUpFormData) {
  try {
    // Validate the data
    const validatedData = followUpSchema.parse(data);

    const followUp = await prisma.followUp.create({
      data: {
        memberId: validatedData.memberId,
        assignedToId: validatedData.assignedToId,
        assignedToName: validatedData.assignedToName,
        reason: validatedData.reason,
        reasonOther: validatedData.reasonOther,
        priority: validatedData.priority,
        method: validatedData.method,
        status: validatedData.status,
        dueDate: validatedData.dueDate,
        completedAt: validatedData.completedAt,
        initialNotes: validatedData.initialNotes,
        followUpNotes: validatedData.followUpNotes,
        outcome: validatedData.outcome,
        requiresFollowUp: validatedData.requiresFollowUp,
        nextFollowUpDate: validatedData.nextFollowUpDate,
      },
    });

    revalidatePath('/admin/follow-ups');
    revalidatePath(`/admin/members/${validatedData.memberId}`);
    return { success: true, followUp };
  } catch (error) {
    console.error('Error creating follow-up:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Failed to create follow-up' };
  }
}

export async function updateFollowUp(id: string, data: FollowUpFormData) {
  try {
    // Validate the data
    const validatedData = followUpSchema.parse(data);

    // If status is being changed to COMPLETED, set completedAt
    const updateData: any = {
      memberId: validatedData.memberId,
      assignedToId: validatedData.assignedToId,
      assignedToName: validatedData.assignedToName,
      reason: validatedData.reason,
      reasonOther: validatedData.reasonOther,
      priority: validatedData.priority,
      method: validatedData.method,
      status: validatedData.status,
      dueDate: validatedData.dueDate,
      initialNotes: validatedData.initialNotes,
      followUpNotes: validatedData.followUpNotes,
      outcome: validatedData.outcome,
      requiresFollowUp: validatedData.requiresFollowUp,
      nextFollowUpDate: validatedData.nextFollowUpDate,
    };

    // Set completedAt if status is COMPLETED and not already set
    if (validatedData.status === 'COMPLETED' && !validatedData.completedAt) {
      updateData.completedAt = new Date();
    } else if (validatedData.completedAt) {
      updateData.completedAt = validatedData.completedAt;
    }

    const followUp = await prisma.followUp.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/admin/follow-ups');
    revalidatePath(`/admin/follow-ups/${id}`);
    revalidatePath(`/admin/members/${validatedData.memberId}`);
    return { success: true, followUp };
  } catch (error) {
    console.error('Error updating follow-up:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Failed to update follow-up' };
  }
}

export async function deleteFollowUp(id: string) {
  try {
    const followUp = await prisma.followUp.findUnique({
      where: { id },
      select: { memberId: true },
    });

    await prisma.followUp.delete({
      where: { id },
    });

    revalidatePath('/admin/follow-ups');
    if (followUp) {
      revalidatePath(`/admin/members/${followUp.memberId}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting follow-up:', error);
    return { success: false, error: 'Failed to delete follow-up' };
  }
}

export async function getFollowUpStats() {
  try {
    const [totalFollowUps, pending, inProgress, completed, overdue] = await Promise.all([
      prisma.followUp.count(),
      prisma.followUp.count({
        where: { status: 'PENDING' },
      }),
      prisma.followUp.count({
        where: { status: 'IN_PROGRESS' },
      }),
      prisma.followUp.count({
        where: { status: 'COMPLETED' },
      }),
      prisma.followUp.count({
        where: {
          dueDate: { lt: new Date() },
          status: { in: ['PENDING', 'IN_PROGRESS'] },
        },
      }),
    ]);

    return {
      totalFollowUps,
      pending,
      inProgress,
      completed,
      overdue,
    };
  } catch (error) {
    console.error('Error fetching follow-up stats:', error);
    return {
      totalFollowUps: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
    };
  }
}

export async function getMembersForSelect() {
  try {
    const members = await prisma.member.findMany({
      where: {
        status: { in: ['ACTIVE'] },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
      orderBy: { firstName: 'asc' },
    });

    return members;
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
}

export async function getUsersForSelect() {
  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: 'asc' },
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}
