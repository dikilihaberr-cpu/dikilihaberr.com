# DikiliHaber - Professional News Portal

Modern, responsive haber portalı Next.js 15, TypeScript, Tailwind CSS ve Supabase ile geliştirilmiştir.

## 🚀 Özellikler

- ✅ Modern ve responsive tasarım
- ✅ SEO dostu yapı
- ✅ Supabase backend entegrasyonu
- ✅ Admin paneli ile haber yönetimi
- ✅ Çoklu resim/slideshow desteği
- ✅ Kategori bazlı haber listeleme
- ✅ Öne çıkan haberler sistemi
- ✅ Sosyal medya paylaşım butonları

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **UI Components**: Lucide React Icons
- **Deployment**: Vercel/Netlify (önerilen)

## 📋 Kurulum

### 1. Supabase Kurulumu

1. [Supabase](https://supabase.com) hesabınıza giriş yapın
2. Yeni bir proje oluşturun
3. SQL Editor'a gidin ve `supabase-schema.sql` dosyasının içeriğini çalıştırın
4. Settings > API bölümünden Project URL ve anon key'i alın

### 2. Environment Variables

`.env.local` dosyasını oluşturun ve Supabase bilgilerinizi ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Bağımlılıkları Yükleyin

```bash
npm install
```

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Site `http://localhost:3000` adresinde çalışacaktır.

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin paneli
│   ├── news/              # Haber detay sayfaları
│   ├── category/          # Kategori sayfaları
│   └── page.tsx           # Ana sayfa
├── components/            # UI bileşenleri
│   ├── ui/               # Temel UI bileşenleri
│   └── layout/           # Layout bileşenleri
└── lib/                  # Yardımcı fonksiyonlar
    ├── supabase.ts       # Supabase client ve API fonksiyonları
    └── data.ts           # Eski localStorage tabanlı data (kullanılmıyor)
```

## 🔧 Supabase Database Schema

Veritabanı şeması `supabase-schema.sql` dosyasında tanımlanmıştır. Ana tablo: `news`

### News Tablosu Alanları:
- `id`: UUID (Primary Key)
- `title`: Haber başlığı
- `excerpt`: Özet
- `content`: Tam içerik
- `category`: Kategori
- `author`: Yazar
- `featured`: Öne çıkan haber mi?
- `image_url`: Ana resim URL
- `images`: Çoklu resim URL'leri (array)
- `slug`: URL slug (benzersiz)
- `published_at`: Yayın tarihi
- `created_at`: Oluşturulma tarihi
- `updated_at`: Güncellenme tarihi

## 🎨 Admin Paneli

Admin paneline `/admin` adresine giderek erişebilirsiniz.

### Özellikler:
- 📊 Dashboard istatistikleri
- ➕ Yeni haber oluşturma
- ✏️ Haber düzenleme (yakında)
- 🗂️ Kategori yönetimi
- 📸 Çoklu resim yükleme
- ⭐ Öne çıkan haber ayarı

## 🚀 Production Deployment

### Vercel'e Deploy Etme:

1. [Vercel](https://vercel.com) hesabınıza giriş yapın
2. "New Project" oluşturun
3. GitHub repository'nizi bağlayın
4. Environment variables'ları ayarlayın:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy edin

### Netlify'e Deploy Etme:

1. [Netlify](https://netlify.com) hesabınıza giriş yapın
2. Site oluşturun ve GitHub repo'yu bağlayın
3. Environment variables'ları ayarlayın
4. Deploy edin

## 📝 Kullanım

### Haber Ekleme:
1. `/admin` adresine gidin
2. "Yeni Haber" butonuna tıklayın
3. Formu doldurun
4. Birden fazla resim ekleyebilirsiniz
5. "Haber Yayınla" butonuna tıklayın

### Kategoriler:
- Gündem
- Siyaset
- Ekonomi
- Spor
- Magazin
- Teknoloji
- Eğitim
- Kültür
- Çevre

## 🔒 Güvenlik

- Supabase Row Level Security (RLS) aktif
- Public read-only erişim
- Admin işlemleri için authentication gerekli

## 📞 Destek

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.

## 📄 Lisans

Bu proje açık kaynak kodludur ve MIT lisansı altında yayınlanmıştır.
