# AgentCee Frontend — Full Backend Integration & UI Overhaul

## Goal

Transform the current static/mock frontend into a fully functional application:
1. **State management** with Redux Toolkit + RTK Query
2. **Backend integration** with all API endpoints
3. **Functional forms** using React Hook Form + Zod validation
4. **Working buttons/modals** — every interactive element does what it says
5. **UI overhaul** — premium 4-color palette, less gradients, light+dark mode

---

## Current State Analysis

The app is a **Vite + React + TailwindCSS v4 + shadcn/ui** project with:
- **7 dashboard pages** (analytics, calendar, content, messages, profile, settings, layout)
- **Signup + Onboarding** pages
- All data is hardcoded mock data
- Buttons either `console.log` or do nothing
- No Redux store, no API calls, no form validation
- Dark-mode-only with heavy use of `bg-gradient-to-r` everywhere
- Uses `react-router` v7, `motion` v12, `recharts`, `sonner` for toasts

### Non-Functional Elements Identified

| Page | Element | Current Behavior |
|------|---------|-----------------|
| **Signup** | Sign Up form | Navigates to onboarding with no API call |
| **Signup** | "Sign in" link | Href `#`, does nothing |
| **Onboarding** | Platform connect buttons | Toggles local state, no API call |
| **Calendar** | "Schedule Post" button | No modal, no action |
| **Calendar** | Calendar day cells | No click handler, no detail view |
| **Calendar** | Toast "Let's do it" action | `console.log` only |
| **Content** | "Generate New" button | No modal, no action |
| **Content** | Schedule dialog | `console.log` only, no API call |
| **Content** | View/Edit/Download hover buttons | No action |
| **Content** | Edit button on drafts | No action |
| **Content** | Duplicate button on posted | No action |
| **Messages** | Send reply button | `console.log` only |
| **Messages** | "AI Suggest Reply" badge | No action |
| **Messages** | Like/Archive/Mark as Read buttons | No action |
| **Profile** | All static, no edit capability | — |
| **Settings** | Switches not persisted | — |
| **Settings** | Change Password button | No modal |
| **Settings** | Delete Account button | No confirmation |
| **Global Toolbar** | Message/Clock buttons | No action |

---

## User Review Required

> [!IMPORTANT]
> **Color Palette Decision**: I propose the following 4-color palette (replacing current gradient-heavy scheme):
> - **Slate 950** `#0B1120` — Primary backgrounds (dark mode)
> - **Indigo 600** `#4F46E5` — Primary brand / accent (buttons, active states)
> - **Emerald 500** `#10B981` — Success / positive indicators
> - **Zinc 100** `#F4F4F5` — Light mode background
> 
> Neutral grays from Tailwind's Zinc scale for text/borders. This gives a professional SaaS feel without heavy gradients.

> [!IMPORTANT]
> **Login Page**: The backend has a `/auth/login` endpoint, but the current app only has a Signup page with a non-functional "Sign in" link. I will **add a Login page** and make the "Sign in" link navigate to it.

> [!WARNING]
> **No token refresh endpoint** exists in the backend API docs. JWTs expire after 24h. The app will store the token in memory (Redux state) and also persist to `localStorage` for session recovery. On 401 errors, the user will be redirected to login.

---

## Open Questions

> [!IMPORTANT]
> **Backend URL**: The API docs show `http://localhost:8000/api/v1`. Should I use this directly, or should I configure a Vite proxy for development? I'll default to a `.env` variable `VITE_API_BASE_URL` that defaults to `http://localhost:8000/api/v1`.

> [!IMPORTANT]
> **Canvas Overlay**: The `canvas-overlay.tsx` (ReactFlow-based content generation canvas) is a large component. Should I integrate it with the backend content generation API, or leave it as-is for now? I'll wire it up to `POST /content/generate` but won't refactor the ReactFlow internals.

---

## Proposed Changes

### Phase 1: Foundation — Redux Store, RTK Query, Types

Sets up the global state management layer that everything else depends on.

---

#### [NEW] [types.ts](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/types.ts)

All TypeScript interfaces matching the backend API contracts:
- `AuthResponse`, `LoginRequest`, `RegisterRequest`
- `UserProfile`, `ProfileUpdateRequest`, `ProfileUpdateResponse`
- `ConnectPlatformRequest`, `OnboardingResponse`
- `SocialAccount`, `ConnectSocialRequest`
- `Message`, `ReceiveMessageRequest`, `ReplyMessageRequest`, `ReplyResponse`
- `AISuggestRequest`, `AISuggestion`
- `GeneratedContent`, `GenerateContentRequest`, `UpdateContentRequest`
- `ContentHistoryResponse`, `ContentHistoryParams`
- `ScheduledPost`, `CreateScheduledPostRequest`, `UpdateScheduledPostRequest`
- `AnalyticsOverview`, `WeeklyEngagementData`, `PlatformBreakdown`
- `TrackingRule`, `CreateTrackingRuleRequest`
- `ApiErrorResponse`

#### [NEW] [apiSlice.ts](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/store/apiSlice.ts)

RTK Query `createApi` with:
- `fetchBaseQuery` pointing to `VITE_API_BASE_URL`
- `prepareHeaders` injecting Bearer token from auth state
- All `tagTypes`: Profile, SocialAccounts, Messages, Content, ScheduledPosts, Analytics, TrackingRules
- All endpoint definitions (auth, profile, onboarding, social, messages, content, scheduler, analytics, tracking) — ~25 endpoints total
- Custom `baseQueryWithReauth` wrapper that catches 401 and redirects to `/login`

#### [NEW] [authSlice.ts](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/store/authSlice.ts)

Redux slice for auth state:
- `accessToken`, `user`, `isAuthenticated`
- `extraReducers` listening to login/register `matchFulfilled` to persist token
- `logout` action that clears state + localStorage
- Initialize token from localStorage on load

#### [NEW] [uiSlice.ts](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/store/uiSlice.ts)

Redux slice for UI state:
- `theme: 'light' | 'dark'` (persisted to localStorage)
- `sidebarCollapsed: boolean`
- Actions to toggle theme, toggle sidebar

#### [NEW] [store.ts](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/store/store.ts)

Configure Redux store with:
- `apiSlice.reducer`
- `authSlice.reducer`
- `uiSlice.reducer`
- `apiSlice.middleware`
- Export `RootState`, `AppDispatch`, typed hooks (`useAppSelector`, `useAppDispatch`)

#### [MODIFY] [main.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/main.tsx)

Wrap `<App />` in `<Provider store={store}>`.

---

### Phase 2: Theme System — Light/Dark Mode + Premium Palette

---

#### [MODIFY] [theme.css](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/styles/theme.css)

Update CSS custom properties for a refined 4-color system:

**Light mode (`:root`)**:
- Background: `#FAFAFA` (near-white)
- Card: `#FFFFFF`
- Primary: `#4F46E5` (Indigo)
- Foreground: `#0F172A` (Slate 900)
- Muted: `#F1F5F9` (Slate 100)
- Border: `#E2E8F0` (Slate 200)
- Accent/success: `#10B981`

**Dark mode (`.dark`)**:
- Background: `#0B1120` (deep navy-black)
- Card: `#111827` (Slate 900)
- Primary: `#6366F1` (Indigo 500, lighter for dark bg)
- Foreground: `#F1F5F9`
- Muted: `#1E293B`
- Border: `#1E293B`

#### [NEW] [ThemeProvider.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/components/ThemeProvider.tsx)

React context that:
- Reads theme from Redux `uiSlice`
- Applies/removes `.dark` class on `<html>` element
- Exposes `useTheme()` hook

#### [MODIFY] All page components

Replace hardcoded dark-mode colors (`bg-[#0a0a0a]`, `text-white`, `bg-zinc-900/50`, etc.) with theme-aware classes (`bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-primary`, etc.). Remove excessive gradient usage — replace `bg-gradient-to-r from-[#13005A] to-[#00337C]` with solid `bg-primary`.

---

### Phase 3: Auth Flow — Login, Signup, Protected Routes

---

#### [NEW] [login.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/pages/login.tsx)

Login page with:
- React Hook Form + Zod schema (`email: z.email()`, `password: z.string().min(8)`)
- `useLoginMutation` from RTK Query
- Error display from API responses
- Redirect to `/dashboard` on success
- Link to signup page

#### [MODIFY] [signup.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/pages/signup.tsx)

Replace manual `useState` with React Hook Form:
- Zod schema: `email`, `password` (min 8), `company_name`
- `useRegisterMutation` call on submit
- Store token in Redux on success
- Navigate to `/onboarding` on success
- Show API errors (email already registered, etc.)
- "Sign in" link navigates to `/login`

#### [NEW] [ProtectedRoute.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/components/ProtectedRoute.tsx)

Wrapper that checks `isAuthenticated` from Redux. Redirects to `/login` if not authenticated.

#### [MODIFY] [App.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/App.tsx)

- Add `/login` route
- Wrap dashboard routes in `<ProtectedRoute>`
- Default `/` route → redirect to `/dashboard` if authenticated, else `/login`

---

### Phase 4: Dashboard Pages — Live Data + Working Buttons

---

#### [MODIFY] [analytics.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/pages/dashboard/analytics.tsx)

- Replace hardcoded `stats` with `useGetAnalyticsOverviewQuery()`
- Replace `engagementData` with `useGetWeeklyEngagementQuery()`
- Replace `platformData` with `useGetPlatformsBreakdownQuery()`
- Add loading skeletons, error states
- Apply new theme colors

#### [MODIFY] [content-calendar.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/pages/dashboard/content-calendar.tsx)

- Replace `mockPosts` with `useGetScheduledPostsQuery()`
- **"Schedule Post" button** → opens schedule post dialog (new component)
- **Calendar day click** → opens a side panel/popover showing posts for that day with details (platform, time, status, text preview)
- **Toast "Let's do it" action** → opens content generation dialog
- Proper month navigation (prev/next month buttons)
- Apply theme colors

#### [NEW] [SchedulePostDialog.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/components/SchedulePostDialog.tsx)

React Hook Form + Zod dialog:
- Fields: `platform` (select), `post_text` (textarea), `scheduled_for` (date+time picker), optional `content_id` (select from existing content)
- Calls `useSchedulePostMutation()`
- Success toast, closes dialog, data auto-refetches via tag invalidation

#### [NEW] [GenerateContentDialog.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/components/GenerateContentDialog.tsx)

React Hook Form + Zod dialog:
- Fields: `platform` (select), `content_type` (select), `prompt` (textarea), `tone` (select)
- Calls `useGenerateContentMutation()`
- Shows loading state (AI generation can take 60-120s)
- Displays result with copy-to-clipboard
- Option to schedule immediately after generation

#### [MODIFY] [generated-content.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/pages/dashboard/generated-content.tsx)

- Replace `mockContent` with `useGetContentHistoryQuery()`
- **"Generate New" button** → opens `GenerateContentDialog`
- **Schedule dialog** → uses `useSchedulePostMutation()` with form validation
- **View button** → opens detail dialog showing full content
- **Edit button** → opens edit dialog with `useUpdateContentMutation()`
- **Copy/Duplicate button** → copies caption to clipboard + toast
- **Download button** → downloads content as text file
- Filter tabs work with actual API params (`status` query param)
- Apply theme colors

#### [NEW] [ContentDetailDialog.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/components/ContentDetailDialog.tsx)

Dialog showing full content details: platform, status, full caption text, hashtags, CTA, timestamps, engagement stats.

#### [NEW] [EditContentDialog.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/components/EditContentDialog.tsx)

React Hook Form dialog for editing content:
- Fields: `generated_text`, `hashtags`, `call_to_action`, `status`
- Calls `PATCH /content/{content_id}` via RTK mutation

#### [MODIFY] [messages.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/pages/dashboard/messages.tsx)

- Replace `mockMessages` with `useGetMessagesQuery()`
- **Send reply** → calls `useReplyToMessageMutation()`
- **"AI Suggest Reply" badge** → button that calls `useGetAISuggestionsMutation()`, shows suggestion chips the user can click to auto-fill the reply box
- **Like button** → visual feedback (local state toggle, no API for this)
- **Mark as Read** → local state (or could be tracked via replied status)
- Apply theme colors

#### [MODIFY] [profile.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/pages/dashboard/profile.tsx)

- Fetch user with `useGetProfileQuery()`
- Fetch connected accounts with `useGetSocialAccountsQuery()`
- **Add "Edit Profile" button** → opens dialog with React Hook Form for company_name, avatar_url
- Calls `useUpdateProfileMutation()`
- **Add "Connect Account" button** → opens dialog to connect new platform
- Apply theme colors

#### [NEW] [EditProfileDialog.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/components/EditProfileDialog.tsx)

React Hook Form + Zod:
- Fields: `company_name`, `avatar_url`
- Calls `PATCH /me`

#### [NEW] [ConnectAccountDialog.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/components/ConnectAccountDialog.tsx)

React Hook Form + Zod:
- Fields: `platform` (select), `account_name`, `account_id`
- Calls `POST /social/connect`

#### [MODIFY] [settings.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/pages/dashboard/settings.tsx)

- **Theme toggle** → dispatches `toggleTheme` action from `uiSlice`
- **Change Password button** → opens a dialog (placeholder since no API endpoint for this)
- **Delete Account button** → opens confirmation `AlertDialog`
- Switch values persist to localStorage via Redux
- Apply theme colors

#### [MODIFY] [onboarding.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/pages/onboarding.tsx)

- Platform connect → calls `useConnectPlatformMutation()` for each selected platform
- Shows loading state during API calls
- Apply theme colors

#### [MODIFY] [layout.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/pages/dashboard/layout.tsx)

- Read message count from `useGetMessagesQuery()` for badge
- Theme toggle button in sidebar
- User avatar from `useGetProfileQuery()`
- Apply theme colors (replace `bg-[#0a0a0a]`, `bg-zinc-900/50`, etc.)
- Logout button in sidebar bottom

---

### Phase 5: Onboarding Integration

---

#### [MODIFY] [onboarding.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/pages/onboarding.tsx)

- When user clicks a platform, call `POST /onboarding/connect` with platform + account_name (prompt user for account handle via small input)
- Show connected state from API response
- Step 2 fetches `GET /onboarding/platforms` to confirm connections

---

### Phase 6: Global Toolbar Integration

---

#### [MODIFY] [global-toolbar.tsx](file:///c:/dev/Hackathon/ai-marketing-agent/frontend/src/app/components/global-toolbar.tsx)

- **Message button** → navigates to `/dashboard/messages`
- **Clock buttons** → navigates to `/dashboard/calendar`
- **Create button** → already opens canvas (keep as-is)
- Apply theme colors

---

### Phase 7: UI Polish & Theme Application

---

#### All dashboard pages + components

Systematic pass to:
1. Replace all `bg-[#0a0a0a]`, `bg-zinc-900/50`, `bg-zinc-800` → `bg-background`, `bg-card`, `bg-muted`
2. Replace `text-white` → `text-foreground`
3. Replace `text-zinc-400/500` → `text-muted-foreground`
4. Replace `border-zinc-800` → `border-border`
5. Replace `bg-gradient-to-r from-[#13005A] to-[#00337C]` → `bg-primary text-primary-foreground`
6. Replace `text-[#03C988]` → `text-emerald-500` (success color)
7. Replace `text-[#1C82AD]`, `bg-[#1C82AD]` → `text-primary`, `bg-primary`
8. Add `font-['Inter']` via Google Fonts import in `fonts.css`
9. Add subtle `transition-colors` on theme-switchable elements
10. Add loading skeletons using shadcn's `<Skeleton />` component

---

## New Files Summary

| File | Purpose |
|------|---------|
| `src/app/types.ts` | All API TypeScript interfaces |
| `src/app/store/store.ts` | Redux store configuration |
| `src/app/store/apiSlice.ts` | RTK Query API definition (all endpoints) |
| `src/app/store/authSlice.ts` | Auth state management |
| `src/app/store/uiSlice.ts` | UI state (theme, sidebar) |
| `src/app/pages/login.tsx` | Login page |
| `src/app/components/ThemeProvider.tsx` | Theme context provider |
| `src/app/components/ProtectedRoute.tsx` | Auth route guard |
| `src/app/components/SchedulePostDialog.tsx` | Schedule post form modal |
| `src/app/components/GenerateContentDialog.tsx` | AI content generation form modal |
| `src/app/components/ContentDetailDialog.tsx` | Content detail view modal |
| `src/app/components/EditContentDialog.tsx` | Edit content form modal |
| `src/app/components/EditProfileDialog.tsx` | Edit profile form modal |
| `src/app/components/ConnectAccountDialog.tsx` | Connect social account form modal |

---

## Verification Plan

### Automated Tests
- `npm run build` — ensure TypeScript compiles with no errors
- `npm run dev` — verify dev server starts

### Manual Verification (Browser)
1. **Auth flow**: Register → redirects to onboarding → connect platforms → dashboard. Logout → redirects to login. Login → back to dashboard.
2. **Theme toggle**: Switch between light/dark mode — all pages render correctly in both.
3. **Analytics**: Data loads from API (or shows loading skeleton / error state).
4. **Content generation**: Click "Generate New" → fill form → submit → content appears in list.
5. **Scheduling**: Schedule a post → appears in calendar on correct date.
6. **Calendar**: Click a day with posts → detail panel shows. Click "Schedule Post" → form works.
7. **Messages**: Messages load from API. Select message → type reply → send → API called. "AI Suggest" → suggestions appear.
8. **Profile**: User data loads. Edit profile → changes persist. Connect new account → appears in list.
9. **Settings**: Theme toggle works. All switches persist on page reload.
