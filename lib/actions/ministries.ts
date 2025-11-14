'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// Validation schema for ministry
const ministrySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  leaderId: z.string().optional().nullable(),
  isActive: z.boolean(),
  contactEmail: z.string().email('Invalid email').optional().or(z.literal('')).nullable(),
  contactPhone: z.string().optional().nullable(),
  meetingSchedule: z.string().optional().nullable(),
});

export type MinistryFormData = z.infer<typeof ministrySchema>;

// Type for ministry with relations
const ministryWithRelations = Prisma.validator<Prisma.MinistryDefaultArgs>()({
  include: {
    leader: {
      select: {
        id: true,
        name: true,
        email: true,
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
      },
    },
    events: {
      select: {
        id: true,
        title: true,
        eventDate: true,
        eventType: true,
        status: true,
      },
    },
    _count: {
      select: {
        members: true,
        events: true,
      },
    },
  },
});

export type MinistryWithRelations = Prisma.MinistryGetPayload<typeof ministryWithRelations>;

export async function getMinistries(params?: {
  search?: string;
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
      ];
    }

    if (params?.isActive !== undefined) {
      where.isActive = params.isActive;
    }

    const [ministries, total] = await Promise.all([
      prisma.ministry.findMany({
        where,
        include: {
          leader: {
            select: {
              id: true,
              name: true,
              email: true,
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
      prisma.ministry.count({ where }),
    ]);

    return { ministries, total };
  } catch (error) {
    console.error('Error fetching ministries:', error);
    throw new Error('Failed to fetch ministries');
  }
}

export async function getMinistryById(id: string): Promise<MinistryWithRelations | null> {
  try {
    return await prisma.ministry.findUnique({
      where: { id },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            email: true,
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
          },
          where: { status: 'ACTIVE' },
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
  } catch (error) {
    console.error('Error fetching ministry:', error);
    throw new Error('Failed to fetch ministry');
  }
}

export async function createMinistry(data: MinistryFormData) {
  try {
    // Validate the data
    const validatedData = ministrySchema.parse(data);

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const ministry = await prisma.ministry.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description ?? undefined,
        ...(validatedData.leaderId && {
          leader: { connect: { id: validatedData.leaderId } }
        }),
        isActive: validatedData.isActive,
        contactEmail: validatedData.contactEmail ?? undefined,
        contactPhone: validatedData.contactPhone ?? undefined,
        meetingSchedule: validatedData.meetingSchedule ?? undefined,
      },
    });

    revalidatePath('/admin/ministries');
    return { success: true, ministry };
  } catch (error) {
    console.error('Error creating ministry:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to create ministry' };
  }
}

export async function updateMinistry(id: string, data: MinistryFormData) {
  try {
    // Validate the data
    const validatedData = ministrySchema.parse(data);

    const ministry = await prisma.ministry.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description ?? undefined,
        ...(validatedData.leaderId ? {
          leader: { connect: { id: validatedData.leaderId } }
        } : {
          leader: { disconnect: true }
        }),
        isActive: validatedData.isActive,
        contactEmail: validatedData.contactEmail ?? undefined,
        contactPhone: validatedData.contactPhone ?? undefined,
        meetingSchedule: validatedData.meetingSchedule ?? undefined,
      },
    });

    revalidatePath('/admin/ministries');
    revalidatePath(`/admin/ministries/${id}`);
    return { success: true, ministry };
  } catch (error) {
    console.error('Error updating ministry:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to update ministry' };
  }
}

export async function deleteMinistry(id: string) {
  try {
    await prisma.ministry.delete({
      where: { id },
    });

    revalidatePath('/admin/ministries');
    return { success: true };
  } catch (error) {
    console.error('Error deleting ministry:', error);
    return { success: false, error: 'Failed to delete ministry' };
  }
}

export async function getMinistryStats() {
  try {
    const [totalMinistries, activeMinistries] = await Promise.all([
      prisma.ministry.count(),
      prisma.ministry.count({
        where: { isActive: true },
      }),
    ]);

    // Get total members across all ministries
    const ministriesWithMembers = await prisma.ministry.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    const totalMembers = ministriesWithMembers.reduce(
      (sum, ministry) => sum + ministry._count.members,
      0
    );

    // Get ministries with upcoming events
    const ministriesWithEvents = await prisma.ministry.findMany({
      where: {
        events: {
          some: {
            eventDate: { gte: new Date() },
            status: 'SCHEDULED',
          },
        },
      },
    });

    return {
      totalMinistries,
      activeMinistries,
      totalMembers,
      withUpcomingEvents: ministriesWithEvents.length,
    };
  } catch (error) {
    console.error('Error fetching ministry stats:', error);
    return {
      totalMinistries: 0,
      activeMinistries: 0,
      totalMembers: 0,
      withUpcomingEvents: 0,
    };
  }
}

export async function getLeadersForSelect() {
  try {
    const leaders = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'LEADER', 'SUPER_ADMIN'] },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: 'asc' },
    });

    return leaders;
  } catch (error) {
    console.error('Error fetching leaders:', error);
    return [];
  }
}
