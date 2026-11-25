#!/usr/bin/env python3
"""Yazar adları yazar sayfasına bağlanır (Dada Haber prototip · Beyar 2026-11-25: "yazarlara tıklanmıyor").
parca.py her sayfada uygular; tekrar çalıştırmak bir şeyi değiştirmez.

  · Kart imzası   <div class="imza"><span class="av">H</span><b>Ad</b>        → ad ve baş harf tek bağlantı (a.yz-bag)
  · Detay künyesi <span class="dt-yz"><span class="av">…</span><span><b>Ad</b><small>Unvan</small></span></span>
  · Manşet satırı <span class="yz"><span class="av">H</span>Ad</span>
  · Yazar kartları (a.yz1) ve "yazar.html" giden ad bağlantıları
Hedef: yazar.html?ad=<kısa-ad>. Yalnız örnek verideki yazarlar (araclar/ornek_veri.json "yazarlar"); okur yorumlarındaki
adlar yazar değildir, bağlanmaz. Yazar sayfası adresteki yazarı gösterir: yazar.html'e örnek veri (#yazar-veri) yazılır,
ortak.js "Yazar sayfası" ad, baş harf ve unvanı doldurur. Sunucuda bu gerçek yazar kaydıdır.
Kart içinde bağlantı kendi işini yapar; kartın geri kalanı haberi açar (ortak.js "Kartın tamamı tıklanır")."""
import re, json, os
from html import escape

_VERI = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ornek_veri.json'), encoding='utf-8'))
YAZAR = {y['ad']: y for y in _VERI['yazarlar']}
_TR = str.maketrans('çğıöşüâîûÇĞİIÖŞÜÂÎÛ', 'cgiosuaiuCGIIOSUAIU')

def kisa(ad):
    return re.sub(r'[^a-z0-9]+', '-', ad.translate(_TR).lower()).strip('-')

def adres(ad):
    return f'yazar.html?ad={kisa(ad)}'

def uygula(t, dosya):
    def imza(m):
        av, ad = m.group(1), m.group(2)
        if ad not in YAZAR: return m.group(0)
        return f'<div class="imza"><a class="yz-bag" href="{adres(ad)}"><span class="av">{av}</span><b>{ad}</b></a>'
    t = re.sub(r'<div class="imza"><span class="av">([^<]*)</span><b>([^<]+)</b>', imza, t)
    def dtyz(m):
        av, ad, unvan = m.group(1), m.group(2), m.group(3) or ''
        if ad not in YAZAR: return m.group(0)
        return f'<span class="dt-yz"><a class="yz-bag" href="{adres(ad)}"><span class="av">{av}</span><span><b>{ad}</b>{unvan}</span></a></span>'
    t = re.sub(r'<span class="dt-yz"><span class="av">([^<]*)</span><span><b>(?:<a href="yazar\.html[^"]*">)?([^<]+)(?:</a>)?</b>(<small>[^<]*</small>)?</span></span>', dtyz, t)
    def yz(m):
        av, ad = m.group(1), m.group(2)
        if ad not in YAZAR: return m.group(0)
        return f'<span class="yz"><a class="yz-bag" href="{adres(ad)}"><span class="av">{av}</span>{ad}</a></span>'
    t = re.sub(r'<span class="yz"><span class="av">([^<]*)</span>([^<]+)</span>', yz, t)
    def yz1(m):
        ad = re.search(r'<h3>([^<]+)</h3>', m.group(0))
        return m.group(0).replace('href="yazar.html"', f'href="{adres(ad.group(1))}"', 1) if ad and ad.group(1) in YAZAR else m.group(0)
    t = re.sub(r'<a class="yz1" href="yazar\.html"[^>]*>.*?</a>', yz1, t, flags=re.S)
    t = re.sub(r'<a href="yazar\.html">([^<]+)</a>', lambda m: f'<a href="{adres(m.group(1))}">{m.group(1)}</a>' if m.group(1) in YAZAR else m.group(0), t)
    if dosya == 'yazar.html':
        veri = json.dumps([{'k': kisa(y['ad']), 'ad': y['ad'], 'u': y.get('unvan', '')} for y in _VERI['yazarlar']], ensure_ascii=False, separators=(',', ':'))
        etiket = f'<script type="application/json" id="yazar-veri">{veri}</script>'
        t = re.sub(r'<script type="application/json" id="yazar-veri">.*?</script>', etiket, t, flags=re.S) if 'id="yazar-veri"' in t else t.replace('</main>', etiket + '\n</main>', 1)
    return t
