'use client';

import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { data: session } = useSession();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-500';
      case 'ADMIN':
        return 'bg-blue-500';
      case 'LEADER':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h2 className="text-xl font-semibold">Admin Portal</h2>
        <p className="text-sm text-muted-foreground">
          Manage your church operations
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{session?.user?.name}</p>
          <Badge variant="outline" className={cn(getRoleColor(session?.user?.role || ''), 'text-white text-xs')}>
            {formatRole(session?.user?.role || '')}
          </Badge>
        </div>
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {session?.user?.name ? getInitials(session.user.name) : 'AD'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
