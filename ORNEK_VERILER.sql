-- ============================================
-- DİKİLİHABER.COM - ÖRNEK VERİLER
-- ============================================
-- Bu dosyayı Supabase SQL Editor'da çalıştırın
-- Siteye örnek haberler, yorumlar ve reklamlar eklenecek

-- ============================================
-- 1. ÖRNEK HABERLER
-- ============================================

INSERT INTO public.news (
  title, excerpt, content, category, author, featured, image_url, images, slug, status, is_published, is_draft, published_at
) VALUES
(
  'Dikili Belediyesi Yeni Park Projesini Açıkladı',
  'Dikili Belediyesi, şehir merkezinde yeni bir park projesi başlatacağını duyurdu. Proje kapsamında 5.000 metrekarelik alanda modern bir park oluşturulacak.',
  'Dikili Belediyesi, şehir merkezinde yeni bir park projesi başlatacağını duyurdu. Belediye Başkanı yaptığı açıklamada, projenin 5.000 metrekarelik alanda modern bir park oluşturulacağını belirtti. Park içerisinde çocuk oyun alanları, yürüyüş yolları, dinlenme alanları ve yeşil alanlar bulunacak. Proje, önümüzdeki ay başlayacak ve 6 ay içinde tamamlanması planlanıyor. Belediye yetkilileri, projenin şehrin sosyal yaşamına önemli katkı sağlayacağını ifade etti.',
  'Gündem',
  'DikiliHaber Editörü',
  true,
  'https://picsum.photos/800/600?random=1',
  ARRAY['https://picsum.photos/800/600?random=2', 'https://picsum.photos/800/600?random=3'],
  'dikili-belediyesi-yeni-park-projesini-acikladi',
  'published',
  true,
  false,
  NOW() - INTERVAL '2 days'
),
(
  'Dikili Sahilinde Temizlik Kampanyası Düzenlendi',
  'Dikili sahillerinde gönüllüler tarafından büyük bir temizlik kampanyası düzenlendi. Kampanyaya yüzlerce vatandaş katıldı.',
  'Dikili sahillerinde gönüllüler tarafından büyük bir temizlik kampanyası düzenlendi. Kampanyaya yüzlerce vatandaş katıldı ve sahillerden tonlarca çöp toplandı. Organizatörler, çevre bilincini artırmak için bu tür etkinliklerin devam edeceğini belirtti. Kampanya sonunda katılımcılara teşekkür belgeleri verildi.',
  'Çevre',
  'DikiliHaber Muhabiri',
  false,
  'https://picsum.photos/800/600?random=4',
  ARRAY[]::TEXT[],
  'dikili-sahilinde-temizlik-kampanyasi-duzenlendi',
  'published',
  true,
  false,
  NOW() - INTERVAL '1 day'
),
(
  'Dikili Tarım Fuarı Bu Yıl Daha Büyük Olacak',
  'Dikili Tarım Fuarı bu yıl daha geniş katılımla gerçekleşecek. Fuara 50''den fazla firma katılacak.',
  'Dikili Tarım Fuarı bu yıl daha geniş katılımla gerçekleşecek. Fuara 50''den fazla firma katılacak ve binlerce ziyaretçi bekleniyor. Fuar, tarım teknolojileri, tohum, gübre ve tarım makineleri gibi konularda zengin içerik sunacak. Organizatörler, fuarın bölge tarımına önemli katkı sağlayacağını ifade etti.',
  'Ekonomi',
  'DikiliHaber Editörü',
  true,
  'https://picsum.photos/800/600?random=5',
  ARRAY['https://picsum.photos/800/600?random=6'],
  'dikili-tarim-fuari-bu-yil-daha-buyuk-olacak',
  'published',
  true,
  false,
  NOW() - INTERVAL '3 hours'
),
(
  'Dikili Spor Kulübü Yeni Sezona Hazır',
  'Dikili Spor Kulübü yeni sezon hazırlıklarına başladı. Takım, bu sezon daha iddialı olmayı hedefliyor.',
  'Dikili Spor Kulübü yeni sezon hazırlıklarına başladı. Takım antrenörü yaptığı açıklamada, bu sezon daha iddialı olmayı hedeflediklerini belirtti. Takım, yeni transferlerle güçlendirildi ve antrenmanlara başladı. Taraftarlar, yeni sezonu heyecanla bekliyor.',
  'Spor',
  'DikiliHaber Spor Muhabiri',
  false,
  'https://picsum.photos/800/600?random=7',
  ARRAY[]::TEXT[],
  'dikili-spor-kulubu-yeni-sezona-hazir',
  'published',
  true,
  false,
  NOW() - INTERVAL '5 hours'
),
(
  'Dikili''de Yeni Teknoloji Merkezi Açıldı',
  'Dikili''de gençlere yönelik yeni bir teknoloji merkezi açıldı. Merkez, kodlama ve teknoloji eğitimleri verecek.',
  'Dikili''de gençlere yönelik yeni bir teknoloji merkezi açıldı. Merkez, kodlama ve teknoloji eğitimleri verecek. Açılış törenine Belediye Başkanı ve çok sayıda davetli katıldı. Merkez, gençlerin teknoloji alanında kendilerini geliştirmelerine olanak sağlayacak.',
  'Teknoloji',
  'DikiliHaber Teknoloji Muhabiri',
  false,
  'https://picsum.photos/800/600?random=8',
  ARRAY[]::TEXT[],
  'dikilide-yeni-teknoloji-merkezi-acildi',
  'published',
  true,
  false,
  NOW() - INTERVAL '6 hours'
),
(
  'Dikili Kültür Sanat Festivali Başladı',
  'Dikili Kültür Sanat Festivali büyük bir coşkuyla başladı. Festival, bir hafta boyunca devam edecek.',
  'Dikili Kültür Sanat Festivali büyük bir coşkuyla başladı. Festival, bir hafta boyunca devam edecek ve çeşitli etkinlikler düzenlenecek. Konserler, tiyatro gösterileri, sergiler ve atölye çalışmaları festival programında yer alıyor. Festival, şehrin kültürel hayatına renk katıyor.',
  'Kültür',
  'DikiliHaber Kültür Editörü',
  true,
  'https://picsum.photos/800/600?random=9',
  ARRAY['https://picsum.photos/800/600?random=10', 'https://picsum.photos/800/600?random=11'],
  'dikili-kultur-sanat-festivali-basladi',
  'published',
  true,
  false,
  NOW() - INTERVAL '1 hour'
);

-- ============================================
-- 2. ÖRNEK REKLAMLAR
-- ============================================

INSERT INTO public.ads (
  title, description, image_url, link_url, position, is_active, start_date, end_date
) VALUES
(
  'Dikili Otel Rezervasyon',
  'Dikili''de konforlu bir tatil için rezervasyon yapın',
  'https://picsum.photos/300/250?random=20',
  'https://example.com/otel',
  'sidebar',
  true,
  NOW(),
  NOW() + INTERVAL '30 days'
),
(
  'Dikili Emlak',
  'Dikili''de ev, arsa ve villa satış/kiralama',
  'https://picsum.photos/300/250?random=21',
  'https://example.com/emlak',
  'sidebar',
  true,
  NOW(),
  NOW() + INTERVAL '60 days'
),
(
  'Dikili Restoran',
  'Lezzetli yemekler ve güzel atmosfer',
  'https://picsum.photos/728/90?random=22',
  'https://example.com/restoran',
  'header',
  true,
  NOW(),
  NOW() + INTERVAL '45 days'
);

-- ============================================
-- 3. KONTROL SORGULARI
-- ============================================

-- Haber sayısını kontrol et
SELECT COUNT(*) as haber_sayisi FROM public.news WHERE is_published = true;

-- Reklam sayısını kontrol et
SELECT COUNT(*) as reklam_sayisi FROM public.ads WHERE is_active = true;

-- Son eklenen haberleri göster
SELECT title, category, published_at 
FROM public.news 
WHERE is_published = true 
ORDER BY published_at DESC 
LIMIT 5;

-- ============================================
-- NOT: Yorumlar için kullanıcıların önce kayıt olması ve giriş yapması gerekiyor
-- ============================================
