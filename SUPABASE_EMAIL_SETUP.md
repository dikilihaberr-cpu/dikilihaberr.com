# Supabase E-posta Ayarları Rehberi

## Sorun: E-posta Doğrulama Kodu Gelmiyor

E-posta doğrulama kodunun gelmemesinin birkaç nedeni olabilir. Aşağıdaki adımları kontrol edin:

## 1. Supabase Dashboard Ayarları

### Authentication > Email Templates
1. Supabase Dashboard'a giriş yapın
2. **Authentication** > **Email Templates** bölümüne gidin
3. **Confirm signup** template'inin aktif olduğundan emin olun
4. Template içeriğini kontrol edin

### Authentication > Providers > Email
1. **Authentication** > **Providers** > **Email** bölümüne gidin
2. **Enable email confirmations** seçeneğinin açık olduğundan emin olun
3. **Secure email change** seçeneğini kontrol edin

## 2. Email Provider Ayarları

### Development Modu (Local)
- Development modunda Supabase varsayılan olarak e-posta göndermez
- **Authentication** > **URL Configuration** bölümünde:
  - **Site URL**: `http://localhost:3000` (development için)
  - **Redirect URLs**: `http://localhost:3000/auth/callback` ekleyin

### Production Modu
- Production için bir email provider (SMTP) yapılandırmanız gerekir
- **Project Settings** > **Auth** > **SMTP Settings** bölümünden:
  - Gmail, SendGrid, Mailgun gibi bir provider seçin
  - SMTP bilgilerini girin

## 3. Environment Variables Kontrolü

`.env.local` dosyanızda şunların olduğundan emin olun:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Development için
```

## 4. E-posta Klasörlerini Kontrol Edin

- **Gelen Kutusu**: E-postanızı kontrol edin
- **Spam/Junk Klasörü**: E-posta spam klasörüne düşmüş olabilir
- **Promotions Klasörü**: Gmail kullanıyorsanız Promotions sekmesine bakın

## 5. Test E-posta Gönderimi

Supabase Dashboard'da:
1. **Authentication** > **Users** bölümüne gidin
2. Test kullanıcısı oluşturun
3. **Send magic link** veya **Resend confirmation email** butonunu kullanın

## 6. Kod Tarafında Kontroller

Kod tarafında yapılan düzeltmeler:
- ✅ `emailRedirectTo` parametresi eklendi
- ✅ Callback route (`/auth/callback`) oluşturuldu
- ✅ Daha detaylı hata mesajları eklendi
- ✅ Success mesajları iyileştirildi

## 7. Hızlı Çözüm (Development için)

Eğer development modunda test ediyorsanız:

1. **Authentication** > **URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

2. **Authentication** > **Providers** > **Email**:
   - **Enable email confirmations**: KAPALI yapın (development için)
   - Bu durumda kullanıcı otomatik olarak giriş yapacaktır

## 8. Production için SMTP Ayarları

Production'da mutlaka bir SMTP provider yapılandırın:

### Gmail SMTP (Örnek)
```
Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: your-app-password
```

### SendGrid (Önerilen)
1. SendGrid hesabı oluşturun
2. API Key oluşturun
3. Supabase Dashboard'da SMTP ayarlarına girin

## Sorun Devam Ederse

1. Supabase Dashboard > **Logs** > **Auth Logs** bölümünden hataları kontrol edin
2. Browser console'da hata mesajlarını kontrol edin
3. Network tab'ında API isteklerini kontrol edin

## İletişim

Sorun devam ederse Supabase support ile iletişime geçin veya proje maintainer'ına bildirin.
