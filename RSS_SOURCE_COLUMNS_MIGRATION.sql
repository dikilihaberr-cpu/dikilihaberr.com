-- RSS Feed Source Columns Migration
-- Bu migration dosyasını Supabase SQL Editor'de çalıştırın

-- source_url ve source_name kolonlarını ekle (opsiyonel)
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS source_url TEXT,
ADD COLUMN IF NOT EXISTS source_name TEXT;

-- source_url için index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_news_source_url ON news(source_url);

-- Açıklama ekle
COMMENT ON COLUMN news.source_url IS 'RSS feed''den çekilen haberlerin orijinal kaynak URL''si';
COMMENT ON COLUMN news.source_name IS 'RSS feed kaynak adı (örn: Hürriyet Gündem)';
