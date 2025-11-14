import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Button } from '@/components/ui/button';
import { NoticeForm } from '@/components/admin/notice-form';
import { getNoticeById } from '@/lib/actions/notices';

export default async function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session?.user?.name) {
    redirect('/login');
  }

  const { id } = await params;
  const notice = await getNoticeById(id);

  if (!notice) {
    notFound();
  }

  // Prepare initial data for the form
  const initialData = {
    title: notice.title,
    content: notice.content,
    summary: notice.summary || '',
    category: notice.category,
    priority: notice.priority,
    targetAudience: notice.targetAudience,
    publishDate: new Date(notice.publishDate),
    expiryDate: notice.expiryDate ? new Date(notice.expiryDate) : undefined,
    displayOnWebsite: notice.displayOnWebsite,
    isActive: notice.isActive,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/notices/${notice.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit {notice.title}</h1>
          <p className="text-muted-foreground">
            Update notice information
          </p>
        </div>
      </div>

      <NoticeForm
        initialData={initialData}
        noticeId={notice.id}
        userId={session.user.id}
        userName={session.user.name}
      />
    </div>
  );
}
