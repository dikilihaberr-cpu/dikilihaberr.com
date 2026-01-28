# 🔍 HABER YAYINLAMA SORUNU DEBUG REHBERİ

## Sorun
Yeni girilen haberler siteye düşmüyor.

## Olası Nedenler

### 1. Status Field Eksik
- ✅ **DÜZELTİLDİ**: `addNews` fonksiyonunda `status: 'published'` eklendi
- RLS policy `status = 'published' AND is_published = TRUE` kontrolü yapıyor

### 2. is_published False
- ✅ **DÜZELTİLDİ**: `publishNews` fonksiyonunda `is_published: true` yapıldı

### 3. RLS Policy Sorunu
RLS policy şu koşulu kontrol ediyor:
```sql
status = 'published' AND is_published = TRUE
```

## Test Adımları

### 1. Database'de Kontrol
Supabase SQL Editor'da çalıştırın:
```sql
-- Son eklenen haberleri kontrol et
SELECT 
  id,
  title,
  status,
  is_published,
  is_draft,
  published_at,
  created_at
FROM public.news
ORDER BY created_at DESC
LIMIT 5;
```

### 2. RLS Policy Kontrolü
```sql
-- RLS policy'yi kontrol et
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'news';
```

### 3. Manuel Test
1. Admin paneline gir
2. "Yeni Haber" butonuna tıkla
3. Formu doldur:
   - Başlık: "Test Haberi"
   - Kategori: "Gündem"
   - İçerik: "Bu bir test haberidir"
4. **"Haber Yayınla"** butonuna tıkla (Taslak değil!)
5. Ana sayfaya git ve kontrol et

## Beklenen Sonuç

Haber eklendikten sonra:
- `status` = `'published'`
- `is_published` = `true`
- `is_draft` = `false`
- `published_at` = şu anki tarih/saat

## Sorun Devam Ederse

1. Browser Console'u kontrol et (F12)
2. Network tab'ında Supabase request'lerini kontrol et
3. Supabase Dashboard > Logs bölümünü kontrol et
4. Database'de haberin gerçekten eklendiğini kontrol et
