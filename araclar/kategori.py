#!/usr/bin/env python3
"""Kategori ve medya yapısı uygulayıcısı (Dada Haber prototip · Beyar 2026-11-25).

Tek kaynak araclar/kategori.json (docs/kaynak/DADAHABER-10 belgesinin karşılığı). parca.py çağırır:
  · parcalari_uret()  parcalar/ust.html mega menüsünü ve parcalar/footer.html telefon menüsünü (cm-liste) üretir
  · uygula(t, dosya)  her sayfada: eski adresler hedefe, servis sayfalarında "81 İl" → şehir seçme penceresi,
                      menüden türeyen alt menü şeridi (ana başlık ya da Keşfet sütunu), kart kategori etiketleri
Yönlendirme sayfalarına (<meta name="dada-yonlendirme">) dokunulmaz. Tekrar çalıştırmak bir şeyi değiştirmez."""
import os, re, json
from html import escape as _esc
def escape(s): return _esc(s, quote=False)   # metin düğümü: tırnak ve kesme işareti olduğu gibi

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
K = json.load(open(os.path.join(KOK, 'araclar', 'kategori.json'), encoding='utf-8'))
YON = K['yonlendirme']

def _menu_ad(ad):
    """Menü ve telefon menüsünde "Dada" ön eki kalın yazılır (mevcut biçim)."""
    return f'<b>Dada</b> {escape(ad[5:])}' if ad.startswith('Dada ') else escape(ad)

# ---------------------------------------------------------------- ortak parçalar
def _mega():
    li = []
    for b in K['basliklar']:
        g = ' genis' if b.get('genis') else ''
        kol = ''.join(f'<div class="mg-kol"><span class="mg-grp">{escape(s["ad"])}</span><ul>'
                      + ''.join(f'<li><a href="{o["adres"]}">{_menu_ad(o["ad"])}</a></li>' for o in s['ogeler'])
                      + '</ul></div>' for s in b['sutunlar'])
        li.append(f'<li class="mm"><a href="{b["adres"]}" class="mm-a" aria-haspopup="true" aria-expanded="false">{escape(b["ad"])}<i class="fa-solid fa-chevron-down"></i></a>'
                  f'<div class="mega"><div class="mg-ic{g}"><div class="mg-bas" style="background-image:url({b["gorsel"]})"><span class="mg-ik"><i class="fa-solid {b["ikon"]}"></i></span>'
                  f'<span class="mg-ad">{escape(b["ad"])}</span><p>{escape(b["aciklama"])}</p><a class="gd-dugme" href="{b["adres"]}">Tümünü Gör<i class="fa-solid fa-arrow-right"></i></a></div>'
                  f'<div class="mg-kollar{g}">{kol}</div></div></div></li>')
    return '<ul class="mm-l">' + ''.join(li) + '</ul>'

def _cekmece():
    d = []
    for b in K['basliklar']:
        alt = ''.join(f'<a href="{o["adres"]}">{_menu_ad(o["ad"])}</a>' for s in b['sutunlar'] for o in s['ogeler'])
        d.append(f'<details class="cm-bol"><summary><i class="fa-solid {b["ikon"]}"></i>{escape(b["ad"])}<i class="fa-solid fa-chevron-down cm-ok"></i></summary>'
                 f'<div class="cm-alt"><a href="{b["adres"]}" class="cm-tumu">{escape(b["ad"])} · Tümü</a>{alt}</div></details>')
    return ''.join(d)

def parcalari_uret():
    """parcalar/ust.html ve parcalar/footer.html içindeki menü bloklarını kategori.json'dan yeniden yazar."""
    yol = os.path.join(KOK, 'parcalar', 'ust.html'); t = open(yol, encoding='utf-8').read()
    y = re.sub(r'<ul class="mm-l">.*?</ul></nav>', lambda m: _mega() + '</nav>', t, count=1, flags=re.S)
    if y != t: open(yol, 'w', encoding='utf-8').write(y)
    yol = os.path.join(KOK, 'parcalar', 'footer.html'); t = open(yol, encoding='utf-8').read()
    y = re.sub(r'(<nav class="cm-liste"[^>]*>).*?(</nav>)', lambda m: m.group(1) + _cekmece() + m.group(2), t, count=1, flags=re.S)
    if y != t: open(yol, 'w', encoding='utf-8').write(y)

# ---------------------------------------------------------------- alt menü şeritleri
SERIT = {}      # dosya → (etiket, kök adres, [(ad, adres)])
ETIKETLER = set()
for b in K['basliklar']:
    if b['serit'] == 'baslik':
        ogeler = [(o['ad'], o['adres']) for s in b['sutunlar'] for o in s['ogeler']]
        spec = (b['ad'], b['adres'], ogeler); ETIKETLER.add(b['ad'])
        for d in [b['adres']] + [a for _, a in ogeler]: SERIT[d] = spec
    else:
        for s in b['sutunlar']:
            if s['ad'] in b.get('serit_disi', []): continue
            et = b.get('serit_etiketi', {}).get(s['ad'], s['ad'])
            ogeler = [(o['ad'], o['adres']) for o in s['ogeler']] + [(o['ad'], o['adres']) for o in b.get('serit_ek', {}).get(s['ad'], [])]
            spec = (et, b['adres'], ogeler); ETIKETLER.add(et)
            for d in [a for _, a in ogeler] + b.get('serit_kok', {}).get(s['ad'], []): SERIT[d] = spec
# Eski yazımlı etiketler de menüden türeyen şerit sayılır (ilk geçişte çevrilir)
ESKI_ETIKET = ETIKETLER | {'Teknoloji ve bilim', 'Sağlık ve yaşam', 'Kültür ve sanat'}

def _serit(t, dosya):
    spec = SERIT.get(dosya)
    if not spec: return t
    et, kok, ogeler = spec
    def r(m):
        if m.group(2) not in ESKI_ETIKET: return m.group(0)
        cip = f'<a href="{kok}" class="ls-cip{" aktif" if dosya == kok else ""}">Tümü</a>' + ''.join(
            f'<a href="{a}" class="ls-cip{" aktif" if dosya == a else ""}">{escape(ad)}</a>' for ad, a in ogeler)
        return f'{m.group(1)}{escape(et)}{m.group(3)}{cip}{m.group(5)}'
    return re.sub(r'(<div class="am"><div class="kap am-ic"><span class="am-etk">)([^<]*)(</span>.*?<div class="ls-cipler">)(.*?)(</div>)', r, t, count=1, flags=re.S)

# ---------------------------------------------------------------- uygulama
def uygula(t, dosya):
    if 'name="dada-yonlendirme"' in t: return t
    # Servis sayfaları: "81 İl" ve "Bütün iller" şehir seçme penceresini açar (Beyar karar 3)
    si = K['servis_il']
    if dosya in si['sayfalar']:
        def il(m):
            a = re.sub(r'\s*data-acilir="[^"]*"', '', m.group(1))
            return f'<a{a}href="{dosya}?il=sec" data-acilir="{si["pencere"]}"{m.group(2)}>'
        t = re.sub(r'<a([^>]*?)href="81-il\.html"([^>]*)>', il, t)
    # Eski adresler doğrudan hedefe (Beyar/danışman karar 5)
    def yon(m):
        hedef = YON[m.group(2)]
        return f'{m.group(1)}"{hedef.replace("&", "&amp;")}"'
    t = re.sub(r'(href=)"(' + '|'.join(re.escape(k) for k in YON) + r')(?:\?[^"#]*)?"', yon, t)
    t = _serit(t, dosya)
    # Kart kategori etiketleri: kaldırılan/birleşen alt kategoriler yeni adlarıyla
    KE = K['kart_etiketi']
    t = re.sub(r'(<span class="cip"><i class="[^"]+"></i>)(' + '|'.join(re.escape(k) for k in KE) + r')(</span>)', lambda m: m.group(1) + escape(KE[m.group(2)]) + m.group(3), t)
    return t
