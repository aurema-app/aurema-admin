'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  itemCount?: number;
  hideWhenEmpty?: boolean;
  className?: string;
}

export function LoadMoreButton({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  itemCount = 0,
  hideWhenEmpty = false,
  className,
}: LoadMoreButtonProps) {
  if (hideWhenEmpty && itemCount === 0) {
    return null;
  }

  if (!hasNextPage) {
    if (itemCount === 0) return null;
    return (
      <div className={className ?? 'flex justify-center py-4'}>
        <p className="text-xs text-muted-foreground">No more results</p>
      </div>
    );
  }

  return (
    <div className={className ?? 'flex justify-center py-4'}>
      <Button
        variant="outline"
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage}
      >
        {isFetchingNextPage ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          'Load more'
        )}
      </Button>
    </div>
  );
}
