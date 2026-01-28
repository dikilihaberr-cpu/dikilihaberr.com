# 🚀 VERCEL İÇİN TALİMATLAR - SADECE BUNLARI YAPIN

## ✅ HER ŞEY HAZIR! Sadece Vercel'de şunları yapın:

---

## 📋 ADIM 1: VERCEL'E GİRİŞ YAPIN

1. https://vercel.com adresine gidin
2. **"Sign Up"** → **"Continue with GitHub"** ile giriş yapın
3. GitHub hesabınızla authorize edin

---

## 📋 ADIM 2: PROJE EKLEYİN

1. Vercel dashboard'da **"Add New..."** butonuna tıklayın
2. **"Project"** seçin
3. GitHub repository'nizi bulun: **`dikilihaberr-cpu/desktop-tutorial`**
4. **"Import"** butonuna tıklayın

**ÖNEMLİ:** Branch'i **"main"** seçtiğinizden emin olun!

---

## 📋 ADIM 3: PROJE AYARLARI (Otomatik gelecek, kontrol edin)

- ✅ **Framework Preset:** Next.js
- ✅ **Root Directory:** Boş bırakın
- ✅ **Build Command:** `npm run build`
- ✅ **Output Directory:** `.next`
- ✅ **Install Command:** `npm install`
- ✅ **Branch:** `main`

**Şimdilik "Deploy" butonuna BASMAYIN!** Önce environment variables ekleyelim.

---

## 📋 ADIM 4: ENVIRONMENT VARIABLES EKLEYİN

**3 tane değişken eklemeniz gerekiyor:**

### 1️⃣ İlk Değişken:
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `.env.local` dosyanızdaki `NEXT_PUBLIC_SUPABASE_URL` değeri
- **Environment:** ✅ Production ✅ Preview ✅ Development (hepsini seçin)
- **"Add"** butonuna tıklayın

### 2️⃣ İkinci Değişken:
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `.env.local` dosyanızdaki `NEXT_PUBLIC_SUPABASE_ANON_KEY` değeri
- **Environment:** ✅ Production ✅ Preview ✅ Development (hepsini seçin)
- **"Add"** butonuna tıklayın

### 3️⃣ Üçüncü Değişken:
- **Name:** `NEXT_PUBLIC_SITE_URL`
- **Value:** Domain'iniz (henüz yoksa `https://dikilihaber.vercel.app` yazın, sonra domain bağlayınca güncellersiniz)
- **Environment:** ✅ Production ✅ Preview ✅ Development (hepsini seçin)
- **"Add"** butonuna tıklayın

---

## 📋 ADIM 5: DEPLOY EDİN

1. Tüm environment variables'ları ekledikten sonra
2. Sayfanın altındaki **"Deploy"** butonuna tıklayın
3. 2-5 dakika bekleyin ⏳
4. ✅ **"Congratulations!"** mesajı göreceksiniz

---

## 📋 ADIM 6: DOMAIN BAĞLAYIN (İsteğe bağlı)

Domain bağlamak isterseniz:

1. Vercel dashboard → Projeniz → **"Settings"** → **"Domains"**
2. **"Add Domain"** → Domain'inizi yazın: `dikilihaber.com`
3. DNS ayarlarını Türk Ticaret.net'te yapın (Vercel size gösterecek)

---

## 🎉 TAMAMLANDI!

Artık siteniz canlıda! 🚀

---

## 📝 NOTLAR

- ✅ Tüm kodlar GitHub'da hazır
- ✅ `vercel.json` dosyası hazır
- ✅ `next.config.js` hazır
- ✅ `package.json` hazır
- ✅ `.env.local` GitHub'a pushlanmadı (güvenlik için doğru)

**Sadece yukarıdaki 6 adımı yapın, başka bir şey yapmanıza gerek yok!**

---

## 🆘 SORUN MU VAR?

Eğer hata alırsanız:
1. Environment variables'ların doğru eklendiğinden emin olun
2. Branch'in "main" olduğundan emin olun
3. `VERCEL_HATA_COZUMU.md` dosyasına bakın
