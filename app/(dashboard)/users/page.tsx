'use client';

import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { PaginatedResponse, UserProfile } from '@/types';
import { UsersTable } from '@/components/users/users-table';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { LoadMoreButton } from '@/components/ui/load-more-button';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const PAGE_SIZE = 25;

export default function UsersPage() {
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
    queryKey: ['users', debouncedSearch],
    queryFn: ({ pageParam }) =>
      apiClient<PaginatedResponse<UserProfile>>(
        `/admin/users?limit=${PAGE_SIZE}${
          pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ''
        }${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}`
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined),
  });

  const users = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage and view all registered users</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {error ? (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load users</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <UsersTable users={users} isLoading={isLoading} />
          <LoadMoreButton
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            itemCount={users.length}
            hideWhenEmpty={isLoading}
          />
        </>
      )}
    </div>
  );
}
