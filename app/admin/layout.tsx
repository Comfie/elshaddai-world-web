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

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-64 md:block">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
