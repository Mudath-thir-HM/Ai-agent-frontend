# AgentCee — Frontend

A React + Redux social media management dashboard that connects to the AgentCee backend. Handles content generation, post scheduling, inbox management, analytics, and platform tracking — all wired to live API endpoints with no mock data in production flows.

---

## Tech Stack

| Layer        | Library                         |
| ------------ | ------------------------------- |
| Framework    | React 18 + Vite 6               |
| Language     | TypeScript 6                    |
| State / Data | Redux Toolkit + RTK Query       |
| Routing      | React Router v7                 |
| Styling      | Tailwind CSS v4                 |
| Components   | shadcn/ui (Radix UI primitives) |
| Forms        | React Hook Form + Zod           |
| Charts       | Recharts                        |
| Canvas       | ReactFlow                       |
| Animations   | Motion (Framer Motion v12)      |
| Toasts       | Sonner                          |

---

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- A running instance of the AgentCee backend (see backend README)

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

If this variable is omitted, the app defaults to `http://localhost:8000/api/v1`. The Vite dev server also proxies `/api` requests to `http://localhost:8000` (configured in `vite.config.ts`), so either approach works locally.

### Build for Production

```bash
pnpm build
```

Output goes to `dist/`. Serve with any static file host (Vercel, Netlify, Nginx, etc.).

---

## Project Structure

```
src/
├── app/
│   ├── components/          # Shared UI components
│   │   ├── ui/              # shadcn/ui primitives (button, dialog, etc.)
│   │   ├── canvas-nodes/    # ReactFlow node types
│   │   ├── canvas-overlay.tsx
│   │   ├── global-toolbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── SchedulePostDialog.tsx
│   │   ├── GenerateContentDialog.tsx
│   │   ├── EditContentDialog.tsx
│   │   ├── ContentDetailDialog.tsx
│   │   ├── EditProfileDialog.tsx
│   │   └── ConnectAccountDialog.tsx
│   ├── pages/
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── onboarding.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── analytics.tsx
│   │       ├── content-calendar.tsx
│   │       ├── generated-content.tsx
│   │       ├── messages.tsx
│   │       ├── profile.tsx
│   │       └── settings.tsx
│   ├── store/
│   │   ├── store.ts         # Redux store configuration
│   │   ├── apiSlice.ts      # RTK Query — all endpoints
│   │   ├── authSlice.ts     # JWT + user state
│   │   ├── uiSlice.ts       # Theme, sidebar, canvas state
│   │   └── hooks.ts         # Typed useAppSelector / useAppDispatch
│   ├── types.ts             # TypeScript interfaces matching API contracts
│   └── App.tsx              # Route definitions
├── styles/
│   ├── index.css
│   ├── theme.css            # CSS custom properties (light + dark)
│   ├── tailwind.css
│   └── fonts.css
└── main.tsx                 # Redux Provider + app entry point
```

---

## Authentication Flow

1. User registers or logs in — the API returns a JWT.
2. The token is stored in Redux state (`auth.accessToken`) and persisted to `localStorage` under the key `astra_access_token`.
3. On app load, `authSlice` reads the token from `localStorage` to restore the session.
4. Every RTK Query request injects the token as `Authorization: Bearer <token>` via `prepareHeaders`.
5. Any `401` response triggers `baseQueryWithReauth`, which dispatches `logout()` and redirects to `/login`.
6. Protected routes are guarded by `<ProtectedRoute />`, which checks `auth.isAuthenticated` and redirects unauthenticated users.

> **Security note:** Storing JWTs in `localStorage` is XSS-vulnerable. For production, replace this with HTTP-only cookies and a server-side refresh token flow.

---

## State Management

### Redux Slices

**`authSlice`** — Stores `accessToken`, `user`, and `isAuthenticated`. Exposes `setCredentials` (called after login/register) and `logout` (clears state and localStorage).

**`uiSlice`** — Stores `theme` (`light` | `dark`, persisted to localStorage), `sidebarCollapsed`, and `isCanvasOpen`. The canvas overlay is opened from multiple locations (sidebar button, global toolbar, content page) and closing it from anywhere works because the state is global.

**`apiSlice`** — RTK Query API definition with ~25 endpoints. Tag types (`Profile`, `Messages`, `Content`, `ScheduledPosts`, `Analytics`, etc.) drive automatic cache invalidation. For example, `schedulePost` invalidates both `ScheduledPosts` and `Content`, so the calendar and content grid both refresh after a post is scheduled.

### API ↔ UI Transform Layer

The backend uses `sender_name` / `message_text` for messages and `platform` / `generated_text` for content. The frontend domain model uses `author_name` / `content` and `target_platform` / `post_text` respectively. The `transformResponse` functions in `apiSlice.ts` (`transformMessage`, `transformContent`) handle this mapping at the network boundary so the rest of the app works with a consistent shape.

---

## Key Features

### Content Calendar

Fetches scheduled posts from `GET /scheduler/` and renders them on a month grid. Clicking any day opens `SchedulePostDialog` pre-filled with that date. Month navigation (prev/next) is handled client-side.

### AI Content Canvas

A ReactFlow-based node editor accessible via the global toolbar. Nodes: **Image** (upload a reference image), **AI Prompt** (caption or image generation mode, adjustable creativity), **Output** (live platform preview with character limit indicators for Instagram, X, and Facebook). The output node's Schedule button wires directly to `POST /scheduler/`.

### Messages Inbox

Loads all messages from `GET /messages/`. Selecting a message opens the reply panel. The **AI Suggest Reply** badge is wired to `POST /messages/ai-suggest`, which returns 3 reply options and a sentiment classification. Clicking a suggestion auto-fills the reply textarea.

### Analytics Dashboard

Three RTK Query calls run in parallel: overview stats, weekly engagement (line chart), and platform breakdown (bar chart). All charts use Recharts with theme-aware colors (`var(--primary)`, `var(--border)`, etc.) so they adapt to light/dark mode.

### Theme System

`ThemeProvider` reads the `ui.theme` value from Redux and adds/removes the `.dark` class on `<html>`. All colors are defined as CSS custom properties in `theme.css` and consumed via Tailwind's `bg-background`, `text-foreground`, `border-border`, etc. Toggling theme from Settings takes effect instantly across all pages.

---

## Form Validation

All forms use React Hook Form with Zod resolvers. Schemas are defined inline in each dialog/page component. Validation runs on submit (not on every keystroke) to avoid noisy error states. API error messages from the backend (`err?.data?.detail`) are surfaced via Sonner toast notifications.

---

## Adding a New API Endpoint

1. Define the TypeScript interfaces in `src/app/types.ts`.
2. Add the endpoint to `apiSlice.ts` using `builder.query` or `builder.mutation`.
3. Add the tag type to `tagTypes` if the endpoint affects cached data.
4. Export the generated hook from the bottom of `apiSlice.ts`.
5. Use the hook in your component.

```typescript
// 1. types.ts
export interface MyResponse { id: string; value: string; }

// 2. apiSlice.ts — inside endpoints:
getMyThing: builder.query<MyResponse, void>({
  query: () => ({ url: "/my-thing", method: "GET" }),
  providesTags: ["MyTag"],
}),

// 3. Export
export const { useGetMyThingQuery } = apiSlice;

// 4. Component
const { data, isLoading } = useGetMyThingQuery();
```

---

## Scripts

| Command      | Description                                |
| ------------ | ------------------------------------------ |
| `pnpm dev`   | Start Vite dev server with HMR             |
| `pnpm build` | TypeScript compile + Vite production build |

---

## Known Limitations

- **No token refresh endpoint.** JWTs expire after 7 days (configurable on the backend). When a token expires, the user is redirected to login. A refresh token flow would improve this.
- **ReactFlow canvas state is not persisted.** Nodes and edges are in-memory only. Navigating away from the canvas loses the graph. Persisting canvas state to the backend or to `localStorage` is a natural next step.
- **No pagination UI.** The content history and messages endpoints support pagination params, but the frontend currently fetches all items (up to the default limit). Infinite scroll or page controls would be needed at scale.
