"""Boş bağlantı kuralları (lead). araclar/parca.py her sayfada çalıştırır.
Amaç: sitede hiçbir bağlantı "#"e (boşa) gitmesin. Her "#" bağlantısı bağlamına göre gerçek bir sayfaya,
sayfanın kendi süzgeç/sayfalama adresine, resmî kurum adresine ya da paylaşım adresine bağlanır.
Kural sırası önemlidir; eşleşmeyen "#" kalırsa parca.py raporlar."""
import re, urllib.parse

KAYNAK = {
 'Türkiye İstatistik Kurumu':'https://www.tuik.gov.tr','TÜİK Ulusal Veri Yayımlama Takvimi':'https://www.tuik.gov.tr',
 'Resmî Gazete':'https://www.resmigazete.gov.tr','Çalışma ve Sosyal Güvenlik Bakanlığı':'https://www.csgb.gov.tr',
 'Türkiye Cumhuriyet Merkez Bankası':'https://www.tcmb.gov.tr','Karayolları Genel Müdürlüğü':'https://www.kgm.gov.tr',
 'Yükseköğretim Kurulu':'https://www.yok.gov.tr','Meteoroloji Genel Müdürlüğü':'https://www.mgm.gov.tr',
 'Çevre, Şehircilik ve İklim Değişikliği Bakanlığı':'https://csb.gov.tr','Elektronik Kamu Alımları Platformu':'https://ekap.kik.gov.tr',
 'Ölçme, Seçme ve Yerleştirme Merkezi':'https://www.osym.gov.tr','2026 YKS Kılavuzu':'https://www.osym.gov.tr',
 'İstanbul Valiliği':'https://www.istanbul.gov.tr','Sağlık Bakanlığı':'https://www.saglik.gov.tr','Dünya Sağlık Örgütü':'https://www.who.int',
 'Bilgi Teknolojileri ve İletişim Kurumu':'https://www.btk.gov.tr','BTK Elektronik Haberleşme Pazar Verileri':'https://www.btk.gov.tr',
 'Ulaştırma ve Altyapı Bakanlığı':'https://www.uab.gov.tr','Kütüphaneler ve Yayımlar Genel Müdürlüğü':'https://kygm.ktb.gov.tr',
 'BM İklim Değişikliği Çerçeve Sözleşmesi Sekreteryası':'https://unfccc.int','Uyum Finansmanı Ek Kararı':'https://unfccc.int',
 'Savunma Sanayii Başkanlığı':'https://www.ssb.gov.tr','Savunma ve Havacılık Sanayii İmalatçılar Derneği':'https://www.sasad.org.tr',
 'Strateji ve Bütçe Başkanlığı':'https://www.sbb.gov.tr','Türkiye Futbol Federasyonu':'https://www.tff.org',
 'Kulüp Lisans ve Finansal Kontrol Talimatı':'https://www.tff.org','Futbolcu Statüsü ve Transferleri Talimatı':'https://www.tff.org',
 'AFAD':'https://www.afad.gov.tr','Bankacılık Düzenleme ve Denetleme Kurumu':'https://www.bddk.org.tr','Bankalararası Kart Merkezi':'https://bkm.com.tr',
 'Türk Borçlar Kanunu':'https://www.mevzuat.gov.tr','TBMM Sağlık, Aile, Çalışma ve Sosyal İşler Komisyonu':'https://www.tbmm.gov.tr',
 'Aile ve Sosyal Hizmetler Bakanlığı':'https://www.aile.gov.tr','Dada Haber':'index.html',
}
ACILIR = {'giris':'giris.html','kayit':'uye-ol.html','sifre':'sifremi-unuttum.html','uyelik':'giris.html','cerez':'cerez-politikasi.html',
          'bildirim':'hesabim-bildirimler.html','izin':'hesabim-bildirimler.html','gorus':'iletisim.html','paylas':'index.html',
          'dil':'hesabim-tercihler.html','sehir':'hava-durumu.html','arama':'arama.html','gorunum':'hesabim-tercihler.html',
          'onay':'hesabim-gizlilik.html','bulten':'bulten.html','hesap':'hesabim.html'}
PAYLAS = {'X':'https://x.com/intent/post?url={u}','Facebook':'https://www.facebook.com/sharer/sharer.php?u={u}','WhatsApp':'https://wa.me/?text={u}',
          'Telegram':'https://t.me/share/url?url={u}','LinkedIn':'https://www.linkedin.com/sharing/share-offsite/?url={u}','E-posta':'mailto:?body={u}'}
MAGAZA = {'App Store':'https://apps.apple.com/','Google Play':'https://play.google.com/store/apps'}

def _slug(x):
    tr = str.maketrans('çğıöşüÇĞİÖŞÜâîû', 'cgiosuCGIOSUaiu')
    return re.sub(r'[^a-z0-9]+', '-', re.sub(r'<[^>]+>', ' ', x).translate(tr).lower()).strip('-') or 'secim'

def uygula(t, dosya):
    kendi = dosya
    url = urllib.parse.quote(f'https://dadahaber.com/{dosya}', safe='')
    def a_isle(m):
        bas, attrs, ic = m.group(0)[:2], m.group(1), m.group(2)
        if 'href="#"' not in attrs: return m.group(0)
        metin = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', ic)).strip()
        aria = (re.search(r'aria-label="([^"]*)"', attrs) or [None, ''])[1]
        cls = (re.search(r'class="([^"]*)"', attrs) or [None, ''])[1]
        acilir = re.search(r'data-acilir="([^"]+)"', attrs)
        hedef = None
        if acilir: hedef = ACILIR.get(acilir.group(1), 'index.html')
        elif 'dt-pay-d' in cls or aria.endswith('paylaş') or aria.endswith("'ta paylaş") or 'ile paylaş' in aria:
            for k, v in PAYLAS.items():
                if aria.startswith(k): hedef = v.format(u=url)
            if 'kopyala' in aria.lower():
                yeni = attrs.replace('href="#"', 'type="button" data-toast="Bağlantı kopyalandı"')
                return f'<button{yeni}>{ic}</button>'
        elif 'sw-mac' in cls or 'sw-fk' in cls: hedef = 'mac-detay.html'
        elif 'sw-tv' in cls:
            if re.search(r'ÖSYM|YKS|KPSS|ALES|YDS|YÖKDİL|Tercih|Sınav', metin): hedef = 'sinav-takvimi.html'
            elif re.search(r'TCMB|PMI|TÜFE|Fed|ECB|Enflasyon|enflasyon|İşsizlik|işsizlik|Güven|Faiz|faiz|GSYH|Bütçe|PPK|Endeks', metin): hedef = 'ekonomik-takvim.html'
            else: hedef = 'gundem-takvimi.html'
        elif 'sw-pk' in cls: hedef = 'enstruman-detay.html'
        elif 'sw-tr' in cls: hedef = 'transfer.html'
        elif 'tc-a' in cls: hedef = 'takimlar.html'
        elif 'ft-mag' in cls or metin.endswith('App Store') or metin.endswith('Google Play'):
            hedef = MAGAZA['App Store'] if 'App Store' in metin else MAGAZA['Google Play']
        elif 'gd-dugme' in cls or 'fr-dugme' in cls:
            if 'Giriş Yap' in metin: hedef = 'giris.html'; attrs += ' data-acilir="giris"'
            elif 'Üye Ol' in metin or 'Üye ol' in metin: hedef = 'uye-ol.html'; attrs += ' data-acilir="kayit"'
            elif 'Google' in metin or 'Apple' in metin: hedef = 'hesap-bagla.html'
            else: hedef = f'{kendi}?gonderildi=1'; attrs += ' data-toast="Gönderildi"'
        elif aria.endswith('kaynağını aç'):
            ad = aria[:-len(' kaynağını aç')]
            hedef = KAYNAK.get(ad, 'yayin-ilkeleri.html#b2')
        elif 'ls-cip' in cls or 'cp-sec' in cls or cls.startswith('sec') or ' sec' in cls:
            hedef = f'{kendi}?secim={_slug(metin or aria)}'
        elif aria in ('Önceki', 'Sonraki') or 'aktif' == cls or re.fullmatch(r'\d+', metin or ''):
            n = '1' if aria == 'Önceki' else ('2' if aria == 'Sonraki' else (metin or '1'))
            hedef = f'{kendi}?sayfa={n}'
        elif 'Yeniden gönder' in metin: hedef = f'{kendi}?gonderildi=1'; attrs += ' data-toast="Bağlantı yeniden gönderildi"'
        else: hedef = f'{kendi}?secim={_slug(metin or aria or "oge")}'
        return f'<a{attrs.replace(chr(34)+"#"+chr(34), chr(34)+hedef+chr(34), 1)}>{ic}</a>'
    return re.sub(r'<a\b([^>]*)>(.*?)</a>', a_isle, t, flags=re.S)
