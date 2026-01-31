'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { UserWithCounts, PaginatedResponse, Conversation, Meditation } from '@/types';
import { UserProfileCard } from '@/components/users/user-profile-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ConversationsTable } from '@/components/conversations/conversations-table';
import { MeditationsTable } from '@/components/meditations/meditations-table';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.userId as string;

  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiClient<UserWithCounts>(`/admin/users/${userId}`),
    enabled: !!userId,
  });

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['user-conversations', userId],
    queryFn: () =>
      apiClient<PaginatedResponse<Conversation>>(
        `/admin/users/${userId}/conversations?limit=50`
      ),
    enabled: !!userId,
  });

  const { data: meditations, isLoading: meditationsLoading } = useQuery({
    queryKey: ['user-meditations', userId],
    queryFn: () =>
      apiClient<PaginatedResponse<Meditation>>(
        `/admin/users/${userId}/meditations?limit=50`
      ),
    enabled: !!userId,
  });

  if (userError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Not Found</h1>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load user details</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userLoading || !user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{user.displayName || 'User Details'}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <UserProfileCard user={user} />

      <Tabs defaultValue="conversations" className="w-full">
        <TabsList>
          <TabsTrigger value="conversations">
            Conversations ({user.conversationsCount})
          </TabsTrigger>
          <TabsTrigger value="meditations">
            Meditations ({user.meditationsCount})
          </TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="mt-6">
          <ConversationsTable
            conversations={conversations?.data || []}
            isLoading={conversationsLoading}
            showUser={false}
            userId={userId}
          />
        </TabsContent>

        <TabsContent value="meditations" className="mt-6">
          <MeditationsTable
            meditations={meditations?.data || []}
            isLoading={meditationsLoading}
            showUser={false}
          />
        </TabsContent>

        <TabsContent value="raw" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <pre className="overflow-auto text-xs">
                {JSON.stringify(user, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
