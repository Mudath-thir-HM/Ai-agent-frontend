// ─── Auth ────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  company_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: UserProfile;
}

// ─── User / Profile ──────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  company_name: string | null;
  avatar_url: string | null;
  connected_platforms: string[];
  created_at: string;
}

export interface ProfileUpdateRequest {
  company_name?: string;
  avatar_url?: string;
}

export interface ProfileUpdateResponse {
  id: string;
  company_name: string | null;
  avatar_url: string | null;
  connected_platforms: string[];
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export interface ConnectPlatformRequest {
  platform: "instagram" | "facebook" | "x" | "linkedin" | "tiktok";
  account_name: string;
}

export interface OnboardingResponse {
  message: string;
}

// ─── Social ──────────────────────────────────────────────────────────────────

export interface ConnectSocialRequest {
  platform: string;
  account_name: string;
  account_id: string;
}

export interface SocialAccount {
  id: string;
  platform: string;
  account_name: string | null;
  account_id: string | null;
  is_active: boolean;
}

// ─── Messages ────────────────────────────────────────────────────────────────

/**
 * Front-end Message type.
 * Maps API fields: sender_name→author_name, message_text→content
 */
export interface Message {
  id: string;
  user_id: string;
  platform: string;
  author_name: string;
  content: string;
  type?: "dm" | "comment";
  post_id?: string | null;
  external_message_id: string | null;
  is_replied: boolean;
  created_at: string;
}

export interface ReceiveMessageRequest {
  platform: string;
  sender_name: string;
  message_text: string;
}

export interface ReplyMessageRequest {
  messageId: string;
  reply_text: string;
}

export interface ReplyResponse {
  message_id: string;
  reply_text: string;
  sent_at: string;
}

export interface AISuggestRequest {
  platform: string;
  message_text: string;
  sender_name: string;
  context?: string;
}

export interface AISuggestion {
  suggestions: string[];
  sentiment: "positive" | "negative" | "neutral";
  urgency: "low" | "medium" | "high";
}

// ─── Content ─────────────────────────────────────────────────────────────────

/**
 * Front-end GeneratedContent type.
 * Maps API fields: platform→target_platform, generated_text→post_text, image_url→media_urls[]
 */
export interface GeneratedContent {
  id: string;
  user_id: string;
  target_platform: string;
  content_type: string;
  prompt: string;
  post_text: string;
  hashtags: string[];
  call_to_action: string;
  status: "draft" | "scheduled" | "posted" | "archived";
  media_urls: string[];
  created_at: string;
}

export interface GenerateContentRequest {
  platform: string;
  content_type: string;
  prompt: string;
  tone?: string;
}

export interface UpdateContentRequest {
  generated_text?: string;
  hashtags?: string[];
  call_to_action?: string;
  status?: string;
}

export interface ContentHistoryParams {
  platform?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

// ─── Scheduler ───────────────────────────────────────────────────────────────

export interface ScheduledPost {
  id: string;
  user_id: string;
  content_id: string | null;
  platform: string;
  post_text: string;
  scheduled_for: string;
  status: "pending" | "published" | "failed" | "cancelled";
  published_at: string | null;
  error_message: string | null;
  created_at: string;
}

export interface CreateScheduledPostRequest {
  content_id?: string;
  platform: string;
  post_text: string;
  scheduled_for: string;
}

export interface UpdateScheduledPostRequest {
  post_text?: string;
  scheduled_for?: string;
  status?: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface AnalyticsOverview {
  total_reach: number;
  total_impressions: number;
  avg_engagement_rate: number;
  total_likes: number;
  total_shares: number;
  total_comments: number;
  total_clicks: number;
  posts_this_week: number;
  top_platform: string;
  growth_percentage: number;
}

export interface TopPost {
  id: string;
  user_id: string;
  scheduled_post_id: string | null;
  platform: string;
  likes: number;
  impressions: number;
  reach: number;
  engagement_rate: number;
  clicks: number;
  shares: number;
  comments: number;
  recorded_at: string;
  post_text: string | null;
}

export interface WeeklyEngagementData {
  day: string;
  engagement: number;
}

export interface PlatformBreakdown {
  platform: string;
  posts: number;
}

// ─── Tracking ────────────────────────────────────────────────────────────────

export interface TrackingRule {
  id: string;
  type: "hashtag" | "mention" | "keyword";
  value: string;
  platform: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateTrackingRuleRequest {
  type: "hashtag" | "mention" | "keyword";
  value: string;
  platform?: string;
}

// ─── API Error ───────────────────────────────────────────────────────────────

export interface ApiErrorResponse {
  detail: string | { msg: string; type: string }[];
}
