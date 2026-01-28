# 🔐 Admin Kurulum Rehberi

## Hızlı Kurulum

### 1. Supabase SQL Editor'da Çalıştırın

```sql
-- Admins tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin',
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policy ekle (admin kullanıcılar kendi kayıtlarını görebilir)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read self" ON public.admins
  FOR SELECT USING (auth.uid() = user_id);

-- Service role ile admin ekleme için policy (opsiyonel)
-- Bu policy sadece service role ile çalışır, normal kullanıcılar admin ekleyemez
```

### 2. Kendinizi Admin Olarak Ekleyin

Supabase SQL Editor'da şu komutu çalıştırın (email'inizi değiştirin):

```sql
-- Önce kullanıcı ID'nizi bulun
SELECT id, email FROM auth.users WHERE email = 'dikilihaberr@gmail.com';

-- Sonra kendinizi admin olarak ekleyin (yukarıdaki ID'yi kullanın)
INSERT INTO public.admins (user_id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'dikilihaberr@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

### 3. Kontrol Edin

```sql
-- Admin listesini kontrol edin
SELECT a.*, u.email as user_email
FROM public.admins a
JOIN auth.users u ON a.user_id = u.id;
```

## ✅ Kurulum Tamamlandı!

Artık admin olarak giriş yapabilirsiniz. Login sayfasından giriş yaptığınızda otomatik olarak admin paneline yönlendirileceksiniz.
