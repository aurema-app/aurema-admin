import { UserWithCounts } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Mail, Calendar, CheckCircle, MessageSquare, Music, CreditCard } from 'lucide-react';

interface UserProfileCardProps {
  user: UserWithCounts;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Onboarding Status</p>
              <Badge variant={user.completedOnboarding ? 'default' : 'outline'}>
                {user.completedOnboarding ? 'Completed' : 'Pending'}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-sm text-muted-foreground">
                {user.createdAt
                  ? format(new Date(user.createdAt), 'MMMM d, yyyy')
                  : 'Unknown'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity & Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Subscription Status</p>
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
              {user.subscriptionExpiresAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Expires: {format(new Date(user.subscriptionExpiresAt), 'MMM d, yyyy')}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Total Conversations</p>
              <p className="text-2xl font-bold">{user.conversationsCount}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Music className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Total Meditations</p>
              <p className="text-2xl font-bold">{user.meditationsCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {user.summary && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>AI-Generated User Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.summary.user_character_impression && (
              <div>
                <p className="text-sm font-medium">Character Impression</p>
                <p className="text-sm text-muted-foreground">
                  {user.summary.user_character_impression}
                </p>
              </div>
            )}

            {user.summary.communication_style && user.summary.communication_style.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Communication Style</p>
                <div className="flex flex-wrap gap-2">
                  {user.summary.communication_style.map((style, i) => (
                    <Badge key={i} variant="secondary">
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {user.summary.personal_themes && user.summary.personal_themes.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Personal Themes</p>
                <div className="flex flex-wrap gap-2">
                  {user.summary.personal_themes.map((theme, i) => (
                    <Badge key={i} variant="outline">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
