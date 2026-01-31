import Link from 'next/link';
import { UserProfile } from '@/types';
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

interface UsersTableProps {
  users: UserProfile[];
  isLoading: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Onboarding</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Display Name</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Onboarding</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link
                  href={`/users/${user.id}`}
                  className="font-medium hover:underline"
                >
                  {user.email}
                </Link>
              </TableCell>
              <TableCell>{user.displayName || '-'}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.subscriptionStatus === 'active'
                      ? 'default'
                      : user.subscriptionStatus === 'free'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {user.subscriptionStatus || 'free'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.completedOnboarding ? 'default' : 'outline'}>
                  {user.completedOnboarding ? 'Completed' : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.createdAt
                  ? format(new Date(user.createdAt), 'MMM d, yyyy')
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
