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
import hashlib
# Önbellek kırma: CSS ve JS bağlantılarına içerik özetinden sürüm eklenir (?v=…); dosya değişince sürüm değişir, tarayıcı yenisini alır
SURUM = {}
for yol_ in glob.glob(os.path.join(KOK, 'assets', 'css', '*.css')) + glob.glob(os.path.join(KOK, 'assets', 'js', '*.js')):
    SURUM[os.path.relpath(yol_, KOK)] = hashlib.md5(open(yol_, 'rb').read()).hexdigest()[:8]
# Tablo hizalama kuralı (Beyar): sayısal sütunlar (sayı, %, tutar, tarih, saat) sona yaslı; th ve td'ye class="say" eklenir.
# Bir sütun, dolu hücrelerinin en az %60'ı sayısalsa sayısal sayılır. "sol" sınıflı (anahtar-değer) tablolara dokunulmaz.
_IZIN = r'(puan|TL|USD|EUR|km|cm|kg|dk|sa|gün|ay|yıl|hafta|Oca|Şub|Mar|Nis|May|Haz|Tem|Ağu|Eyl|Eki|Kas|Ara|B|M|Mn|Mr|bin|milyon|milyar)'
def _sayisal(h):
    x = re.sub(r'<[^>]+>', ' ', h); x = re.sub(r'&[a-z#0-9]+;', ' ', x).strip()
    if not x or not re.search(r'\d', x): return False
    y = re.sub(_IZIN, ' ', x)
    return not re.search(r'[A-Za-zÇĞİÖŞÜçğıöşüâîû]{2,}', y)
def _hucre_sinif(h, ekle):
    if not ekle or re.search(r'\bsay\b', h.split('>',1)[0]): return h
    bas, kalan = h.split('>', 1)
    if 'class="' in bas: bas = bas.replace('class="', 'class="say ', 1)
    else: bas += ' class="say"'
    return bas + '>' + kalan
def tablo_hizala(t):
    def tablo(m):
        s = m.group(0)
        satirlar = re.findall(r'<tr\b.*?</tr>', s, re.S)
        govde = [re.findall(r'<td\b[^>]*>.*?</td>', r, re.S) for r in satirlar if '<td' in r]
        if not govde: return s
        n = max(len(r) for r in govde); say = set()
        for i in range(1, n):
            dolu = [r[i] for r in govde if i < len(r) and re.sub(r'<[^>]+>', '', r[i]).strip()]
            if dolu and sum(_sayisal(x) for x in dolu) / len(dolu) >= .6: say.add(i)
        def satir(rm):
            r = rm.group(0); i = [-1]
            def h(cm):
                i[0] += 1; return _hucre_sinif(cm.group(0), i[0] in say)
            return re.sub(r'<t[hd]\b[^>]*>', lambda cm: _hucre_sinif(cm.group(0), (i.__setitem__(0, i[0]+1) or i[0]) in say), r)
        return re.sub(r'<tr\b.*?</tr>', satir, s, flags=re.S)
    return re.sub(r'(?<!sol">)<table\b.*?</table>', tablo, t, flags=re.S)
def surumle(t):
    return re.sub(r'(href|src)="(assets/(?:css|js)/[^"?]+\.(?:css|js))(?:\?v=[0-9a-f]+)?"', lambda m: f'{m.group(1)}="{m.group(2)}?v={SURUM.get(m.group(2), "1")}"', t)
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
    # Teyit işareti: Beyar 2026-11-24 "haber detayında teyitli olmayacak" → "Teyitli · N kaynak" hiçbir detayda yok.
    # Yalnızca doğrulama incelemesinde (dada-dogrula-*) "İncelendi · N kaynak" (gri) kalır; kaynaklar bölümü yerinde durur.
    ad_ = os.path.basename(yol)
    if not ad_.startswith('dada-dogrula-'):
        t = re.sub(r'<a class="dt-teyit"[^>]*>.*?</a>', '', t, flags=re.S)
    else:
        t = t.replace('<a class="dt-teyit" ', '<a class="dt-teyit incelendi" ')
    # Akış girişlerindeki "Teyitli" rozeti de yok (canlı, dakika dakika, son dakika, bugün ne oldu); teyit veride tutulur
    t = re.sub(r'\s*<span class="ty-rozet teyitli">Teyitli</span>', '', t)
    if ad_.startswith('dada-dogrula-') and 'class="dt-bas-ic"' in t and 'class="dt-teyit' not in t:
        n = len(re.findall(r'class="dt-k-ik"', t))
        if n:
            kb = re.search(r'<section class="dt-kaynak[^"]*"[^>]*aria-labelledby="([^"]+)"', t)
            hedef = f'#{kb.group(1)}' if kb else '#icerik'
            isaret = f'<a class="dt-teyit incelendi" href="{hedef}"><i class="fa-solid fa-magnifying-glass"></i>İncelendi · {n} kaynak</a>'
            t = re.sub(r'(<div class="dt-bas-ic">.*?<div class="dt-meta">.*?</div>)', lambda m: m.group(1) + isaret, t, count=1, flags=re.S)
    # Yorum başlığı (Beyar 2026-11-24): ana sayfadaki üst etiket + başlık bütünü; etiket konu, başlık cümle. Sayı süzgeç çipinde.
    t = re.sub(r'(<span class="ust"><i class="fa-solid fa-comments"></i>)Okur yorumları(</span><h2 id="[^"]+">)Yorumlar \(\d+\)(</h2>)', r'\1Yorumlar\2Okurlar Ne Diyor?\3', t)
    # Bilgi satırı (Beyar 2026-11-24): "09.15 Güncellendi", "3 dk Okuma" baş harfleri büyük
    t = re.sub(r'(fa-bolt"></i>[^<]*?\d) güncellendi', r'\1 Güncellendi', t)
    t = re.sub(r'(fa-clock"></i>\d+ dk) okuma', r'\1 Okuma', t)
    t = tablo_hizala(t)
    t = surumle(t)
    # "İçeriğe geç" bağlantısının hedefi
    t = re.sub(r'<main(?![^>]*\bid=)([^>]*)>', r'<main id="icerik"\1>', t, count=1)
    n = len(re.findall(r'href="#"', t))
    if n: bos[os.path.basename(yol)] = n
    if t != once:
        degisen.append(os.path.basename(yol))
        if not kontrol: open(yol, 'w', encoding='utf-8').write(t)
print(('güncellenmesi gereken: ' if kontrol else 'güncellendi: ') + (', '.join(degisen) or 'yok'))
if bos: print('UYARI · boş bağlantı (#) kalan: ' + ', '.join(f'{k}:{v}' for k, v in bos.items()))
