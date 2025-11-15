import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { MinistryForm } from '@/components/admin/ministry-form';
import { getLeadersForSelect } from '@/lib/actions/ministries';

export default async function NewMinistryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const leaders = await getLeadersForSelect();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/ministries">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Ministry</h1>
          <p className="text-muted-foreground">
            Add a new ministry or department
          </p>
        </div>
      </div>

      <MinistryForm leaders={leaders} />
    </div>
  );
}
