'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { EventType, EventStatus } from '@prisma/client';
import { z } from 'zod';

// Validation schema for event
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  eventDate: z.date(),
  endDate: z.date().optional().nullable(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  isAllDay: z.boolean().default(false),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().optional().nullable(),
  location: z.string().min(1, 'Location is required'),
  address: z.string().optional().nullable(),
  isOnline: z.boolean().default(false),
  onlineLink: z.string().url().optional().or(z.literal('')).nullable(),
  eventType: z.nativeEnum(EventType).default('SERVICE'),
  ministryId: z.string().optional().nullable(),
  groupId: z.string().optional().nullable(),
  requiresRSVP: z.boolean().default(false),
  maxAttendees: z.number().optional().nullable(),
  registrationDeadline: z.date().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  posterUrl: z.string().optional().nullable(),
  displayOnWebsite: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  status: z.nativeEnum(EventStatus).default('SCHEDULED'),
});

export type EventFormData = z.infer<typeof eventSchema>;

export async function getEvents(params?: {
  search?: string;
  status?: EventStatus;
  eventType?: EventType;
  ministryId?: string;
  upcoming?: boolean;
  skip?: number;
  take?: number;
}) {
  try {
    const where: any = {};

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { location: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.eventType) {
      where.eventType = params.eventType;
    }

    if (params?.ministryId) {
      where.ministryId = params.ministryId;
    }

    if (params?.upcoming) {
      where.eventDate = { gte: new Date() };
      where.status = 'SCHEDULED';
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          ministry: { select: { name: true } },
          group: { select: { name: true } },
          createdBy: { select: { name: true } },
        },
        orderBy: { eventDate: 'desc' },
        skip: params?.skip || 0,
        take: params?.take || 50,
      }),
      prisma.event.count({ where }),
    ]);

    return { events, total };
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
}

export async function getEventById(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        ministry: true,
        group: true,
        createdBy: { select: { name: true, email: true } },
        attendance: {
          include: {
            member: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return event;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw new Error('Failed to fetch event');
  }
}

export async function createEvent(data: EventFormData, userId: string) {
  try {
    const validated = eventSchema.parse(data);

    const event = await prisma.event.create({
      data: {
        ...validated,
        onlineLink: validated.onlineLink || undefined,
        createdById: userId,
      },
    });

    revalidatePath('/admin/events');
    revalidatePath('/admin/dashboard');
    return { success: true, event };
  } catch (error) {
    console.error('Error creating event:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to create event' };
  }
}

export async function updateEvent(id: string, data: EventFormData) {
  try {
    const validated = eventSchema.parse(data);

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...validated,
        onlineLink: validated.onlineLink || undefined,
      },
    });

    revalidatePath('/admin/events');
    revalidatePath(`/admin/events/${id}`);
    revalidatePath('/admin/dashboard');
    return { success: true, event };
  } catch (error) {
    console.error('Error updating event:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to update event' };
  }
}

export async function deleteEvent(id: string) {
  try {
    await prisma.event.delete({
      where: { id },
    });

    revalidatePath('/admin/events');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error: 'Failed to delete event' };
  }
}

export async function getEventStats() {
  try {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    const [
      totalEvents,
      upcomingEvents,
      thisMonthEvents,
      featuredEvents,
    ] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({
        where: {
          eventDate: { gte: now },
          status: 'SCHEDULED',
        },
      }),
      prisma.event.count({
        where: {
          eventDate: {
            gte: now,
            lte: nextMonth,
          },
          status: 'SCHEDULED',
        },
      }),
      prisma.event.count({
        where: {
          isFeatured: true,
          status: 'SCHEDULED',
        },
      }),
    ]);

    return {
      totalEvents,
      upcomingEvents,
      thisMonthEvents,
      featuredEvents,
    };
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return {
      totalEvents: 0,
      upcomingEvents: 0,
      thisMonthEvents: 0,
      featuredEvents: 0,
    };
  }
}
