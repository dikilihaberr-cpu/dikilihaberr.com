# Haber Girememe Sorunu – Kontrol Listesi

Site ayağa kalktı ama "Yayınla" dediğinizde haber kaydedilmiyorsa aşağıdakileri sırayla kontrol edin.

---

## 1. Hata mesajını okuyun

Artık hata oluştuğunda **kırmızı toast** ile gerçek sebep gösteriliyor. Örnekler:

- **"Oturum bulunamadı. Tekrar giriş yapıp deneyin."** → Bölüm 2
- **"Admin yetkisi yok veya oturum geçersiz."** → Bölüm 3
- **"column ... does not exist"** veya **"Supabase'te DATABASE_MIGRATION..."** → Bölüm 4
- **"İçerik en az 50 karakter olmalı."** → İçerik alanını uzatın
- **"Başlık 5–200 karakter olmalı."** → Başlığı düzeltin

---

## 2. Oturum (Session) – "Oturum bulunamadı"

- Canlı sitede (www.dikilihaber.net) **tekrar giriş yapın**: Çıkış → Giriş.
- Supabase Dashboard → **Authentication** → **URL Configuration**:
  - **Site URL:** `https://www.dikilihaber.net` (veya kullandığınız domain)
  - **Redirect URLs:** Şunları ekleyin:
    - `https://www.dikilihaber.net/**`
    - `https://www.dikilihaber.net/auth/callback`
    - Vercel URL’iniz: `https://dikilihabercom-git-main-....vercel.app/**`
- Kaydedin ve tekrar deneyin.

---

## 3. Admin yetkisi – "Admin yetkisi yok"

- Supabase’te **admins** tablosunda kullanıcınız olmalı.
- Supabase → **Table Editor** → **admins** → Giriş yaptığınız kullanıcının `user_id`’si bir satırda olmalı.
- Yoksa Supabase SQL Editor’da (e-posta yerine kendi user_id’nizi yazın):

```sql
-- Önce auth.users'dan user_id'nizi bulun (email ile)
-- Sonra:
INSERT INTO public.admins (user_id, role, email)
VALUES ('BURAYA-USER-UUID', 'admin', 'sizin@email.com')
ON CONFLICT (user_id) DO NOTHING;
```

---

## 4. Veritabanı sütunları – "column does not exist"

Hata mesajında **is_trending** veya **is_daily_news** geçiyorsa, migration henüz çalışmamıştır.

**Yapılacak:** Supabase → **SQL Editor** → **New query** → Aşağıdaki dosyanın içeriğini yapıştırıp **Run**:

Dosya: **`DATABASE_MIGRATION_TRENDING_DAILY.sql`**

İçeriği özetle:

- `news` tablosuna `is_trending` ve `is_daily_news` sütunları eklenir.
- Bu migration’ı bir kez çalıştırdıktan sonra haber ekleme tekrar denenecek.

---

## 5. Vercel ortam değişkenleri

Vercel → Proje → **Settings** → **Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase proje URL’i
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key
- `NEXT_PUBLIC_SITE_URL` – Canlı site adresi (örn. `https://www.dikilihaber.net`)

Bunlar **Production** (ve isterseniz Preview) için tanımlı olmalı. Değiştirdiyseniz **Redeploy** yapın.

---

## 6. Özet akış

1. Hata mesajını oku (toast).
2. "Oturum bulunamadı" → Supabase URL/Redirect + tekrar giriş.
3. "Admin yetkisi yok" → `admins` tablosuna kullanıcı ekle.
4. "column ... does not exist" → `DATABASE_MIGRATION_TRENDING_DAILY.sql` çalıştır.
5. Ortam değişkenleri doğru ve redeploy yapılmış olsun.

Bu adımlardan sonra hâlâ haber giremiyorsanız, gördüğünüz **tam hata metnini** (toast veya tarayıcı konsolu) paylaşın.
