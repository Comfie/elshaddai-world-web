import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(1, 'Phone number is required'),
  alternatePhone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', '']).optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', '']).optional(),
  membershipType: z.enum(['VISITOR', 'NEW_CONVERT', 'MEMBER']).default('VISITOR'),
  notes: z.string().optional(),
});

// POST - Public member registration (creates member with PENDING status)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if email already exists (if email provided)
    if (validatedData.email) {
      const existingMember = await prisma.member.findUnique({
        where: { email: validatedData.email },
      });

      if (existingMember) {
        return NextResponse.json(
          { error: 'A member with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Create member with PENDING status
    const member = await prisma.member.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email || null,
        phone: validatedData.phone,
        alternatePhone: validatedData.alternatePhone || null,
        address: validatedData.address || null,
        city: validatedData.city || null,
        province: validatedData.province || null,
        postalCode: validatedData.postalCode || null,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        gender: validatedData.gender || null,
        maritalStatus: validatedData.maritalStatus || null,
        membershipType: validatedData.membershipType,
        notes: validatedData.notes || null,
        status: 'PENDING', // Set to PENDING for admin approval
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your registration has been submitted successfully. Our team will review and contact you soon.',
        id: member.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating member registration:', error);
    return NextResponse.json(
      { error: 'Failed to submit registration' },
      { status: 500 }
    );
  }
}
