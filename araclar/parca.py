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
Parçaları yalnızca lead değiştirir (CLAUDE.md · Takım çalışması)."""
import sys, re, glob, os
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARCALAR = {ad: open(os.path.join(KOK, 'parcalar', f'{ad}.html'), encoding='utf-8').read().split('-->', 1)[1].strip()
            for ad in ('ust', 'son-dakika', 'footer')}
kontrol = '--kontrol' in sys.argv
hedef = [a for a in sys.argv[1:] if not a.startswith('--')] or sorted(glob.glob(os.path.join(KOK, '*.html')))
degisen = []
for yol in hedef:
    yol = yol if os.path.isabs(yol) else os.path.join(KOK, yol)
    t = open(yol, encoding='utf-8').read(); once = t
    for ad, icerik in PARCALAR.items():
        t = re.sub(rf'<!--P:{ad}-->.*?<!--/P:{ad}-->', lambda m: f'<!--P:{ad}-->\n{icerik}\n<!--/P:{ad}-->', t, flags=re.S)
    if t != once:
        degisen.append(os.path.basename(yol))
        if not kontrol: open(yol, 'w', encoding='utf-8').write(t)
print(('güncellenmesi gereken: ' if kontrol else 'güncellendi: ') + (', '.join(degisen) or 'yok'))
