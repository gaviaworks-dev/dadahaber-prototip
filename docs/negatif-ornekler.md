# Negatif örnekler

Beyar'ın ya da Yasin Bey'in yakaladığı hatalar. Yeni işten önce okunur; aynı hata tekrar görülürse buraya eklenir ve bütün sitede taranıp düzeltilir (CLAUDE.md · Proje kuralları · Negatif örnekler).

| # | Tarih | Sayfa | Ne yanlıştı | Kural | Düzeltme |
|---|---|---|---|---|---|
| N1 | 2026-11-23 | `faiz-oranlari.html` (ve bütün tablolar) | Alt alta üç tablonun sütunları birbirine hizalı değildi ("Oran" sütunu her tabloda başka yerde); sayılar ortalanmıştı, başlıklar ortalı | Tablolarda hizalama | Metin başa, sayısal sütun sona (`class="say"`, parca.py otomatik); başlık sütunuyla aynı tarafa; aynı kutudaki tablolar ortak ızgara (ilk sütun %40). 24 sayfadaki 63 tabloya uygulandı |
| N2 | 2026-11-23 | `haber-detay.html`, `hamilelik.html` | "Neden önemli / Bana etkisi / Bundan sonra" ve "Bebeğin gelişimi…" bölümleri aynı anda açık kalabiliyordu | Akordiyon: aynı kapta birden çok açılır bölüm varsa tek bölüm açık | Genel kural `ortak.js`: aynı kaptaki `details` grupları tek açık |
| N3 | 2026-11-23 | Canlı anlatım kilit anlar | Cümle üç noktayla kesiliyordu; okunmuyordu | Metin kesilmez; sığmayan kayar | Kesme kaldırıldı, kartlar eşit yükseklik, cümle en çok ~60 karakter |
| N4 | 2026-11-23 | Detay telefon önizlemeleri | Bölümler arası boşluklar tutarsız; kartlar ve kaynak listesi tarayıcı girintisiyle sağa kaymıştı | Boşluk ölçeği mobilde de geçerli | 4/8/12/16/20/24/32 ölçeği; bölümler arası 32; listelerde varsayılan girinti sıfır |
| N5 | 2026-11-23 | Detay başlığı | h1 karakter sınırıyla daraltılmış, iki satıra sığacakken üç satıra kırılıyordu | Gereksiz satır açılmaz | Başlık sütun genişliğini kullanır |
| N6 | 2026-11-23 | Masaüstü üst bölüm | Menü yazıları ve bant düğmeleri fazla büyüktü | Yoğunluk ve ölçek tutarlılığı | Menü 13.5px, bant 40px, düğmeler 30–32px |
