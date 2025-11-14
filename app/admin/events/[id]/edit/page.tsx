import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Button } from '@/components/ui/button';
import { EventForm } from '@/components/admin/event-form';
import { getEventById } from '@/lib/actions/events';
import { prisma } from '@/lib/db';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id } = await params;
  const event = await getEventById(id);

  const [ministries, groups] = await Promise.all([
    prisma.ministry.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    }),
    prisma.group.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!event) {
    notFound();
  }

  // Prepare initial data for the form
  const initialData = {
    title: event.title,
    description: event.description || '',
    eventDate: new Date(event.eventDate),
    endDate: event.endDate ? new Date(event.endDate) : undefined,
    startTime: event.startTime || '',
    endTime: event.endTime || '',
    isAllDay: event.isAllDay,
    isRecurring: event.isRecurring,
    recurrenceRule: event.recurrenceRule || '',
    location: event.location,
    address: event.address || '',
    isOnline: event.isOnline,
    onlineLink: event.onlineLink || '',
    eventType: event.eventType,
    ministryId: event.ministryId || '',
    groupId: event.groupId || '',
    requiresRSVP: event.requiresRSVP,
    maxAttendees: event.maxAttendees || undefined,
    registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline) : undefined,
    imageUrl: event.imageUrl || '',
    posterUrl: event.posterUrl || '',
    displayOnWebsite: event.displayOnWebsite,
    isFeatured: event.isFeatured,
    status: event.status,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/events/${event.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit {event.title}</h1>
          <p className="text-muted-foreground">
            Update event information
          </p>
        </div>
      </div>

      <EventForm
        initialData={initialData}
        eventId={event.id}
        ministries={ministries}
        groups={groups}
        userId={session.user.id}
      />
    </div>
  );
}
