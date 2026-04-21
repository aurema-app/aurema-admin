'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { PaginatedResponse, Meditation } from '@/types';
import { MeditationsTable } from '@/components/meditations/meditations-table';
import { Card, CardContent } from '@/components/ui/card';
import { LoadMoreButton } from '@/components/ui/load-more-button';

const PAGE_SIZE = 25;

export default function MeditationsPage() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['all-meditations'],
    queryFn: ({ pageParam }) =>
      apiClient<PaginatedResponse<Meditation>>(
        `/admin/meditations?limit=${PAGE_SIZE}${
          pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ''
        }`
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined),
  });

  const meditations = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meditations</h1>
        <p className="text-muted-foreground">
          View all generated meditations across all users
        </p>
      </div>

      {error ? (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load meditations</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <MeditationsTable
            meditations={meditations}
            isLoading={isLoading}
            showUser={true}
          />
          <LoadMoreButton
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            itemCount={meditations.length}
            hideWhenEmpty={isLoading}
          />
        </>
      )}
    </div>
  );
}
