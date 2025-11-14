'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { NoticeCategory, TargetAudience, Priority } from '@prisma/client';
import { z } from 'zod';

// Validation schema for notice
const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  summary: z.string().optional().nullable(),
  priority: z.nativeEnum(Priority).default('NORMAL'),
  category: z.nativeEnum(NoticeCategory).default('GENERAL'),
  displayOnWebsite: z.boolean().default(true),
  displayInAdmin: z.boolean().default(true),
  targetAudience: z.nativeEnum(TargetAudience).default('EVERYONE'),
  publishDate: z.date().default(() => new Date()),
  expiryDate: z.date().optional().nullable(),
  isActive: z.boolean().default(true),
  imageUrl: z.string().optional().nullable(),
  attachmentUrl: z.string().optional().nullable(),
});

export type NoticeFormData = z.infer<typeof noticeSchema>;

export async function getNotices(params?: {
  search?: string;
  category?: NoticeCategory;
  priority?: Priority;
  active?: boolean;
  skip?: number;
  take?: number;
}) {
  try {
    const where: any = {};

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { content: { contains: params.search, mode: 'insensitive' } },
        { summary: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params?.category) {
      where.category = params.category;
    }

    if (params?.priority) {
      where.priority = params.priority;
    }

    if (params?.active !== undefined) {
      where.isActive = params.active;
    }

    const [notices, total] = await Promise.all([
      prisma.notice.findMany({
        where,
        include: {
          createdBy: { select: { name: true } },
        },
        orderBy: [{ priority: 'desc' }, { publishDate: 'desc' }],
        skip: params?.skip || 0,
        take: params?.take || 50,
      }),
      prisma.notice.count({ where }),
    ]);

    return { notices, total };
  } catch (error) {
    console.error('Error fetching notices:', error);
    throw new Error('Failed to fetch notices');
  }
}

export async function getNoticeById(id: string) {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id },
      include: {
        createdBy: { select: { name: true, email: true } },
      },
    });

    return notice;
  } catch (error) {
    console.error('Error fetching notice:', error);
    throw new Error('Failed to fetch notice');
  }
}

export async function createNotice(data: NoticeFormData, userId: string, userName: string) {
  try {
    const validated = noticeSchema.parse(data);

    const notice = await prisma.notice.create({
      data: {
        ...validated,
        createdById: userId,
        createdByName: userName,
      },
    });

    revalidatePath('/admin/notices');
    revalidatePath('/admin/dashboard');
    return { success: true, notice };
  } catch (error) {
    console.error('Error creating notice:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to create notice' };
  }
}

export async function updateNotice(id: string, data: NoticeFormData) {
  try {
    const validated = noticeSchema.parse(data);

    const notice = await prisma.notice.update({
      where: { id },
      data: validated,
    });

    revalidatePath('/admin/notices');
    revalidatePath(`/admin/notices/${id}`);
    revalidatePath('/admin/dashboard');
    return { success: true, notice };
  } catch (error) {
    console.error('Error updating notice:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to update notice' };
  }
}

export async function deleteNotice(id: string) {
  try {
    await prisma.notice.delete({
      where: { id },
    });

    revalidatePath('/admin/notices');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting notice:', error);
    return { success: false, error: 'Failed to delete notice' };
  }
}

export async function getNoticeStats() {
  try {
    const now = new Date();

    const [
      totalNotices,
      activeNotices,
      urgentNotices,
      expiringNotices,
    ] = await Promise.all([
      prisma.notice.count(),
      prisma.notice.count({
        where: {
          isActive: true,
          publishDate: { lte: now },
          OR: [
            { expiryDate: null },
            { expiryDate: { gte: now } },
          ],
        },
      }),
      prisma.notice.count({
        where: {
          isActive: true,
          priority: 'URGENT',
        },
      }),
      prisma.notice.count({
        where: {
          isActive: true,
          expiryDate: {
            gte: now,
            lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
        },
      }),
    ]);

    return {
      totalNotices,
      activeNotices,
      urgentNotices,
      expiringNotices,
    };
  } catch (error) {
    console.error('Error fetching notice stats:', error);
    return {
      totalNotices: 0,
      activeNotices: 0,
      urgentNotices: 0,
      expiringNotices: 0,
    };
  }
}
