'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { Gender, MaritalStatus, MembershipType, MemberStatus } from '@prisma/client';
import { z } from 'zod';

// Validation schema for member
const memberSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional().nullable(),
  phone: z.string().min(1, 'Phone number is required'),
  alternatePhone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  dateOfBirth: z.date().optional().nullable(),
  gender: z.nativeEnum(Gender).optional().nullable(),
  maritalStatus: z.nativeEnum(MaritalStatus).optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  membershipType: z.nativeEnum(MembershipType).default('VISITOR'),
  baptized: z.boolean().default(false),
  baptismDate: z.date().optional().nullable(),
  salvationDate: z.date().optional().nullable(),
  ministryId: z.string().optional().nullable(),
  groupId: z.string().optional().nullable(),
  familyId: z.string().optional().nullable(),
  status: z.nativeEnum(MemberStatus).default('ACTIVE'),
  notes: z.string().optional().nullable(),
});

export type MemberFormData = z.infer<typeof memberSchema>;

export async function getMembers(params?: {
  search?: string;
  status?: MemberStatus;
  membershipType?: MembershipType;
  ministryId?: string;
  skip?: number;
  take?: number;
}) {
  try {
    const where: any = {};

    if (params?.search) {
      where.OR = [
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { phone: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.membershipType) {
      where.membershipType = params.membershipType;
    }

    if (params?.ministryId) {
      where.ministryId = params.ministryId;
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        include: {
          ministry: { select: { name: true } },
          group: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: params?.skip || 0,
        take: params?.take || 50,
      }),
      prisma.member.count({ where }),
    ]);

    return { members, total };
  } catch (error) {
    console.error('Error fetching members:', error);
    throw new Error('Failed to fetch members');
  }
}

export async function getMemberById(id: string) {
  try {
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        ministry: true,
        group: true,
        family: true,
        followUps: {
          include: {
            assignedTo: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        attendance: {
          orderBy: { serviceDate: 'desc' },
          take: 10,
        },
      },
    });

    return member;
  } catch (error) {
    console.error('Error fetching member:', error);
    throw new Error('Failed to fetch member');
  }
}

export async function createMember(data: MemberFormData) {
  try {
    const validated = memberSchema.parse(data);

    const member = await prisma.member.create({
      data: {
        ...validated,
        email: validated.email || undefined,
      },
    });

    revalidatePath('/admin/members');
    return { success: true, member };
  } catch (error) {
    console.error('Error creating member:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Failed to create member' };
  }
}

export async function updateMember(id: string, data: MemberFormData) {
  try {
    const validated = memberSchema.parse(data);

    const member = await prisma.member.update({
      where: { id },
      data: {
        ...validated,
        email: validated.email || undefined,
      },
    });

    revalidatePath('/admin/members');
    revalidatePath(`/admin/members/${id}`);
    return { success: true, member };
  } catch (error) {
    console.error('Error updating member:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Failed to update member' };
  }
}

export async function deleteMember(id: string) {
  try {
    await prisma.member.delete({
      where: { id },
    });

    revalidatePath('/admin/members');
    return { success: true };
  } catch (error) {
    console.error('Error deleting member:', error);
    return { success: false, error: 'Failed to delete member' };
  }
}

export async function getMemberStats() {
  try {
    const [
      totalMembers,
      activeMembers,
      newThisMonth,
      visitors,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { status: 'ACTIVE' } }),
      prisma.member.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.member.count({ where: { membershipType: 'VISITOR' } }),
    ]);

    return {
      totalMembers,
      activeMembers,
      newThisMonth,
      visitors,
    };
  } catch (error) {
    console.error('Error fetching member stats:', error);
    return {
      totalMembers: 0,
      activeMembers: 0,
      newThisMonth: 0,
      visitors: 0,
    };
  }
}
