-- ============================================
-- DİKİLİHABER ADMIN KURULUM SQL
-- ============================================
-- Bu dosyayı Supabase SQL Editor'da çalıştırın
-- Tüm adımlar otomatik olarak yapılacak

-- 1. ADMINS TABLOSUNU OLUŞTUR
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin',
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS (Row Level Security) ETKİNLEŞTİR
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 3. MEVCUT POLİTİKALARI TEMİZLE (varsa)
DROP POLICY IF EXISTS "Admins can read self" ON public.admins;
DROP POLICY IF EXISTS "Service role can manage admins" ON public.admins;

-- 4. ADMIN KULLANICILAR KENDİ KAYITLARINI GÖREBİLİR
-- NOT: Bu policy sonsuz döngüyü önlemek için sadece user_id kontrolü yapar
-- Admin kontrolü yapmaz (çünkü bu sonsuz döngüye neden olur)
CREATE POLICY "Admins can read self" ON public.admins
  FOR SELECT 
  USING (auth.uid() = user_id);

-- 5. SERVICE ROLE İLE ADMIN EKLEME İÇİN POLICY (Sonsuz döngüyü önlemek için)
-- Bu policy sadece service role ile çalışır, normal kullanıcılar admin ekleyemez
-- Service role kullanarak admin eklemek için bu policy gereklidir
CREATE POLICY "Service role can manage admins" ON public.admins
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 5. İLK ADMIN KULLANICISINI EKLE
-- NOT: Email adresinizi değiştirin!
INSERT INTO public.admins (user_id, email, role)
SELECT 
  id as user_id,
  email,
  'admin' as role
FROM auth.users
WHERE email = 'dikilihaberr@gmail.com'
ON CONFLICT (user_id) DO UPDATE 
SET 
  role = 'admin',
  email = EXCLUDED.email;

-- 6. KONTROL SORGUSU (Admin listesini göster)
SELECT 
  a.user_id,
  a.email,
  a.role,
  a.created_at,
  u.email as auth_email
FROM public.admins a
LEFT JOIN auth.users u ON a.user_id = u.id
ORDER BY a.created_at DESC;

