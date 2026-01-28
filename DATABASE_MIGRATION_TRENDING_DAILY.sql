    -- ============================================
    -- TRENDING VE GÜNÜN HABERİ FIELD'LARI EKLEME
    -- ============================================
    -- Bu migration'ı Supabase SQL Editor'da çalıştırın

    -- is_trending field'ı ekle
    ALTER TABLE public.news 
    ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE;

    -- is_daily_news field'ı ekle (Günün Haberi)
    ALTER TABLE public.news 
    ADD COLUMN IF NOT EXISTS is_daily_news BOOLEAN DEFAULT FALSE;

    -- Index'ler ekle (performans için)
    CREATE INDEX IF NOT EXISTS idx_news_is_trending ON public.news(is_trending) WHERE is_trending = TRUE;
    CREATE INDEX IF NOT EXISTS idx_news_is_daily_news ON public.news(is_daily_news) WHERE is_daily_news = TRUE;

    -- Yorum
    COMMENT ON COLUMN public.news.is_trending IS 'Haber trendlerde görünsün mü?';
    COMMENT ON COLUMN public.news.is_daily_news IS 'Haber günün haberi olarak gösterilsin mi?';
