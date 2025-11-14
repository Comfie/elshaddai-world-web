import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MemberForm } from '@/components/admin/member-form';
import { prisma } from '@/lib/db';

export default async function NewMemberPage() {
  const ministries = await prisma.ministry.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/members">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Member</h1>
          <p className="text-muted-foreground">
            Create a new member profile
          </p>
        </div>
      </div>

      <MemberForm ministries={ministries} />
    </div>
  );
}
