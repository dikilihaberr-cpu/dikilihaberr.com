# 📸 Supabase Storage Kurulum Rehberi

Resim yükleme özelliğinin çalışması için Supabase Storage bucket'ını kurmanız gerekiyor.

## 🚀 Adım Adım Kurulum

### 1. Supabase Dashboard'a Giriş
1. [Supabase Dashboard](https://app.supabase.com) adresine gidin
2. Projenizi seçin

### 2. Storage Bucket Oluşturma
1. Sol menüden **Storage** seçin
2. **"Create a new bucket"** butonuna tıklayın
3. Bucket bilgilerini girin:
   - **Name**: `images` (veya istediğiniz isim)
   - **Public bucket**: ✅ **Aktif** (ÖNEMLİ: Resimlerin herkese açık olması için)
4. **"Create bucket"** butonuna tıklayın

### 3. Storage Policies (İzinler) Ayarlama
1. Oluşturduğunuz bucket'a tıklayın
2. **"Policies"** sekmesine gidin
3. **"New Policy"** butonuna tıklayın

#### Policy 1: Herkes Okuyabilir (Public Read)
- **Policy name**: `Public can read images`
- **Allowed operation**: `SELECT`
- **Policy definition**: 
  ```sql
  (bucket_id = 'images'::text)
  ```
- **Save** butonuna tıklayın

#### Policy 2: Authenticated Kullanıcılar Yükleyebilir
- **Policy name**: `Authenticated users can upload`
- **Allowed operation**: `INSERT`
- **Policy definition**:
  ```sql
  (bucket_id = 'images'::text AND auth.role() = 'authenticated'::text)
  ```
- **Save** butonuna tıklayın

#### Policy 3: Authenticated Kullanıcılar Güncelleyebilir
- **Policy name**: `Authenticated users can update`
- **Allowed operation**: `UPDATE`
- **Policy definition**:
  ```sql
  (bucket_id = 'images'::text AND auth.role() = 'authenticated'::text)
  ```
- **Save** butonuna tıklayın

#### Policy 4: Authenticated Kullanıcılar Silebilir
- **Policy name**: `Authenticated users can delete`
- **Allowed operation**: `DELETE`
- **Policy definition**:
  ```sql
  (bucket_id = 'images'::text AND auth.role() = 'authenticated'::text)
  ```
- **Save** butonuna tıklayın

### 4. Alternatif: SQL Editor ile Toplu Policy Ekleme

SQL Editor'a gidin ve aşağıdaki SQL'i çalıştırın:

```sql
-- Storage bucket oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read policy
CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND
  auth.role() = 'authenticated'
);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' AND
  auth.role() = 'authenticated'
);

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' AND
  auth.role() = 'authenticated'
);
```

### 5. Test Etme
1. Admin paneline gidin
2. Yeni haber oluşturun
3. Resim yükleme bölümünde bir resim seçin
4. Resim başarıyla yüklenmeli ve görünmeli

## ⚠️ Sorun Giderme

### Sorun: "Bucket not found"
**Çözüm**: Bucket adının `images` olduğundan emin olun. Farklı bir isim kullandıysanız, `src/lib/supabase.ts` dosyasındaki `uploadImage` fonksiyonunda bucket adını güncelleyin.

### Sorun: "Permission denied"
**Çözüm**: 
1. Bucket'ın **public** olduğundan emin olun
2. Policies'lerin doğru ayarlandığından emin olun
3. Kullanıcının authenticated olduğundan emin olun

### Sorun: "File too large"
**Çözüm**: Supabase Storage'ın ücretsiz planında dosya boyutu limiti 50MB'dır. Daha büyük dosyalar için pro planına geçmeniz gerekebilir.

## ✅ Kurulum Kontrol Listesi

- [ ] Storage bucket oluşturuldu (`images`)
- [ ] Bucket public olarak ayarlandı
- [ ] Public read policy eklendi
- [ ] Authenticated upload policy eklendi
- [ ] Authenticated update policy eklendi
- [ ] Authenticated delete policy eklendi
- [ ] Test resim yükleme başarılı

## 📝 Notlar

- Bucket adı `images` olmalı (veya kodda değiştirilmeli)
- Resimler `news-images/` klasörüne yüklenir
- Yüklenen resimler otomatik olarak public URL alır
- Resimler CDN üzerinden hızlı bir şekilde servis edilir
