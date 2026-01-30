# GitHub'a Push ve Nasıl Denersiniz

## 1. GitHub'a push etmek

Proje klasöründe terminal açıp sırayla:

```bash
# Tüm değişiklikleri stage'e al
git add .

# Commit (açıklama ile)
git commit -m "ESLint 9 + flat config, npm deprecated uyarıları azaltma, Next 16 proxy"

# GitHub'a gönder (branch adınız genelde main veya master)
git push origin main
```

Branch adınız farklıysa (`master` vb.) şöyle kullanın:

```bash
git push origin master
```

Branch adını görmek için:

```bash
git branch
```

---

## 2. Yerelde denemek (push etmeden önce)

```bash
# Bağımlılıklar
npm install

# Derleme
npm run build

# Lint
npx eslint . --max-warnings 0
```

Build ve lint hatasız biterse push edebilirsiniz.

---

## 3. Push sonrası (Vercel kullanıyorsanız)

- Repo Vercel’e bağlıysa push ile birlikte yeni dağıtım otomatik başlar.
- Vercel Dashboard → **Deployments** bölümünden son deployment’ı izleyin.
- Başarılı olunca site adresinizden (örn. `https://xxx.vercel.app`) canlıyı test edin.

---

## 4. Özet: Yapılan değişiklikler

- **ESLint 9** + flat config (`eslint.config.mjs`), `.eslintrc.json` kaldırıldı.
- **rimraf** `package.json` overrides ile 5.x’e çekildi (deprecated uyarısı azaltıldı).
- **Next 16**: `middleware.ts` → `proxy.ts` (Next 16 uyumu).
- TypeScript / React düzeltmeleri (JSX.Element, Zod, Suspense vb.).

Bu adımlarla önce yerelde `npm run build` ve `npx eslint .` çalıştırıp sonra `git add .` → `git commit` → `git push` yaparak hem GitHub’a push edebilir hem de Vercel üzerinde deneyebilirsiniz.
