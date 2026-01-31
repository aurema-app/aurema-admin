import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';
import { Users, CreditCard, MessageSquare, TrendingUp, Music, Sparkles } from 'lucide-react';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: 'Registered accounts',
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions.toLocaleString(),
      icon: CreditCard,
      description: 'Currently subscribed',
    },
    {
      title: 'Total Conversations',
      value: stats.totalConversations.toLocaleString(),
      icon: MessageSquare,
      description: `${stats.conversationsToday} created today`,
    },
    {
      title: 'Conversations Today',
      value: stats.conversationsToday.toLocaleString(),
      icon: TrendingUp,
      description: 'New conversations',
    },
    {
      title: 'Total Meditations',
      value: stats.totalMeditations.toLocaleString(),
      icon: Music,
      description: `${stats.meditationsToday} created today`,
    },
    {
      title: 'Meditations Today',
      value: stats.meditationsToday.toLocaleString(),
      icon: Sparkles,
      description: 'New meditations',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
