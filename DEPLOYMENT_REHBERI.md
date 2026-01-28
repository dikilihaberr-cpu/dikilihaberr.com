# 🚀 DEPLOYMENT REHBERİ - Türk Ticaret.net Hosting

## ⚠️ ÖNEMLİ: Next.js Hosting Gereksinimleri

Next.js uygulamanız **Node.js** gerektirir. Türk Ticaret.net hosting'inizin **Node.js desteği** olup olmadığını kontrol etmeniz gerekiyor.

---

## 📋 SEÇENEK 1: Türk Ticaret.net'te Node.js Desteği VARSA

### Adım 1: Hosting Kontrolü
Türk Ticaret.net müşteri panelinizde:
- Node.js versiyonu kontrol edin (18.x veya üzeri olmalı)
- SSH erişimi olup olmadığını kontrol edin
- PM2 veya benzeri process manager olup olmadığını kontrol edin

### Adım 2: Projeyi Hazırlama

```bash
# 1. Projeyi build edin
npm run build

# 2. .env.production dosyası oluşturun
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://dikilihaber.com
```

### Adım 3: FTP/SSH ile Upload

**FTP ile:**
1. `.next` klasörünü upload edin
2. `package.json` ve `package-lock.json` upload edin
3. `node_modules` klasörünü upload edin (veya SSH'de `npm install --production`)
4. `public` klasörünü upload edin
5. `.env.production` dosyasını upload edin

**SSH ile (Önerilen):**
```bash
# 1. Projeyi Git ile clone edin veya FTP ile upload edin
cd /home/username/public_html

# 2. Bağımlılıkları yükleyin
npm install --production

# 3. Build edin
npm run build

# 4. PM2 ile çalıştırın (eğer varsa)
pm2 start npm --name "dikilihaber" -- start
pm2 save
pm2 startup
```

### Adım 4: Domain Ayarları
- Domain'inizi hosting'e bağlayın
- Port 3000'i açık tutun (veya reverse proxy kullanın)

---

## 📋 SEÇENEK 2: Türk Ticaret.net'te Node.js Desteği YOKSA

### ⚠️ UYARI: Bu durumda bazı özellikler çalışmayacak!

Next.js App Router ve Server Components Node.js gerektirir. Static export ile sadece statik sayfalar çalışır.

### Alternatif Çözümler:

#### A) Vercel (ÖNERİLEN - ÜCRETSİZ)
Vercel Next.js'in yaratıcıları tarafından yapılmış ve tamamen ücretsiz:

1. **Vercel Hesabı Oluşturun**
   - https://vercel.com adresine gidin
   - GitHub ile giriş yapın

2. **Projeyi Deploy Edin**
   ```bash
   # Vercel CLI ile
   npm i -g vercel
   vercel
   ```
   
   Veya:
   - Vercel dashboard'dan "New Project"
   - GitHub repo'nuzu bağlayın
   - Environment variables ekleyin
   - Deploy edin

3. **Domain Bağlama**
   - Vercel dashboard > Settings > Domains
   - Türk Ticaret.net'ten aldığınız domain'i ekleyin
   - DNS ayarlarını yapın (Vercel size verecek)

**Avantajları:**
- ✅ Tamamen ücretsiz
- ✅ Otomatik SSL sertifikası
- ✅ CDN dahil
- ✅ Otomatik deploy (Git push ile)
- ✅ Next.js için optimize edilmiş

#### B) Netlify (Alternatif)
1. https://netlify.com adresine gidin
2. GitHub repo'nuzu bağlayın
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Environment variables ekleyin
6. Deploy edin

#### C) DigitalOcean / AWS / Google Cloud (VPS)
Eğer VPS kullanmak isterseniz:
- DigitalOcean Droplet ($6/ay)
- Node.js kurulumu
- PM2 ile process management
- Nginx reverse proxy

---

## 🎯 EN İYİ ÇÖZÜM: Vercel + Türk Ticaret.net Domain

### Neden Vercel?
1. **Ücretsiz**: Tamamen ücretsiz hosting
2. **Hızlı**: Global CDN ile çok hızlı
3. **Kolay**: 5 dakikada deploy
4. **Otomatik**: Git push ile otomatik deploy
5. **SSL**: Otomatik HTTPS sertifikası

### Domain Bağlama Adımları:

1. **Vercel'e Deploy Edin**
   - GitHub repo'nuzu Vercel'e bağlayın
   - Environment variables ekleyin
   - Deploy edin

2. **Türk Ticaret.net DNS Ayarları**
   Türk Ticaret.net DNS panelinizde:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel IP - güncel IP'yi Vercel'den alın)
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Vercel'de Domain Ekle**
   - Vercel Dashboard > Settings > Domains
   - `dikilihaber.com` ekleyin
   - DNS ayarlarını kontrol edin

---

## 📝 DEPLOYMENT CHECKLIST

### Öncesi:
- [ ] `npm run build` başarılı mı?
- [ ] Environment variables hazır mı?
- [ ] Supabase URL'leri production'a güncellendi mi?
- [ ] Domain DNS ayarları yapıldı mı?

### Sonrası:
- [ ] Site açılıyor mu?
- [ ] Haberler görünüyor mu?
- [ ] Admin paneli çalışıyor mu?
- [ ] Resimler yükleniyor mu?
- [ ] Yorum sistemi çalışıyor mu?
- [ ] HTTPS aktif mi?

---

## 🔧 TÜRK TİCARET.NET İÇİN ÖZEL AYARLAR

Eğer Türk Ticaret.net'te Node.js varsa:

### 1. `.htaccess` Dosyası (Apache için)
```apache
RewriteEngine On
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

### 2. PM2 Ecosystem Dosyası
`ecosystem.config.js` oluşturun:
```javascript
module.exports = {
  apps: [{
    name: 'dikilihaber',
    script: 'npm',
    args: 'start',
    cwd: '/home/username/public_html',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### 3. Nginx Reverse Proxy (Eğer varsa)
```nginx
server {
    listen 80;
    server_name dikilihaber.com www.dikilihaber.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🆘 SORUN GİDERME

### Site açılmıyor:
1. Node.js versiyonu kontrol edin: `node -v`
2. Port açık mı kontrol edin
3. PM2 çalışıyor mu: `pm2 list`
4. Logları kontrol edin: `pm2 logs dikilihaber`

### Environment variables çalışmıyor:
- `.env.production` dosyasının doğru yerde olduğundan emin olun
- Değişkenlerin `NEXT_PUBLIC_` ile başladığından emin olun

### Build hatası:
- `npm install` tekrar çalıştırın
- `node_modules` ve `.next` klasörlerini silip yeniden build edin

---

## 💡 ÖNERİ

**En kolay ve güvenilir çözüm:** Vercel kullanın ve Türk Ticaret.net domain'inizi bağlayın. Bu şekilde:
- ✅ Ücretsiz hosting
- ✅ Otomatik SSL
- ✅ Global CDN
- ✅ Kolay yönetim
- ✅ Otomatik deploy

Türk Ticaret.net hosting'iniz sadece domain için kullanılır, hosting Vercel'de olur.

---

## 📞 DESTEK

Sorun yaşarsanız:
1. Türk Ticaret.net destek ekibine Node.js desteği olup olmadığını sorun
2. Vercel dokümantasyonuna bakın: https://vercel.com/docs
3. Next.js deployment guide: https://nextjs.org/docs/deployment
