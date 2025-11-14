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
  Video,
  UserCheck,
  Mail,
  Heart,
  BarChart,
  Settings,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Members', href: '/admin/members', icon: Users },
  { name: 'Follow-ups', href: '/admin/follow-ups', icon: ClipboardList },
  { name: 'Groups', href: '/admin/groups', icon: Users },
  { name: 'Notices', href: '/admin/notices', icon: Bell },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Ministries', href: '/admin/ministries', icon: Church },
  { name: 'Books', href: '/admin/books', icon: BookOpen },
  { name: 'Sermons', href: '/admin/sermons', icon: Video },
  { name: 'Contact Messages', href: '/admin/contact-messages', icon: Mail },
  { name: 'Prayer Requests', href: '/admin/prayer-requests', icon: Heart },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="flex h-full flex-col border-r bg-gradient-to-b from-blue-900 to-blue-950">
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b border-blue-800 px-6">
        <Church className="h-6 w-6 text-blue-200" />
        <span className="ml-2 text-lg font-semibold text-white">El Shaddai</span>
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
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="border-t border-blue-800 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-blue-100 hover:bg-blue-800 hover:text-white"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
