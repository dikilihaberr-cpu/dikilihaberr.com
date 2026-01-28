-- ============================================
-- RLS SONSUZ DÖNGÜ DÜZELTME SQL
-- ============================================
-- Bu dosyayı Supabase SQL Editor'da çalıştırın
-- Admins tablosundaki sonsuz döngü sorununu çözecek

-- 1. MEVCUT PROBLEMATİK POLİTİKALARI SİL
DROP POLICY IF EXISTS "Admins can read self" ON public.admins;
DROP POLICY IF EXISTS "Service role can manage admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can read all admins" ON public.admins;
DROP POLICY IF EXISTS "Public can read admins" ON public.admins;

-- 2. YENİ POLİTİKA OLUŞTUR (Sonsuz döngü yok)
-- Kullanıcılar sadece kendi kayıtlarını görebilir (admin kontrolü yapmadan)
CREATE POLICY "Users can read own admin record" ON public.admins
  FOR SELECT 
  USING (auth.uid() = user_id);

-- 3. SERVICE ROLE İLE ADMIN EKLEME İÇİN POLICY
-- Bu policy sadece service role ile çalışır
CREATE POLICY "Service role can manage admins" ON public.admins
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 4. KONTROL: Policy'lerin düzgün çalıştığını kontrol edin
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'admins';

-- ============================================
-- ✅ DÜZELTME TAMAMLANDI!
-- ============================================
-- Artık sonsuz döngü sorunu çözülmüş olmalı.
-- /setup-admin sayfasından tekrar deneyin.
