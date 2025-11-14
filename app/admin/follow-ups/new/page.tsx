import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { FollowUpForm } from '@/components/admin/follow-up-form';
import { getMembersForSelect, getUsersForSelect } from '@/lib/actions/follow-ups';

export default async function NewFollowUpPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const [members, users] = await Promise.all([
    getMembersForSelect(),
    getUsersForSelect(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/follow-ups">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Follow-up</h1>
          <p className="text-muted-foreground">
            Add a new member follow-up task
          </p>
        </div>
      </div>

      <FollowUpForm members={members} users={users} />
    </div>
  );
}
