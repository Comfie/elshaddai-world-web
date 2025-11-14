import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ClipboardList, Calendar, Bell } from 'lucide-react';

export default async function DashboardPage() {
  // In Phase 2, we'll fetch actual stats from the database
  const stats = [
    {
      title: 'Total Members',
      value: '0',
      description: 'Active members in database',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Pending Follow-ups',
      value: '0',
      description: 'Tasks requiring attention',
      icon: ClipboardList,
      color: 'text-orange-600',
    },
    {
      title: 'Upcoming Events',
      value: '0',
      description: 'Events this month',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Active Notices',
      value: '0',
      description: 'Current announcements',
      icon: Bell,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to El Shaddai World Ministries Admin Portal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Welcome Message */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Phase 1!</CardTitle>
          <CardDescription>
            The foundation of your church management system is now in place.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">✅ Completed in Phase 1:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Database schema with all models (Members, Events, Ministries, etc.)</li>
              <li>Authentication system with NextAuth.js</li>
              <li>Admin portal with sidebar navigation</li>
              <li>Role-based access control (SUPER_ADMIN, ADMIN, LEADER, MEMBER)</li>
              <li>Responsive admin layout</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">🎯 Next Steps (Phase 2):</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Members Management (Add, Edit, View, Delete members)</li>
              <li>Follow-ups System (Create and track follow-up tasks)</li>
              <li>Dashboard with real statistics</li>
              <li>Search and filtering functionality</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
              📝 Important: Database Setup Required
            </h4>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Before you can use the system, you need to:
            </p>
            <ol className="list-decimal list-inside text-sm text-amber-800 dark:text-amber-300 mt-2 space-y-1">
              <li>Set up a PostgreSQL database</li>
              <li>Copy <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">.env.example</code> to <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">.env</code></li>
              <li>Update DATABASE_URL in .env</li>
              <li>Run <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">npx prisma migrate dev</code></li>
              <li>Run <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">npm run db:seed</code></li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
