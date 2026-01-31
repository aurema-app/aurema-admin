'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { PaginatedResponse, Meditation } from '@/types';
import { MeditationsTable } from '@/components/meditations/meditations-table';
import { Card, CardContent } from '@/components/ui/card';

export default function MeditationsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['all-meditations'],
    queryFn: () =>
      apiClient<PaginatedResponse<Meditation>>('/admin/meditations?limit=50'),
  });

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
        <MeditationsTable
          meditations={data?.data || []}
          isLoading={isLoading}
          showUser={true}
        />
      )}
    </div>
  );
}
