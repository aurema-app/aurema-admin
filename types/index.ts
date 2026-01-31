// User types (from aurema-app)
export interface EmotionLevel {
  title: string;
  emotions: Record<string, number>;
}

export interface UserSummary {
  themes_to_avoid?: string[];
  potential_trauma_signals?: string[];
  communication_style?: string[];
  somatic_insights?: string[];
  user_character_impression?: string;
  personal_themes?: string[];
  ideal_support_approach?: string[];
  emotions?: EmotionLevel[];
  signal?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  createdAt?: string;
  completedOnboarding?: boolean;
  lastImageIndex?: number;
  summary?: UserSummary;
  hasUsedFreeConversation?: boolean;
  subscriptionStatus?: 'free' | 'active' | 'expired' | 'cancelled';
  subscriptionExpiresAt?: string;
  isStaff?: boolean;
}

// Conversation types (from aurema-app)
export enum ConversationStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface ConversationMessage {
  content: string;
  createdAt: string;
  role: 'user' | 'assistant';
  meditationTitle?: string;
  meditationUrl?: string;
  imageCardUrl?: string;
}

export interface Conversation {
  id: string;
  createdAt: string;
  messages: ConversationMessage[];
  status: ConversationStatus;
  description?: string;
  title?: string;
  tags?: string[];
  image?: string;
  imageCardUrl?: string;
  meditationUrl?: string;
  cloudUrl?: string;
  meditationListened?: boolean;
  meditationTitle?: string;
  userEmotions?: EmotionLevel[];
  isNew?: boolean;
  userId?: string; // Added for admin views
  userEmail?: string; // Added for admin views
}

// Meditation types
export interface Meditation {
  id: string;
  userId: string;
  userEmail?: string;
  title?: string;
  createdAt: string;
  audioUrl?: string;
  duration?: number;
}

// Admin API response types
export interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalConversations: number;
  conversationsToday: number;
  totalMeditations: number;
  meditationsToday: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
  total?: number;
}

// User with counts for admin detail view
export interface UserWithCounts extends UserProfile {
  conversationsCount: number;
  meditationsCount: number;
}
