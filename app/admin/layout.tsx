import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/admin/sidebar';
import { Header } from '@/components/admin/header';
import { SessionProvider } from '@/components/providers/session-provider';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Regular members shouldn't access admin at all
  if (session.user.role === 'MEMBER') {
    redirect('/');
  }

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:block flex-shrink-0">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-6">
            <div className="max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
