'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ConversationMessage } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { User, Bot } from 'lucide-react';

interface MessageThreadProps {
  messages: ConversationMessage[];
}

// Threshold below which we just render everything (virtualization overhead
// isn't worth it for short threads).
const VIRTUALIZE_THRESHOLD = 40;

export function MessageThread({ messages }: MessageThreadProps) {
  if (messages.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No messages in this conversation
      </div>
    );
  }

  if (messages.length < VIRTUALIZE_THRESHOLD) {
    return (
      <div className="space-y-4">
        {messages.map((message, index) => (
          <MessageRow key={index} message={message} />
        ))}
      </div>
    );
  }

  return <VirtualizedThread messages={messages} />;
}

function VirtualizedThread({ messages }: { messages: ConversationMessage[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140,
    overscan: 6,
    measureElement:
      typeof window !== 'undefined' &&
      typeof ResizeObserver !== 'undefined'
        ? (el) => el.getBoundingClientRect().height
        : undefined,
  });

  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="max-h-[70vh] overflow-y-auto pr-2"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {items.map((virtualItem) => {
          const message = messages[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
                paddingBottom: 16,
              }}
            >
              <MessageRow message={message} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MessageRow({ message }: { message: ConversationMessage }) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg border p-4',
        message.role === 'user' ? 'bg-muted/50' : 'bg-background'
      )}
    >
      <div className="flex-shrink-0">
        {message.role === 'user' ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Bot className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {message.role === 'user' ? 'User' : 'Assistant'}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
          </p>
        </div>

        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

        {message.meditationTitle && (
          <div className="mt-2 rounded-md bg-muted p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Meditation Generated
            </p>
            <p className="text-sm font-medium">{message.meditationTitle}</p>
            {message.meditationUrl && (
              <a
                href={message.meditationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline mt-1 inline-block"
              >
                Listen to meditation
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
