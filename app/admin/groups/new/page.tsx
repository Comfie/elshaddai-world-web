import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { GroupForm } from '@/components/admin/group-form';
import { getMinistriesForSelect } from '@/lib/actions/groups';

export default async function NewGroupPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const ministries = await getMinistriesForSelect();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/groups">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Group</h1>
          <p className="text-muted-foreground">
            Add a new small group or bible study
          </p>
        </div>
      </div>

      <GroupForm ministries={ministries} />
    </div>
  );
}
