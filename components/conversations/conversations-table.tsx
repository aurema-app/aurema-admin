import Link from 'next/link';
import { Conversation } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface ConversationsTableProps {
  conversations: Conversation[];
  isLoading: boolean;
  showUser?: boolean;
  userId?: string; // Optional userId for when viewing single user's conversations
}

export function ConversationsTable({
  conversations,
  isLoading,
  showUser = true,
  userId,
}: ConversationsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {showUser && <TableHead>User</TableHead>}
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Messages</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {showUser && <TableCell><Skeleton className="h-4 w-48" /></TableCell>}
                <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No conversations found</p>
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
            <TableHead>Status</TableHead>
            <TableHead>Messages</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((conversation) => (
            <TableRow key={conversation.id}>
              {showUser && (
                <TableCell>
                  <Link
                    href={`/users/${conversation.userId}`}
                    className="text-sm hover:underline"
                  >
                    {conversation.userEmail || conversation.userId}
                  </Link>
                </TableCell>
              )}
              <TableCell>
                <Link
                  href={`/conversations/${conversation.userId || userId}/${conversation.id}`}
                  className="font-medium hover:underline"
                >
                  {conversation.title || 'Untitled Conversation'}
                </Link>
                {conversation.tags && conversation.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {conversation.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={conversation.status === 'open' ? 'default' : 'secondary'}>
                  {conversation.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {conversation.messages?.length || 0}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {conversation.createdAt
                  ? format(new Date(conversation.createdAt), 'MMM d, yyyy')
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
