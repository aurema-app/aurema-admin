'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Conversation } from '@/types';
import { MessageThread } from '@/components/conversations/message-thread';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ArrowLeft, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConversationDetailPage() {
  const params = useParams();
  const userId = params.userId as string;
  const conversationId = params.conversationId as string;

  const { data: conversation, isLoading, error } = useQuery({
    queryKey: ['conversation', userId, conversationId],
    queryFn: () =>
      apiClient<Conversation>(
        `/conversations/admin/${userId}/${conversationId}`
      ),
    enabled: !!userId && !!conversationId,
  });

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Conversation Not Found</h1>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load conversation details</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !conversation) {
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/conversations">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {conversation.title || 'Untitled Conversation'}
          </h1>
          <p className="text-muted-foreground">
            <Link href={`/users/${userId}`} className="hover:underline">
              {conversation.userEmail || userId}
            </Link>
            {' · '}
            {format(new Date(conversation.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={conversation.status === 'open' ? 'default' : 'secondary'}>
              {conversation.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{conversation.messages?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Meditation</CardTitle>
          </CardHeader>
          <CardContent>
            {conversation.meditationUrl ? (
              <a
                href={conversation.meditationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Music className="h-4 w-4" />
                {conversation.meditationTitle || 'Listen'}
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">Not generated</span>
            )}
          </CardContent>
        </Card>
      </div>

      {conversation.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{conversation.description}</p>
          </CardContent>
        </Card>
      )}

      {conversation.tags && conversation.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {conversation.tags.map((tag, i) => (
                <Badge key={i} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Conversation Thread</CardTitle>
        </CardHeader>
        <CardContent>
          <MessageThread messages={conversation.messages || []} />
        </CardContent>
      </Card>
    </div>
  );
}
