# Siteye Güncelleme Atma – Nasıl Yapılır?

Artık site canlıda. Güncelleme atmak için aşağıdaki akışı kullanın.

---

## Kısa Akış (Her Güncellemede)

1. **Kodda değişiklik yap** (bu projede dosyaları düzenle).
2. **GitHub’a gönder** (push).
3. **Vercel otomatik deploy eder** – ekstra bir şey yapmana gerek yok.

---

## Adım Adım

### 1. Değişiklikleri yap

- Projeyi Cursor/VS Code’da aç.
- İstediğin dosyaları düzenle (haber, tasarım, metin, yeni sayfa vb.).
- Değişiklikleri kaydet.

### 2. Terminal’de (proje klasöründe)

```bash
# Tüm değişiklikleri ekle
git add .

# Commit (açıklama yaz)
git commit -m "Ne yaptığını kısaca yaz, örn: ana sayfa metni güncellendi"

# GitHub'a gönder
git push origin main
```

**PowerShell’de** aynı komutlar çalışır. Branch adın `main` değilse (örn. `master`) son satırda `main` yerine onu yaz.

### 3. Vercel tarafı

- Repo Vercel’e bağlı olduğu için **push** yaptığın anda yeni bir **Deployment** başlar.
- **vercel.com** → Projen → **Deployments** sekmesinden ilerlemeyi izleyebilirsin.
- Yeşil tik + **Ready** olunca güncelleme **canlıda** demektir (genelde 1–3 dakika).

### 4. Kontrol

- **https://www.dikilihaber.net** (veya **https://dikilihaber.net**) açıp değişiklikleri kontrol et.
- Bazen tarayıcı cache’i eski sayfayı gösterir; **Ctrl+F5** (veya **Ctrl+Shift+R**) ile sayfayı zorla yenile.

---

## Özet

| Ne yapıyorsun        | Nerede / Nasıl                    |
|---------------------|-----------------------------------|
| Kod değiştir        | Proje klasöründe dosyaları düzenle |
| Değişiklikleri kaydet | `git add .` → `git commit -m "..."` → `git push origin main` |
| Canlıya çıkması     | Vercel otomatik deploy eder       |
| Kontrol             | www.dikilihaber.net aç, gerekirse Ctrl+F5 |

Bundan sonra her güncelleme için bu akışı tekrarlaman yeterli.
