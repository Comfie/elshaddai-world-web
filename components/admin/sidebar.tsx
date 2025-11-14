'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Bell,
  Calendar,
  Church,
  BookOpen,
  UserCheck,
  Mail,
  BarChart,
  Settings,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Members', href: '/admin/members', icon: Users },
  { name: 'Follow-ups', href: '/admin/follow-ups', icon: ClipboardList },
  { name: 'Notices', href: '/admin/notices', icon: Bell },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Ministries', href: '/admin/ministries', icon: Church },
  { name: 'Groups', href: '/admin/groups', icon: Users },
  { name: 'Books', href: '/admin/books', icon: BookOpen },
  { name: 'Attendance', href: '/admin/attendance', icon: UserCheck },
  { name: 'Communications', href: '/admin/communications', icon: Mail },
  { name: 'Reports', href: '/admin/reports', icon: BarChart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="flex h-full flex-col border-r bg-background">
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b px-6">
        <Church className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold">El Shaddai</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
