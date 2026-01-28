# 🚀 DİKİLİHABER.COM - TAM KURULUM REHBERİ

Bu rehber, projeyi sıfırdan kurmak için gereken tüm adımları içerir.

---

## 📋 İÇİNDEKİLER

1. [Gereksinimler](#1-gereksinimler)
2. [Supabase Kurulumu](#2-supabase-kurulumu)
3. [Database Schema Kurulumu](#3-database-schema-kurulumu)
4. [Environment Variables](#4-environment-variables)
5. [Proje Bağımlılıkları](#5-proje-bağımlılıkları)
6. [Admin Kullanıcı Oluşturma](#6-admin-kullanıcı-oluşturma)
7. [Projeyi Çalıştırma](#7-projeyi-çalıştırma)
8. [İlk Test](#8-ilk-test)
9. [Sorun Giderme](#9-sorun-giderme)

---

## 1. GEREKSINIMLER

### Sistem Gereksinimleri:
- **Node.js**: v18.x veya üzeri
- **npm**: v9.x veya üzeri (Node.js ile birlikte gelir)
- **Git**: Projeyi klonlamak için

### Kontrol:
```bash
node --version  # v18.x veya üzeri olmalı
npm --version   # v9.x veya üzeri olmalı
git --version   # Herhangi bir versiyon
```

---

## 2. SUPABASE KURULUMU

### Adım 2.1: Supabase Hesabı Oluşturma
1. [https://supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub veya Email ile kayıt olun
4. Email doğrulamasını tamamlayın

### Adım 2.2: Yeni Proje Oluşturma
1. Supabase Dashboard'a giriş yapın
2. "New Project" butonuna tıklayın
3. **Proje Bilgileri:**
   - **Name**: `dikilihaber` (veya istediğiniz isim)
   - **Database Password**: Güçlü bir şifre belirleyin (SAKLAYIN!)
   - **Region**: En yakın bölgeyi seçin (örn: `West Europe`)
   - **Pricing Plan**: Free tier yeterli
4. "Create new project" butonuna tıklayın
5. Projenin hazır olmasını bekleyin (2-3 dakika)

### Adım 2.3: API Bilgilerini Alma
1. Proje oluşturulduktan sonra Dashboard'a gidin
2. Sol menüden **Settings** > **API** seçin
3. Şu bilgileri kopyalayın ve bir yere kaydedin:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: (Gizli tutun, sadece backend için)

---

## 3. DATABASE SCHEMA KURULUMU

### Adım 3.1: SQL Editor'a Erişim
1. Supabase Dashboard'da sol menüden **SQL Editor** seçin
2. "New query" butonuna tıklayın

### Adım 3.2: Ana Tabloları Oluşturma

Aşağıdaki SQL  kodunu kopyalayıp SQL Editor'a yapıştırın ve **RUN** butonuna tıklayın:

```sql
-- ============================================
-- DİKİLİHABER DATABASE SCHEMA
-- ============================================

-- 1. NEWS TABLOSU
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

-- 2. COMMENTS TABLOSU
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_approved BOOLEAN DEFAULT FALSE, -- Legacy field
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ADMINS TABLOSU
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin',
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. IMAGES TABLOSU (Storage metadata için)
CREATE TABLE IF NOT EXISTS public.images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  filename TEXT,
  size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. INDEXLER (Performans için)
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category);
CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at);
CREATE INDEX IF NOT EXISTS idx_comments_news_id ON public.comments(news_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON public.comments(status);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins(user_id);

-- 6. TRIGGER: updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Adım 3.3: RLS (Row Level Security) Politikaları

Aşağıdaki SQL kodunu çalıştırın:

```sql
-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- NEWS TABLOSU RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Herkes yayınlanmış haberleri okuyabilir
CREATE POLICY "Public can read published news" ON public.news
  FOR SELECT
  USING (status = 'published' AND is_published = TRUE);

-- Authenticated kullanıcılar yorum yapabilir
CREATE POLICY "Authenticated users can insert comments" ON public.comments
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Herkes onaylanmış yorumları okuyabilir
CREATE POLICY "Public can read approved comments" ON public.comments
  FOR SELECT
  USING (status = 'approved' OR is_approved = TRUE);

-- Kullanıcılar kendi yorumlarını güncelleyebilir
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ADMINS TABLOSU RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi admin kayıtlarını görebilir
CREATE POLICY "Admins can read self" ON public.admins
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role admin ekleyebilir
CREATE POLICY "Service role can manage admins" ON public.admins
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- IMAGES TABLOSU RLS
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Herkes resimleri okuyabilir
CREATE POLICY "Public can read images" ON public.images
  FOR SELECT
  USING (TRUE);

-- Authenticated kullanıcılar resim ekleyebilir
CREATE POLICY "Authenticated users can insert images" ON public.images
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

---

## 4. ENVIRONMENT VARIABLES

### Adım 4.1: .env.local Dosyası Oluşturma
Proje kök dizininde `.env.local` dosyası oluşturun:

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# Linux/Mac
touch .env.local
```

### Adım 4.2: Environment Variables Ekleme
`.env.local` dosyasını açın ve aşağıdaki içeriği ekleyin:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site Configuration (Opsiyonel)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**ÖNEMLİ:**
- `xxxxx` yerine Supabase Project URL'inizi yazın
- `eyJhbGci...` yerine Supabase anon key'inizi yazın
- Bu dosyayı `.gitignore`'a ekleyin (zaten ekli olmalı)

---

## 5. PROJE BAĞIMLILIKLARI

### Adım 5.1: Projeyi Klonlama (Eğer Git'ten alıyorsanız)
```bash
git clone <repository-url>
cd dikilihaber.com
```

### Adım 5.2: Bağımlılıkları Yükleme
```bash
npm install
```

Bu işlem 2-5 dakika sürebilir. Tüm paketler yüklendiğinde `node_modules` klasörü oluşacak.

---

## 6. ADMIN KULLANICI OLUŞTURMA

### Adım 6.1: İlk Kullanıcı Kaydı
1. Projeyi çalıştırın (Adım 7'ye bakın)
2. Tarayıcıda `http://localhost:3000/auth/register` adresine gidin
3. Email ve şifre ile kayıt olun
4. Email doğrulaması için Supabase Dashboard > Authentication > Users bölümünden email'i verify edin

### Adım 6.2: Admin Olarak İşaretleme

**Yöntem 1: SQL Editor ile (Önerilen)**

Supabase Dashboard > SQL Editor'a gidin ve aşağıdaki SQL'i çalıştırın:

```sql
-- Email adresinizi değiştirin!
INSERT INTO public.admins (user_id, email, role)
SELECT 
  id as user_id,
  email,
  'admin' as role
FROM auth.users
WHERE email = 'dikilihaberr@gmail.com'  -- BURAYA KENDİ EMAİL'İNİZİ YAZIN
ON CONFLICT (user_id) DO UPDATE 
SET 
  role = 'admin',
  email = EXCLUDED.email;
```

**Yöntem 2: SETUP_ADMIN.sql Dosyasını Kullanma**

1. `SETUP_ADMIN.sql` dosyasını açın
2. 45. satırdaki email adresini kendi email'inizle değiştirin
3. SQL Editor'a yapıştırıp çalıştırın

### Adım 6.3: Admin Kontrolü
```sql
-- Admin listesini kontrol edin
SELECT 
  a.user_id,
  a.email,
  a.role,
  u.email as auth_email
FROM public.admins a
LEFT JOIN auth.users u ON a.user_id = u.id;
```

---

## 7. PROJEYI ÇALIŞTIRMA

### Adım 7.1: Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```

### Adım 7.2: Tarayıcıda Açma
Tarayıcıda şu adrese gidin:
```
http://localhost:3000
```

Eğer port 3000 kullanılıyorsa, terminal'de farklı bir port gösterilecektir (örn: `http://localhost:3001`)

---

## 8. İLK TEST

### Test 1: Ana Sayfa
- ✅ `http://localhost:3000` açılıyor mu?
- ✅ "Henüz haber yok" mesajı görünüyor mu?

### Test 2: Kayıt ve Giriş
- ✅ `http://localhost:3000/auth/register` ile kayıt olabiliyor musunuz?
- ✅ `http://localhost:3000/auth/login` ile giriş yapabiliyor musunuz?

### Test 3: Admin Paneli
- ✅ Giriş yaptıktan sonra `http://localhost:3000/admin` erişebiliyor musunuz?
- ✅ Admin dashboard görünüyor mu?

### Test 4: İlk Haber Ekleme
1. Admin panelinde "Yeni Haber" butonuna tıklayın
2. Formu doldurun:
   - **Başlık**: Test Haberi
   - **Kategori**: Gündem
   - **İçerik**: Bu bir test haberidir.
   - **Yayınla** butonuna tıklayın
3. Ana sayfada haber görünüyor mu?

---

## 9. SORUN GIDerme

### Sorun 1: "Supabase client not initialized"
**Çözüm:**
- `.env.local` dosyasının doğru yerde olduğundan emin olun (proje kök dizini)
- Environment variables'ların doğru yazıldığından emin olun
- Sunucuyu yeniden başlatın (`Ctrl+C` sonra `npm run dev`)

### Sorun 2: "admins table does not exist"
**Çözüm:**
- Adım 3.2'deki SQL'i çalıştırdığınızdan emin olun
- Supabase Dashboard > Table Editor'da `admins` tablosunun olduğunu kontrol edin

### Sorun 3: "RLS infinite recursion detected"
**Çözüm:**
- `FIX_RLS_RECURSION.sql` dosyasını SQL Editor'da çalıştırın
- Veya Adım 3.3'teki RLS politikalarını tekrar çalıştırın

### Sorun 4: "Cannot read property 'map' of undefined"
**Çözüm:**
- Database'de haber var mı kontrol edin
- Supabase bağlantısını kontrol edin
- Browser console'da hata var mı bakın

### Sorun 5: Port 3000 kullanılıyor
**Çözüm:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Sorun 6: npm install hataları
**Çözüm:**
```bash
# Cache temizleme
npm cache clean --force

# node_modules ve package-lock.json silme
rm -rf node_modules package-lock.json  # Linux/Mac
rmdir /s node_modules & del package-lock.json  # Windows

# Yeniden yükleme
npm install
```

---

## 📝 SONRAKI ADIMLAR

### Storage Kurulumu (Resim Yükleme İçin)
1. Supabase Dashboard > Storage
2. "Create a new bucket" > `news-images` oluşturun
3. Public bucket olarak ayarlayın
4. Policies ekleyin:
   - Public read access
   - Authenticated write access

### Production Deployment
1. [Vercel](https://vercel.com) hesabı oluşturun
2. GitHub repo'yu bağlayın
3. Environment variables'ları ekleyin
4. Deploy edin

---

## ✅ KURULUM KONTROL LİSTESİ

- [ ] Node.js ve npm yüklü
- [ ] Supabase hesabı oluşturuldu
- [ ] Supabase projesi oluşturuldu
- [ ] Database schema çalıştırıldı
- [ ] RLS politikaları eklendi
- [ ] `.env.local` dosyası oluşturuldu
- [ ] Environment variables eklendi
- [ ] `npm install` başarılı
- [ ] İlk kullanıcı kaydedildi
- [ ] Admin olarak işaretlendi
- [ ] `npm run dev` çalışıyor
- [ ] Ana sayfa açılıyor
- [ ] Admin paneli erişilebilir
- [ ] İlk haber eklendi

---

## 🆘 YARDIM

Sorun yaşıyorsanız:
1. Browser Console'u kontrol edin (F12)
2. Terminal'deki hata mesajlarını okuyun
3. Supabase Dashboard > Logs bölümünü kontrol edin
4. GitHub Issues'da benzer sorunları arayın

---

**🎉 Kurulum tamamlandı! İyi çalışmalar!**
