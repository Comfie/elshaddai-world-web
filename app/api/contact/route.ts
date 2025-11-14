import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  category: z.enum([
    'GENERAL',
    'PRAYER_REQUEST',
    'VISITOR_INFO',
    'PARTNERSHIP',
    'MEDIA_INQUIRY',
    'COMPLAINT',
    'SUGGESTION',
  ]).optional(),
});

// GET - List all contact messages (admin only)
export async function GET(request: NextRequest) {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: [
        { status: 'asc' }, // NEW messages first
        { createdAt: 'desc' },
      ],
      take: 100,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
}

// POST - Create new contact message (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Get IP address and user agent for tracking
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const message = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        subject: validatedData.subject,
        message: validatedData.message,
        category: validatedData.category || 'GENERAL',
        ipAddress,
        userAgent,
        status: 'NEW',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received. We will get back to you soon!',
        id: message.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
