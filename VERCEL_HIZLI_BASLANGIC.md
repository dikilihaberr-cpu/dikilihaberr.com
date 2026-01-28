# ⚡ VERCEL HIZLI BAŞLANGIÇ - 5 DAKİKADA DEPLOY

## 🎯 ÖNEMLİ: Domain Uzantınız Aynı Kalacak!

**Evet!** `dikilihaber.com` → Vercel'de de `dikilihaber.com` olarak çalışacak.
Sadece DNS ayarlarını yapacağız, domain uzantısı değişmeyecek.

---

## 📝 HIZLI ADIMLAR

### 1️⃣ GitHub'a Yükle (2 dakika)
```bash
cd "C:\Users\TURPA ATERNA\OneDrive\Documentos\GitHub\dikilihaber.com"
git init
git add .
git commit -m "Vercel'e hazır"
git remote add origin https://github.com/KULLANICI_ADINIZ/dikilihaber.git
git push -u origin main
```

### 2️⃣ Vercel'e Giriş Yap (1 dakika)
- https://vercel.com → GitHub ile giriş yap

### 3️⃣ Proje Ekle (1 dakika)
- "Add New..." → "Project"
- GitHub repo'nuzu seçin → "Import"

### 4️⃣ Environment Variables Ekle (2 dakika)
**3 tane ekleyin:**

1. `NEXT_PUBLIC_SUPABASE_URL` = Supabase URL'niz
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase anon key'iniz  
3. `NEXT_PUBLIC_SITE_URL` = `https://dikilihaber.com`

**Hepsi için:** Production ✅ Preview ✅ Development ✅

### 5️⃣ Deploy Et (2 dakika)
- "Deploy" butonuna tıkla
- 2-5 dakika bekle
- ✅ Site hazır!

### 6️⃣ Domain Bağla (5 dakika)
**Vercel'de:**
- Settings → Domains → Add Domain → `dikilihaber.com`

**Türk Ticaret.net'te:**
- DNS Yönetimi → A kaydı ekle (@ → Vercel IP)
- DNS Yönetimi → CNAME ekle (www → Vercel CNAME)

**15-30 dakika bekle → ✅ Hazır!**

---

## 🎉 TOPLAM SÜRE: ~15 DAKİKA

Detaylı rehber için: `VERCEL_DEPLOYMENT_ADIM_ADIM.md`
