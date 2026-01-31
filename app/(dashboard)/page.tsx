'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api';
import { DashboardStats } from '@/types';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, userProfile, loading } = useAuth();

  // Redirect to login if not authenticated (only on root)
  useEffect(() => {
    if (!loading && !user && pathname === '/') {
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient<DashboardStats>('/admin/stats'),
  });

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your Aurema platform</p>
        </div>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load dashboard statistics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your Aurema platform</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <StatsCards stats={stats} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/users"
              className="block p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <h3 className="font-medium">View All Users</h3>
              <p className="text-sm text-muted-foreground">
                Browse and search through all registered users
              </p>
            </a>
            <a
              href="/conversations"
              className="block p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <h3 className="font-medium">View Conversations</h3>
              <p className="text-sm text-muted-foreground">
                Review conversations across all users
              </p>
            </a>
            <a
              href="/meditations"
              className="block p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <h3 className="font-medium">View Meditations</h3>
              <p className="text-sm text-muted-foreground">
                See all generated meditations
              </p>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Backend API</p>
              <p className="text-sm text-muted-foreground">
                {process.env.NEXT_PUBLIC_API_URL}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Firebase Project</p>
              <p className="text-sm text-muted-foreground">
                {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
