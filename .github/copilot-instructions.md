# DikiliHaber AI Coding Agent Instructions

## Project Overview

DikiliHaber is a Turkish news portal built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase PostgreSQL**. The project serves as a professional news management platform with admin capabilities, featuring categories, featured articles, and comment systems.

## Architecture

### Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Lucide React Icons
- **Backend**: Supabase (PostgreSQL) with Row-Level Security (RLS)
- **Auth**: Supabase Auth with session persistence
- **Deployment**: Vercel/Netlify compatible

### Key Directories
- `src/app/` - Next.js App Router (pages, admin, auth, category, news routes)
- `src/lib/supabase.ts` - Centralized Supabase client and all database APIs (~500 lines)
- `src/contexts/AuthContext.tsx` - Global auth state and user metadata management
- `src/components/` - Reusable UI and layout components
- `src/types/` - TypeScript interfaces (basic schema definitions)

### Data Model
**News Table** (`news` in Supabase):
- `id` (UUID), `title`, `excerpt`, `content`, `category`, `author`, `featured`, `image_url`, `images` (array), `slug`, `published_at`, `created_at`, `updated_at`

**Supporting Tables**: `admins` (user access control), `comments` (news comments with RLS), `drafts` (draft management)

## Critical Patterns

### 1. Supabase Client Pattern
All database operations go through `src/lib/supabase.ts`. The client validates environment variables at initialization and handles gracefully when missing (important for dev/test). **Import functions directly**, not the client:
```typescript
// ✅ Correct
import { getAllNews, getNewsByCategory, addNews } from '@/lib/supabase'

// ❌ Avoid
import { supabase } from '@/lib/supabase'
supabase.from('news')...
```

### 2. Authentication Flow
- **Client Components** use `useAuth()` hook from `AuthContext` for user/session/isAdmin state
- **Server Components** call `getCurrentUser()` or `getSession()` directly
- Admin checks: First verify `isAdmin()` in middleware, then enforce on client via `useAuth().isAdmin`
- Middleware routes unauth users to `/auth/login` with redirect param

### 3. Server-Side Data Fetching (ISR Pattern)
Home page uses `revalidate = 60` for Incremental Static Regeneration:
```typescript
export const revalidate = 60  // Revalidate every 60 seconds
const allNews = await getAllNews()  // Called at build/revalidation time
```

### 4. Component Patterns
- Use path alias `@/` for imports (configured in `tsconfig.json`)
- Separate `ui/` components (buttons, cards, form elements) from `layout/` components (Navbar, Footer, Sidebar)
- Server Components by default; use `'use client'` only where needed (forms, hooks, interactivity)

### 5. Tailwind + CSS Conventions
- Color scheme uses `primary` (blue), `background`, and semantic grays
- Responsive breakpoints: `sm:`, `md:`, `lg:` (Next.js defaults: 640px, 768px, 1024px)
- Grid layouts prefer `lg:col-span-3` and `md:grid-cols-2` patterns

## Database/Schema Management

### Setting Up
1. Create Supabase project
2. Run `supabase-schema.sql` in SQL Editor to initialize tables
3. Enable Row-Level Security (RLS) on tables (already configured in schema)
4. Admins table must be manually populated with `user_id` entries (no self-signup)

### Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
```

**Critical**: Variables are public (NEXT_PUBLIC prefix) - intended for browser use with RLS enforcing security.

## Development Workflows

### Local Development
```bash
npm install
npm run dev  # Runs on http://localhost:3000 (Turbopack disabled for stability)
npm run lint  # Next.js ESLint
```

### Key API Functions (in `src/lib/supabase.ts`)
- **Read**: `getAllNews()`, `getNewsByCategory()`, `getFeaturedNews()`, `getNewsBySlug()`, `getCommentsByNewsId()`
- **Write**: `addNews()`, `updateNews()`, `deleteNews()`, `addComment()`, `updateComment()`
- **Auth**: `signIn()`, `signUp()`, `signOut()`, `isAdmin()`

### Adding New Features
1. **New API endpoint**: Add function to `src/lib/supabase.ts` (centralized pattern)
2. **New page**: Create route in `src/app/[route]/page.tsx`, import data functions
3. **New component**: Create in `src/components/ui/` or `layout/` with proper TypeScript types
4. **Admin feature**: Verify `isAdmin` check in middleware + client-side `useAuth().isAdmin`

## Common Gotchas

1. **Draft Management**: The database has separate `drafts` table for work-in-progress news - always check for drafts before publishing
2. **Comments Moderation**: Comments have RLS policies - ensure `user_id` is set on insert (use authenticated user)
3. **Slug Uniqueness**: `slug` field has unique constraint - `addNews()` auto-generates from title, but verify uniqueness on updates
4. **Image Storage**: Images stored as URLs in database; use Supabase Storage bucket for uploads (next.config.js whitelist configured)
5. **Turkish Content**: UI strings are Turkish - maintain locale consistency in new features
6. **Middleware Patterns**: Cookie-based auth check is basic - actual permissions verified server-side via `isAdmin()`

## File Organization Reminders

- Avoid creating top-level utility files - extend `src/lib/supabase.ts` or `src/lib/utils.ts`
- Component file = one component per file (don't bundle multiple)
- Types go in `src/types/index.ts`, not scattered
- Server Components don't use hooks or context - only client components
- Layout wraps all routes through RootLayout (don't bypass it)

---

**For questions**: Check `README.md` for user-facing guides or `supabase-schema.sql` for database structure.
