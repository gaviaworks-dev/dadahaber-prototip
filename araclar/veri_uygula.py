#!/usr/bin/env python3
"""Örnek veri sözlüğünü (araclar/ornek_veri.json) sayfalara uygular (Dada Haber prototip).

Sözlük tek kaynaktır: an (23 Kasım 2026 16.05), yazarlar, haberler, son dakika, piyasa, hava, puan tablosu.
Betik yalnızca veri alanlarına dokunur: kart bilgi satırı (tarih, süre, görüntülenme), imza, detay künyesi,
yazar unvanı, son dakika listesi, piyasa değerleri, hava kutuları, Süper Lig tablosu, zaman listeleri ve
sözlükteki hedefli metin geçişleri. Sayfalama, bağlantı hedefi, sayfa yolu, menü ve ortak parçalara
(<!--P:...--> arası) dokunmaz.

Kullanım:
  python3 -I araclar/veri_uygula.py <kök>                   # sayfalara uygular
  python3 -I araclar/veri_uygula.py <kök> --kontrol         # yazmaz; değişecek dosyaları ve doğrulamayı raporlar
  python3 -I araclar/veri_uygula.py <kök> --parca           # ayrıca parcalar/son-dakika.html şeridini ve footer bildirim saatini üretir
  python3 -I araclar/veri_uygula.py <kök> --dogrula         # yalnızca tutarlılık doğrulaması
  python3 -I araclar/veri_uygula.py <kök> --sozluk-tamamla  # sitede olup sözlükte olmayan başlıkları sözlüğe ekler
İdempotenttir: ikinci çalıştırmada değişiklik olmaz."""
import sys, os, re, json, glob, html, hashlib, collections

BETIK = os.path.dirname(os.path.abspath(__file__))
ARGS = [a for a in sys.argv[1:] if not a.startswith('--')]
BAYRAK = {a for a in sys.argv[1:] if a.startswith('--')}
KOK = os.path.abspath(ARGS[0]) if ARGS else os.path.dirname(BETIK)
VERI_YOLU = os.path.join(BETIK, 'ornek_veri.json')
for a in sys.argv[1:]:
    if a.startswith('--veri='): VERI_YOLU = a.split('=', 1)[1]

AY_K = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
AY_U = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
DETAY_BOLUM = {'haber-detay.html': 'Gündem', 'spor-detay.html': 'Spor', 'finans-detay.html': 'Finans',
               'kadin-detay.html': 'Kadın', 'savunma-detay.html': 'Savunma', 'dunya-detay.html': 'Dünya',
               'kampus-detay.html': 'Kampüs', 'kesfet-detay.html': 'Keşfet', 'kose-yazisi.html': 'Köşe'}
KART = re.compile(r'<article class="(gk|gy|go|g|bo-s)(?: [^"]*)?"[^>]*>.*?</article>', re.S)
BASLIK = re.compile(r'<h([1-3])[^>]*>\s*(?:<a\b[^>]*>)?\s*(.*?)\s*(?:</a>)?\s*</h\1>', re.S)

# ---------------------------------------------------------------- yardımcılar
def duz(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', s))).strip()

def anahtar(s):
    s = duz(s).replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"').replace('–', '-')
    s = s.translate(str.maketrans({'î': 'i', 'â': 'a', 'û': 'u', 'Î': 'İ', 'Â': 'A', 'Û': 'U', 'I': 'ı', 'İ': 'i'}))
    return re.sub(r'[\s.?!:;,]+$', '', s.lower())

def slug(s):
    s = anahtar(s).translate(str.maketrans('çğışöü', 'cgisou'))
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')[:80]

def tk_yazim(s):
    """Sözlükteki başlıklar yazım kuralına göre: Millî."""
    return re.sub(r'\bmilli\b', 'millî', re.sub(r'\bMilli\b', 'Millî', s))

SIRA = ['id', 'baslik', 'esdeger', 'bolum', 'alt_konu', 'yazar', 'tarih', 'saat', 'goruntulenme', 'sure', 'detay']

def kayit_duzen(h):
    h['baslik'] = tk_yazim(h['baslik'].replace('’', "'"))
    h.setdefault('id', slug(h['baslik']))
    return {k: h[k] for k in SIRA if k in h} | {k: v for k, v in h.items() if k not in SIRA}

def ozet(s):
    return int(hashlib.md5(s.encode()).hexdigest()[:8], 16)

def bas_harf(ad):
    return ad[0].upper()

def dk(saat):
    h, m = saat.split('.'); return int(h) * 60 + int(m)

def saat_yaz(n):
    return '%02d.%02d' % (n // 60, n % 60)

def t_kisa(t):
    y, a, g = t.split('-'); return f'{int(g)} {AY_K[int(a) - 1]}'

def t_uzun(t):
    y, a, g = t.split('-'); return f'{int(g)} {AY_U[int(a) - 1]} {y}'

def t_coz(s):
    """'23 Kas' | '23 Kasım 2026' -> '2026-11-23'"""
    m = re.match(r'(\d{1,2}) (\w+)(?: (\d{4}))?$', s.strip())
    if not m: return None
    ay = m.group(2)
    for i, (k, u) in enumerate(zip(AY_K, AY_U)):
        if ay in (k, u): return f'{m.group(3) or "2026"}-{i + 1:02d}-{int(m.group(1)):02d}'
    return None

def maskele(t):
    parca = []
    def f(m):
        parca.append(m.group(0)); return f'\x00P{len(parca) - 1}\x00'
    return re.sub(r'<!--P:([\w-]+)-->.*?<!--/P:\1-->', f, t, flags=re.S), parca

def geri(t, parca):
    return re.sub(r'\x00P(\d+)\x00', lambda m: parca[int(m.group(1))], t)

def sayfalar(kok):
    return sorted(f for f in glob.glob(os.path.join(kok, '*.html')) if not os.path.basename(f).startswith('_'))

# ---------------------------------------------------------------- sözlük
def yukle():
    with open(VERI_YOLU, encoding='utf-8') as f: return json.load(f)

def kaydet(V):
    """Okunur biçim: üst düzey girintili, her haber tek satır. Kimlikler tekil."""
    gor = collections.Counter()
    for i, h in enumerate(V['haberler']):
        h = V['haberler'][i] = kayit_duzen(h)
        gor[h['id']] += 1
        if gor[h['id']] > 1: h['id'] += f'-{gor[h["id"]]}'
    parcalar = []
    for k, v in V.items():
        if k == 'haberler':
            ic = ',\n'.join('    ' + json.dumps(h, ensure_ascii=False) for h in v)
            parcalar.append(f'  "haberler": [\n{ic}\n  ]')
        else:
            parcalar.append(f'  {json.dumps(k, ensure_ascii=False)}: ' + json.dumps(v, ensure_ascii=False, indent=2).replace('\n', '\n  '))
    with open(VERI_YOLU, 'w', encoding='utf-8') as f: f.write('{\n' + ',\n'.join(parcalar) + '\n}\n')

class Sozluk:
    def __init__(s, V):
        s.V = V
        s.simdi_t = V['simdi']['tarih']; s.simdi_s = dk(V['simdi']['saat'])
        s.yazar = {y['ad']: y for y in V['yazarlar']}
        s.havuz = collections.defaultdict(list)
        for y in V['yazarlar']: s.havuz[y['alan']].append(y['ad'])
        s.eski = V.get('eski_imzalar', {})
        s.haber = {}
        for h in V['haberler']:
            for b in [h['baslik']] + h.get('esdeger', []): s.haber[anahtar(b)] = h
    def bul(s, baslik):
        return s.haber.get(anahtar(baslik))
    def ad_coz(s, ad):
        """Sözlük dışı imzayı sözlükteki yazara çevirir (eski imza tablosu, yoksa aynı ilk ad)."""
        if ad in s.yazar: return ad
        if ad in s.eski: return s.eski[ad]
        ilk = ad.split()[0] if ad.split() else ''
        aday = [a for a in s.yazar if a.split()[0] == ilk]
        return aday[0] if len(aday) == 1 else None

# ---------------------------------------------------------------- dönüşümler
def kart_meta(t, S, rapor):
    """Kart bilgi satırı ve imza: tarih, süre, görüntülenme, yazar (aynı başlık her yerde aynı)."""
    def kart(m):
        k = m.group(0)
        b = BASLIK.search(k)
        if not b: return k
        h = S.bul(b.group(2))
        if not h:
            if not re.search(r'<h[1-3][^>]*>\s*<a href="https?:', k): rapor['sozlukte_yok'].add(duz(b.group(2)))
            return k
        def tarih(mm):
            eski = mm.group(2)
            if re.fullmatch(r'\d{1,2} \w{3}', eski): yeni = t_kisa(h['tarih'])
            elif re.fullmatch(r'\d{1,2} \w+ \d{4}', eski): yeni = t_uzun(h['tarih'])
            elif re.fullmatch(r'\d{1,2} \w+ \d{4} · \d\d\.\d\d', eski): yeni = t_uzun(h['tarih']) + ' · ' + h['saat']
            else: return mm.group(0)
            return mm.group(1) + yeni + '<'
        k = re.sub(r'(<i class="fa-solid fa-calendar-day"></i>)([^<]*)<', tarih, k)
        if h.get('goruntulenme'):
            k = re.sub(r'(<i class="fa-solid fa-eye"></i>)\d[\d.,]* B(?=<)', lambda mm: mm.group(1) + h['goruntulenme'], k)
        if h.get('sure'):
            k = re.sub(r'(<i class="fa-solid fa-clock"></i>)\d+ dk(?=<)', lambda mm: mm.group(1) + h['sure'], k)
        y = h.get('yazar')
        if y:
            k = re.sub(r'(<div class="imza"><span class="av">)[^<]*(</span><b>)[^<]*(</b>)', lambda mm: mm.group(1) + bas_harf(y) + mm.group(2) + y + mm.group(3), k)
            k = re.sub(r'(<span class="yz"><span class="av">)[^<]*(</span>)[^<]*(<)', lambda mm: mm.group(1) + bas_harf(y) + mm.group(2) + y + mm.group(3), k)
        if m.group(1) == 'bo-s' and h['tarih'] == S.simdi_t:
            k = re.sub(r'<time datetime="[^"]*">[^<]*</time>', f'<time datetime="{h["tarih"]}T{h["saat"].replace(".", ":")}">{h["saat"]}</time>', k, count=1)
        return k
    return KART.sub(kart, t)

def detay_meta(t, S, rapor):
    """Detay künyesi: yazar, unvan, yayın tarihi ve saati (h1 sözlükteyse)."""
    if 'class="dt-meta"' not in t: return t
    m1 = re.search(r'<h1[^>]*>(.*?)</h1>', t, re.S)
    h = S.bul(m1.group(1)) if m1 else None
    if not h: return t
    def meta(m):
        k = m.group(0)
        y = h.get('yazar')
        if y and y in S.yazar:
            def yz(mm):
                ad = duz(mm.group(3))
                if not (S.ad_coz(ad) or ad in S.yazar): return mm.group(0)   # kurum imzası: dokunma
                ic = mm.group(3)
                ic = re.sub(r'>[^<]+<', '>' + y + '<', ic) if '<a' in ic else y
                return mm.group(1) + bas_harf(y) + mm.group(2) + ic + mm.group(4) + S.yazar[y]['unvan'] + mm.group(5)
            k = re.sub(r'(<span class="dt-yz"><span class="av">)[^<]*(</span><span><b>)(.*?)(</b><small>)[^<]*(</small>)', yz, k, count=1, flags=re.S)
        def tarih(mm):
            eski = mm.group(2)
            if re.fullmatch(r'\d{1,2} \w+ \d{4} · \d\d\.\d\d', eski): yeni = t_uzun(h['tarih']) + ' · ' + h['saat']
            elif re.fullmatch(r'\d{1,2} \w+ \d{4}', eski): yeni = t_uzun(h['tarih'])
            else: return mm.group(0)
            return mm.group(1) + yeni + '<'
        k = re.sub(r'(<i class="fa-solid fa-calendar-day"></i>)([^<]*)<', tarih, k, count=1)
        if h.get('goruntulenme'):
            k = re.sub(r'(<i class="fa-solid fa-eye"></i>)\d[\d.,]* B(?=<)', lambda mm: mm.group(1) + h['goruntulenme'], k, count=1)
        return k
    return re.sub(r'<div class="dt-meta">.*?</div>', meta, t, count=1, flags=re.S)

def yazar_unvan(t, S, rapor, dosya):
    """Yazar kartları (yz1), takip çipleri, podcast sunucuları: ad sözlükten, unvan sözlükten."""
    def yz1(m):
        ad = S.ad_coz(duz(m.group(2)))
        if not ad:
            rapor['yazar_yok'].add(duz(m.group(2))); return m.group(0)
        u = S.yazar[ad]['unvan']
        return (f'<a class="yz1" href="{m.group(1)}" aria-label="{ad}, {u}: yazar sayfası"><span class="yz1-av">{bas_harf(ad)}</span>'
                f'<h3>{ad}</h3><small>{u}</small></a>')
    t = re.sub(r'<a class="yz1" href="([^"]*)"[^>]*>\s*<span class="yz1-av">[^<]*</span>\s*<h3>([^<]*)</h3>\s*<small>[^<]*</small>\s*</a>', yz1, t)
    def ad_degis(m):
        ad = S.ad_coz(m.group(2)); return m.group(1) + (ad or m.group(2)) + m.group(3)
    t = re.sub(r'(<span class="cp-sec(?: on)?"><i class="fa-solid fa-pen-nib"></i>)([^<]+)(<)', ad_degis, t)
    t = re.sub(r'(<i class="fa-solid fa-microphone"></i>)([^<]+)(<)', ad_degis, t)
    t = re.sub(r'(<b>)([^<]+?)( yeni bir yazı yayımladı</b>)', ad_degis, t)
    # yazar profil sayfası: banner görevi = sözlükteki unvan
    if dosya == 'yazar.html':
        m = re.search(r'<h1>([^<]+)</h1>', t)
        if m and S.ad_coz(m.group(1)):
            ad = S.ad_coz(m.group(1))
            t = re.sub(r'(<div class="pf-bas"><span class="pf-av">[^<]*</span><div><span class="bn-gorev">)[^<]*(</span>)', lambda mm: mm.group(1) + S.yazar[ad]['unvan'] + mm.group(2), t, count=1)
    # yazar dizini: sözlüğün dizin sırasıyla ilk sayfa
    if dosya == 'yazarlar.html':
        dizin = sorted((y for y in S.V['yazarlar'] if y.get('dizin')), key=lambda y: y['dizin'])
        def izg(m):
            n = len(re.findall(r'<a class="yz1"', m.group(2)))
            ic = ''.join(f'<a class="yz1" href="yazar.html" aria-label="{y["ad"]}, {y["unvan"]}: yazar sayfası"><span class="yz1-av">{bas_harf(y["ad"])}</span><h3>{y["ad"]}</h3><small>{y["unvan"]}</small></a>' for y in dizin[:n])
            return m.group(1) + ic + m.group(3)
        t = re.sub(r'(<div class="[^"]*">)((?:<a class="yz1"[^>]*>.*?</a>)+)(</div>)', izg, t, count=1, flags=re.S)
        t = re.sub(r'<b>\d+ yazar</b>', f'<b>{len(S.V["yazarlar"])} yazar</b>', t)
    return t

def kunye(t, S, dosya):
    if dosya != 'kunye.html': return t
    for gorev, ad in S.V.get('kunye', {}).items():
        t = re.sub(r'(<tr><td>' + re.escape(gorev) + r'</td><td>)[^<]*(</td></tr>)', lambda m: m.group(1) + ad + m.group(2), t)
    return t

def kategori_adlari(t, S):
    """#20: kart çipi, zaman akışı kategorisi, açılış paneli etiketi ve haber etiketlerinde menüdeki başlıklar.
    Gezinme çiplerine (alt menü) ve adı bu olan sayfanın kendisine dokunulmaz (sayfa adı kararı Beyar'da)."""
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', t, re.S)
    if h1 and duz(h1.group(1)) in S.V.get('kategori_adlari', {}): return t
    for eski, yeni in S.V.get('kategori_adlari', {}).items():
        e = re.escape(eski)
        t = re.sub(r'(<span class="(?:cip|za-kat|cam|kas)">(?:<i class="[^"]*"></i>)?)' + e + '(<)', lambda m: m.group(1) + yeni + m.group(2), t)
        t = re.sub(r'(class="bn-y(?: aktif)?"><small>)' + e + '(</small>)', lambda m: m.group(1) + yeni + m.group(2), t)
        # etiketler: detay etiket satırı ya da ?secim= süzgeç çipi
        t = re.sub(r'(<a href="[^"]*\?secim=[^"]*" class="ls-cip(?: aktif)?">)' + e + '(</a>)', lambda m: m.group(1) + yeni + m.group(2), t)
        t = re.sub(r'<div class="dt-etk">.*?</div>', lambda m: re.sub(r'(class="ls-cip(?: aktif)?">)' + e + '(</a>)', lambda mm: mm.group(1) + yeni + mm.group(2), m.group(0)), t, flags=re.S)
    return t

def son_dakika_sayfa(t, S, dosya):
    if dosya != 'son-dakika.html': return t
    SD = S.V['son_dakika']
    m = re.search(r'<div class="za">(.*?)</div><nav', t, re.S)
    if not m: return t
    eski = m.group(1)
    hrefler = {anahtar(h3): href for href, h3 in re.findall(r'<a class="za-s[^"]*" href="([^"]*)">.*?<h3>(.*?)</h3>', eski, re.S)}
    gunler = collections.OrderedDict()
    for o in sorted(SD['liste'], key=lambda o: (o['tarih'], dk(o['saat'])), reverse=True):
        gunler.setdefault(o['tarih'], []).append(o)
    yeni = ''
    for i, (g, ogeler) in enumerate(gunler.items()):
        ad = {0: 'Bugün', 1: 'Dün'}.get((int(S.simdi_t[-2:]) - int(g[-2:])), SD.get('gun_adlari', {}).get(g, t_kisa(g)))
        yeni += f'<div class="za-gun">{ad}<small>{t_uzun(g)}</small></div>'
        for o in ogeler:
            h = S.bul(o['baslik'])
            href = hrefler.get(anahtar(o['baslik'])) or (h or {}).get('detay') or 'haber-detay.html'
            yeni_mi = ' yeni' if g == S.simdi_t and S.simdi_s - dk(o['saat']) <= 30 else ''
            yeni += (f'<a class="za-s{yeni_mi}" href="{href}"><time>{o["saat"]}</time><span class="za-kat"><i class="fa-solid {o["ikon"]}"></i>{o["kat"]}</span>'
                     f'<h3>{o["baslik"]}</h3><small>{o["sure"]}</small></a>')
    return t[:m.start(1)] + yeni + t[m.end(1):]

def serit_uret(S):
    SD = S.V['son_dakika']
    bugun = {anahtar(o['baslik']): o for o in SD['liste'] if o['tarih'] == S.simdi_t}
    ogeler = ''.join(f'<span><time>{bugun[anahtar(b)]["saat"]}</time><em>{SD["serit_metin"].get(b, b)}</em></span>' for b in SD['serit'])
    return ogeler + ogeler   # kayan şerit için iki tur

def blok_bul(t, bas):
    """t[bas:] bir <div ile başlar; eşleşen </div> sonunu döndürür."""
    derin = 0
    for m in re.finditer(r'<div\b|</div>', t[bas:]):
        derin += 1 if m.group(0) == '<div' else -1
        if derin == 0: return bas + m.end()
    return None

def zaman_listeleri(t, S, dosya):
    """Zaman akışı listeleri (za): bugünün grubunda saat 'şimdi'yi geçemez; sözlükteki haber yayından önce görünemez;
    önceki günün haberi 'bugün' grubunda durmaz (o günün grubu varsa oraya geçer); gruplar saate göre sıralanır.
    'yakinda' listesindeki (henüz yayımlanmamış) öğeler 'Yakında' etiketiyle en üstte kalır."""
    if dosya == 'son-dakika.html' or 'class="za"' not in t: return t
    yakinda = {anahtar(b) for b in S.V.get('yakinda', [])}
    cikti, konum = '', 0
    for m in re.finditer(r'<div class="za">', t):
        if m.start() < konum: continue
        son = blok_bul(t, m.start())
        if not son: continue
        ic = t[m.end():son - len('</div>')]
        parca = re.split(r'(<div class="za-gun">.*?</div>)', ic, flags=re.S)
        if parca[0].strip() or len(parca) < 3:          # gün başlığı olmayan liste (ör. bülten içeriği): dokunma
            continue
        gruplar = []
        for i in range(1, len(parca), 2):
            ogeler = re.findall(r'<a class="za-s[^"]*" href="[^"]*">.*?</a>', parca[i + 1], re.S)
            if ''.join(ogeler) != parca[i + 1].strip(): gruplar = None; break
            gm = re.search(r'<small>(\d{1,2} \w+ \d{4})</small>', parca[i])
            gruplar.append({'bas': parca[i], 'tarih': t_coz(gm.group(1)) if gm else None, 'oge': ogeler})
        if not gruplar or any(g['tarih'] is None for g in gruplar): continue
        tarihli = {g['tarih']: g for g in gruplar}
        tum = []
        for g in gruplar:
            for o in g['oge']:
                sm = re.search(r'<time>(\d\d)\.(\d\d)</time>', o)
                b = re.search(r'<h3>(.*?)</h3>', o, re.S).group(1)
                tum.append({'g': g['tarih'], 's': int(sm.group(1)) * 60 + int(sm.group(2)) if sm else None, 'b': b, 'o': o})
        for x in tum:
            if x['s'] is None: continue
            if anahtar(x['b']) in yakinda: x['yakinda'] = True; continue
            h = S.bul(x['b'])
            if not h: continue
            hs = dk(h['saat'])
            if h['tarih'] < x['g'] and x['g'] == S.simdi_t:
                if h['tarih'] in tarihli:
                    x['g'] = h['tarih']; x['s'] = min(23 * 60 + 55, hs + 15 + ozet(dosya + x['b']) % 4 * 5)
                else:
                    x['g'] = None          # o günün grubu yok: 'bugün' diye gösterilmez
            elif h['tarih'] == x['g'] and x['s'] < hs:
                x['s'] = hs + 5 + ozet(dosya + x['b']) % 4 * 5
            if x['g'] == S.simdi_t and x['s'] > S.simdi_s and hs <= S.simdi_s and h['tarih'] == S.simdi_t:
                x['s'] = max(hs, S.simdi_s - 5)
        # bugün: şimdiyi geçen (yakında olmayan) öğeler şimdiden geriye dizilir
        dolu = {x['s'] for x in tum if x['g'] == S.simdi_t and x['s'] is not None and x['s'] <= S.simdi_s}
        for x in sorted((x for x in tum if x['g'] == S.simdi_t and x['s'] is not None and x['s'] > S.simdi_s and not x.get('yakinda')), key=lambda x: x['s']):
            n = S.simdi_s
            while n in dolu: n -= 5
            dolu.add(n); x['s'] = n
        yeni = ''
        for g in gruplar:
            ogeler = [x for x in tum if x['g'] == g['tarih']]
            ogeler.sort(key=lambda x: (1 if x.get('yakinda') else 0, x['s'] if x['s'] is not None else -1), reverse=True)
            yeni += g['bas']
            for x in ogeler:
                o = x['o']
                if x['s'] is not None:
                    o = re.sub(r'<time>[^<]*</time>', f'<time>{saat_yaz(x["s"] % 1440)}</time>', o, count=1)
                if x.get('yakinda'):
                    if '<small>Yakında</small>' not in o:
                        o = re.sub(r'<span class="dt-oyn"[^>]*>.*?</span>|<small>[^<]*</small>', '<small>Yakında</small>', o, count=1, flags=re.S)
                    o = re.sub(r'class="za-s(?: yeni)?"', 'class="za-s"', o, count=1)
                elif x['s'] is not None:
                    yeni_mi = g['tarih'] == S.simdi_t and S.simdi_s - x['s'] <= 30
                    o = re.sub(r'class="za-s(?: yeni)?"', 'class="za-s yeni"' if yeni_mi else 'class="za-s"', o, count=1)
                yeni += o
        cikti += t[konum:m.end()] + yeni + '</div>'
        konum = son
    return cikti + t[konum:]

def guncellenen(t, S):
    """Güncellenen haberler: 'ilk yayın' sözlükteki yayın tarihi ve saati."""
    def gn(m):
        k = m.group(0); b = re.search(r'<h3><a [^>]*>(.*?)</a></h3>', k, re.S)
        h = S.bul(b.group(1)) if b else None
        if not h: return k
        y, a, g = h['tarih'].split('-')
        return re.sub(r'ilk yayın \d{1,2} \w+(?: \d\d\.\d\d)?', f'ilk yayın {int(g)} {AY_U[int(a) - 1]} {h["saat"]}', k, count=1)
    return re.sub(r'<article class="gn-k">.*?</article>', gn, t, flags=re.S)

def isaret(t):
    """#29: puan cinsinden değişimde işaret: düşüşte −, artışta +."""
    t = re.sub(r'(<em class="d"><i class="fa-solid fa-caret-down"></i>)(\d+,\d+ puan)', lambda m: m.group(1) + '−' + m.group(2), t)
    t = re.sub(r'(<em class="y"><i class="fa-solid fa-caret-up"></i>)(\d+,\d+ puan)', lambda m: m.group(1) + '+' + m.group(2), t)
    return t

def banner_meta(t, S):
    """Liste açılış panelindeki öne çıkan haberin görüntülenmesi."""
    def bn(m):
        k = m.group(0); b = re.search(r'<h2>(.*?)</h2>', k, re.S)
        h = S.bul(b.group(1)) if b else None
        if not h or not h.get('goruntulenme'): return k
        return re.sub(r'(<i class="fa-solid fa-eye"></i>)\d[\d.,]* B(?=<)', lambda mm: mm.group(1) + h['goruntulenme'], k)
    return re.sub(r'<a href="[^"]*" class="bn-one">.*?</a>', bn, t, flags=re.S)

def okuma_gecmisi(t, S, dosya):
    """Okuma geçmişi ve bildirimler: okunma saati yayından sonra, şimdiden önce."""
    if dosya not in ('hesabim-gecmis.html',): return t
    def satir(m):
        b, kat, zaman = m.group(2), m.group(3), m.group(5)
        h = S.bul(b)
        if not h: return m.group(0)
        zm = re.fullmatch(r'(Bugün|Dün|\d{1,2} \w{3}) (\d\d\.\d\d)', zaman)
        if not zm: return m.group(0)
        gun = {'Bugün': S.simdi_t, 'Dün': S.simdi_t[:-2] + '%02d' % (int(S.simdi_t[-2:]) - 1)}.get(zm.group(1)) or t_coz(zm.group(1))
        yayin = (h['tarih'], dk(h['saat']))
        okunma = (gun, dk(zm.group(2)))
        if okunma > yayin: return m.group(0)
        yeni = dk(h['saat']) + 20 + ozet(b) % 6 * 10
        if h['tarih'] == S.simdi_t: yeni = min(yeni, S.simdi_s - 5)
        g = h['tarih']
        if yeni >= 24 * 60: yeni = 23 * 60 + 50
        ad = 'Bugün' if g == S.simdi_t else ('Dün' if int(S.simdi_t[-2:]) - int(g[-2:]) == 1 else t_kisa(g))
        return m.group(1) + m.group(4) + f'{ad} {saat_yaz(yeni)}' + m.group(6)
    t = re.sub(r'(<b>([^<]+)</b>\s*<small>(· [^<]*)</small>(?:(?!<b>).)*?)(<small>)((?:Bugün|Dün|\d{1,2} \w{3}) \d\d\.\d\d)(</small>)', satir, t, flags=re.S)
    # her sekmede satırlar okunma zamanına göre (en yeni önce)
    def sirala(m):
        satirlar = re.findall(r'<a class="hs-satir"[^>]*>.*?</a>', m.group(2), re.S)
        if not satirlar or ''.join(satirlar) != m.group(2): return m.group(0)
        def an(x):
            z = re.search(r'<small>(Bugün|Dün|\d{1,2} \w{3}) (\d\d\.\d\d)</small></a>$', x)
            if not z: return None
            g = {'Bugün': S.simdi_t, 'Dün': S.simdi_t[:-2] + '%02d' % (int(S.simdi_t[-2:]) - 1)}.get(z.group(1)) or t_coz(z.group(1))
            return (g, dk(z.group(2)))
        if any(an(x) is None for x in satirlar): return m.group(0)
        return m.group(1) + ''.join(sorted(satirlar, key=an, reverse=True)) + m.group(3)
    return re.sub(r'(<div data-sekme-icerik="[^"]*"(?: hidden)?>)((?:<a class="hs-satir".*?</a>)+)(</div>)', sirala, t, flags=re.S)

def piyasa(t, S, dosya):
    P = S.V['piyasa']; ar = {a['ad']: a for a in P['araclar']}
    def yon_i(a): return 'up' if a['yon'] == 'y' else 'down'
    # Finans şeridi
    def ps(m):
        etk = re.sub(r' · satış$', '', m.group(2))
        a = next((x for x in P['araclar'] if etk in x.get('serit', [])), None)
        if not a: return m.group(0)
        etiket = a['serit'][0] + (' · satış' if a.get('kur') else '')
        return (f'{m.group(1)}<small>{etiket}</small><b>{a["deger"]}</b><em class="{a["yon"]}"><i class="fa-solid fa-caret-{yon_i(a)}"></i>%{a["degisim"]}</em></a>')
    t = re.sub(r'(<a href="[^"]*" class="sw-ps">)<small>([^<]*)</small><b>[^<]*</b><em class="[yd]"><i class="fa-solid fa-caret-(?:up|down)"></i>%[^<]*</em></a>', ps, t)
    t = re.sub(r'(<span class="sw-serit-e"><i></i>Canlı · )\d\d\.\d\d(</span>)', lambda m: m.group(1) + P['guncelleme'] + m.group(2), t)
    # Ana sayfa döviz kartları
    def dvz(m):
        k = m.group(0)
        ad = re.search(r'<b>([^<]*)</b>', k).group(1)
        a = next((x for x in P['araclar'] if ad in x.get('vitrin', [])), None)
        if not a: return k
        k = re.sub(r'(<span class="dvz-ust"><b>[^<]*</b><small>)([^<·]*?)(?: · satış)?(</small>)', lambda mm: mm.group(1) + mm.group(2).strip() + (' · satış' if a.get('kur') else '') + mm.group(3), k)
        k = re.sub(r'(<span class="dvz-deger">)[^<]*(</span>)', lambda mm: mm.group(1) + a['deger'] + mm.group(2), k)
        k = re.sub(r'<span class="dvz-deg [yd]"><i class="fa-solid fa-arrow-(?:up|down)"></i>[^<]*</span>', f'<span class="dvz-deg {a["yon"]}"><i class="fa-solid fa-arrow-{yon_i(a)}"></i>{a["degisim"]}%</span>', k)
        renk_y, renk_d = '#19750A', '#C8102E'
        k = k.replace(renk_d if a['yon'] == 'y' else renk_y, renk_y if a['yon'] == 'y' else renk_d)
        return k
    t = re.sub(r'<a class="dvz-k" href="[^"]*">.*?</a>', dvz, t, flags=re.S)
    # Tablolarda Brent satırı (akaryakıt sekmesi): değer, önceki, değişim
    b = ar.get('Brent')
    if b:
        t = re.sub(r'(<tr><td>Brent petrol \(varil\)</td><td class="say"><b>)[^<]*(</b></td><td class="say">)[^<]*(</td><td class="say"><em class=")[yd](">)<i class="fa-solid fa-caret-(?:up|down)"></i>%[^<]*(</em>)',
                   lambda m: f'{m.group(1)}{b["deger"]} ${m.group(2)}{b["onceki"]} ${m.group(3)}{b["yon"]}{m.group(4)}<i class="fa-solid fa-caret-{yon_i(b)}"></i>%{b["degisim"]}{m.group(5)}', t)
    return t

def derece(n):
    return f'−{-n}' if n < 0 else str(n)

def hava(t, S, dosya):
    H = S.V['hava']; s = dict(S.V['hava']['simdi']); G = [dict(g) for g in H['gunler']]
    for x in [s] + G:
        for k in ('sicaklik', 'hissedilen', 'yuksek', 'dusuk'):
            if k in x: x[k] = derece(x[k])
    saatlik = [dict(x, sicaklik=derece(x['sicaklik']), hissedilen=derece(x['hissedilen'])) for x in H['saatlik']]
    if dosya == 'index.html':
        def kutu(m):
            gun = ''.join(f'<div><small>{g["gun"]}</small><i class="fa-solid {g["ikon"]}"></i><b>{g["yuksek"]}°<span>{g["dusuk"]}°</span></b></div>' for g in G)
            return (f'<div class="ay-kart ay-hava"><a class="ay-kim" href="{m.group(1)}"><span class="ay-ik"><i class="fa-solid {s["ikon"]}"></i></span>'
                    f'<span><b>{H["sehir"]}</b><small>{s["durum"]} · hissedilen {s["hissedilen"]}°</small></span></a><div class="ay-sicak">{s["sicaklik"]}<sup>°C</sup></div>'
                    f'<div class="ay-gunler">{gun}</div>{m.group(2)}')
        t = re.sub(r'<div class="ay-kart ay-hava"><a class="ay-kim" href="([^"]*)">.*?<div class="ay-gunler">.*?</div></div>(<a class="ay-dugme")', kutu, t, flags=re.S)
    if dosya == 'hava-durumu.html':
        t = re.sub(r'(<div class="sv-deger">)<i class="fa-solid [^"]*"></i><b>[^<]*</b><span><strong>[^<]*</strong>[^<]*</span>(</div>)',
                   lambda m: f'{m.group(1)}<i class="fa-solid {s["ikon"]}"></i><b>{s["sicaklik"]}°</b><span><strong>{s["durum"]}</strong>Hissedilen {s["hissedilen"]}° · Nem %{s["nem"]} · Rüzgâr {s["ruzgar"]}</span>{m.group(2)}', t, count=1)
        gun = (f'<div class="bugun"><small>Bugün</small><i class="fa-solid {s["ikon"]}"></i><b>{s["yuksek"]}°</b><em>{s["dusuk"]}°</em></div>'
               + ''.join(f'<div><small>{g["gun"]} {g["tarih"]}</small><i class="fa-solid {g["ikon"]}"></i><b>{g["yuksek"]}°</b><em>{g["dusuk"]}°</em></div>' for g in G))
        t = re.sub(r'(<div class="sv-gunler">)(?:<div[^>]*><small>.*?</em></div>)+(</div>)', lambda m: m.group(1) + gun + m.group(2), t, count=1, flags=re.S)
        def tablo(m):
            satir = ''.join(f'<tr><td>{x["saat"]}</td><td>{x["durum"]}</td><td class="say"><b>{x["sicaklik"]}°</b></td><td class="say">{x["hissedilen"]}°</td><td class="say">%{x["yagis"]}</td><td class="say">{x["ruzgar"]} km/sa</td></tr>' for x in saatlik)
            return m.group(1) + satir + m.group(2)
        t = re.sub(r'(<th class="say">Yağış ihtimali</th><th class="say">Rüzgâr</th></tr></thead><tbody>).*?(</tbody>)', tablo, t, count=1, flags=re.S)
        t = re.sub(r'(<small class="sw-not">)Meteoroloji Genel Müdürlüğü tahmini · [^<]*(</small>)', lambda m: m.group(1) + H['kaynak'] + m.group(2), t, count=1)
    return t

def puan_satirlari(S):
    PT = S.V['puan_tablosu']
    tak = []
    for x in PT['takimlar']:
        tak.append(dict(x, O=x['G'] + x['B'] + x['M'], P=3 * x['G'] + x['B'], AV=x['A'] - x['Y']))
    tak.sort(key=lambda x: (-x['P'], -x['AV'], -x['A']))
    return tak

def puan(t, S, dosya):
    PT = S.V['puan_tablosu']
    genel = puan_satirlari(S)
    kod = {x['ad'] for x in genel}
    def av(n): return f'+{n}' if n > 0 else (f'{n}' if n < 0 else '+0')
    def satirlar(liste, sinif=True):
        out = ''
        for i, x in liste:
            s = ''
            if sinif: s = 'sl' if i <= 2 else ('al' if i <= 4 else ('kd' if i > len(genel) - 3 else ''))
            out += (f'<tr class="{s}"><td>{i}</td><td class="sw-tkh"><span class="sw-arma k" style="background:{x["renk"]}">{x["kod"]}</span>{x["ad"]}</td>'
                    f'<td class="say">{x["O"]}</td><td class="say">{x["G"]}</td><td class="say">{x["B"]}</td><td class="say">{x["M"]}</td>'
                    f'<td class="say">{x["A"]}</td><td class="say">{x["Y"]}</td><td class="say">{av(x["AV"])}</td><td class="say"><b>{x["P"]}</b></td></tr>')
        return out
    def tablo(m):
        tb = m.group(0); ad = m.group(1)
        if ad not in ('Süper Lig', 'Genel', 'İç saha', 'Dış saha'): return tb
        govde = re.search(r'<tbody>(.*?)</tbody>', tb, re.S)
        if not govde: return tb
        adlar = re.findall(r'</span>([^<]+)</td>', govde.group(1))
        if not adlar or not set(adlar) <= kod: return tb   # Süper Lig dışı tablo
        n = len(re.findall(r'<tr\b', govde.group(1)))
        if ad in ('İç saha', 'Dış saha'):
            ek = 'ic' if ad == 'İç saha' else 'dis'
            liste = [dict(x, G=x[ek][0], B=x[ek][1], M=x[ek][2], A=x[ek][3], Y=x[ek][4]) for x in genel]
            for x in liste: x.update(O=x['G'] + x['B'] + x['M'], P=3 * x['G'] + x['B'], AV=x['A'] - x['Y'])
            liste.sort(key=lambda x: (-x['P'], -x['AV'], -x['A']))
            sinif = False
        else:
            liste = genel; sinif = True
        secim = list(enumerate(liste, 1))[:n]          # kısa tablolar (takım sayfası, bölüm vitrini): ilk n sıra
        return tb[:govde.start(1)] + satirlar(secim, sinif) + tb[govde.end(1):]
    return re.sub(r'<table data-sekme-icerik="([^"]*)"[^>]*>.*?</table>', tablo, t, flags=re.S)

def gecisler(t, S, dosya):
    """Hedefli metin geçişleri (sözlükte 'gecisler'): eski metin varsa yenisiyle değişir; yeni metin eskiyi içermez."""
    for g in S.V.get('gecisler', []):
        dosyalar = g.get('dosyalar', '*')
        if dosyalar != '*' and dosya not in dosyalar: continue
        if g['eski'] in t: t = t.replace(g['eski'], g['yeni'])
    return t

def uygula_sayfa(yol, S, rapor):
    dosya = os.path.basename(yol)
    with open(yol, encoding='utf-8') as f: ilk = f.read()
    t, parca = maskele(ilk)
    t = gecisler(t, S, dosya)
    t = kart_meta(t, S, rapor)
    t = detay_meta(t, S, rapor)
    t = yazar_unvan(t, S, rapor, dosya)
    t = kunye(t, S, dosya)
    t = kategori_adlari(t, S)
    t = son_dakika_sayfa(t, S, dosya)
    t = zaman_listeleri(t, S, dosya)
    t = okuma_gecmisi(t, S, dosya)
    t = isaret(t)
    t = guncellenen(t, S)
    t = banner_meta(t, S)
    t = piyasa(t, S, dosya)
    t = hava(t, S, dosya)
    t = puan(t, S, dosya)
    return ilk, geri(t, parca)

def parca_uret(S, kok, yaz):
    degisen = []
    yol = os.path.join(kok, 'parcalar', 'son-dakika.html')
    t = open(yol, encoding='utf-8').read()
    y = re.sub(r'(<div class="serit">).*?(</div>)', lambda m: m.group(1) + serit_uret(S) + m.group(2), t, count=1, flags=re.S)
    if y != t:
        degisen.append(yol)
        if yaz: open(yol, 'w', encoding='utf-8').write(y)
    yol = os.path.join(kok, 'parcalar', 'footer.html')
    t = open(yol, encoding='utf-8').read()
    y = t
    for b, s in S.V['son_dakika'].get('footer_bildirim', {}).items():
        y = re.sub(r'(<b>' + re.escape(b) + r'</b><small>[^<]*· )\d\d\.\d\d(</small>)', lambda m, s=s: m.group(1) + s + m.group(2), y)
    if y != t:
        degisen.append(yol)
        if yaz: open(yol, 'w', encoding='utf-8').write(y)
    return degisen

# ---------------------------------------------------------------- doğrulama
def dogrula(S, kok):
    hata = []
    # puan tablosu
    tak = puan_satirlari(S)
    G = sum(x['G'] for x in tak); M = sum(x['M'] for x in tak); B = sum(x['B'] for x in tak)
    A = sum(x['A'] for x in tak); Y = sum(x['Y'] for x in tak)
    hafta = S.V['puan_tablosu']['oynanan_hafta']
    if G != M: hata.append(f'puan: ΣG {G} ≠ ΣM {M}')
    if B % 2: hata.append(f'puan: ΣB {B} tek')
    if A != Y: hata.append(f'puan: ΣA {A} ≠ ΣY {Y}')
    for x in tak:
        if x['O'] != hafta: hata.append(f'puan: {x["ad"]} {x["O"]} maç')
        ic, dis = x['ic'], x['dis']
        if [i + d for i, d in zip(ic, dis)] != [x['G'], x['B'], x['M'], x['A'], x['Y']]: hata.append(f'puan: {x["ad"]} iç+dış ≠ genel')
    if (G + B // 2) * 2 != len(tak) * hafta: hata.append('puan: maç sayısı tutmuyor')
    ic = [sum(x['ic'][i] for x in tak) for i in range(5)]; dis = [sum(x['dis'][i] for x in tak) for i in range(5)]
    if (ic[0], ic[1], ic[2], ic[3]) != (dis[2], dis[1], dis[0], dis[4]): hata.append(f'puan: iç/dış saha lig toplamı tutmuyor {ic} / {dis}')
    # haberler: tarih/saat şimdiden önce; yazar bölüm havuzunda
    for h in S.V['haberler']:
        if (h['tarih'], dk(h['saat'])) > (S.simdi_t, S.simdi_s): hata.append(f'haber gelecekte: {h["baslik"]}')
        if h.get('yazar') and h['yazar'] not in S.yazar: hata.append(f'yazar sözlükte yok: {h["yazar"]} ({h["baslik"]})')
        elif h.get('yazar') and S.yazar[h['yazar']]['alan'] != h['bolum']: hata.append(f'yazar bölüm dışı: {h["yazar"]} / {h["bolum"]} ({h["baslik"]})')
    # son dakika: şimdiden önce, şerit listede
    SD = S.V['son_dakika']
    for o in SD['liste']:
        if (o['tarih'], dk(o['saat'])) > (S.simdi_t, S.simdi_s): hata.append(f'son dakika gelecekte: {o["baslik"]}')
        h = S.bul(o['baslik'])
        if h and (h['tarih'], h['saat']) != (o['tarih'], o['saat']): hata.append(f'son dakika ≠ haber: {o["baslik"]} {o["saat"]} / {h["saat"]}')
        if 'borsa' in anahtar(o['baslik']) and 'tamamladı' in o['baslik'] and dk(o['saat']) < 18 * 60: hata.append(f'borsa kapanışı 18.00 öncesi: {o["baslik"]}')
    liste = {anahtar(o['baslik']) for o in SD['liste']}
    for b in SD['serit']:
        if anahtar(b) not in liste: hata.append(f'şerit öğesi listede yok: {b}')
    # site taraması: aynı başlık aynı meta; tek piyasa değeri; hava kutuları
    meta = collections.defaultdict(set)
    for yol in sayfalar(kok):
        t, _ = maskele(open(yol, encoding='utf-8').read())
        for m in KART.finditer(t):
            k = m.group(0); b = BASLIK.search(k)
            if not b: continue
            key = anahtar(b.group(2)); h = S.haber.get(key)
            if not h: continue
            d = re.search(r'fa-calendar-day"></i>(\d{1,2} \w+(?: \d{4})?)', k)
            v = re.search(r'fa-eye"></i>(\d[\d.,]* B)<', k)
            y = re.search(r'class="imza"><span class="av">[^<]*</span><b>([^<]*)</b>', k) or re.search(r'class="yz"><span class="av">[^<]*</span>([^<]*)<', k)
            meta[h['baslik']].add((t_coz(d.group(1)) if d else None, v.group(1) if v else None, y.group(1) if y else None))
    for b, ks in meta.items():
        for alan, ad in ((0, 'tarih'), (1, 'görüntülenme'), (2, 'yazar')):
            deg = {k[alan] for k in ks if k[alan]}
            if len(deg) > 1: hata.append(f'{ad} farklı: {b}: {sorted(deg)}')
    P = S.V['piyasa']
    for a in P['araclar']:
        for etk in a.get('serit', []):
            for yol in sayfalar(kok):
                t, _ = maskele(open(yol, encoding='utf-8').read())
                for v in re.findall(r'class="sw-ps"><small>' + re.escape(etk) + r'(?: · satış)?</small><b>([^<]*)</b>', t):
                    if v != a['deger']: hata.append(f'piyasa {etk}: {os.path.basename(yol)} {v} ≠ {a["deger"]}')
    for yol in sayfalar(kok):
        dosya = os.path.basename(yol)
        t, _ = maskele(open(yol, encoding='utf-8').read())
        # detay künyesi = sözlük
        m1 = re.search(r'<h1[^>]*>(.*?)</h1>', t, re.S); h = S.bul(m1.group(1)) if m1 else None
        dm = re.search(r'<div class="dt-meta">.*?fa-calendar-day"></i>(\d{1,2} \w+ \d{4})(?: · (\d\d\.\d\d))?', t, re.S)
        if h and dm and (t_coz(dm.group(1)) != h['tarih'] or (dm.group(2) and dm.group(2) != h['saat'])):
            hata.append(f'detay künyesi ≠ sözlük: {dosya} {dm.group(1)} {dm.group(2)} / {h["tarih"]} {h["saat"]}')
        # zaman akışı: bugünün grubunda şimdiden sonraki saat yalnızca "Yakında" öğede
        for zm in re.finditer(r'<div class="za-gun">[^<]*<small>' + t_uzun(S.simdi_t) + r'</small></div>(.*?)(?=<div class="za-gun">|</div>)', t, re.S):
            for o in re.findall(r'<a class="za-s[^"]*"[^>]*><time>(\d\d\.\d\d)</time>(.*?)</a>', zm.group(1), re.S):
                if dk(o[0]) > S.simdi_s and 'Yakında' not in o[1]: hata.append(f'zaman akışında gelecek saat: {dosya} {o[0]}')
    hv = []
    for ad in ('index.html', 'hava-durumu.html'):
        yol = os.path.join(kok, ad)
        if not os.path.exists(yol): continue
        t = open(yol, encoding='utf-8').read()
        if ad == 'index.html':
            m = re.search(r'<div class="ay-sicak">(−?\d+)<sup>.*?<div class="ay-gunler">(.*?)</div></div>', t, re.S)
            if m: hv.append((m.group(1), re.findall(r'<b>(−?\d+)°<span>(−?\d+)°', m.group(2))))
        else:
            m = re.search(r'<div class="sv-deger"><i[^>]*></i><b>(−?\d+)°</b>.*?<div class="sv-gunler">(.*?)</div></div>', t, re.S)
            if m: hv.append((m.group(1), re.findall(r'<b>(−?\d+)°</b><em>(−?\d+)°', m.group(2))[1:]))
    if len(hv) == 2 and hv[0] != hv[1]: hata.append(f'hava kutuları farklı: {hv}')
    return hata

# ---------------------------------------------------------------- sözlük tamamlama (sitede olup sözlükte olmayan başlıklar)
def menu_haritasi(kok):
    t = open(os.path.join(kok, 'parcalar', 'ust.html'), encoding='utf-8').read()
    harita = {}
    for m in re.finditer(r'<li class="mm"><a href="[^"]*" class="mm-a"[^>]*>([^<]+)<.*?(?=<li class="mm">|</ul></nav>)', t, re.S):
        bolum = m.group(1).strip()
        for ad in re.findall(r'<li><a href="[^"]*">([^<]+)</a></li>', m.group(0)):
            harita.setdefault(ad.strip(), bolum)
        harita[bolum] = bolum
    return harita

def tc_var(oc):
    return any(o['tarih'] for o in oc)

def sozluk_tamamla(V, kok):
    S = Sozluk(V); menu = menu_haritasi(kok)
    bolumler = set(S.havuz) - {'Köşe'}
    goz = collections.defaultdict(list)
    for yol in sayfalar(kok):
        dosya = os.path.basename(yol)
        t, _ = maskele(open(yol, encoding='utf-8').read())
        yolm = re.search(r'<nav class="ls-yol"[^>]*>(.*?)</nav>', t, re.S)
        kirinti = [duz(x) for x in re.findall(r'<a href="(?!index)[^"]*">(.*?)</a>|<span>([^<]*)</span>', yolm.group(1)) for x in x if x] if yolm else []
        sayfa_bolum = next((menu.get(k) for k in kirinti if menu.get(k) in bolumler), None)
        h1 = re.search(r'<h1[^>]*>(.*?)</h1>', t, re.S)
        h1 = duz(h1.group(1)) if h1 else ''
        for m in KART.finditer(t):
            k = m.group(0); b = BASLIK.search(k)
            if not b: continue
            cip = re.search(r'<span class="(?:cip|cam|kas)">(?:<i[^>]*></i>)?([^<]+)<', k)
            href = re.search(r'<h[1-3][^>]*>\s*<a href="([^"#?]*)', k)
            if href and href.group(1).startswith('http'): continue
            d = re.search(r'fa-calendar-day"></i>(\d{1,2} \w+(?: \d{4})?)', k)
            v = re.search(r'fa-eye"></i>(\d[\d.,]* B)<', k)
            s = re.search(r'fa-clock"></i>(\d+ dk)<', k)
            y = re.search(r'class="imza"><span class="av">[^<]*</span><b>([^<]*)</b>', k) or re.search(r'class="yz"><span class="av">[^<]*</span>([^<]*)<', k)
            zm = re.search(r'<time datetime="(\d{4}-\d\d-\d\d)T(\d\d):(\d\d)"', k)
            goz[anahtar(b.group(2))].append(dict(baslik=duz(b.group(2)), dosya=dosya, cip=cip.group(1).strip() if cip else None,
                href=href.group(1) if href else None, tarih=t_coz(d.group(1)) if d else (zm.group(1) if zm else None),
                saat=f'{zm.group(2)}.{zm.group(3)}' if zm else None,
                goruntulenme=v.group(1) if v else None, sure=s.group(1) if s else None, yazar=y.group(1) if y else None,
                sayfa_bolum=sayfa_bolum, h1=h1, kirinti=kirinti))
        for m in re.finditer(r'<article class="gn-k">.*?<h3><a href="([^"#?]*)[^"]*">(.*?)</a></h3>.*?ilk yayın (\d{1,2} \w+)(?: (\d\d\.\d\d))?', t, re.S):
            goz[anahtar(m.group(2))].append(dict(baslik=duz(m.group(2)), dosya=dosya, cip=None, href=m.group(1), tarih=t_coz(m.group(3)), saat=m.group(4),
                goruntulenme=None, sure=None, yazar=None, sayfa_bolum=sayfa_bolum, h1=h1, kirinti=kirinti, detay=bool(m.group(4))))
        # başlık geçen diğer yerler: zaman akışı, açılış paneli, hesap satırları (meta yok; yalnızca kayıt açar)
        gun = None
        for m in re.finditer(r'<div class="za-gun">.*?<small>(\d{1,2} \w+ \d{4})</small>|<a class="za-s[^"]*" href="([^"#?]*)[^"]*"><time>(\d\d\.\d\d)?[^<]*</time><span class="za-kat">(?:<i[^>]*></i>)?([^<]*)</span><h3>(.*?)</h3>', t, re.S):
            if m.group(1): gun = t_coz(m.group(1)); continue
            goz[anahtar(m.group(5))].append(dict(baslik=duz(m.group(5)), dosya=dosya, cip=m.group(4), href=m.group(2), tarih=None, saat=m.group(3) if gun else None,
                goruntulenme=None, sure=None, yazar=None, sayfa_bolum=sayfa_bolum, h1=h1, kirinti=kirinti, zayif_tarih=gun))
        for m in re.finditer(r'<a href="([^"#?]*)[^"]*" class="bn-one">(?:<span class="cip">(?:<i[^>]*></i>)?([^<]*)</span>)?<h2>(.*?)</h2>(.*?)</a>', t, re.S):
            v = re.search(r'fa-eye"></i>(\d[\d.,]* B)<', m.group(4))
            goz[anahtar(m.group(3))].append(dict(baslik=duz(m.group(3)), dosya=dosya, cip=m.group(2), href=m.group(1), tarih=None, saat=None,
                goruntulenme=v.group(1) if v else None, sure=None, yazar=None, sayfa_bolum=sayfa_bolum, h1=h1, kirinti=kirinti))
        for m in re.finditer(r'<a href="([^"#?]*)[^"]*" class="bn-y[^"]*"><small>([^<]*)</small><b>(.*?)</b></a>', t, re.S):
            goz[anahtar(m.group(3))].append(dict(baslik=duz(m.group(3)), dosya=dosya, cip=m.group(2), href=m.group(1), tarih=None, saat=None,
                goruntulenme=None, sure=None, yazar=None, sayfa_bolum=sayfa_bolum, h1=h1, kirinti=kirinti))
        if dosya.startswith('hesabim'):
            for m in re.finditer(r'<a class="hs-satir" href="([^"#?]*)[^"]*">.*?<b>([^<]+)</b>\s*<small>· ([^<·]*)</small>', t, re.S):
                goz[anahtar(m.group(2))].append(dict(baslik=duz(m.group(2)), dosya=dosya, cip=m.group(3).strip(), href=m.group(1), tarih=None, saat=None,
                    goruntulenme=None, sure=None, yazar=None, sayfa_bolum=None, h1=h1, kirinti=[]))
        if 'class="dt-meta"' in t and h1:
            mm = re.search(r'<div class="dt-meta">(.*?)</div>', t, re.S).group(1)
            y = re.search(r'<span class="dt-yz"><span class="av">[^<]*</span><span><b>(.*?)</b>', mm, re.S)
            d = re.search(r'fa-calendar-day"></i>(\d{1,2} \w+ \d{4})(?: · (\d\d\.\d\d))?', mm)
            v = re.search(r'fa-eye"></i>(\d[\d.,]* B)<', mm)
            goz[anahtar(h1)].append(dict(baslik=h1, dosya=dosya, cip=None, href=dosya, tarih=t_coz(d.group(1)) if d else None,
                saat=d.group(2) if d else None, goruntulenme=v.group(1) if v else None, sure=None,
                yazar=duz(y.group(1)) if y else None, sayfa_bolum=sayfa_bolum, h1=h1, kirinti=kirinti, detay=True))
    for o in V['son_dakika']['liste']:
        goz[anahtar(o['baslik'])].insert(0, dict(baslik=o['baslik'], dosya='son-dakika.html', cip=o['kat'], href=None, tarih=o['tarih'], saat=o['saat'],
            goruntulenme=None, sure=o['sure'], yazar=None, sayfa_bolum=None, h1='', kirinti=[], detay=True))
    eklenen = 0
    for key, oc in goz.items():
        if key in S.haber: continue
        sayac = lambda alan: collections.Counter(o[alan] for o in oc if o[alan])
        hrefc = sayac('href'); href = hrefc.most_common(1)[0][0] if hrefc else None
        # bölüm
        if href in DETAY_BOLUM: bolum = DETAY_BOLUM[href]
        elif any(o['dosya'] in ('kadin-yazarlar.html', 'yazar.html') for o in oc): bolum = 'Köşe'
        else:
            bolum = None
            for o in oc:
                c = o['cip']
                if c and menu.get(c) in bolumler: bolum = menu[c]; break
            bolum = bolum or next((o['sayfa_bolum'] for o in oc if o['sayfa_bolum']), None) or 'Keşfet'
        # alt konu
        alt = None
        for o in oc:
            if len(o['kirinti']) >= 2 and menu.get(o['kirinti'][-1]) == bolum: alt = o['kirinti'][-1]; break
        if not alt:
            c = next((o['cip'] for o in oc if o['cip'] and o['cip'] != bolum), None)
            alt = c
        # yazar
        havuz = S.havuz.get(bolum, [])
        sabit = next((o for o in oc if o['dosya'] == 'yazar.html'), None)   # yazar profilindeki yazılar o yazarın
        if sabit and S.ad_coz(sabit['yazar'] or ''): yazar = S.ad_coz(sabit['yazar'])
        else:
            aday = collections.Counter()
            for o in oc:
                if o['yazar']:
                    r = S.ad_coz(o['yazar'])
                    if r in havuz: aday[r] += 2 if o.get('detay') else 1
            yazar = aday.most_common(1)[0][0] if aday else (havuz[ozet(key) % len(havuz)] if havuz else None)
        if not havuz: yazar = None
        detay_imza = [o['yazar'] for o in oc if o.get('detay') and o['yazar']]
        if detay_imza and not S.ad_coz(detay_imza[0]): yazar = None      # kurum ya da bülten imzası
        # tarih: detay sayfası önce, sonra çoğunluk (eşitlikte en yeni)
        det = next((o for o in oc if o.get('detay') and o['tarih']), None)
        if det: tarih = det['tarih']
        else:
            tc = sayac('tarih')
            enc = max(tc.values()) if tc else 0
            tarih = max([d for d, n in tc.items() if n == enc]) if tc else S.simdi_t
        if not tc_var(oc) and not det:
            zt = [o.get('zayif_tarih') for o in oc if o.get('zayif_tarih')]
            if zt: tarih = min(zt)
        tarih = min(tarih, S.simdi_t)
        saat = (det or {}).get('saat') or next((o['saat'] for o in oc if o['saat'] and (o['tarih'] or o.get('zayif_tarih')) == tarih), None)
        if not saat:
            if tarih == S.simdi_t: saat = saat_yaz(390 + (ozet(key) % ((S.simdi_s - 10 - 390) // 5)) * 5)
            else: saat = saat_yaz(420 + (ozet(key) % 186) * 5)
        if tarih == S.simdi_t and dk(saat) > S.simdi_s: saat = saat_yaz(S.simdi_s - 5)
        vc = [o['goruntulenme'] for o in oc if o['goruntulenme']]
        det_v = (det or {}).get('goruntulenme')
        gor = det_v or (max(vc, key=lambda x: float(x.split()[0].replace('.', '').replace(',', '.'))) if vc else f'{1 + ozet(key) % 9},{ozet(key) // 9 % 10} B')
        sc = sayac('sure')
        sure = sc.most_common(1)[0][0] if sc else None
        kayit = dict(baslik=oc[0]['baslik'], bolum=bolum, alt_konu=alt, yazar=yazar, tarih=tarih, saat=saat,
                     goruntulenme=gor, sure=sure, detay=href)
        kayit = kayit_duzen({k: v for k, v in kayit.items() if v is not None})
        V['haberler'].append(kayit); S.haber[key] = kayit; eklenen += 1
    return eklenen

# ---------------------------------------------------------------- ana akış
def main():
    V = yukle()
    if '--sozluk-tamamla' in BAYRAK:
        n = sozluk_tamamla(V, KOK); kaydet(V)
        print(f'sözlüğe eklenen başlık: {n} · toplam {len(V["haberler"])}'); return
    S = Sozluk(V)
    if '--dogrula' in BAYRAK:
        h = dogrula(S, KOK)
        print('\n'.join(h) if h else 'doğrulama: sorun yok'); sys.exit(1 if h else 0)
    yaz = '--kontrol' not in BAYRAK
    rapor = collections.defaultdict(set); degisen = []
    for yol in sayfalar(KOK):
        ilk, yeni = uygula_sayfa(yol, S, rapor)
        if yeni != ilk:
            degisen.append(os.path.basename(yol))
            if yaz:
                with open(yol, 'w', encoding='utf-8') as f: f.write(yeni)
    if '--parca' in BAYRAK:
        degisen += [os.path.relpath(p, KOK) for p in parca_uret(S, KOK, yaz)]
    print(f'{"değişecek" if not yaz else "değişen"} dosya: {len(degisen)}')
    if degisen and not yaz: print('  ' + ' '.join(degisen))
    if rapor['sozlukte_yok']: print(f'sözlükte olmayan kart başlığı: {len(rapor["sozlukte_yok"])} (--sozluk-tamamla ile eklenir)')
    if rapor['yazar_yok']: print('sözlükte olmayan yazar:', ', '.join(sorted(rapor['yazar_yok'])))
    if yaz or '--kontrol' in BAYRAK:
        h = dogrula(S, KOK)
        print('doğrulama:', 'sorun yok' if not h else f'{len(h)} sorun'); [print('  ' + x) for x in h[:40]]

if __name__ == '__main__':
    main()
