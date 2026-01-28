// TypeScript interfaces - Centralized type exports
// NewsItem is the primary type for news articles - exported from @/lib/supabase
// This file re-exports it for convenience and adds additional types

export interface Category {
  id: string;
  name: string;
}

// Re-export NewsItem from supabase.ts for centralized access
// Note: NewsItem is defined in src/lib/supabase.ts with full database schema
export type { NewsItem, Comment, CommentWithNews, Tip } from '@/lib/supabase'