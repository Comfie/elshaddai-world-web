import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserForm } from '@/components/admin/user-form';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  // Only SUPER_ADMIN can edit users
  if (session?.user?.role !== 'SUPER_ADMIN') {
    redirect('/admin/dashboard');
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    notFound();
  }

  // Prepare initial data for the form
  const initialData = {
    name: user.name || '',
    email: user.email,
    role: user.role,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600">Update user information and role</p>
        </div>
      </div>

      <UserForm initialData={initialData} userId={user.id} isEdit />
    </div>
  );
}
