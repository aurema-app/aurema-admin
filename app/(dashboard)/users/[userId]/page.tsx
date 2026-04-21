'use client';

import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { UserWithCounts, PaginatedResponse, Conversation, Meditation } from '@/types';
import { UserProfileCard } from '@/components/users/user-profile-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ConversationsTable } from '@/components/conversations/conversations-table';
import { MeditationsTable } from '@/components/meditations/meditations-table';
import { LoadMoreButton } from '@/components/ui/load-more-button';

const PAGE_SIZE = 25;

type UserTab = 'conversations' | 'meditations' | 'raw';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [tab, setTab] = useState<UserTab>('conversations');

  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiClient<UserWithCounts>(`/admin/users/${userId}`),
    enabled: !!userId,
  });

  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    fetchNextPage: fetchMoreConversations,
    hasNextPage: hasMoreConversations,
    isFetchingNextPage: isFetchingMoreConversations,
  } = useInfiniteQuery({
    queryKey: ['user-conversations', userId],
    queryFn: ({ pageParam }) =>
      apiClient<PaginatedResponse<Conversation>>(
        `/admin/users/${userId}/conversations?limit=${PAGE_SIZE}${
          pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ''
        }`
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined),
    enabled: !!userId && tab === 'conversations',
  });

  const {
    data: meditationsData,
    isLoading: meditationsLoading,
    fetchNextPage: fetchMoreMeditations,
    hasNextPage: hasMoreMeditations,
    isFetchingNextPage: isFetchingMoreMeditations,
  } = useInfiniteQuery({
    queryKey: ['user-meditations', userId],
    queryFn: ({ pageParam }) =>
      apiClient<PaginatedResponse<Meditation>>(
        `/admin/users/${userId}/meditations?limit=${PAGE_SIZE}${
          pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ''
        }`
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined),
    enabled: !!userId && tab === 'meditations',
  });

  const conversations = conversationsData?.pages.flatMap((p) => p.data) ?? [];
  const meditations = meditationsData?.pages.flatMap((p) => p.data) ?? [];

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

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as UserTab)}
        className="w-full"
      >
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
            conversations={conversations}
            isLoading={conversationsLoading}
            showUser={false}
            userId={userId}
          />
          <LoadMoreButton
            hasNextPage={!!hasMoreConversations}
            isFetchingNextPage={isFetchingMoreConversations}
            fetchNextPage={fetchMoreConversations}
            itemCount={conversations.length}
            hideWhenEmpty={conversationsLoading}
          />
        </TabsContent>

        <TabsContent value="meditations" className="mt-6">
          <MeditationsTable
            meditations={meditations}
            isLoading={meditationsLoading}
            showUser={false}
          />
          <LoadMoreButton
            hasNextPage={!!hasMoreMeditations}
            isFetchingNextPage={isFetchingMoreMeditations}
            fetchNextPage={fetchMoreMeditations}
            itemCount={meditations.length}
            hideWhenEmpty={meditationsLoading}
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
