import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Users as UsersIcon, Shield, UserCog, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

async function getUsers() {
  return await prisma.user.findMany({
    orderBy: [
      { role: 'asc' },
      { createdAt: 'desc' },
    ],
  });
}

export default async function UsersPage() {
  const session = await auth();

  // Only SUPER_ADMIN can access user management
  if (session?.user?.role !== 'SUPER_ADMIN') {
    redirect('/admin/dashboard');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Users</h1>
          <p className="text-gray-600">Manage admin users and their roles</p>
        </div>
        <Link href="/admin/users/new">
          <Button className="bg-blue-900 hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <Suspense fallback={<UsersSkeleton />}>
        <UsersList />
      </Suspense>
    </div>
  );
}

async function UsersList() {
  const users = await getUsers();

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <UsersIcon className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No users yet</h3>
          <p className="text-gray-600 text-center mb-4">
            Get started by adding your first user
          </p>
          <Link href="/admin/users/new">
            <Button className="bg-blue-900 hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Shield className="h-4 w-4" />;
      case 'ADMIN':
        return <UserCog className="h-4 w-4" />;
      case 'LEADER':
        return <UsersIcon className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge className="bg-purple-600">Super Admin</Badge>;
      case 'ADMIN':
        return <Badge className="bg-blue-600">Admin</Badge>;
      case 'LEADER':
        return <Badge className="bg-green-600">Leader</Badge>;
      default:
        return <Badge variant="secondary">Member</Badge>;
    }
  };

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <Card key={user.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  {getRoleIcon(user.role)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getRoleBadge(user.role)}
                <Link href={`/admin/users/${user.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit Role
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UsersSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
