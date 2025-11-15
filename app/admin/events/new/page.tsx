import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { EventForm } from '@/components/admin/event-form';
import { prisma } from '@/lib/db';

export default async function NewEventPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
          <p className="text-muted-foreground">
            Add a new event to the calendar
          </p>
        </div>
      </div>

      <EventForm ministries={ministries} groups={groups} userId={session.user.id} />
    </div>
  );
}
