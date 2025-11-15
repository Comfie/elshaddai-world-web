'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for group
const groupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  leaderId: z.string().optional().nullable(),
  leaderName: z.string().optional().nullable(),
  ministryId: z.string().optional().nullable(),
  meetingDay: z.string().optional().nullable(),
  meetingTime: z.string().optional().nullable(),
  meetingLocation: z.string().optional().nullable(),
  maxMembers: z.number().int().positive().optional().nullable(),
  isActive: z.boolean(),
});

export type GroupFormData = z.infer<typeof groupSchema>;

export async function getGroups(params?: {
  search?: string;
  ministryId?: string;
  isActive?: boolean;
  skip?: number;
  take?: number;
}) {
  try {
    const where: any = {};

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { leaderName: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params?.ministryId) {
      where.ministryId = params.ministryId;
    }

    if (params?.isActive !== undefined) {
      where.isActive = params.isActive;
    }

    const [groups, total] = await Promise.all([
      prisma.group.findMany({
        where,
        include: {
          ministry: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              members: true,
              events: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip: params?.skip || 0,
        take: params?.take || 50,
      }),
      prisma.group.count({ where }),
    ]);

    return { groups, total };
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw new Error('Failed to fetch groups');
  }
}

export async function getGroupById(id: string) {
  try {
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        ministry: {
          select: {
            id: true,
            name: true,
          },
        },
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            photoUrl: true,
            status: true,
          },
          orderBy: { firstName: 'asc' },
        },
        events: {
          select: {
            id: true,
            title: true,
            eventDate: true,
            eventType: true,
            status: true,
          },
          orderBy: { eventDate: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            members: true,
            events: true,
          },
        },
      },
    });

    return group;
  } catch (error) {
    console.error('Error fetching group:', error);
    throw new Error('Failed to fetch group');
  }
}

export async function createGroup(data: GroupFormData) {
  try {
    // Validate the data
    const validatedData = groupSchema.parse(data);

    const group = await prisma.group.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        leaderId: validatedData.leaderId,
        leaderName: validatedData.leaderName,
        ministryId: validatedData.ministryId,
        meetingDay: validatedData.meetingDay,
        meetingTime: validatedData.meetingTime,
        meetingLocation: validatedData.meetingLocation,
        maxMembers: validatedData.maxMembers,
        isActive: validatedData.isActive,
      },
    });

    revalidatePath('/admin/groups');
    return { success: true, group };
  } catch (error) {
    console.error('Error creating group:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to create group' };
  }
}

export async function updateGroup(id: string, data: GroupFormData) {
  try {
    // Validate the data
    const validatedData = groupSchema.parse(data);

    const group = await prisma.group.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        leaderId: validatedData.leaderId,
        leaderName: validatedData.leaderName,
        ministryId: validatedData.ministryId,
        meetingDay: validatedData.meetingDay,
        meetingTime: validatedData.meetingTime,
        meetingLocation: validatedData.meetingLocation,
        maxMembers: validatedData.maxMembers,
        isActive: validatedData.isActive,
      },
    });

    revalidatePath('/admin/groups');
    revalidatePath(`/admin/groups/${id}`);
    return { success: true, group };
  } catch (error) {
    console.error('Error updating group:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to update group' };
  }
}

export async function deleteGroup(id: string) {
  try {
    await prisma.group.delete({
      where: { id },
    });

    revalidatePath('/admin/groups');
    return { success: true };
  } catch (error) {
    console.error('Error deleting group:', error);
    return { success: false, error: 'Failed to delete group' };
  }
}

export async function getGroupStats() {
  try {
    const [totalGroups, activeGroups] = await Promise.all([
      prisma.group.count(),
      prisma.group.count({
        where: { isActive: true },
      }),
    ]);

    // Get total members across all groups
    const groupsWithMembers = await prisma.group.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    const totalMembers = groupsWithMembers.reduce(
      (sum, group) => sum + group._count.members,
      0
    );

    // Get groups that are at capacity
    const atCapacity = groupsWithMembers.filter(
      (group) => group.maxMembers && group._count.members >= group.maxMembers
    ).length;

    return {
      totalGroups,
      activeGroups,
      totalMembers,
      atCapacity,
    };
  } catch (error) {
    console.error('Error fetching group stats:', error);
    return {
      totalGroups: 0,
      activeGroups: 0,
      totalMembers: 0,
      atCapacity: 0,
    };
  }
}

export async function getMinistriesForSelect() {
  try {
    const ministries = await prisma.ministry.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });

    return ministries;
  } catch (error) {
    console.error('Error fetching ministries:', error);
    return [];
  }
}
