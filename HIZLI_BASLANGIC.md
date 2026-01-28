# ⚡ HIZLI BAŞLANGIÇ REHBERİ

Bu rehber, deneyimli geliştiriciler için hızlı kurulum adımlarını içerir.

## 🚀 5 Dakikada Kurulum

### 1. Supabase Projesi Oluştur
- [supabase.com](https://supabase.com) > New Project
- Proje adı: `dikilihaber`
- Region seç, şifre belirle

### 2. Database Schema'yı Çalıştır
- Supabase Dashboard > SQL Editor
- `DATABASE_SCHEMA.sql` dosyasının içeriğini yapıştır
- RUN butonuna tıkla

### 3. Environment Variables
Proje kök dizininde `.env.local` oluştur:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Bağımlılıkları Yükle
```bash
npm install
```

### 5. Projeyi Çalıştır
```bash
npm run dev
```

### 6. İlk Kullanıcı ve Admin
1. `http://localhost:3000/auth/register` ile kayıt ol
2. Supabase Dashboard > Authentication > Users > Email verify et
3. SQL Editor'da `SETUP_ADMIN.sql` çalıştır (email'i değiştir!)
4. `http://localhost:3000/admin` ile admin paneline gir

## ✅ Tamamlandı!

Detaylı kurulum için `KURULUM_REHBERI.md` dosyasına bakın.
