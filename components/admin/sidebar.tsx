'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
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
  ChevronLeft,
  ChevronRight,
  UserCog,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'System Users', href: '/admin/users', icon: UserCog, superAdminOnly: true },
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
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load initial state from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter((item) => {
    if (item.superAdminOnly) {
      return session?.user?.role === 'SUPER_ADMIN';
    }
    return true;
  });

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-gradient-to-b from-blue-900 to-blue-950 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo/Header with Toggle */}
      <div className="flex h-16 items-center justify-between border-b border-blue-800 px-3">
        <div className="flex items-center overflow-hidden">
          <Church className="h-6 w-6 text-blue-200 flex-shrink-0" />
          {!isCollapsed && (
            <span className="ml-2 text-lg font-semibold text-white whitespace-nowrap">El Shaddai</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="text-blue-200 hover:bg-blue-800 hover:text-white p-1 h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="border-t border-blue-800 p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full gap-3 text-blue-100 hover:bg-blue-800 hover:text-white",
            isCollapsed ? 'justify-center px-2' : 'justify-start'
          )}
          onClick={handleSignOut}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
}
