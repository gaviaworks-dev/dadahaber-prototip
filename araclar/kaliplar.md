# Dada Haber · şablon aileleri kalıp kılavuzu (lead)

Sayfalar bu kalıplardan kurulur. Stil `assets/css/sablonlar.css` (aileler) ve `assets/css/ortak.css`'te (form alanı, anahtar, pencere, çerez, toast). Yeni sınıf ve `<style>` yok. Kararlar: `docs/tasarim-kararlari.md` §4 (C1–C25).

**Her sayfanın `<head>` CSS sırası:** `degiskenler.css`, `ortak.css` (şablonda hazır) + {{SAYFA_CSS}}: `liste.css` (banner/panel/alt menü/çip/sayfalama hep buradan) + gerekiyorsa `konu.css` (Spor/Finans bileşenleri: `.sw-*`, `.dv-*`) + gerekiyorsa `detay.css` (detay B: `.dt-*`) + **`sablonlar.css` (her Dalga 3 sayfası)**. Sıra: liste → konu → detay → sablonlar.

**Ortak kurallar:** tek h1; h2 bölüm, h3 kart; seviye atlanmaz. Kart başlıkları `<h3><a href="HEDEF">`. Dalga 2 HEDEF tablosu geçerli (`tasks/dalga2/ORTAK-BRIEF.md`). İçerik: gerçekçi, sakin, kaynak gösteren Türkçe; lorem yok; başka yayın kuruluşu yok. Görseller `assets/gorsel/pNNN.jpg` (16 dosya). İkon: Font Awesome 6.5.2 solid/brands.

---

## Kabuklar (seçilmiş ekranlar)
- **Liste kabuğu:** `dunya.html` → `section.bn` (satır içi `style="background-image:url(assets/gorsel/…)"`) + `div.pnl` > `.am` alt menü + `section.pnl-ic` > `.kap` …
- **Merkez kutusu (bileşen + haberler):** `finans.html` → `.sw-merkez` > `.sw-bas` + `.sw-merkez-ic` …; bant `.sw-band`; kutu `.sw-kutu`; tablo `.sw-tablo`; takvim `.sw-takvim`; uyarı `.sw-uyari`.
- **Detay kabuğu:** `haber-detay.html` → `.dt-sade.dt-ust` (geniş görsel) + `.dt-sade` baş + `.dt-sade2` > `.dt-hiza` (eylem şeridi + `.dt-ic.dt-sutun`).

## C1 · Metin sayfası (kurumsal ve yasal, M2) — tam örnek: `secenekler/metin-b.html`
`section.bn.mt-bn` (yol › Kurumsal › Sayfa; `.bn-gorev`; h1; `.mt-bn-alt` > p + `.mt-kunye` yürürlük/güncelleme/sürüm) → `div.pnl` > `section.pnl-ic` > `.kap.mt-gastro` > `nav.mt-menu` (bütün kurumsal/yasal sayfalar, ikonlu, bulunulan `aktif`) + `article.mt-kart` > `nav.mt-ici.kutu` (içindekiler, `<ol><li><a href="#b1"><b>1</b>Başlık</a>`) + `.mt-metin` > `section.mt-bol#bN` > `h2` + `p`/`ul`/`table`. Sayılar için `.mt-sayilar` > `div` > `b` + `small`.
Menü sırası: Hakkımızda, Künye, Yayın İlkeleri, Düzeltme Politikası, İletişim, Yardım Merkezi, Reklam, İnsan Kaynakları, Uygulamayı İndir, Kullanım Koşulları, Gizlilik ve KVKK, Aydınlatma Metni, Çerez Politikası, Açık Rıza Metni, Telif Hakları, Topluluk Kuralları, Erişilebilirlik, KVKK Başvuru, Sayfa Dizini.

## C4 · Form ve üyelik
```html
<section class="pnl-ic"><div class="kap uy-izg">
  <div class="fr-kart"><h2>Giriş Yap</h2><p>…</p>
    <div class="fr-sosyal"><a class="fr-dugme ikincil" href="#"><i class="fa-brands fa-google"></i>Google ile</a>…</div>
    <div class="fr-ayrac">ya da e-posta ile</div>
    <label class="fr-alan"><span>E-posta</span><span class="fr-inp dolu"><i class="fa-solid fa-envelope"></i>ornek@eposta.com</span></label>
    <span class="fr-hata"><i class="fa-solid fa-circle-exclamation"></i>Bu e-posta ile kayıtlı hesap yok.</span>   (hata hali)
    <div class="fr-iki">…iki alan yan yana…</div>
    <label class="fr-onay"><span class="fr-k on"></span><span>…<a href="kullanim-kosullari.html">…</a></span></label>
    <a class="fr-dugme" href="…">Giriş Yap</a>
    <div class="fr-satir"><span>Hesabın yok mu?</span><a href="uye-ol.html">Üye ol</a></div></div>
  <aside class="uy-yan"><h2>Hesapla ne değişir?</h2><ul><li><i class="fa-solid fa-bookmark"></i><span><b>Kaydet</b>…</span></li>…</ul></aside>
</div></section>
```
Adım göstergesi: `<div class="fr-adim"><span class="bitti"><b>1</b>E-posta</span><span class="aktif"><b>2</b>Bağlantı</span><span><b>3</b>Yeni şifre</span></div>`. Durum: `<div class="fr-durum"><i class="fa-solid fa-envelope-circle-check"></i><div><b>…</b><p>…</p></div></div>` (hata: `.fr-durum.hata`). Seçim çipleri: `.cp-izg` > `.cp-sec` (`.on`). Uzun metin alanı: `.fr-inp.alan-uzun`. Banner üyelik sayfalarında YOK: `section.dt-sade` beyaz baş (yol + h1 + kısa açıklama), sonra `section.dt-sade2` içinde form.

## C3 · Hesabım
Beyaz baş (`.dt-sade`: yol Ana sayfa › Hesabım › Bölüm, h1). Sonra `section.dt-sade2` > `.kap.hs-izg` > `nav.mt-menu` (Genel Bakış, Takip Ettiklerim, Kaydedilenler, Okuma Geçmişi, Bildirimler, Bültenlerim, Serim ve Rozetlerim, Tercihler, Güvenlik ve Profil, Gizlilik ve Veriler, Uygulama, Oturumu Kapat; bulunulan `aktif`) + `.hs-ic` > `.hs-kart` (h2 + içerik). Bileşenler: `.hs-profil` (`.av` + ad), `.hs-sayilar` > `a|div` > `b`+`small`, `.hs-anahtar` > `span`(b+small) + `span.anh(.on)`, `.hs-satir` (ikon/avatar + metin + eylem), alt sekmeler `.pn-sekme`, boş hal `.bos`, tehlikeli kutu `.hs-kart.hs-tehlike` + `<a class="fr-dugme ikincil" href="#" data-acilir="onay">`. Liste kartları için `.g3`/`.g4` + kart kökü.

## C5 · Hata ve durum
```html
<section class="dt-sade2"><div class="kap"><div class="ht"><span class="ht-kod">404</span><h1>Bu sayfa yayında değil</h1><p>…</p>
  <div class="ht-ara"><span class="fr-inp"><i class="fa-solid fa-magnifying-glass"></i>Haberlerde ara</span><a class="fr-dugme" href="arama.html">Ara</a></div>
  <div class="ls-cipler"><a class="ls-cip" href="gundem.html">Gündem</a>…</div></div>
  <div class="ht-pop"><h2>…Çok okunanlar</h2><div class="g4">…kart kökü…</div></div></div></section>
```
İkonlu hal: `<span class="ht-kod ikon"><i class="fa-solid fa-wifi"></i></span>`. Bakım (503): header/footer YOK; `<body>` içinde yalnız `<main class="ht-sade"><div class="ht">…</div></main>` (parça işaretlerini koyma). Durum bileşenleri: `.bos` (i + b + p + düğme), `.isk-kart` > `.isk` + `.isk.s` + `.isk.s.k`, `.toast`, `.bant-durum` (`.iyi`), `.fr-durum`. Vitrin sayfasında her örnek `.vitrin` > `section.vitrin-oge` > h2 + p + örnek.

## C6 · Açılır pencereler (lead'de, footer parçasında hazır)
Tetik: herhangi bir öğeye `data-acilir="ad"`: giris, kayit, sifre, uyelik, cerez, bildirim, izin, gorus, paylas, dil, sehir, arama, gorunum, onay, bulten. Pencere içeriğini sayfaya YAZMA; yalnız tetik koy.

## C9 · Keşfet formatları (liste kabuğu + merkez kutusu + haberler)
Format ızgarası `.kf-izg` > `a.kf-kart` > `i` + `span` > h3 + p + small. Zaman çizgisi `.kr` > `.kr-o` > `time` + `div` > b + p. Doğrulama etiketleri `.dg-izg` > `.dg-etk.dogru|yanlis|yaniltici|eksik|dogrulanamadi|baglam` > i + b + small; rozet `.dg-rozet.dogru…`. Karşılaştırma `.fb-izg` > `.fb-k` > h3 + p + small. Dada Özet sekmeleri `.pn-sekme` + `detay.css`'teki `.dt-ozet`. Günün 5'i: `index.html`'deki `.numara` bileşeni. Ayarlar `.hs-anahtar`.

## C10 · Piyasa alt sayfası (Döviz D1 kalıbı) — `doviz.html` (Dalga 2) ve `secenekler/finans-doviz-a.html`
`.sw-merkez` > `.sw-merkez-ic.dv-ic` > `.dv-iki` (`.sw-tablo.dv-tablo` + `.dv-yan` > `.dv-cev` araç + `.dv-not`). Grafik yok. Enstrüman detayında tek çizgi grafik: `index.html`/`finans.html`'deki `.sw-spark` svg'sini büyük boy (`.dv-graf` sınıfı `konu.css`'te var) kullan.

## C11 · Profil başlıklı banner
`section.bn.pf` > `.kap` > `.bn-sol` > yol + `.pf-bas` (`.pf-av` (takımda `.pf-av.arma` + satır içi `style="background:#A90432"` takım rengi) + div > `.bn-gorev` + h1) + `.pf-kunye` > span > b + small. Maç: `.pf-skor` > `.pf-av.arma` + b skor + `.pf-av.arma`.

## C12 · Medya oynatıcılı detay (detay kabuğu)
Geniş görsel yerine: `<div class="oy-video" style="background-image:url(…)"><span class="oy-canli"><i></i>Canlı</span>(canlıda) <button class="oy-oynat" aria-label="Oynat"><i class="fa-solid fa-play"></i></button><div class="oy-cubuk"><span>02:14</span><span class="sw-ar"><i style="inset-inline-start:30%"></i></span><span>12:40</span></div></div>`. Ses: `.oy-kapak` > `span` kapak (background-image) + `.dt-dinle.genis` (detay.css). Sıradaki: `.oy-sira` > `a` > span(görsel) + span(b + small) + small süre. Deşifre: `.oy-desifre` > p > time + metin. Canlı akış: `.ca` > `.ca-o(.onemli)` > time + h3 + p.

## C13 · Görüntüleyici (detay kabuğu)
`.gr` > `.gr-sahne(.dikey)` (satır içi background-image) > `.gr-say` (i + "01 / 24") + `button.gr-ok.o` + `button.gr-ok.s` + `.kaydet.gr-tam` (tam ekran ikonu) ; `.gr-serit` > 8 × `a(.sec)` (satır içi background-image) ; `.gr-alt` > p (altyazı) + small (künye).

## C14 · Akış
`.ak-izg` > `.ak-oy` (satır içi background-image) > `.ak-ilerleme` > i(.d)… + `.ak-oy-ic` > çip + h2 + `.bilgi` ; `.ak-sira` > h2 + `.oy-sira` … + `.ak-son` (i + b + p + düğme).

## C15 · Zaman akışı listesi
`.za` > `.za-gun` (Bugün + small tarih) + `a.za-s(.yeni)` > time + `span.za-kat` (i + kategori) + h3 + small (Haber Dinle'de small yerine `button.dt-oyn`).

## C16 · Şehir seçicili servis
Merkez kutusunda: `.sv-ust` > `a.cp-sec` (`data-acilir="sehir"`; şehir adı) + `.sv-deger` (i + b + span > strong + metin) + düğme; `.sv-gunler` > `div(.bugun)` > small + i + b + em ; namaz `.sv-vakit` > `div(.simdi)` > small + b ; aylık tablo `.sw-tablo`. 81 İl: `.il-izg` > a > b plaka + ad.

## C17 · Arama
`.ar-kutu` > `.pn-sekme` + `.fr-inp.odak` ; tür şeridi `.ls-cipler` ; gruplar `.ar-grup` > h2 (i + ad + small sayı) + `.g4`/`.za`/`.yz-ray` ; Dada'ya Sor: `.ar-soru` + `.ar-yanit` > `.ar-yanit-bas` + p + `.dt-kaynak` (detay.css Kaynaklar).

## C19, C23, dizin
Burç ızgarası `.bz-izg` > a(.sec) > i + b + small. Uyarı `.uyari-kutu` > i + div(b + p). Dizin `.dz` > section > h2 (i + grup) + a…
