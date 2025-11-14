import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Button } from '@/components/ui/button';
import { FollowUpForm } from '@/components/admin/follow-up-form';
import { getFollowUpById, getMembersForSelect, getUsersForSelect } from '@/lib/actions/follow-ups';

export default async function EditFollowUpPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id } = await params;
  const [followUp, members, users] = await Promise.all([
    getFollowUpById(id),
    getMembersForSelect(),
    getUsersForSelect(),
  ]);

  if (!followUp) {
    notFound();
  }

  // Prepare initial data for the form
  const initialData = {
    memberId: followUp.memberId,
    assignedToId: followUp.assignedToId,
    assignedToName: followUp.assignedToName,
    reason: followUp.reason,
    reasonOther: followUp.reasonOther || '',
    priority: followUp.priority,
    method: followUp.method || undefined,
    status: followUp.status,
    dueDate: new Date(followUp.dueDate),
    completedAt: followUp.completedAt ? new Date(followUp.completedAt) : undefined,
    initialNotes: followUp.initialNotes || '',
    followUpNotes: followUp.followUpNotes || '',
    outcome: followUp.outcome || '',
    requiresFollowUp: followUp.requiresFollowUp,
    nextFollowUpDate: followUp.nextFollowUpDate ? new Date(followUp.nextFollowUpDate) : undefined,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/follow-ups/${followUp.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Follow-up: {followUp.member.firstName} {followUp.member.lastName}
          </h1>
          <p className="text-muted-foreground">
            Update follow-up information
          </p>
        </div>
      </div>

      <FollowUpForm
        initialData={initialData}
        followUpId={followUp.id}
        members={members}
        users={users}
      />
    </div>
  );
}
