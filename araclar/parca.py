#!/usr/bin/env python3
"""Ortak parçaları sayfalara yerleştirir (Dada Haber prototip).

Sayfalar düz HTML'dir, derleme adımı yoktur. Header, Son Dakika ve footer tek kaynaktan gelir:
  parcalar/ust.html · parcalar/son-dakika.html · parcalar/footer.html
Her sayfada şu işaretlerin arası bu dosyalarla değiştirilir (işaretler korunur):
  <!--P:ust--> ... <!--/P:ust-->   <!--P:son-dakika--> ... <!--/P:son-dakika-->   <!--P:footer--> ... <!--/P:footer-->

Kullanım:
  python3 -I araclar/parca.py              # kökteki bütün *.html sayfalarını günceller
  python3 -I araclar/parca.py gundem.html  # yalnızca verilen sayfalar
  python3 -I araclar/parca.py --kontrol    # değişiklik gerekiyorsa listeler, yazmaz

Yeni sayfa: araclar/sablon.html'yi kopyala; {{BASLIK}}, {{SAYFA_CSS}} ve {{ICERIK}} yerlerini doldur, sonra bu betiği çalıştır.
Ayrıca araclar/baglanti_kurallari.py ile "#" bağlantıları bağlamına göre gerçek hedefe bağlanır ve <main> id="icerik" alır.
Parçaları ve kuralları yalnızca lead değiştirir (CLAUDE.md · Takım çalışması)."""
import sys, re, glob, os
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARCALAR = {ad: open(os.path.join(KOK, 'parcalar', f'{ad}.html'), encoding='utf-8').read().split('-->', 1)[1].strip()
            for ad in ('ust', 'son-dakika', 'footer')}
kontrol = '--kontrol' in sys.argv
hedef = [a for a in sys.argv[1:] if not a.startswith('--')] or sorted(glob.glob(os.path.join(KOK, '*.html')))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import baglanti_kurallari as BK
degisen = []; bos = {}
for yol in hedef:
    yol = yol if os.path.isabs(yol) else os.path.join(KOK, yol)
    t = open(yol, encoding='utf-8').read(); once = t
    for ad, icerik in PARCALAR.items():
        t = re.sub(rf'<!--P:{ad}-->.*?<!--/P:{ad}-->', lambda m: f'<!--P:{ad}-->\n{icerik}\n<!--/P:{ad}-->', t, flags=re.S)
    # Bağlantı kuralları (araclar/baglanti_kurallari.py): sayfa içeriğindeki "#" bağlantıları gerçek hedefe
    t = BK.uygula(t, os.path.basename(yol))
    # Yapı kuralı (Beyar: gereksiz satır açılmaz): Etiketler ve Paylaş tek satırda; solda etiketler (kayar), sağda paylaş
    t = re.sub(r'(?<!<div class="dt-ep">)(<div class="dt-etk[^"]*">(?:(?!<div).)*?</div>)\s*(<div class="dt-pay[^"]*">(?:(?!<div).)*?</div>)',
               r'<div class="dt-ep">\1\2</div>', t, flags=re.S)
    # Yapı kuralı: yorum filtresi "Yorumlar (N)" başlık satırının sağına (ayrı satır açılmaz)
    t = re.sub(r'(<section class="dt-yorum"[^>]*>\s*<div class="gs">)((?:(?!</div>).)*?)(</div>)((?:(?!<section).)*?)<div class="dt-c-filtre">((?:(?!</div>).)*?)</div>',
               r'\1\2<div class="arac dt-c-filtre">\5</div>\3\4', t, flags=re.S)
    # Marka kuralı: ikonlar tek stil, dolu (fa-solid); içi boş fa-regular kullanılmaz
    t = t.replace('fa-regular ', 'fa-solid ')
    # "İçeriğe geç" bağlantısının hedefi
    t = re.sub(r'<main(?![^>]*\bid=)([^>]*)>', r'<main id="icerik"\1>', t, count=1)
    n = len(re.findall(r'href="#"', t))
    if n: bos[os.path.basename(yol)] = n
    if t != once:
        degisen.append(os.path.basename(yol))
        if not kontrol: open(yol, 'w', encoding='utf-8').write(t)
print(('güncellenmesi gereken: ' if kontrol else 'güncellendi: ') + (', '.join(degisen) or 'yok'))
if bos: print('UYARI · boş bağlantı (#) kalan: ' + ', '.join(f'{k}:{v}' for k, v in bos.items()))
