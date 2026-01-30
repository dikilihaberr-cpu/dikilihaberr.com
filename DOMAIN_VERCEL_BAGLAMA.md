# www.dikilihaber.net → Vercel Bağlama (Basit Adımlar)

Güncel arayüzlere göre (Vercel + Türk Ticaret Net 2025–2026).

---

## ADIM 1: Vercel’de domain ekle

1. **vercel.com** → Giriş yap.
2. Projeni aç (**dikilihaberr.com**).
3. Üstte **Settings** sekmesine tıkla.
4. Solda **Domains** menüsüne tıkla.
5. **Add** (veya **Add Domain**) butonuna tıkla.
6. Kutuya **www.dikilihaber.net** yaz → **Add**.
7. İstersen aynı şekilde **dikilihaber.net** (www’suz) de ekle.
8. Eklediğin her domain için Vercel ekranda **ne yapman gerektiğini** yazar:
   - **dikilihaber.net** için: **A** kaydı + bir **IP adresi** (örn. `76.76.21.21`)
   - **www.dikilihaber.net** için: **CNAME** kaydı + bir **hedef adres** (örn. `cname.vercel-dns.com` veya `xxx.vercel-dns-xxx.com`)

Bu ekrandaki **IP** ve **hedef adresi** bir yere not et; Türk Ticaret Net’te bunları gireceksin.

---

## ADIM 2: Türk Ticaret Net’e gir

1. **turkticaret.net** → **Giriş yap** (sağ üst).
2. Menüden: **Domain İşlemleri** → **Domain Yönetimi**.
3. **dikilihaber.net** satırında **Yönet** butonuna tıkla.
4. Açılan sayfada **DNS Pro** kutusuna / butonuna tıkla.
5. “Kayıt Oluştur” bölümüne geç.

---

## ADIM 3: www için CNAME kaydı (önemli)

**www.dikilihaber.net** açıldığında sitenin gelmesi için:

1. **Tür:** **CNAME** seç.
2. **Ad:** `www` yaz (sadece www).
3. **Veri:** Vercel’in verdiği hedef adresi yapıştır.  
   (Genelde `cname.vercel-dns.com` veya `xxxx.vercel-dns-017.com` gibi bir şey; Vercel ekranındakini aynen kopyala.)
4. **Kayıt oluştur** butonuna tıkla.

---

## ADIM 4: dikilihaber.net (www’suz) için A kaydı

**dikilihaber.net** de açılsın istiyorsan:

1. **Tür:** **A** seç.
2. **Ad:** `@` yaz (veya alan boşsa @ işareti).
3. **Veri:** Vercel’in verdiği IP’yi yaz (çoğu zaman **76.76.21.21**).
4. **Kayıt oluştur** butonuna tıkla.

---

## ADIM 5: Bekle ve kontrol et

- DNS 15–30 dakika (bazen 1–2 saat) içinde güncellenir.
- Vercel’de **Settings → Domains** sayfasında domain’in yanında **Verified** yazana kadar bekleyebilir veya **Refresh** deneyebilirsin.
- Tarayıcıda **https://www.dikilihaber.net** yaz; siten Vercel’deki site olarak açılmalı.

---

## Kısa özet

| Nerede        | Ne yapıyorsun |
|---------------|----------------|
| **Vercel**    | Domain ekle (www.dikilihaber.net + istenirse dikilihaber.net), ekrandaki **IP** ve **CNAME hedefini** not al. |
| **Türk Ticaret Net** | **DNS Pro** → CNAME: Ad=`www`, Veri=Vercel’in CNAME adresi → **Kayıt oluştur**. |
| **Türk Ticaret Net** | **DNS Pro** → A: Ad=`@`, Veri=Vercel’in IP’si (örn. 76.76.21.21) → **Kayıt oluştur**. |

Değerleri her zaman **Vercel → Settings → Domains** ekranında yazanlardan al; IP veya CNAME adresi projeye göre değişebilir.

---

## SORUN: "Biri verified geldi, diğeri eski site açılıyor"

**Ne oluyor?**  
- **www.dikilihaber.net** → Vercel’de **Valid Configuration** (yeşil), yeni site açılıyor.  
- **dikilihaber.net** (www’suz) → Vercel’de **Invalid Configuration** (kırmızı), tarayıcıda hâlâ eski site açılıyor.

**Sebep:** Türk Ticaret Net’te **dikilihaber.net** (kök domain) için A kaydı **eski sunucunun IP’sine** (31.186.11.164) işaret ediyor. Vercel’in istediği IP değil.

**Ne yapacaksın (Türk Ticaret Net):**

1. **turkticaret.net** → Giriş → **Domain İşlemleri** → **DNS Yönetimi** (veya **DNS Pro**) → **dikilihaber.net**.
2. **Oluşturulan Kayıtlar** tablosunda **A** kaydını bul: **Ad** = `@` (veya boş), **Veriler** = **31.186.11.164**.
3. Bu kaydın yanındaki **Düzenle** butonuna tıkla.
4. **Veri** alanını **31.186.11.164** yerine **216.198.79.1** yap (Vercel’in verdiği IP; Vercel ekranında farklı yazıyorsa onu kullan).
5. **Kaydet** de.
6. (İstersen eski A kaydını **Kaldır** deyip yeni A kaydı **Oluştur**: Tür=A, Ad=@, Veri=**216.198.79.1**.)

**Vercel’de ne yazıyorsa onu yap:**  
Vercel → **Domains** → **dikilihaber.net** → "Remove the conflicting DNS record: **A, @, 31.186.11.164**" ve "set: **A, @, 216.198.79.1**" diyorsa, Türk Ticaret Net’te tam olarak bunu uygula.

**Bekleme:** DNS 15–60 dakika (TTL 3600 ise 1 saat) içinde güncellenir. Sonra hem **dikilihaber.net** hem **www.dikilihaber.net** yeni siteyi gösterecek.

**Şu an yeni siteyi görmek için:** Adres çubuğuna **https://www.dikilihaber.net** yaz; www’lu adres zaten Vercel’e gidiyor.
