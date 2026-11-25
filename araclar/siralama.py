#!/usr/bin/env python3
"""Liste sıralama seçicisi (Dada Haber prototip · Beyar 2026-11-25). Tek kaynak: HTML burada üretilir; parca.py uygular.

Eski hali yalnız görüntüydü (<span class="ls-sira">). Kalıp: düğme + menü (En yeni · En çok okunan · En eski).
Davranış assets/js/ortak.js "Sayfalama" içinde: seçim adresi günceller (?sira=, sayfa 1'e döner), liste kayıtları
o sıraya göre dizilir, sayfalama yeniden çizilir. Sunucuda sıralama gerçek sorgudur."""
import re

SECENEK = [('yeni', 'En yeni'), ('okunan', 'En çok okunan'), ('eski', 'En eski')]

def kalip():
    menu = ''.join(f'<button type="button" role="menuitemradio" aria-checked="{"true" if k == "yeni" else "false"}" data-sira="{k}">{ad}<i class="fa-solid fa-check"></i></button>'
                   for k, ad in SECENEK)
    return ('<span class="ls-sira-k"><button type="button" class="ls-sira" aria-haspopup="menu" aria-expanded="false">'
            '<i class="fa-solid fa-arrow-down-wide-short"></i>Sıralama: <b>En yeni</b><i class="fa-solid fa-chevron-down"></i></button>'
            f'<span class="ls-sira-menu" role="menu" aria-label="Sıralama" hidden>{menu}</span></span>')

def uygula(t):
    t = re.sub(r'<span class="ls-sira-k">.*?</span></span></span>', kalip(), t, flags=re.S)  # yeni kalıp: güncel tut
    return re.sub(r'<span class="ls-sira">.*?</span>', kalip(), t, flags=re.S)           # eski görüntü: çevir
