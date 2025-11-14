import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Button } from '@/components/ui/button';
import { NoticeForm } from '@/components/admin/notice-form';

export default async function NewNoticePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session?.user?.name) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/notices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Notice</h1>
          <p className="text-muted-foreground">
            Add a new notice or announcement
          </p>
        </div>
      </div>

      <NoticeForm userId={session.user.id} userName={session.user.name} />
    </div>
  );
}
