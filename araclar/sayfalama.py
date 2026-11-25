#!/usr/bin/env python3
"""Ortak sayfalama bileşeni (Dada Haber prototip · Beyar 2026-11-25). Tek kaynak: HTML burada üretilir.

araclar/parca.py her çalıştırmada sayfalardaki her <nav class="ls-sayfa"> öğesini bu kalıba getirir; elle yazılmış
sayfalama kalmaz. Sunucu tarafı da aynı kalıbı üretir; tarayıcıda assets/js/ortak.js aynı algoritmayla adresteki
?sayfa= değerine göre yeniden çizer (seçili sayfa, kayıtlar, adres, liste başına kaydırma).

Girdi öğesi:  <nav class="ls-sayfa" aria-label="Sayfalar" data-toplam="12" [data-sekme="haberler"]>
  data-toplam  toplam sayfa sayısı (yoksa mevcut içerikteki en büyük numaradan alınır: ilk geçiş)
  data-sekme   sayfalama bir sekmenin içindeyse o sekme (adres ?sekme=…&sayfa=N olur)

Kurallar:
  · Sıra: en başa, önceki, numaralar, sonraki, en sona; ortalı, tek satır.
  · Numaralar en çok 7 kutu. Toplam ≤ 7 ise hepsi, "…" yok. Fazlaysa 1 … 4 5 6 … 12 biçimi; "…" yalnız sayfa atlanınca.
  · İlk sayfada en başa/önceki, son sayfada sonraki/en sona pasif (gizlenmez, yer değiştirmez).
  · Toplam 1 ise sayfalama görünmez (hidden).
  · Telefonda numaralar yerine "3 / 12" (.sf-ozet); CSS ile."""
import re
from html import escape

def ogeler(toplam, secili):
    """Görünecek numara kutuları; 0 = '…' (atlanan sayfalar). En çok 7 kutu."""
    T, c = toplam, secili
    if T <= 7: return list(range(1, T + 1))
    if c <= 4: return [1, 2, 3, 4, 5, 0, T]
    if c >= T - 3: return [1, 0, T - 4, T - 3, T - 2, T - 1, T]
    return [1, 0, c - 1, c, c + 1, 0, T]

def _adres(dosya, n, sekme):
    return f'{dosya}?sekme={escape(sekme)}&amp;sayfa={n}' if sekme else f'{dosya}?sayfa={n}'

def _ok(dosya, n, sekme, etiket, ikon, pasif):
    if pasif:
        return f'<a class="sf-ok pasif" role="link" aria-disabled="true" aria-label="{etiket}"><i class="fa-solid {ikon}"></i></a>'
    return f'<a class="sf-ok" href="{_adres(dosya, n, sekme)}" aria-label="{etiket}"><i class="fa-solid {ikon}"></i></a>'

def ic(dosya, toplam, secili=1, sekme=None):
    T = max(1, int(toplam)); c = min(max(1, int(secili)), T)
    no = ''.join('<span class="sf-ara" aria-hidden="true">…</span>' if n == 0 else
                 (f'<a class="aktif" href="{_adres(dosya, n, sekme)}" aria-current="page">{n}</a>' if n == c else
                  f'<a href="{_adres(dosya, n, sekme)}">{n}</a>') for n in ogeler(T, c))
    return (_ok(dosya, 1, sekme, 'İlk sayfa', 'fa-angles-left', c == 1)
            + _ok(dosya, c - 1, sekme, 'Önceki sayfa', 'fa-chevron-left', c == 1)
            + f'<span class="sf-no">{no}</span>'
            + f'<span class="sf-ozet"><span class="sr">Sayfa </span>{c} / {T}</span>'
            + _ok(dosya, c + 1, sekme, 'Sonraki sayfa', 'fa-chevron-right', c == T)
            + _ok(dosya, T, sekme, 'Son sayfa', 'fa-angles-right', c == T))

def nav(dosya, toplam, secili=1, sekme=None):
    T = max(1, int(toplam))
    ek = f' data-sekme="{escape(sekme)}"' if sekme else ''
    if T == 1:
        return f'<nav class="ls-sayfa" aria-label="Sayfalar" data-toplam="1"{ek} hidden></nav>'
    return f'<nav class="ls-sayfa" aria-label="Sayfalar" data-toplam="{T}"{ek}>{ic(dosya, T, secili, sekme)}</nav>'

def uygula(t, dosya):
    """Sayfadaki bütün sayfalamaları ortak kalıba getirir (ilk sayfa hali)."""
    def bir(m):
        bas, govde = m.group(1), m.group(2)
        tp = re.search(r'data-toplam="(\d+)"', bas)
        if tp: T = int(tp.group(1))
        else:
            nums = [int(x) for x in re.findall(r'>(\d+)</a>', govde)]
            T = max(nums) if nums else 1
        sk = re.search(r'data-sekme="([^"]+)"', bas) or re.search(r'[?&](?:amp;)?sekme=([^&"]+)', govde)
        return nav(dosya, T, 1, sk.group(1) if sk else None)
    return re.sub(r'<nav class="ls-sayfa"([^>]*)>(.*?)</nav>', bir, t, flags=re.S)

if __name__ == '__main__':
    for T in (1, 2, 4, 7, 8, 12, 346):
        for c in sorted({1, 2, 4, 5, 6, T - 3, T - 1, T} & set(range(1, T + 1))):
            print(T, c, ' '.join('…' if n == 0 else (f'[{n}]' if n == c else str(n)) for n in ogeler(T, c)))
