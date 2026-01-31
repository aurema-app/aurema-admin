import Link from 'next/link';
import { Meditation } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Music } from 'lucide-react';

interface MeditationsTableProps {
  meditations: Meditation[];
  isLoading: boolean;
  showUser?: boolean;
}

export function MeditationsTable({
  meditations,
  isLoading,
  showUser = true,
}: MeditationsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {showUser && <TableHead>User</TableHead>}
              <TableHead>Title</TableHead>
              <TableHead>Audio</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {showUser && <TableCell><Skeleton className="h-4 w-48" /></TableCell>}
                <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (meditations.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No meditations found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {showUser && <TableHead>User</TableHead>}
            <TableHead>Title</TableHead>
            <TableHead>Audio</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meditations.map((meditation) => (
            <TableRow key={meditation.id}>
              {showUser && (
                <TableCell>
                  <Link
                    href={`/users/${meditation.userId}`}
                    className="text-sm hover:underline"
                  >
                    {meditation.userEmail || meditation.userId}
                  </Link>
                </TableCell>
              )}
              <TableCell className="font-medium">
                {meditation.title || 'Untitled Meditation'}
              </TableCell>
              <TableCell>
                {meditation.audioUrl ? (
                  <a
                    href={meditation.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Music className="h-4 w-4" />
                    Play
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {meditation.createdAt
                  ? format(new Date(meditation.createdAt), 'MMM d, yyyy')
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
