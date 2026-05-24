import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import {
  AuthResponse, LoginRequest, RegisterRequest,
  UserProfile, ProfileUpdateRequest, ProfileUpdateResponse,
  ConnectPlatformRequest, OnboardingResponse,
  ConnectSocialRequest, SocialAccount,
  Message, ReplyMessageRequest, ReplyResponse, AISuggestRequest, AISuggestion,
  GeneratedContent, GenerateContentRequest, UpdateContentRequest, ContentHistoryParams,
  ScheduledPost, CreateScheduledPostRequest, UpdateScheduledPostRequest,
  AnalyticsOverview, WeeklyEngagementData, PlatformBreakdown, TopPost,
  TrackingRule, CreateTrackingRuleRequest,
} from "../types";
import { logout } from "./authSlice";

// ─── Raw API types (pre-transform) ───────────────────────────────────────────
interface ApiMessage {
  id: string;
  user_id: string;
  platform: string;
  sender_name: string;
  message_text: string;
  external_message_id: string | null;
  is_replied: boolean;
  created_at: string;
}

interface ApiGeneratedContent {
  id: string;
  user_id: string;
  platform: string;
  content_type: string;
  prompt: string;
  generated_text: string;
  hashtags: string[];
  call_to_action: string;
  status: "draft" | "scheduled" | "posted" | "archived";
  image_url: string | null;
  created_at: string;
}

interface ContentHistoryResponse {
  items: ApiGeneratedContent[];
  total: number;
  limit: number;
  offset: number;
}

// ─── Helper transformers ──────────────────────────────────────────────────────

function transformMessage(msg: ApiMessage): Message {
  return {
    id: msg.id,
    user_id: msg.user_id,
    platform: msg.platform,
    author_name: msg.sender_name,
    content: msg.message_text,
    type: "dm",
    post_id: null,
    external_message_id: msg.external_message_id,
    is_replied: msg.is_replied,
    created_at: msg.created_at,
  };
}

function transformContent(c: ApiGeneratedContent): GeneratedContent {
  return {
    id: c.id,
    user_id: c.user_id,
    target_platform: c.platform,
    content_type: c.content_type,
    prompt: c.prompt,
    post_text: c.generated_text,
    hashtags: c.hashtags || [],
    call_to_action: c.call_to_action,
    status: c.status,
    media_urls: c.image_url ? [c.image_url] : [],
    created_at: c.created_at,
  };
}

// ─── Base query with 401 handling ─────────────────────────────────────────────

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(logout());
    window.location.href = "/login";
  }
  return result;
};

// ─── API Slice ────────────────────────────────────────────────────────────────

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Profile",
    "Platforms",
    "SocialAccounts",
    "Messages",
    "Content",
    "ScheduledPosts",
    "Analytics",
    "TrackingRules",
  ],
  endpoints: (builder) => ({
    // ── Auth ──────────────────────────────────────────────────────────────────
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // ── Profile ───────────────────────────────────────────────────────────────
    getProfile: builder.query<UserProfile, void>({
      query: () => ({ url: "/me", method: "GET" }),
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation<ProfileUpdateResponse, Partial<ProfileUpdateRequest>>({
      query: (updates) => ({
        url: "/me",
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: ["Profile"],
    }),

    // ── Onboarding ────────────────────────────────────────────────────────────
    connectPlatform: builder.mutation<OnboardingResponse, ConnectPlatformRequest>({
      query: (payload) => ({
        url: "/onboarding/connect",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Platforms", "Profile"],
    }),

    getConnectedPlatforms: builder.query<string[], void>({
      query: () => ({ url: "/onboarding/platforms", method: "GET" }),
      transformResponse: (raw: any[]) => raw.map(item => typeof item === 'string' ? item : item.platform),
      providesTags: ["Platforms"],
    }),

    // ── Social ────────────────────────────────────────────────────────────────
    connectSocialAccount: builder.mutation<SocialAccount, ConnectSocialRequest>({
      query: (payload) => ({
        url: "/social/connect",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SocialAccounts"],
    }),

    getSocialAccounts: builder.query<SocialAccount[], void>({
      query: () => ({ url: "/social/accounts", method: "GET" }),
      providesTags: ["SocialAccounts"],
    }),

    // ── Messages ──────────────────────────────────────────────────────────────
    getMessages: builder.query<Message[], void>({
      query: () => ({ url: "/messages/", method: "GET" }),
      transformResponse: (raw: ApiMessage[]) => raw.map(transformMessage),
      providesTags: ["Messages"],
    }),

    replyToMessage: builder.mutation<ReplyResponse, ReplyMessageRequest>({
      query: ({ messageId, reply_text }) => ({
        url: "/messages/reply",
        method: "POST",
        body: { message_id: messageId, reply_text },
      }),
      invalidatesTags: ["Messages"],
    }),

    getAISuggestions: builder.mutation<AISuggestion, AISuggestRequest>({
      query: (payload) => ({
        url: "/messages/ai-suggest",
        method: "POST",
        body: payload,
      }),
    }),

    // ── Content ───────────────────────────────────────────────────────────────
    generateContent: builder.mutation<GeneratedContent, GenerateContentRequest>({
      query: (payload) => ({
        url: "/content/generate",
        method: "POST",
        body: payload,
      }),
      transformResponse: (raw: ApiGeneratedContent) => transformContent(raw),
      invalidatesTags: ["Content"],
    }),

    getGeneratedContent: builder.query<GeneratedContent[], ContentHistoryParams | void>({
      query: (params) => ({
        url: "/content/history",
        method: "GET",
        params: params ?? {},
      }),
      transformResponse: (raw: ContentHistoryResponse | ApiGeneratedContent[]) => {
        // Handle both paginated and flat array responses
        if (Array.isArray(raw)) return raw.map(transformContent);
        return (raw as ContentHistoryResponse).items.map(transformContent);
      },
      providesTags: ["Content"],
    }),

    updateContent: builder.mutation<GeneratedContent, { contentId: string; updates: UpdateContentRequest }>({
      query: ({ contentId, updates }) => ({
        url: `/content/${contentId}`,
        method: "PATCH",
        body: updates,
      }),
      transformResponse: (raw: ApiGeneratedContent) => transformContent(raw),
      invalidatesTags: ["Content"],
    }),

    // ── Scheduler ─────────────────────────────────────────────────────────────
    getScheduledPosts: builder.query<ScheduledPost[], { status?: string; platform?: string } | void>({
      query: (params) => ({
        url: "/scheduler/",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["ScheduledPosts"],
    }),

    schedulePost: builder.mutation<ScheduledPost, CreateScheduledPostRequest>({
      query: (payload) => ({
        url: "/scheduler/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ScheduledPosts", "Content"],
    }),

    updateScheduledPost: builder.mutation<ScheduledPost, { postId: string; updates: UpdateScheduledPostRequest }>({
      query: ({ postId, updates }) => ({
        url: `/scheduler/${postId}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: ["ScheduledPosts"],
    }),

    // ── Analytics ─────────────────────────────────────────────────────────────
    getAnalyticsOverview: builder.query<AnalyticsOverview, void>({
      query: () => ({ url: "/analytics/overview", method: "GET" }),
      providesTags: ["Analytics"],
    }),

    getWeeklyEngagement: builder.query<WeeklyEngagementData[], void>({
      query: () => ({ url: "/analytics/weekly-engagement", method: "GET" }),
      providesTags: ["Analytics"],
    }),

    getPlatformsBreakdown: builder.query<PlatformBreakdown[], void>({
      query: () => ({ url: "/analytics/platforms", method: "GET" }),
      providesTags: ["Analytics"],
    }),

    getTopPosts: builder.query<TopPost[], void>({
      query: () => ({ url: "/analytics/top-posts", method: "GET" }),
      providesTags: ["Analytics"],
    }),

    // ── Tracking ──────────────────────────────────────────────────────────────
    getTrackingRules: builder.query<TrackingRule[], void>({
      query: () => ({ url: "/tracking/", method: "GET" }),
      providesTags: ["TrackingRules"],
    }),

    createTrackingRule: builder.mutation<TrackingRule, CreateTrackingRuleRequest>({
      query: (payload) => ({
        url: "/tracking/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["TrackingRules"],
    }),
  }),
});

export const {
  // Auth
  useRegisterMutation,
  useLoginMutation,
  // Profile
  useGetProfileQuery,
  useUpdateProfileMutation,
  // Onboarding
  useConnectPlatformMutation,
  useGetConnectedPlatformsQuery,
  // Social
  useConnectSocialAccountMutation,
  useGetSocialAccountsQuery,
  // Messages
  useGetMessagesQuery,
  useReplyToMessageMutation,
  useGetAISuggestionsMutation,
  // Content
  useGenerateContentMutation,
  useGetGeneratedContentQuery,
  useUpdateContentMutation,
  // Scheduler
  useGetScheduledPostsQuery,
  useSchedulePostMutation,
  useUpdateScheduledPostMutation,
  // Analytics
  useGetAnalyticsOverviewQuery,
  useGetWeeklyEngagementQuery,
  useGetPlatformsBreakdownQuery,
  useGetTopPostsQuery,
  // Tracking
  useGetTrackingRulesQuery,
  useCreateTrackingRuleMutation,
} = apiSlice;
