'use client';

import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { PaginatedResponse, Conversation } from '@/types';
import { ConversationsTable } from '@/components/conversations/conversations-table';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { LoadMoreButton } from '@/components/ui/load-more-button';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const PAGE_SIZE = 25;

export default function ConversationsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['all-conversations', debouncedSearch],
    queryFn: ({ pageParam }) =>
      apiClient<PaginatedResponse<Conversation>>(
        `/admin/conversations?limit=${PAGE_SIZE}${
          pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ''
        }${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}`
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined),
  });

  const conversations = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Conversations</h1>
        <p className="text-muted-foreground">
          View all conversations across all users
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {error ? (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load conversations</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <ConversationsTable
            conversations={conversations}
            isLoading={isLoading}
            showUser={true}
          />
          <LoadMoreButton
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            itemCount={conversations.length}
            hideWhenEmpty={isLoading}
          />
        </>
      )}
    </div>
  );
}
