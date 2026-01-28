# 🚀 VERCEL'E DEPLOY ETME - ADIM ADIM REHBER

**Evet, domain uzantınız aynı kalacak!** 
Örneğin: `dikilihaber.com` → Vercel'de de `dikilihaber.com` olarak çalışacak.

---

## 📋 ADIM 1: GITHUB'A YÜKLEME (Eğer yoksa)

### 1.1 GitHub Hesabı Oluşturun
1. https://github.com adresine gidin
2. "Sign up" butonuna tıklayın
3. E-posta, şifre girin ve hesap oluşturun

### 1.2 Yeni Repository Oluşturun
1. GitHub'a giriş yaptıktan sonra sağ üstteki **"+"** butonuna tıklayın
2. **"New repository"** seçin
3. Repository adı: `dikilihaber` (veya istediğiniz isim)
4. **Public** seçin (ücretsiz için)
5. **"Create repository"** butonuna tıklayın

### 1.3 Projeyi GitHub'a Yükleyin

**Windows'ta Git Bash veya PowerShell açın:**

```bash
# 1. Proje klasörünüze gidin
cd "C:\Users\TURPA ATERNA\OneDrive\Documentos\GitHub\dikilihaber.com"

# 2. Git'i başlatın (eğer daha önce yapmadıysanız)
git init

# 3. Tüm dosyaları ekleyin
git add .

# 4. İlk commit'i yapın
git commit -m "İlk commit - Vercel'e hazır"

# 5. GitHub repository'nizi ekleyin (GitHub'da göreceksiniz)
git remote add origin https://github.com/dikilihaberr-cpu/dikilihaber.git
https://github.com/dikilihaberr-cpu /dikilihaber.git

# 6. GitHub'a yükleyin
git branch -M main
git push -u origin main
```

**Not:** `KULLANICI_ADINIZ` yerine GitHub kullanıcı adınızı yazın.

---

## 📋 ADIM 2: VERCEL HESABI OLUŞTURMA

### 2.1 Vercel'e Gidin
1. https://vercel.com adresine gidin
2. Sağ üstteki **"Sign Up"** butonuna tıklayın

### 2.2 GitHub ile Giriş Yapın
1. **"Continue with GitHub"** butonuna tıklayın
2. GitHub hesabınızla giriş yapın
3. Vercel'in GitHub'a erişim izni isteyecek → **"Authorize Vercel"** tıklayın

---

## 📋 ADIM 3: PROJEYİ VERCEL'E EKLEME

### 3.1 Yeni Proje Oluşturun
1. Vercel dashboard'da **"Add New..."** butonuna tıklayın
2. **"Project"** seçin

### 3.2 GitHub Repository'nizi Seçin
1. GitHub repository'nizi göreceksiniz
2. **"Import"** butonuna tıklayın

### 3.3 Proje Ayarları
1. **Framework Preset:** Otomatik olarak "Next.js" seçili olacak ✅
2. **Root Directory:** Boş bırakın (veya `./` yazın)
3. **Build Command:** `npm run build` (otomatik gelecek)
4. **Output Directory:** `.next` (otomatik gelecek)
5. **Install Command:** `npm install` (otomatik gelecek)

**Şimdilik "Deploy" butonuna BASMAYIN!** Önce environment variables ekleyelim.

---

## 📋 ADIM 4: ENVIRONMENT VARIABLES EKLEME

### 4.1 Environment Variables Bölümüne Gidin
1. Proje ayarlarında **"Environment Variables"** bölümünü bulun
2. Veya "Deploy" butonunun altında göreceksiniz

### 4.2 3 Değişken Ekleyin

**1. İlk Değişken:**
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Supabase dashboard'unuzdan alacağınız URL
  - Örnek: `https://abcdefghijklmnop.supabase.co`
- **Environment:** Production, Preview, Development (hepsini seçin ✅)
- **"Add"** butonuna tıklayın

**2. İkinci Değişken:**
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Supabase dashboard'unuzdan alacağınız anon key
  - Uzun bir string olacak (örn: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
- **Environment:** Production, Preview, Development (hepsini seçin ✅)
- **"Add"** butonuna tıklayın

**3. Üçüncü Değişken:**
- **Name:** `NEXT_PUBLIC_SITE_URL`
- **Value:** Domain'iniz (henüz bağlamadıysanız Vercel'in verdiği URL)
  - Örnek: `https://dikilihaber.com` veya `https://dikilihaber.vercel.app`
- **Environment:** Production, Preview, Development (hepsini seçin ✅)
- **"Add"** butonuna tıklayın

### 4.3 Supabase Bilgilerini Nereden Bulacaksınız?
1. https://supabase.com adresine gidin
2. Projenize giriş yapın
3. Sol menüden **"Settings"** → **"API"** seçin
4. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` için kullanın
5. **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` için kullanın

---

## 📋 ADIM 5: DEPLOY ETME

### 5.1 Deploy Butonuna Tıklayın
1. Tüm environment variables'ları ekledikten sonra
2. Sayfanın altındaki **"Deploy"** butonuna tıklayın

### 5.2 Build İşlemi
- Vercel otomatik olarak:
  1. GitHub'dan kodunuzu çekecek
  2. `npm install` çalıştıracak
  3. `npm run build` çalıştıracak
  4. Siteyi deploy edecek

**Bu işlem 2-5 dakika sürebilir.** ⏳

### 5.3 Başarılı Deploy
- Build tamamlandığında **"Congratulations!"** mesajı göreceksiniz
- Site şu anda şu adreste çalışıyor: `https://dikilihaber-xxxxx.vercel.app`
- Bu geçici bir URL'dir, domain'i bağlayacağız.

---

## 📋 ADIM 6: DOMAIN BAĞLAMA (Türk Ticaret.net Domain)

### 6.1 Vercel'de Domain Ekleme
1. Vercel dashboard'da projenize gidin
2. Üst menüden **"Settings"** sekmesine tıklayın
3. Sol menüden **"Domains"** seçin
4. **"Add Domain"** butonuna tıklayın
5. Domain'inizi yazın: `dikilihaber.com` (veya neyse)
6. **"Add"** butonuna tıklayın

### 6.2 DNS Ayarları
Vercel size DNS ayarlarını gösterecek. Şunları göreceksiniz:

**Örnek:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**ÖNEMLİ:** Bu IP ve CNAME değerleri her projede farklı olabilir! Vercel'de gösterilen değerleri kullanın.

### 6.3 Türk Ticaret.net DNS Ayarları
1. Türk Ticaret.net müşteri panelinize giriş yapın
2. **"Domain Yönetimi"** veya **"DNS Yönetimi"** bölümüne gidin
3. Domain'inizi seçin

**A Kaydı Ekleyin:**
- **Tip:** A
- **Host/Name:** `@` veya boş bırakın
- **Value/IP:** Vercel'den aldığınız IP (örn: `76.76.21.21`)
- **TTL:** 3600 (veya varsayılan)
- **Kaydet**

**CNAME Kaydı Ekleyin:**
- **Tip:** CNAME
- **Host/Name:** `www`
- **Value:** Vercel'den aldığınız CNAME (örn: `cname.vercel-dns.com`)
- **TTL:** 3600 (veya varsayılan)
- **Kaydet**

### 6.4 DNS Yayılması
- DNS değişiklikleri **5 dakika - 48 saat** arasında yayılabilir
- Genellikle **15-30 dakika** içinde çalışır
- Kontrol etmek için: https://dnschecker.org adresine gidin ve domain'inizi kontrol edin

### 6.5 SSL Sertifikası
- Vercel otomatik olarak SSL sertifikası ekler
- Domain bağlandıktan sonra **5-10 dakika** içinde HTTPS aktif olur
- Hiçbir şey yapmanıza gerek yok, otomatik! ✅

---

## 📋 ADIM 7: SUPABASE AYARLARI

### 7.1 Supabase Dashboard'a Gidin
1. https://supabase.com → Projenize girin
2. Sol menüden **"Authentication"** → **"URL Configuration"** seçin

### 7.2 Site URL Güncelleme
- **Site URL:** `https://dikilihaber.com` yazın
- **Redirect URLs:** Şunu ekleyin:
  ```
  https://dikilihaber.com/auth/callback
  ```
- **"Save"** butonuna tıklayın

---

## 📋 ADIM 8: TEST ETME

### 8.1 Site Kontrolü
1. Tarayıcınızda `https://dikilihaber.com` adresine gidin
2. Site açılıyor mu? ✅
3. Haberler görünüyor mu? ✅

### 8.2 Admin Panel Kontrolü
1. `https://dikilihaber.com/admin` adresine gidin
2. Giriş yapabiliyor musunuz? ✅
3. Haber ekleyebiliyor musunuz? ✅

### 8.3 Yorum Sistemi Kontrolü
1. Bir habere gidin
2. Yorum yapabiliyor musunuz? ✅

---

## 🎉 TAMAMLANDI!

Artık siteniz canlıda! 🚀

---

## 🔄 GÜNCELLEME YAPMAK İÇİN

Kodunuzu güncellediğinizde:

1. Değişiklikleri GitHub'a yükleyin:
   ```bash
   git add .
   git commit -m "Güncelleme açıklaması"
   git push
   ```

2. Vercel otomatik olarak:
   - Yeni kodu çekecek
   - Build edecek
   - Deploy edecek
   - **2-5 dakika içinde yeni versiyon canlıda!** ✅

**Hiçbir şey yapmanıza gerek yok, otomatik!**

---

## 🆘 SORUN GİDERME

### Site açılmıyor:
1. DNS ayarlarını kontrol edin (24 saat bekleyin)
2. Vercel dashboard'da "Domains" bölümünde domain durumunu kontrol edin
3. SSL sertifikası hazır mı kontrol edin

### Environment variables çalışmıyor:
1. Vercel dashboard → Settings → Environment Variables
2. Tüm değişkenlerin eklendiğinden emin olun
3. Production, Preview, Development hepsinde olmalı

### Build hatası:
1. Vercel dashboard → Deployments → Hata mesajına bakın
2. Genellikle environment variables eksikliğinden kaynaklanır
3. Local'de `npm run build` çalıştırıp hata var mı kontrol edin

### Domain bağlanmıyor:
1. DNS ayarlarının doğru olduğundan emin olun
2. https://dnschecker.org ile DNS yayılımını kontrol edin
3. Türk Ticaret.net destek ekibine danışın

---

## 📞 YARDIM

Sorun yaşarsanız:
1. Vercel dokümantasyonu: https://vercel.com/docs
2. Vercel Discord: https://vercel.com/discord
3. GitHub Issues: Projenizin GitHub sayfasında

---

**BAŞARILAR! 🎉**
