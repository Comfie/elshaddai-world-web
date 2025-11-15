import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserForm } from '@/components/admin/user-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function NewUserPage() {
  const session = await auth();

  // Only SUPER_ADMIN can create users
  if (session?.user?.role !== 'SUPER_ADMIN') {
    redirect('/admin/dashboard');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New User</h1>
          <p className="text-gray-600">Create a new system user with role assignment</p>
        </div>
      </div>

      <UserForm />
    </div>
  );
}
