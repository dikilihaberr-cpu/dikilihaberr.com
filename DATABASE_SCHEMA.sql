-- ============================================
-- DİKİLİHABER.COM - TAM DATABASE SCHEMA
-- ============================================
-- Bu dosyayı Supabase SQL Editor'da çalıştırın
-- Tüm tablolar, indexler, triggerlar ve RLS politikaları otomatik oluşturulacak

-- ============================================
-- 1. TABLOLAR
-- ============================================

-- NEWS TABLOSU
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT,
  featured BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  video_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_published BOOLEAN DEFAULT FALSE,
  is_draft BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0
);

-- COMMENTS TABLOSU
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_approved BOOLEAN DEFAULT FALSE, -- Legacy field for backward compatibility
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ADMINS TABLOSU
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin',
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IMAGES TABLOSU (Storage metadata için)
CREATE TABLE IF NOT EXISTS public.images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  filename TEXT,
  size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ADS TABLOSU (Reklamlar)
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position TEXT NOT NULL CHECK (position IN ('sidebar', 'header', 'footer', 'content')),
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  click_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. INDEXLER (Performans için)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category);
CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_featured ON public.news(featured);
CREATE INDEX IF NOT EXISTS idx_comments_news_id ON public.comments(news_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON public.comments(status);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins(user_id);
CREATE INDEX IF NOT EXISTS idx_ads_position ON public.ads(position);
CREATE INDEX IF NOT EXISTS idx_ads_active ON public.ads(is_active);
CREATE INDEX IF NOT EXISTS idx_ads_dates ON public.ads(start_date, end_date);

-- ============================================
-- 3. TRIGGERLAR (Otomatik güncelleme)
-- ============================================

-- updated_at otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- News tablosu için trigger
DROP TRIGGER IF EXISTS update_news_updated_at ON public.news;
CREATE TRIGGER update_news_updated_at 
  BEFORE UPDATE ON public.news
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Comments tablosu için trigger
DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
CREATE TRIGGER update_comments_updated_at 
  BEFORE UPDATE ON public.comments
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Ads tablosu için trigger
DROP TRIGGER IF EXISTS update_ads_updated_at ON public.ads;
CREATE TRIGGER update_ads_updated_at 
  BEFORE UPDATE ON public.ads
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- ============================================

-- NEWS TABLOSU RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Public can read published news" ON public.news;
DROP POLICY IF EXISTS "Admins can manage news" ON public.news;

-- Herkes yayınlanmış haberleri okuyabilir
CREATE POLICY "Public can read published news" ON public.news
  FOR SELECT
  USING (status = 'published' AND is_published = TRUE);

-- Adminler haber ekleyebilir/güncelleyebilir/silebilir
-- NOT: Bu policy admin kontrolü yapmaz (sonsuz döngüyü önlemek için)
-- Admin kontrolü uygulama katmanında yapılır
CREATE POLICY "Admins can manage news" ON public.news
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE user_id = auth.uid()
    )
  );

-- COMMENTS TABLOSU RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Public can read approved comments" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can manage comments" ON public.comments;

-- Herkes onaylanmış yorumları okuyabilir
CREATE POLICY "Public can read approved comments" ON public.comments
  FOR SELECT
  USING (status = 'approved' OR is_approved = TRUE);

-- Authenticated kullanıcılar yorum ekleyebilir
CREATE POLICY "Authenticated users can insert comments" ON public.comments
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Kullanıcılar kendi yorumlarını güncelleyebilir
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Adminler tüm yorumları yönetebilir
CREATE POLICY "Admins can manage comments" ON public.comments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE user_id = auth.uid()
    )
  );

-- ADMINS TABLOSU RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Admins can read self" ON public.admins;
DROP POLICY IF EXISTS "Service role can manage admins" ON public.admins;

-- Kullanıcılar kendi admin kayıtlarını görebilir
CREATE POLICY "Admins can read self" ON public.admins
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role admin ekleyebilir/güncelleyebilir/silebilir
CREATE POLICY "Service role can manage admins" ON public.admins
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- IMAGES TABLOSU RLS
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Public can read images" ON public.images;
DROP POLICY IF EXISTS "Authenticated users can insert images" ON public.images;

-- Herkes resimleri okuyabilir
CREATE POLICY "Public can read images" ON public.images
  FOR SELECT
  USING (TRUE);

-- Authenticated kullanıcılar resim ekleyebilir
CREATE POLICY "Authenticated users can insert images" ON public.images
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ADS TABLOSU RLS
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Public can read active ads" ON public.ads;
DROP POLICY IF EXISTS "Admins can manage ads" ON public.ads;

-- Herkes aktif reklamları okuyabilir
CREATE POLICY "Public can read active ads" ON public.ads
  FOR SELECT
  USING (
    is_active = TRUE AND
    (start_date IS NULL OR start_date <= NOW()) AND
    (end_date IS NULL OR end_date >= NOW())
  );

-- Adminler reklamları yönetebilir
CREATE POLICY "Admins can manage ads" ON public.ads
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 5. RPC FUNCTIONS (Reklam İstatistikleri İçin)
-- ============================================

-- Reklam tıklama sayısını artır
CREATE OR REPLACE FUNCTION increment_ad_clicks(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.ads
  SET click_count = click_count + 1
  WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reklam görüntüleme sayısını artır
CREATE OR REPLACE FUNCTION increment_ad_views(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.ads
  SET view_count = view_count + 1
  WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. BAŞARILI MESAJI
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database schema başarıyla oluşturuldu!';
  RAISE NOTICE '📋 Tablolar: news, comments, admins, images, ads';
  RAISE NOTICE '🔒 RLS politikaları aktif';
  RAISE NOTICE '⚡ Indexler oluşturuldu';
  RAISE NOTICE '🔄 Triggerlar aktif';
  RAISE NOTICE '📊 RPC fonksiyonları hazır';
END $$;
