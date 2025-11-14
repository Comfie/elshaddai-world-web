import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Button } from '@/components/ui/button';
import { GroupForm } from '@/components/admin/group-form';
import { getGroupById, getMinistriesForSelect } from '@/lib/actions/groups';

export default async function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id } = await params;
  const [group, ministries] = await Promise.all([
    getGroupById(id),
    getMinistriesForSelect(),
  ]);

  if (!group) {
    notFound();
  }

  // Prepare initial data for the form
  const initialData = {
    name: group.name,
    description: group.description || '',
    leaderId: group.leaderId || '',
    leaderName: group.leaderName || '',
    ministryId: group.ministryId || '',
    meetingDay: group.meetingDay || '',
    meetingTime: group.meetingTime || '',
    meetingLocation: group.meetingLocation || '',
    maxMembers: group.maxMembers || undefined,
    isActive: group.isActive,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/groups/${group.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit {group.name}</h1>
          <p className="text-muted-foreground">
            Update group information
          </p>
        </div>
      </div>

      <GroupForm
        initialData={initialData}
        groupId={group.id}
        ministries={ministries}
      />
    </div>
  );
}
