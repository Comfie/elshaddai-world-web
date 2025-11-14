import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Button } from '@/components/ui/button';
import { MinistryForm } from '@/components/admin/ministry-form';
import { getMinistryById, getLeadersForSelect } from '@/lib/actions/ministries';

export default async function EditMinistryPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id } = await params;
  const [ministry, leaders] = await Promise.all([
    getMinistryById(id),
    getLeadersForSelect(),
  ]);

  if (!ministry) {
    notFound();
  }

  // Prepare initial data for the form
  const initialData = {
    name: ministry.name,
    description: ministry.description || '',
    leaderId: ministry.leaderId || '',
    isActive: ministry.isActive,
    contactEmail: ministry.contactEmail || '',
    contactPhone: ministry.contactPhone || '',
    meetingSchedule: ministry.meetingSchedule || '',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/ministries/${ministry.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit {ministry.name}</h1>
          <p className="text-muted-foreground">
            Update ministry information
          </p>
        </div>
      </div>

      <MinistryForm
        initialData={initialData}
        ministryId={ministry.id}
        leaders={leaders}
      />
    </div>
  );
}
