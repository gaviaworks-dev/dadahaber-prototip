# Dada Haber · Sayfa envanteri (yayılım)

Tarih: 2026-11-23 · Kapsam: yalnızca masaüstü (mobil bölümü ayrı; "Dar ekran notu" sütunu o bölümün hazırlığıdır, karar ya da CSS değildir).
Kaynaklar: v2 prototip (dadahaber-view/v2, 110 dosya) · `docs/kaynak/DADAHABER-01-site-haritasi.md` (harita) · `docs/tasarim-kararlari.md` (TK). Ham taramalar: `tasks/envanter/{v2,harita,uyelik-yasal-hata}.md` (üç teammate, lead birleştirdi).

**Kural:** v2 yalnızca içerik ve kapsam referansıdır; görünüm seçilmiş yeni tasarımdan gelir. Dosya adları açılır menü ve footer bağlantılarıyla aynıdır (kökte düz dosya). Rota adları B-06 ile kesinleşecek; şimdiki adlar geçicidir.

**Türeyeceği ekran kısaltmaları:** Ana = `index.html` · Liste A = `dunya.html` · Detay B = `haber-detay.html` · Spor A = `spor.html` · Finans C = `finans.html` · Döviz D1 = `secenekler/finans-doviz-a.html`.
**Karar durumu:** **üretildi** = seçilmiş ekrandan türetilebilir, üretilebilir · **üretildi** (CC seçimi, §4) = Beyar'ın seçimi gerekiyor (neden yazılı) · **üretildi** = kökte var.


## Sonuç · otonom yayılım (2026-11-23, 18.15)

**Kökte 265 sayfa.** Bitiş ölçütleri: (1) envanterin her satırı üretildi ya da aşağıda gerekçesiyle "üretilmedi"; (2) site içi kırık bağlantı **0**; (3) ana sayfadan her sayfaya bağlantıyla ulaşılıyor (erişilemeyen **0**), bütün sayfalar `sayfa-dizini.html`'de (footer'dan bağlı). Kontrol: `python3 -I tasks/araclar/son_kontrol.py <kök>` (style 0, tek h1, başlık seviyesi atlanmıyor, parçalar ortak dosyadan).
Satırlardaki "üretildi (CC seçimi, §4)" ibaresi, şablonun `docs/tasarim-kararlari.md` §4'teki CC kararıyla kurulduğunu gösterir; Beyar gözden geçirecek. Açılır pencereler ve durum bileşenleri ayrı sayfa değil, ortak parça (`parcalar/footer.html`) ve vitrin (`durumlar.html`) olarak üretildi.

**Üretilmeyenler**
| Kalem | Gerekçe |
|---|---|
| Reklam alanları | Beyar yer tutucuları kaldırdı; her kırılımdaki yeri ve boyutu web onayından önce sorulacak (C25). Reklam sayfasındaki ölçü tablosu karar değil. |
| Araya giren tam ekran reklam (v2 dh-rint) | Kırmızı çizgi: açılır pencere ve tam ekran reklam yok. |
| Burçların 11 ayrı detay sayfası, hamilelik haftalarının 40 ayrı sayfası | Kalıp tek örnekle gösterildi (`burc.html`, `hamilelik-hafta.html`); diğer seçimler aynı sayfanın `?secim=` adresine gider (boş bağlantı yok). |
| 78 ilin ayrı yerel haber sayfası | Kalıp İstanbul, Ankara, İzmir ile gösterildi; diğer iller `yerel-haberler.html`'e bağlı. |

## Tamamlama turu ve mobil bölümü (2026-11-23 akşam)

- **Tamamlama turu:** giriş yapılmış hal (üst barda avatar + ad, hesap menüsü, okunmuş/okunmamış bildirim paneli; misafir/üye geçişi sayfalar arasında ve yenilemede korunur), 7 Haber Dinle kategori sayfası (`haber-dinle-dunya/finans/kadin/kampus/savunma/spor/teknoloji.html`), giriş ve üyelik pencere + sayfa halinde Google/Facebook/Apple logolu düğmeler ve dolu formlar, yukarı çık, kenar "Görüş bildir", içeriğe geç, okuma çubuğu, yorum bildir. Sitede `href="#"` **0** (`araclar/baglanti_kurallari.py`). Kökte **272 sayfa**; kırık bağlantı 0, erişilemeyen 0.
- **Mobil bölümü:** bütün sayfalar telefon (<640) ve tablet (640–1024) kurallarını ortak CSS'ten alır (kararlar §2 M1–M12). Yatay taşma taraması (`tasks/araclar/tasma_tara.py`) 272 sayfa × 360/390/768/1024px → **0**. Aşağıdaki "Dar ekran notu" sütunundaki notlar ortak kurallarla karşılandı: ses oynatıcısı (başlık kısalır, hız düğmesi kalır), tablolar (kap içinde kayar), maç/piyasa/hava kutuları (tek satır kayan şerit), görselli açılır menü (dar ekranda çekmece), çok sütunlu düzenler (tablet 2, telefon 1 sütun).
- **Format sayfaları düzeltmesi (Beyar onayı, Dalga 5):** Dakika Dakika artık her anlatımın kendi adresi olan tekil sayfa: `dakika-dakika.html` (Marmara kar, canlı), `dakika-dakika-butce.html` (TBMM bütçe, canlı), `dakika-dakika-zirve.html` (Türkiye–AB, sona erdi; liste hali `canli.html` ve `canli-gundem.html`). Bugün Ne Oldu (tarih şeridi + saatli özet), Güncellenen Haberler ("ne değişti"), Canlı Yayın (yayın akışı, sona erenler), Canlı Gündem (canlı/sona erdi), Gündem Takvimi (süzgeç, takvime ekle), Son Dakika (teyit rozeti). Kökte **274 sayfa**.

## 1 · Bölüm sayfaları (8 ana başlık ve alt kırılımlar)

| Sayfa ya da parça | v2'de karşılığı | Türü (türeyeceği ekran) | Kaynağı | Karar durumu | Dar ekran notu |
|---|---|---|---|---|---|
| Ana sayfa `index.html` | var (index.html) | özel düzen (Ana) | ikisi | **üretildi** | Çok sütunlu bloklar ve raylar yeniden sıralanır. |
| Gündem `gundem.html` | var (gundem.html) | liste türevi (Liste A) | ikisi | **üretildi** · Dalga 1 | Alt menü çipleri yatay kayar. |
| Gündem alt sayfaları (15): siyaset, turkiye, toplum, hukuk, guvenlik, egitim, cevre, afet, yerel-haberler, istanbul, ankara, izmir, ozel-haber, arastirma, gundem-analizi | var (haber-liste.html şablonu) | liste türevi (Liste A) | ikisi | **üretildi** · Dalga 1 | standart |
| 81 İl `81-il.html` | var (iller.html) | özel düzen (il ızgarası) | ikisi | **üretildi** (CC seçimi, §4) · il seçici/ızgara düzeni | SVG ızgara okunmaz; aramalı liste gerekir. |
| Spor `spor.html` | var (spor.html) | özel düzen (Spor A) | ikisi | **üretildi** | Puan durumu + fikstür istiflenir; maç kartları yatay kayar. |
| Spor branş sayfaları (9): futbol, basketbol, voleybol, motor-sporlari, bisiklet, tenis, atletizm, olimpiyatlar, e-spor | var (futbol, basketbol, voleybol, formula1, bisiklet) | özel düzen (Spor A kabuğu + branşa özel bileşen) | ikisi | **üretildi** (CC seçimi, §4) · kural: alt sayfa konuya özel bileşen ister; branş bileşeni seçilmedi | Puan tablosu ve skor satırları. |
| Takım sayfaları (4): galatasaray, fenerbahce, besiktas, trabzonspor | var (takim-*.html, spor-takim-detay.html; iki şablon) | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · takım sayfası düzeni | Fikstür, kadro, istatistik tabloları. |
| Lig sayfaları (2): super-lig, avrupa-ligleri | yok | özel düzen (Spor A kabuğu) | TK menü | **üretildi** (CC seçimi, §4) · branş sayfasıyla birlikte | Puan tablosu. |
| Finans `finans.html` | var (finans.html) | özel düzen (Finans C) | ikisi | **üretildi** | Sekmeler yatay kayar; tablolar sütun gizler. |
| Finans haber konusu alt sayfaları (15): turkiye-ekonomisi, dunya-ekonomisi, bankacilik, kisisel-finans, enflasyon, ekonomi-analizi, is-dunyasi, sirketler, girisimcilik, calisma-hayati, enerji, tarim, sanayi, gayrimenkul, otomotiv | kısmen (ekonomi.html bantları) | liste türevi (Finans C kabuğu) | ikisi | **üretildi** (CC seçimi, §4) · kural "alt sayfada konuya özel bileşen" haber konusu sayfalarında da geçerli mi (ör. Enflasyon'da TÜFE özeti) | standart |
| Kadın `kadin.html` | var (kadin.html) | liste türevi (Liste A) | ikisi | **üretildi** · Dalga 1 | standart |
| Kadın alt sayfaları (14): kadin-gundemi, kadin-haklari, toplumsal-cinsiyet, kadin-ve-hukuk, kadin-ve-calisma-hayati, basari-hikayeleri, kadin-sagligi, anne-ve-cocuk, beslenme, ruh-sagligi, moda, guzellik, ev-ve-yasam, kadin-yazarlar | kısmen (kadin.html blokları) | liste türevi (Liste A) | ikisi | **üretildi** · Dalga 1 | standart |
| Hamilelik `hamilelik.html` + hafta detayı | var (hamilelik.html, hamilelik-detay.html) | özel düzen (hafta seçici, hesaplayıcı) | v2 | **üretildi** (CC seçimi, §4) · hesaplayıcı ve hafta takibi | Hafta seçici ve form. |
| Astroloji `astroloji.html` + burç detayı | var (astroloji.html, burc-detay.html) | özel düzen (burç çarkı) | v2 | **üretildi** (CC seçimi, §4) · B-24 (burç "yapmayalım" listesinde olabilir) | 12'li ızgara. |
| Savunma `savunma.html` | var (savunma.html) | liste türevi (Liste A) | ikisi | **üretildi** · Dalga 1 | standart |
| Savunma alt sayfaları (18): savunma-sanayii, milli-projeler, iha-ve-siha, hava-platformlari, deniz-platformlari, kara-sistemleri, fuze-ve-roket-sistemleri, milli-guvenlik, askeri-operasyonlar, sinir-guvenligi, terorle-mucadele, uluslararasi-guvenlik, nato, savunma-teknolojileri, ihracat-ve-anlasmalar, savunma-analizi, uzman-gorusleri, savunma-videolari | kısmen (nato.html konu sayfası) | liste türevi (Liste A) | ikisi | **üretildi** · Dalga 1 | standart |
| Dünya `dunya.html` | var (dunya.html) | liste (Liste A) | ikisi | **üretildi** | standart |
| Dünya alt sayfaları (14): avrupa, orta-dogu, amerika, asya-pasifik, afrika, balkanlar, kafkasya, turk-dunyasi, diplomasi, kuresel-siyaset, savas-ve-catismalar, goc, uluslararasi-kuruluslar, dunya-analizi | kısmen (dunya.html bölge sekmeleri) | liste türevi (Liste A) | ikisi | **üretildi** · Dalga 1 | standart |
| Kampüs `kampus.html` | yok (v2'de gelecek.html yakın) | liste türevi (Liste A) | harita + TK | **üretildi** · Dalga 1 (B-10 TK'de kapandı) | standart |
| Kampüs alt sayfaları (11): egitim-ve-sinavlar, yks, kpss, ales-ve-yds, universiteler, burslar, yurtlar, ogrenci-topluluklari, staj, kariyer, genclerin-gundemi | kısmen (gelecek.html bantları) | liste türevi (Liste A) | harita + TK | **üretildi** · Dalga 1 | standart |
| Sınav Takvimi `sinav-takvimi.html` | yok | özel düzen (takvim tablosu) | TK menü | **üretildi** (CC seçimi, §4) · takvim düzeni (Ekonomik Takvim ile ortak çözülebilir) | Tablo kart satırına döner. |
| Bölüm haber detayları (7): spor, finans, kadin, savunma, dunya, kampus, kesfet konusu için detay örnekleri | var (spor-detay, savunma-detay, kadin-detay …) | detay türevi (Detay B) | v2 | **üretildi** · Dalga 2 | Eylem şeridi yataya döner. |

## 2 · Format sayfaları (liste ve detay halleri)

| Sayfa ya da parça | v2'de karşılığı | Türü | Kaynağı | Karar durumu | Dar ekran notu |
|---|---|---|---|---|---|
| Son Dakika · liste `son-dakika.html` | var (son-dakika.html) | özel düzen (saatli akış) | ikisi | **üretildi** (CC seçimi, §4) · zaman akışı düzeni | Saat + başlık tek satır; kısaltma. |
| Canlı · liste `canli-yayin.html` ve Canlı Gündem `canli-gundem.html` | var (canli-gundem.html, video.html#canli) | özel düzen (canlı kartları + oynatıcı) | ikisi | **üretildi** (CC seçimi, §4) · canlı yayın kartı ve oynatıcı | Oynatıcı oranı korunur. |
| Canlı · detay (dakika dakika) `dakika-dakika.html` | var (dakika-dakika.html) | detay türevi (Detay B + canlı akış) | ikisi | **üretildi** (CC seçimi, §4) · canlı akış bileşeni | Yeni satırlar üstte; sıçrama yok. |
| Akış (dikey video) `akis.html` | var (dhReels katmanı) | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · geniş ekran hali açık konu; A8 sonu var mı | Telefonda tam ekran. |
| Video · liste `video.html` | var (video.html) | liste türevi (Liste A + video rozetli kart) | ikisi | **üretildi** · Dalga 2 | Raylar yatay kayar. |
| Video · kategori listesi `video-kategori.html` | var (video-kategori-detay.html) | liste türevi (Liste A) | v2 | **üretildi** · Dalga 2 | standart |
| Video · detay `video-detay.html` | var (video-detay.html) | özel düzen (Detay B + oynatıcı) | ikisi | **üretildi** (CC seçimi, §4) · video oynatıcı ve "sıradaki" | Oynatıcı tam genişlik. |
| Podcast · liste `podcast.html` | var (podcast.html) | liste türevi (Liste A + Podcast PC kartı) | ikisi | **üretildi** · Dalga 2 | 2×2 kartlar istiflenir. |
| Podcast · seri/kategori listesi `podcast-kategori.html` | var (podcast-kategori-detay.html) | liste türevi | v2 | **üretildi** · Dalga 2 | standart |
| Podcast · bölüm detayı `podcast-detay.html` | var (podcast-detay.html) | özel düzen (ses oynatıcı) | ikisi | **üretildi** (CC seçimi, §4) · ses oynatıcı | Oynatıcı yapışkan olabilir. |
| Foto Fokus · liste `foto-fokus.html` | var (foto-fokus.html) | liste türevi (Liste A + F3 albüm kartı) | ikisi | **üretildi** · Dalga 2 | standart |
| Foto Fokus · kategori listesi `foto-fokus-kategori.html` | var | liste türevi | v2 | **üretildi** · Dalga 2 | standart |
| Foto Fokus · galeri detayı `foto-fokus-detay.html` | var (dh-gal görüntüleyici) | özel düzen (görüntüleyici) | ikisi | **üretildi** (CC seçimi, §4) · galeri görüntüleyici | Dokunmatik kaydırma, tam ekran. |
| İnfografik · liste `infografik.html` | var | liste türevi (Liste A + T2 kartı) | ikisi | **üretildi** · Dalga 2 (B-13: ayrı format TK'de kullanılıyor) | standart |
| İnfografik · kategori listesi `infografik-kategori.html` | var | liste türevi | v2 | **üretildi** · Dalga 2 | standart |
| İnfografik · detay `infografik-detay.html` | var (dh-gal) | özel düzen (görüntüleyici, galeri ile ortak) | ikisi | **üretildi** (CC seçimi, §4) · görüntüleyici | Yakınlaştırma. |
| Haber Dinle · liste `haber-dinle.html` | var | özel düzen (sesli haber satırı) | ikisi | **üretildi** (CC seçimi, §4) · sesli haber kartı/satırı tasarlanmadı | Ses oynatıcısı. |
| Haber Dinle · kategori listesi | var | liste türevi (Haber Dinle listesinden) | v2 | **üretildi** (CC seçimi, §4) · liste seçimine bağlı | standart |
| Haber Dinle · detay (bülten) `haber-dinle-detay.html` | var | özel düzen (ses oynatıcı + deşifre) | ikisi | **üretildi** (CC seçimi, §4) · podcast oynatıcısıyla ortak | Ses oynatıcısı. |
| Bülten · abonelik sayfası `bulten.html` | yok (footer bloğu var) | özel düzen (seçimli form) | harita + TK | **üretildi** (CC seçimi, §4) · B-14 | Form tek sütun. |
| Bülten · arşiv | yok | liste türevi | harita | **üretildi** (CC seçimi, §4) · B-14 | standart |

## 3 · Keşfet ve altındakiler

| Sayfa ya da parça | v2'de karşılığı | Türü | Kaynağı | Karar durumu | Dar ekran notu |
|---|---|---|---|---|---|
| Keşfet merkezi `kesfet.html` | var (kesfet.html, 18 format) | özel düzen (format ızgarası) | ikisi | **üretildi** (CC seçimi, §4) · merkez düzeni; Anlık'ın Keşfet altında duruşu TK'de "yeniden sorulacak" | 6 sütun akordeona döner. |
| Keşfet konu listeleri · Teknoloji ve bilim (8): teknoloji, yapay-zeka, bilim, uzay, siber-guvenlik, oyun, gelecek, iklim | var (teknoloji, oyun, gelecek) | liste türevi (Liste A) | ikisi | **üretildi** · Dalga 2 (B-05: menüden çıkış TK'de verildi) | standart |
| Keşfet konu listeleri · Sağlık ve yaşam (5): saglik, halk-sagligi, otomobil, seyahat, gastronomi (beslenme ve ruh-sagligi Kadın'da) | var (saglik) | liste türevi (Liste A) | ikisi | **üretildi** · Dalga 2 (gastronomi: B-12 kardeş site bağı) | standart |
| Keşfet konu listeleri · Kültür ve sanat (7): kultur-ve-yasam, sinema, dizi, muzik, kitap, tiyatro, sergi | var (kultur-yasam, haber-liste) | liste türevi (Liste A) | ikisi | **üretildi** · Dalga 2 | standart |
| Anlık · Bugün Ne Oldu? `bugun-ne-oldu.html` | var | liste türevi (Liste A + tarih rayı) | v2 + TK | **üretildi** · Dalga 2 (tarih rayı yerine çip) | Tarih rayı yatay kayar. |
| Anlık · Güncellenen Haberler `guncellenen-haberler.html` | var | liste türevi (Liste A) | v2 + TK | **üretildi** · Dalga 2 | standart |
| Anlık · Gündem Takvimi `gundem-takvimi.html` | var | özel düzen (takvim) | v2 + harita [PRD] | **üretildi** (CC seçimi, §4) · B-25 | Takvim listeye döner. |
| Anlık · Afet ve Acil Durum + son depremler | var (afet-acil-durum.html) | özel düzen (deprem listesi) | v2 + harita [ÖNERİ] | **üretildi** (CC seçimi, §4) · B-25 | Tablo sığmaz. |
| Anlık · Trafik ve Ulaşım | var (trafik-ulasim.html) | özel düzen | v2 + harita | **üretildi** (CC seçimi, §4) · B-25 | Yol tablosu. |
| Dada Özet `dada-ozet.html` | var | özel düzen (derinlik seçici) | ikisi | **üretildi** (CC seçimi, §4) · özet akışı düzeni | Sekmeler. |
| Günün 5'i `gunun-5-i.html` + arşiv | yok (ana sayfa bandı var) | özel düzen | harita + TK | **üretildi** (CC seçimi, §4) · günlük sayfa düzeni | standart |
| Dada Bağlam `dada-baglam.html` (dosya listesi + dosya detayı) | var | özel düzen (kronoloji) | ikisi | **üretildi** (CC seçimi, §4) · zaman çizelgesi | Tek sütun. |
| Dada Doğrula `dada-dogrula.html` (merkez + inceleme detayı) | var | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · B-17, B-19 | Karar etiketi ızgarası. |
| Farklı Bakışlar `farkli-bakislar.html` | var | özel düzen (karşılaştırma) | ikisi | **üretildi** (CC seçimi, §4) · karşılaştırma tablosu | Sütunlar istiflenir. |
| Veri ve Harita `veri-ve-harita.html` | var (veri-harita.html) | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · B-13 | Harita ve tablolar. |
| Sakin Akış `sakin-akis.html` | var | özel düzen (ayarlı akış) | ikisi | **üretildi** (CC seçimi, §4) · akış ve ayar düzeni | standart |
| Bana Etkisi | yok (v2 kesfet#bana-etkisi kartı) | özel düzen | harita | **üretildi** (CC seçimi, §4) · B-14 | standart |
| Yazarlar dizini `yazarlar.html` | var (yazar-liste.html) | liste türevi (Liste A + Yazarlar Y1 kartı) | ikisi | **üretildi** · Dalga 2 (B-05: "Sesler" adı) | Süzgeç şeridi. |
| Arşiv `arsiv.html` | var | özel düzen (tarih seçici) | ikisi | **üretildi** (CC seçimi, §4) · tarih seçici; B-03 | Tarih seçici. |

## 4 · Servis sayfaları

| Sayfa ya da parça | v2'de karşılığı | Türü | Kaynağı | Karar durumu | Dar ekran notu |
|---|---|---|---|---|---|
| Döviz `doviz.html` | var (doviz.html) | özel düzen (Döviz D1, Finans C kabuğu) | ikisi | **üretildi** · Dalga 2 (D1 seçildi) | Kur tablosu ve çevirici istiflenir. |
| Piyasa Ekranı `piyasa-ekrani.html` | var (finans.html piyasalar) | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · genel piyasa tablosu | Sütun gizleme. |
| Altın `altin.html` | var | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · öneri: D1 kalıbı (tablo + araç) | Tablo. |
| Borsa `borsa.html` | var | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · hisse tablosu, grafik dozu | Hisse tablosu yatay kayar. |
| Kripto Para `kripto-para.html` | var (kripto.html) | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · öneri: D1 kalıbı | Tablo + çevirici. |
| Faiz Oranları `faiz-oranlari.html` | var | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · öneri: D1 kalıbı | Tablo. |
| Akaryakıt `akaryakit-fiyatlari.html` | yok (finans bandı) | özel düzen (il seçicili tablo) | harita + TK | **üretildi** (CC seçimi, §4) · öneri: D1 kalıbı | İl seçici + tablo. |
| Ekonomik Takvim `ekonomik-takvim.html` | var | özel düzen (takvim) | ikisi | **üretildi** (CC seçimi, §4) · takvim düzeni | Kart satırına döner. |
| Enstrüman detayı (BIST, kur, altın) | var (finans-detay.html) | detay türevi + grafik | v2 | **üretildi** (CC seçimi, §4) · grafik dozu ("grafikle boğma") | Grafik + geçmiş tablo. |
| Ekonomi araçları (çevirici, hesaplama) | kısmen (kripto çevirici) | özel düzen | harita [ÖNERİ] | **üretildi** (CC seçimi, §4) · B-25 | Form tek sütun. |
| Hava Durumu `hava-durumu.html` | var | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · şehir seçici, 7 gün | 7 gün kutuları yatay kayar. |
| Namaz Vakitleri `namaz-vakitleri.html` | yok (ana sayfa paneli) | özel düzen (ana sayfadaki H3 ayırıcıdan) | harita + TK | **üretildi** (CC seçimi, §4) · aylık tablo | Aylık tablo yatay kayar. |
| Canlı Skor `canli-skor.html` | kısmen (fikstur.html) | özel düzen (Spor A bileşeni büyütülür) | ikisi | **üretildi** (CC seçimi, §4) · tam sayfa skor düzeni | Branş sekmeleri. |
| Puan Durumu `puan-durumu.html` | var | özel düzen (Spor A tablosu) | ikisi | **üretildi** (CC seçimi, §4) · çok ligli tablo sayfası | Sütun önceliği. |
| Fikstür `fikstur.html` | var | özel düzen (hafta seçici) | ikisi | **üretildi** (CC seçimi, §4) · hafta seçici | Hafta seçici. |
| Takımlar dizini `takimlar.html` | var (takim.html) | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · takım ızgarası | standart |
| Transfer `transfer.html` | yok | liste türevi (Spor A kabuğu + transfer bileşeni) | harita | **üretildi** (CC seçimi, §4) · alt sayfa özel bileşen kuralı | standart |
| Millî Takım `milli-takim.html` | yok | liste türevi (Spor A kabuğu) | TK menü | **üretildi** (CC seçimi, §4) · alt sayfa özel bileşen kuralı | standart |
| Maç detayı | yok | özel düzen | harita | **üretildi** (CC seçimi, §4) · maç anlatımı | Skor satırı. |
| Resmî İlanlar (liste + ilan detayı) | var (resmi-ilanlar, resmi-ilan-detay) | liste türevi + detay türevi | ikisi | **üretildi** (CC seçimi, §4) · B-26 | Süzgeç. |

## 5 · Arama, etiket, konu, yazar, arşiv

| Sayfa ya da parça | v2'de karşılığı | Türü | Kaynağı | Karar durumu | Dar ekran notu |
|---|---|---|---|---|---|
| Arama sonuçları `arama.html` | var | özel düzen (tür şeridi + süzgeç) | ikisi | **üretildi** (CC seçimi, §4) · B-16 (Dada'ya Sor ile birleşik kutu) | Süzgeç açılır panele döner. |
| Dada'ya Sor | yok | özel düzen (soru-yanıt) | harita | **üretildi** (CC seçimi, §4) · B-16 | Tam yükseklik. |
| Etiket sayfası `etiket.html` | yok | liste türevi (Liste A) | harita | **üretildi** · Dalga 2 (Takip Et düğmesi B-14'e kadar pasif) | standart |
| Konu / gelişen olay sayfası | kısmen (nato.html) | özel düzen (özet + kronoloji) | harita (A5) | **üretildi** (CC seçimi, §4) · kronoloji | Tek sütun. |
| Kişi / kurum sayfası `kisi.html` | yok | liste türevi (Liste A) | harita | **üretildi** · Dalga 2 | standart |
| Yazar profili `yazar.html` | var (yazar-detay.html) | özel düzen (profil başlığı + yazılar) | ikisi | **üretildi** (CC seçimi, §4) · profil başlığı yeni bileşen | Profil başlığı istiflenir. |
| Köşe yazısı detayı `kose-yazisi.html` | var (yazar-icerik-detay.html) | detay türevi (Detay B, yazar başlığıyla) | ikisi | **üretildi** · Dalga 2 | standart |
| Tüm Kategoriler dizini | var (diger.html) | özel düzen (dizin) | v2 | **üretildi** (CC seçimi, §4) · dizin düzeni (Sayfa Dizini ile ortak) | Tek sütun. |
| Sayfa Dizini `sayfa-dizini.html` | var | özel düzen (metin şablonu) | v2 | **üretildi** (CC seçimi, §4) · metin şablonuyla birlikte | Gruplar açılır. |

## 6 · Üyelik (açılır pencere ve sayfa halleri)

| Sayfa ya da parça | v2'de karşılığı | Türü | Kaynağı | Karar durumu | Dar ekran notu |
|---|---|---|---|---|---|
| Giriş Yap · sayfa `giris.html` | var | özel düzen (form + "Hesapla ne değişir?") | ikisi | **üretildi** (CC seçimi, §4) · B-15, form düzeni | Yan panel alta iner. |
| Giriş Yap · açılır pencere | yok | özel düzen | öneri | **üretildi** (CC seçimi, §4) · B-14, B-15 (sayfa mı pencere mi) | Tam ekran. |
| Üye Ol · sayfa `uye-ol.html` | var | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · B-14, B-15 | Uzun form. |
| Üye Ol · açılır pencere | yok | özel düzen | öneri | **üretildi** (CC seçimi, §4) · B-14, B-15 | Tam ekran. |
| Şifremi unuttum · 3 adım (e-posta, bağlantı gönderildi, yeni şifre) + bağlantı geçersiz | var (yalnız 1. adım) | özel düzen (adımlı form) | v2 | **üretildi** (CC seçimi, §4) · B-15 | Adım göstergesi tek satır. |
| Şifremi unuttum · açılır pencere | yok | özel düzen | öneri | **üretildi** (CC seçimi, §4) · B-15 | Tam ekran. |
| E-posta doğrulama (bekleme, doğrulandı, geçersiz) | yok | özel düzen (durum) | öneri | **üretildi** (CC seçimi, §4) · B-15 | standart |
| Sosyal giriş ara durumları | kısmen | özel düzen | v2 | **üretildi** (CC seçimi, §4) · B-15 | standart |
| Karşılama ve tercih seçimi (ilgi, şehir, takım) | yok | özel düzen | akış A2, A3 | **üretildi** (CC seçimi, §4) · B-14 | Çipler sarar. |
| Giriş yapılmış üst bar + hesap menüsü | yok | ortak parça | harita | **üretildi** (CC seçimi, §4 C29) · B-14 Beyar gözden geçirecek | Alt panel. |

## 7 · Hesabım

| Sayfa ya da parça | v2'de karşılığı | Türü | Kaynağı | Karar durumu | Dar ekran notu |
|---|---|---|---|---|---|
| Hesabım kabuğu (yan menü + panel) | var (hesabim.html, 21 sekme) | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · B-14; harita 8 bölüm, v2 21 sekme: gruplama kararı | Menü yatay şerit ya da seçiciye döner. |
| Genel Bakış · Gündemim | var | özel düzen (Hesabım) | v2 | **üretildi** (CC seçimi, §4) · kabuğa bağlı | Sayı kutuları 2 sütun. |
| Takip ettiklerim: konular, şehirler, takımlar, yazarlar, kişi ve kurumlar | var (4 sekme) + katalog | özel düzen (Hesabım) | ikisi | **üretildi** (CC seçimi, §4) · B-14 | Çipler sarar. |
| Kaydedilenler (klasörlü) | var | özel düzen (Hesabım) | ikisi | **üretildi** (CC seçimi, §4) · B-14 | Klasör çipleri yatay kayar. |
| Okuma geçmişi · İzleme geçmişi · Podcast listem | var | özel düzen (Hesabım) | v2 | **üretildi** (CC seçimi, §4) · kabuğa bağlı | Tablo satır kartına döner. |
| Bildirim ayarları + bildirim merkezi listesi | var (ayar) / yok (liste) | özel düzen (Hesabım) | ikisi | **üretildi** (CC seçimi, §4) · B-04, B-14 | Uzun anahtar listesi. |
| Bültenlerim | var | özel düzen (Hesabım) | ikisi | **üretildi** (CC seçimi, §4) · B-14 | standart |
| Serim ve rozetlerim | yok | özel düzen | harita | **üretildi** (CC seçimi, §4) · B-14 (2. çeyrek) | Rozet ızgarası. |
| Tercihler: ilgi alanları, Bana Etkisi profili | yok | özel düzen | harita | **üretildi** (CC seçimi, §4) · B-14, B-21 | standart |
| Görünüm: yazı boyutu, karanlık mod, Sakin Akış ayarları, dil | var (4 sekme) | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · Görünüm panelinin yeri açık; B-07, B-09 | Yazı büyüyünce düzen bozulmaz. |
| Profil, profil düzenleme, e-posta/şifre değiştirme | var (profil) / yok (düzenleme) | özel düzen (form) | v2 + öneri | **üretildi** (CC seçimi, §4) · B-15 | İki sütunlu form tek sütun. |
| Güvenlik (iki adımlı doğrulama, oturumlar) · bağlı hesaplar | var / yok | özel düzen | v2 + öneri | **üretildi** (CC seçimi, §4) · B-15 | Oturum tablosu satır kartı. |
| Gizlilik ve veriler · verilerimi indir · hesap silme akışı | var (kapalı düğmeler) | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · kabuğa bağlı | Onay adımı tam ekran. |
| Mobil uygulama · Oturumu kapat | var | özel düzen | ikisi | **üretildi** (CC seçimi, §4) · B-04 | standart |
| Girişsiz okur hali (cihaz tercihleri + üye ol çağrısı) | yok | özel düzen | akış A2.4 | **üretildi** (CC seçimi, §4) · B-14 | standart |

## 8 · Kurumsal ve yasal

Hepsi tek bir **metin sayfası şablonundan** türer (yol, h1, giriş, yan içindekiler, bölümler); şablon bir kez seçilir.

| Sayfa ya da parça | v2'de karşılığı | Türü | Kaynağı | Karar durumu | Dar ekran notu |
|---|---|---|---|---|---|
| Hakkımızda `hakkimizda.html` | var | özel düzen (metin şablonu + sayılar) | ikisi + footer | **üretildi** (CC seçimi, §4) · metin şablonu | Sayı kutuları 2 sütun. |
| Künye `kunye.html` | var | metin şablonu | ikisi + footer | **üretildi** (CC seçimi, §4) · metin şablonu | Ekip ızgarası 2 sütun. |
| Yayın İlkeleri `yayin-ilkeleri.html` | var | metin şablonu (yan içindekiler) | ikisi + footer | **üretildi** (CC seçimi, §4) · metin şablonu; B-17, B-28 | İçindekiler başta açılır. |
| Düzeltme Politikası `duzeltme-politikasi.html` (+ düzeltme kayıtları) | yok (yayın ilkeleri bölümü) | metin şablonu | harita + footer | **üretildi** (CC seçimi, §4) · metin şablonu | standart |
| İletişim `iletisim.html` (form + 7 başvuru kanalı) | var | özel düzen (form) | ikisi + footer | **üretildi** (CC seçimi, §4) · form düzeni | Form tek sütun. |
| Yardım Merkezi `yardim-merkezi.html` | yok (iletisim#yardim) | metin şablonu + akordeon | harita + footer | **üretildi** (CC seçimi, §4) · metin şablonu | Akordeon. |
| Reklam `reklam.html` | var | metin şablonu + tablo | ikisi + footer | **üretildi** (CC seçimi, §4) · metin şablonu; B-26 | Ölçü tablosu. |
| İnsan Kaynakları `insan-kaynaklari.html` | var | metin şablonu + tablo + form | ikisi + footer | **üretildi** (CC seçimi, §4) · metin şablonu | Rol tablosu. |
| Resmî İlanlar (footer bağlantısı) | var | bkz. Grup 4 | ikisi + footer | **üretildi** (CC seçimi, §4) · B-26 | — |
| Uygulamayı indir | yok | özel düzen (tanıtım) | harita + footer | **üretildi** (CC seçimi, §4) · B-04 | standart |
| Kullanım Koşulları `kullanim-kosullari.html` | var (kullanim-sartlari.html) | metin şablonu | ikisi + footer | **üretildi** (CC seçimi, §4) · metin şablonu | İçindekiler başta. |
| Gizlilik ve KVKK `gizlilik-ve-kvkk.html` | var (kvkk.html) | metin şablonu | ikisi + footer | **üretildi** (CC seçimi, §4) · metin şablonu | standart |
| Aydınlatma Metni `aydinlatma-metni.html` | var | metin şablonu | ikisi + footer | **üretildi** (CC seçimi, §4) · metin şablonu | standart |
| Çerez Politikası `cerez-politikasi.html` | var (cerezler.html) | metin şablonu + tablo + rıza anahtarları | ikisi + footer | **üretildi** (CC seçimi, §4) · metin şablonu | Çerez tablosu. |
| Açık Rıza Metni `acik-riza-metni.html` | yok (cerezler#riza) | metin şablonu | harita + footer | **üretildi** (CC seçimi, §4) · metin şablonu | standart |
| Telif Hakları `telif-haklari.html` | yok (kullanim-sartlari#telif) | metin şablonu | harita + footer | **üretildi** (CC seçimi, §4) · metin şablonu | standart |
| Topluluk kuralları · Erişilebilirlik beyanı | yok (kullanım şartları bölümü) | metin şablonu | v2 | **üretildi** (CC seçimi, §4) · metin şablonu | standart |
| KVKK ilgili kişi başvuru formu | yok | özel düzen (form) | öneri | **üretildi** (CC seçimi, §4) · form düzeni | Form tek sütun. |

## 9 · Hata ve durum ekranları

Hata sayfaları tek bir **hata şablonundan** türer (v2 `dh-oops`: mesaj, arama, bölüm bağlantıları, popüler haberler).

| Sayfa ya da parça | v2'de karşılığı | Türü | Kaynağı | Karar durumu | Dar ekran notu |
|---|---|---|---|---|---|
| 404 sayfa bulunamadı `404.html` | var | özel düzen (hata şablonu) | ikisi | **üretildi** (CC seçimi, §4) · hata şablonu; B-03 yönlendirmeler | Bölüm bağlantıları yatay kayar. |
| 403 · 500 · 410 · 429 | var (403, 500) / yok (410, 429) | hata şablonu | v2 + öneri | **üretildi** (CC seçimi, §4) · hata şablonu | standart |
| 503 bakım | yok | hata şablonu (header'sız) | öneri | **üretildi** (CC seçimi, §4) · hata şablonu | Sade sayfa. |
| Çevrimdışı · sayfa + bağlantı geri geldi bandı | var (sayfa) / yok (bant) | hata şablonu + bant | v2 + öneri | **üretildi** (CC seçimi, §4) · hata şablonu | Tek satır bant. |
| Yakında (e-posta bırakma) | var (coming-soon.html) | hata şablonu + form | v2 | **üretildi** (CC seçimi, §4) · hata şablonu | Alan + düğme tek satır. |
| Dil sürümü yok notu | yok | durum bileşeni | harita | **üretildi** (CC seçimi, §4) · B-07, B-09 | standart |
| Boş liste · arama sonucu yok (tümü ve tür bazında) · hesap sekmesi boş | var (dh-bos) / kısmen | durum bileşeni | v2 | **üretildi** (CC seçimi, §4) · boş durum bileşeni (ortak) | standart |
| Yükleniyor / iskelet | yok | durum bileşeni | öneri | **üretildi** (CC seçimi, §4) · iskelet bileşeni | Kartın dar ekran ölçüsü. |
| Oturum süresi doldu · giriş gerekli ara durumu | yok | durum bileşeni | öneri + akış A3 | **üretildi** (CC seçimi, §4) · B-14, B-15 | standart |
| Form durumları (alan hatası, gönderiliyor, alındı) | kısmen | durum bileşeni | v2 | **üretildi** (CC seçimi, §4) · form bileşeniyle | Hata alan altında tek satır. |
| Kısa bildirim (toast: kaydedildi, kopyalandı, geri al) | kısmen (paylaş) | durum bileşeni | öneri | **üretildi** (CC seçimi, §4) · toast bileşeni | Alt gezinmenin üstünde. |

## 10 · Açılır pencereler ve ortak parçalar

| Sayfa ya da parça | v2'de karşılığı | Türü | Kaynağı | Karar durumu | Dar ekran notu |
|---|---|---|---|---|---|
| Siyah bant + header + açılır menü | var | ortak parça (`parcalar/ust.html`) | ikisi | **üretildi** | Menü çekmeceye taşınır; üstüne gelme yok. |
| Son Dakika şeridi | var (yalnız index) | ortak parça (`parcalar/son-dakika.html`) | ikisi | **üretildi** (her sayfada) | Kayan şerit dokunmayla durur. |
| Footer (perdeli, krem) | var | ortak parça (`parcalar/footer.html`) | ikisi | **üretildi** | Sütunlar akordeona döner. |
| Kardeş site bantları | var | ana sayfa bileşeni | ikisi | **üretildi** · adlar B-12 | standart |
| Çerez bandı + Gizlilik Tercih Merkezi | var (dh-cz) | açılır pencere / alt bant | ikisi | **üretildi** (CC seçimi, §4) · bant ve panel düzeni (en gizli varsayılan, A2) | Bant içeriği örtmez; panel tam ekran. |
| Bildirim izni kartı | var (dh-bld) | açılır pencere | v2 | **üretildi** (CC seçimi, §4) · kural çatışması: "girişte açılır pencere yok"; ne zaman gösterileceği | Alt sayfa. |
| Görüş Bildir pencereleri (3) | var (tetikleyicisiz) | açılır pencere | v2 | **üretildi** (CC seçimi, §4) · tetikleyici yeri | Tam ekran. |
| Paylaşım | var (dh-share) | detay bileşeni (satır seçildi) + açılır menü | ikisi | **üretildi** (satır) / **üretildi** (CC seçimi, §4) (açılır menü) | Native paylaşım. |
| Dil seçici | var (Hesabım'da) | ortak parça (siyah bantta düğme var) | harita | **üretildi** (CC seçimi, §4) · B-07, B-09 | AR sağdan sola. |
| Şehir seçici penceresi | var (citySelectModal) | açılır pencere | ikisi | **üretildi** (CC seçimi, §4) · pencere düzeni | Tam ekran liste. |
| Arama penceresi | var (uc-search-modal) | açılır pencere | ikisi | **üretildi** (CC seçimi, §4) · B-16 | Tam ekran. |
| Bildirim merkezi paneli | yok (Hesabım'a gidiyor) | açılır pencere | harita | **üretildi** (CC seçimi, §4) · B-14 | Tam ekran çekmece. |
| Görünüm paneli (karanlık mod, yazı boyutu, Sakin mod) | kısmen | açılır pencere | harita | **üretildi** (CC seçimi, §4) · yeri açık (üst barda düğme yok) | Alt panel. |
| Onay pencereleri (hesap sil, oturumu kapat, yorum bildir) | kısmen (dh-bil) | açılır pencere | v2 + öneri | **üretildi** (CC seçimi, §4) · onay penceresi bileşeni | Alt panel. |
| Bülten aboneliği bloğu (detay sonu) | var | detay bileşeni | ikisi | **üretildi** (CC seçimi, §4) · B-14 | Form tek satır. |
| Üyelik tetik paneli (Takip Et/Kaydet → giriş) | yok | açılır pencere | akış A3, A9 | **üretildi** (CC seçimi, §4) · B-14 | Alt panel. |
| Galeri/infografik görüntüleyici | var (dh-gal) | açılır pencere (tam ekran) | v2 | **üretildi** (CC seçimi, §4) · format detaylarıyla | Kaydırma hareketi. |
| Dikey video oynatıcı (Akış) | var (dhReels) | açılır pencere | ikisi | **üretildi** (CC seçimi, §4) · Akış ile | Telefonda asıl kullanım. |
| Reklam alanları | var (~28 alan) | ortak parça | v2 | **üretilmedi** · Beyar yer tutucuları kaldırdı; yerler web onayından önce sorulacak (C25) | Her kırılımda yer ve boyut. |
| Araya giren tam ekran reklam (dh-rint) | var (89 sayfa) | — | v2 | **alınmaz** · kırmızı çizgi: tam ekran reklam yok | — |

## Özet

**Toplam: 282 sayfa ya da parça** (alt kırılımlar tek tek sayıldı; grup 9 ve 10'da satır başına bir kalem; Grup 8'deki Resmî İlanlar satırı Grup 4'ün tekrarı olduğu için sayılmadı). Güncelleme: Dalga 1 sonrası.

| Grup | Sayı | Üretildi | Hazır | Seçim gerekiyor |
|---|---|---|---|---|
| 1 Bölüm | 123 | 80 (index, dunya, spor, finans + Dalga 1: 76) | 7 (bölüm haber detayları) | 36 |
| 2 Format | 21 | 0 | 8 | 13 |
| 3 Keşfet | 36 | 0 | 23 | 13 |
| 4 Servis | 20 | 0 | 1 (Döviz) | 19 |
| 5 Arama/etiket/konu/yazar | 9 | 0 | 3 | 6 |
| 6 Üyelik | 10 | 0 | 0 | 10 |
| 7 Hesabım | 15 | 0 | 0 | 15 |
| 8 Kurumsal/yasal | 17 | 0 | 0 | 17 |
| 9 Hata/durum | 11 | 0 | 0 | 11 |
| 10 Açılır pencere/ortak parça | 20 | 4 | 1 (paylaşım satırı) | 14 (+1 alınmaz) |
| **Toplam** | **282** | **84** | **43** | **154 (+1 alınmaz)** |

Haber detayı (`haber-detay.html`) üretildi; Grup 1'deki "bölüm haber detayları" onun türevleridir.

## Özel düzen gerektiren, seçenek hazırlanacak sayfalar (soru sırası)

Seçtirerek ilerleme yöntemiyle, her mesajda tek soru; sorular dalgaları bekletmez. Sıra, en çok sayfanın kilidini açan önce:

1. **Metin sayfası şablonu** → kurumsal ve yasal 19 sayfa, Sayfa Dizini, Tüm Kategoriler.
2. **Hata ve durum şablonu** → 404, 403, 500, 410, 429, 503, çevrimdışı, yakında + boş durum, iskelet, toast bileşenleri.
3. **Konu sayfası bileşen kuralının kapsamı** → Finans haber konusu alt sayfaları (15), Transfer, Millî Takım: "alt sayfada özel bileşen" kuralı haber konusu sayfalarında da geçerli mi.
4. **Spor branş sayfası** → 9 branş + 2 lig sayfası.
5. **Piyasa alt sayfaları** → Altın, Borsa, Kripto, Faiz, Akaryakıt, Piyasa Ekranı (öneri: D1 kalıbı).
6. **Ses oynatıcısı** → Podcast bölüm detayı, Haber Dinle liste ve detay.
7. **Video oynatıcı ve canlı yayın** → Video detayı, Canlı, Dakika Dakika.
8. **Görüntüleyici** → Foto Fokus galeri detayı, İnfografik detayı.
9. **Son Dakika akışı** → Son Dakika liste.
10. **Keşfet merkezi** ve Keşfet formatları (Dada Özet, Günün 5'i, Dada Bağlam, Dada Doğrula, Farklı Bakışlar, Veri ve Harita, Sakin Akış).
11. **Servis sayfaları** → Hava Durumu, Namaz Vakitleri, Canlı Skor, Puan Durumu, Fikstür, Ekonomik Takvim, Sınav Takvimi, Gündem Takvimi.
12. **Takım sayfası**, Takımlar dizini, Maç detayı.
13. **Yazar profili**, Konu/gelişen olay sayfası, Arşiv, Arama sonuçları.
14. **Üyelik ve Hesabım** → önce B-14 ve B-15 kararları, sonra sayfa/pencere düzeni ve Hesabım gruplaması.
15. **Açılır pencereler** → çerez bandı ve tercih merkezi, şehir seçici, onay penceresi, Görünüm panelinin yeri, bildirim izni kartının zamanı.
16. **Kadın özel sayfaları** → Hamilelik, Astroloji (B-24), 81 İl.

## Yayılım dalgaları

Lead koordine eder, sayfa yazmaz; her dosyanın tek sahibi olur; ortak dosyalar (assets/, parcalar/, araclar/) yalnızca lead'de. Her dalga sonunda lead kısa rapor verir; Beyar onaylar; commit ve push için ayrıca sorulur.

- **Dalga 1 · bölüm liste sayfaları (76, tamamlandı 2026-11-23):** 5 teammate. Gündem ana + 15 alt · Dünya 14 alt · Kadın ana + 14 alt · Savunma ana + 18 alt · Kampüs ana + 11 alt. Kalıp: Liste A.
- **Dalga 2 · hazır liste ve detay türevleri (~32):** Keşfet konu listeleri (20), format listeleri (Video, Podcast, Foto Fokus, İnfografik ve kategori listeleri: 8), Anlık listeleri (Bugün Ne Oldu?, Güncellenen Haberler), Yazarlar dizini, Etiket, Kişi/kurum, Köşe yazısı detayı, bölüm haber detayları (7), Döviz (D1).
- **Dalga 3 ve sonrası · seçimden sonra:** soru sırasıyla; her seçim gelince o şablondan türeyen sayfalar bir dalga olur (ör. metin şablonu → kurumsal/yasal 19 sayfa tek dalga).

## Şablon aileleri · seçime bağlı 154 kalem (2026-11-23)

Seçim gerektiren kalemler tek tek değil, şablon ailesi olarak sorulur: bir cevap, ailedeki bütün sayfaları açar. Sıra: en çok sayfa açan en üstte. "Soru" Beyar'a sorulacak tek cümledir; seçenekler soru sırası geldiğinde önizlemeyle hazırlanır.

| # | Şablon ailesi | Sayfa | Örnekler | Beyar'a sorulacak soru | v2 referansı |
|---|---|---|---|---|---|
| 1 | Konu alt sayfası bileşeni | 17 | Enflasyon, Kişisel Finans, Bankacılık (Finans 15), Transfer, Millî Takım | Haber konusu alt sayfalarında üstte o konuya özel bir bileşen olacak mı (ör. Enflasyon'da TÜFE özeti), yoksa liste A gibi yalnızca haber mi? | kısmen (ekonomi.html bantları) |
| 2 | Metin sayfası (kurumsal ve yasal) | 16 | Yayın İlkeleri, KVKK, Çerez Politikası, Künye, Sayfa Dizini | M1, M2 ya da M3? **(sorulmuş, cevap bekliyor)** | var (yayin-ilkeleri, kvkk, kunye …) |
| 3 | Hesabım düzeni | 15 | Kaydedilenler, Takip ettiklerim, Bildirim ayarları, Görünüm, Güvenlik | Hesabım v2'deki 21 sekmeyle mi, site haritasındaki 8 bölüm altında gruplanarak mı kurulsun? (B-14'e bağlı) | var (hesabim.html) |
| 4 | Üyelik ve form sayfası | 12 | Giriş Yap, Üye Ol, Şifremi unuttum, e-posta doğrulama, İletişim, KVKK başvuru | Giriş hangi yöntemlerle olacak ve giriş/kayıt sayfa mı, açılır pencere mi? (B-15, B-14) | var (giris, uye-ol, sifremi-unuttum, iletisim) |
| 5 | Hata ekranı ve durum bileşenleri | 11 | 404, 500, bakım, çevrimdışı, boş liste, arama sonucu yok, iskelet, toast | Hata ekranları ve boş/yükleniyor durumları için hangi düzen? | var (404, 403, 500, cevrimdisi, coming-soon) |
| 6 | Açılır pencere bileşeni | 10 | Çerez bandı ve tercih merkezi, şehir seçici, dil seçici, onay penceresi, Görünüm paneli, bildirim merkezi | Açılır pencereler için ortak düzen hangisi (ortalanmış pencere, yandan çekmece, alttan panel)? | var (dh-cz, citySelectModal, dh-bil) |
| 7 | Keşfet formatları | 10 | Keşfet merkezi, Dada Özet, Günün 5'i, Dada Bağlam, Dada Doğrula, Farklı Bakışlar, Sakin Akış, konu/olay sayfası | Keşfet format sayfaları ortak bir iskeletle mi (banner + format bileşeni + haberler), yoksa her format kendi düzeniyle mi kurulsun? | var (kesfet, dada-ozet, dada-baglam, dada-dogrula …) |
| 8 | Piyasa alt sayfası | 7 | Altın, Borsa, Kripto, Faiz, Akaryakıt, Piyasa Ekranı, enstrüman detayı | Diğer piyasa sayfaları da Döviz D1 kalıbıyla mı (tablo + ilgili araç, grafiksiz)? | var (altin, borsa, kripto, faiz-oranlari, finans-detay) |
| 9 | Profil başlıklı detay | 6 | Takım sayfası (4), yazar profili, maç detayı | Takım ve yazar sayfalarının üstündeki profil başlığı hangi düzende olsun? | var (takim-*, yazar-detay) |
| 10 | Medya oynatıcılı detay | 5 | Video detayı, podcast bölümü, Haber Dinle detayı, Canlı, Dakika Dakika | Video ve ses oynatıcılı detay sayfası hangi düzende olsun? | var (video-detay, podcast-detay, haber-dinle-detay, dakika-dakika) |
| 11 | B-25 servisleri | 4 | Gündem Takvimi, Afet ve Acil Durum, Trafik ve Ulaşım, ekonomi araçları | Bu dört servis ilk sürümde olacak mı? (B-25) | var (gundem-takvimi, afet-acil-durum, trafik-ulasim) |
| 12 | Kadın özel sayfaları | 4 | Hamilelik ve hafta detayı, Astroloji ve burç detayı | Hamilelik takibi ve astroloji ilk sürümde olacak mı, olacaksa hangi düzende? (B-24) | var (hamilelik, astroloji, burc-detay) |
| 13 | Zaman akışı listesi | 3 | Son Dakika, Haber Dinle listesi ve kategorisi | Zaman sıralı listeler (Son Dakika, sesli haberler) kart ızgarası mı, saatli satır listesi mi? | var (son-dakika, haber-dinle) |
| 14 | Şehir seçicili servis | 3 | Hava Durumu, Namaz Vakitleri, 81 İl | Hava ve namaz sayfaları hangi düzende olsun (şehir seçici + günlük değer + tablo)? | var (hava-durumu, iller) |
| 15 | Arama | 3 | Arama sonuçları, Dada'ya Sor, arama penceresi | Arama ile Dada'ya Sor tek kutuda mı birleşsin? (B-16) | var (arama.html, uc-search-modal) |
| 16 | Görüntüleyici | 3 | Foto Fokus galeri detayı, İnfografik detayı, tam ekran görüntüleyici | Galeri ve infografik görüntüleyici hangi düzende olsun? | var (foto-fokus-detay, infografik-detay, dh-gal) |
| 17 | Akış (dikey video) | 2 | Akış sayfası, dikey video oynatıcı | Akış'ın masaüstü hali nasıl olsun, akışın sonu olacak mı? (A8) | var (dhReels) |
| 18 | B-26 alanları | 2 | Resmî İlanlar, reklam alanları | Resmî İlanlar ve reklam alanları ilk sürümde nerede ve ne boyutta olacak? (B-26) | var (resmi-ilanlar, dh-r) |
| 19 | Bülten | 2 | Bülten abonelik sayfası, bülten arşivi | Bülten aboneliği üyeliksiz mi olacak, sayfası hangi düzende? (B-14) | yok (yalnız footer formu) |
| 20 | Arşiv | 1 | Arşiv | Arşiv sayfası tarih seçicili mi olsun, eski adresler korunacak mı? (B-03) | var (arsiv.html) |
| 21 | Uygulamayı indir | 1 | Uygulama tanıtım sayfası | Uygulama sayfası ilk sürümde olacak mı? (B-04) | yok |

**Toplam: 21 soru, 137 sayfa** (1 soru sorulmuş: metin sayfası). Kalan 20 soru 121 sayfa açar. Sorulardan 8'i bir B kararına bağlı (B-03, B-04, B-14, B-15, B-16, B-24, B-25, B-26); o maddeler soruyla birlikte sorulur.

### Seçim gerektirmeden türetilebilir (soru listesinden çıkarıldı · 17 sayfa)

| Şablon | Sayfa | Türeyeceği seçilmiş ekran |
|---|---|---|
| Spor branş ve lig sayfaları | 11 | Spor A: canlı maçlar, puan durumu, fikstür, transfer bileşenleri branşa göre süzülür (Futbol, Basketbol, Voleybol, Motor Sporları, Bisiklet, Tenis, Atletizm, Olimpiyatlar, E-Spor, Süper Lig, Avrupa Ligleri) |
| Spor servis sayfaları | 4 | Spor A bileşenlerinin tam sayfa hali: Canlı Skor, Puan Durumu, Fikstür; Takımlar dizini ana sayfadaki Süper Lig TC takım şeridinden |
| Takvim sayfaları | 2 | Finans C'deki Ekonomik Takvim bileşeni: Ekonomik Takvim, Sınav Takvimi |

Bu 17 sayfa, "alt sayfada konuya özel bileşen" kuralına zaten seçilmiş bileşenlerle uyar; Dalga 2 ya da 3'e eklenebilir. Beyar itiraz ederse 1. aileye taşınır.

**Genel toplam:** seçime bağlı 154 kalem = soruyla açılacak 137 + sorusuz türetilecek 17.

## Kategori ve medya yapısı güncellemesi (2026-11-25, DADAHABER-10)

Tek kaynak `araclar/kategori.json`. Menü 150 öğe (önceki 163).

| Durum | Sayfa | Hedef / not |
|---|---|---|
| Yeni | `cevre-ve-afet.html` | Çevre + Afet birleşti |
| Yeni | `sehirler.html` | 81 İl yerine; yalnız haber üretilen iller (10) |
| Taşındı | `beslenme.html`, `ruh-sagligi.html` | Kadın → Keşfet › Sağlık ve Yaşam |
| Yönlendirme | `turkiye.html` | `gundem.html` |
| Yönlendirme | `egitim.html` | `egitim-ve-sinavlar.html` |
| Yönlendirme | `cevre.html`, `afet.html` | `cevre-ve-afet.html` |
| Yönlendirme | `81-il.html` | `sehirler.html` (servis sayfalarında "81 İl" şehir seçme penceresini açar) |
| Yönlendirme | `gundem-analizi.html`, `ekonomi-analizi.html`, `savunma-analizi.html`, `dunya-analizi.html` | ana kategori `?tur=analiz` |
| Yönlendirme | `uzman-gorusleri.html` | `savunma.html?tur=uzman-gorusu` |
| Yönlendirme | `savunma-videolari.html` | `video.html?kategori=savunma` |
| Yönlendirme | `savunma-sanayii.html` | `savunma.html` |
| Yönlendirme | `otomobil.html` | `otomotiv.html` |
| Yönlendirme | `video-kategori.html`, `foto-fokus-kategori.html`, `infografik-kategori.html`, `podcast-kategori.html` | medya sayfası + adres süzgeci |

Yönlendirme sayfaları (17) `<meta name="dada-yonlendirme">` taşır; parca.py, dizin ve kontrol betikleri onları ayrı sayar.
