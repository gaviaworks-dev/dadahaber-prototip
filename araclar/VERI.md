# Örnek veri sözlüğü

`araclar/ornek_veri.json` prototipteki bütün örnek içeriğin tek kaynağıdır. Yeni sayfa üretilirken başlık, yazar, tarih, saat, görüntülenme, piyasa, hava ve puan değerleri buradan alınır. Elle yeni değer yazılmaz.

## İçerik

| Anahtar | Ne |
|---|---|
| `simdi` | Sitenin anı: 23 Kasım 2026 Pazartesi 16.05 (Europe/Istanbul). Hiçbir yayın, okunma ya da bildirim bundan sonra olamaz. |
| `yazarlar` | 36 imza. Her yazarın tek unvanı ve tek alanı var (bölüm başına 4, köşe yazarları 4). `dizin`: yazar dizinindeki sıra. |
| `eski_imzalar` | Ayıklanan benzer adlar ve bunların karşılığı (Mert Yalçın → Mert Yalın gibi). |
| `haberler` | Sitede geçen her başlık tek kayıttır: `id`, `baslik`, `esdeger` (aynı hikâyenin başka yazılışları), `bolum`, `alt_konu`, `yazar` (bölümün yazarlarından), `tarih`, `saat`, `goruntulenme`, `sure`, `detay`. |
| `son_dakika` | Şerit (`parcalar/son-dakika.html`) ve `son-dakika.html` bu listeden üretilir. |
| `piyasa` | Tek piyasa verisi. Vitrinlerde kur ve altın satış fiyatıyla gösterilir, yanında "satış" etiketi bulunur. |
| `hava` | İstanbul'un anlık durumu, 6 günlük tahmini ve saatlik tablosu. Ana sayfa ve `hava-durumu.html` bu veriyi gösterir. |
| `puan_tablosu` | Süper Lig'de 13 hafta oynandı. İç ve dış saha ayrımı da burada. Kurallar: ΣG = ΣM, ΣB çift, P = 3G + B. |
| `kategori_adlari` | Çip ve etiketlerde menüde olmayan bir ad geçerse menüdeki karşılığı kullanılır (Ekonomi → Finans gibi). |
| `gecisler` | Bir kez uygulanan, hedefli metin düzeltmeleri (eski → yeni). Yeni metin eskisini içermez. |
| `yakinda` | Henüz yayımlanmamış öğeler. Örnek: 18.00 Akşam bülteni; bu öğeler "Yakında" diye gösterilir. |

## Betik

```
python3 -I araclar/veri_uygula.py <kök>                   # sayfalara uygular, sonunda doğrulamayı çalıştırır
python3 -I araclar/veri_uygula.py <kök> --kontrol         # dosyaya yazmaz; değişecek dosyaları ve doğrulamayı raporlar
python3 -I araclar/veri_uygula.py <kök> --parca           # ek olarak son dakika şeridini ve footer bildirim saatlerini üretir (lead)
python3 -I araclar/veri_uygula.py <kök> --dogrula         # yalnızca tutarlılık doğrulaması (sorun varsa çıkış kodu 1)
python3 -I araclar/veri_uygula.py <kök> --sozluk-tamamla  # sitede geçip sözlükte bulunmayan başlıkları sözlüğe ekler
```

- Betik idempotenttir; ikinci çalıştırmada hiçbir dosya değişmez.
- Betik yalnızca veri alanlarını değiştirir: bilgi satırı, imza, detay künyesi, unvan, zaman listeleri, piyasa, hava, puan tablosu ve `gecisler`. Bağlantı hedeflerine, sayfalamaya, sayfa yoluna, menüye ve `<!--P:...-->` ortak parçalarına dokunmaz.
- `--parca` ile parça dosyaları değişirse sayfalara yaymak için ardından `python3 -I araclar/parca.py` çalıştırılır.
- Yeni sayfada sözlükte olmayan bir başlık varsa önce `--sozluk-tamamla`, sonra uygulama çalıştırılır. Tamamlama, yeni başlığı bölümün yazarlarından birine bağlar ve tarih ile saati sayfadaki ipuçlarından alır.
- Doğrulama şunlara bakar: aynı başlık her yerde aynı yazar, tarih ve görüntülenmeyle geçiyor mu; yayın saati şimdiden önce mi; yazar kendi bölümünde mi; son dakika listesi ile şerit uyuşuyor mu; borsa 18.00'den önce "kapanmış" görünüyor mu; piyasa değeri tek mi; iki hava kutusu aynı mı; puan tablosunun toplamları tutuyor mu; detay künyesi sözlükle aynı mı; zaman akışında saati gelmemiş bir öğe var mı.
