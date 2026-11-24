/* Dada Haber · ortak betik. Belirme animasyonu, otomatik ray, takım seçimi, footer perdesi (Gastro gibi). Sayfada öğe yoksa sessizce geçer. */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('gorundu');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.belir').forEach(el=>io.observe(el));
// Süper Lig T2: kutucuğa tıklayınca seçili takım ve panel güncellenir (önizlemede haberler örnek)
/* Süper Lig takım sekmeleri (Beyar 2026-11-24): armaya tıklayınca sayfa değişmez, altındaki önizleme o takımın haberlerine geçer; bölüm düğmesi seçili takımın sayfasına (4 büyük) ya da Süper Lig'e gider. Ok tuşlarıyla gezilir. */
(()=>{const ray=document.querySelector('.tc-ray[role=tablist]'); if(!ray) return; const s=[...ray.querySelectorAll('.tc-a')], bol=ray.closest('section')||document, git=bol.querySelector('[data-tc-git]');
  const sec=a=>{s.forEach(x=>{const on=x===a; x.classList.toggle('sec',on); x.setAttribute('aria-selected',on); x.tabIndex=on?0:-1;});
    bol.querySelectorAll('[data-tc-panel]').forEach(p=>p.hidden=p.dataset.tcPanel!==a.dataset.ad); if(git) git.setAttribute('href',a.dataset.sayfa||'super-lig.html');};
  s.forEach((a,n)=>{a.tabIndex=a.classList.contains('sec')?0:-1; a.addEventListener('click',()=>sec(a));
    a.addEventListener('keydown',e=>{const rtl=getComputedStyle(ray).direction==='rtl'; let k={ArrowRight:rtl?-1:1,ArrowLeft:rtl?1:-1}[e.key]; if(e.key==='Home') k=-n; if(e.key==='End') k=s.length-1-n; if(k===undefined) return; e.preventDefault(); const h=s[(n+k+s.length)%s.length]; h.focus(); sec(h);});});})();
document.querySelectorAll('.tk-serit .tk').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();
  document.querySelectorAll('.tk-serit .tk').forEach(x=>x.classList.remove('sec'));a.classList.add('sec');
  const p=a.closest('.kap').querySelector('.tk-panel'); if(!p) return;
  p.querySelectorAll('.tk-adi').forEach(s=>s.textContent=a.dataset.ad);
  const ar=p.querySelector('.tk-arma .arma'); ar.textContent=a.dataset.kod; ar.style.background=a.dataset.renk;}));
// Otomatik dönen raylar: her 5 sn'de bir kart kayar; üstüne gelince ve sekme görünmezken durur; prefers-reduced-motion'da kapalı.
const azHareket=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Dar ekran ve dokunmatik (Beyar, mobil revize): raylar gerçek yatay kaydırma; parmakla kayar, kartta durur (scroll-snap).
   Otomatik akış sürer ama dokunuş ya da elle kaydırmadan sonra 8 sn bekler; klon kart yok. */
const darRay=matchMedia('(max-width:1024px), (hover: none)').matches;
document.querySelectorAll('[data-oto]').forEach(kap=>{ if(!darRay) return;
  const iz=kap.firstElementChild; if(!iz) return;
  kap.classList.add('oto-kay'); if(azHareket) return;
  let bekle=0; const durdur=()=>{bekle=Date.now()+8000;};
  ['touchstart','pointerdown','wheel'].forEach(o=>iz.addEventListener(o,durdur,{passive:true}));
  kap.addEventListener('mouseenter',durdur);
  const yon=getComputedStyle(iz).direction==='rtl'?-1:1;
  setInterval(()=>{ if(Date.now()<bekle||document.hidden) return;
    const r=kap.getBoundingClientRect(); if(r.bottom<0||r.top>innerHeight) return;
    const pad=parseFloat(getComputedStyle(iz).paddingInlineStart)||0, x=Math.abs(iz.scrollLeft);
    const son=x+iz.clientWidth>=iz.scrollWidth-4;
    const sonraki=[...iz.children].find(c=>c.offsetLeft-pad>x+4);
    iz.scrollTo({left:(son||!sonraki)?0:(sonraki.offsetLeft-pad)*yon,behavior:'smooth'});
  },5000);
});
document.querySelectorAll('[data-oto]').forEach(kap=>{ if(darRay) return;
  const iz=kap.firstElementChild; if(!iz) return;
  const ilk=[...iz.children]; ilk.forEach(c=>iz.appendChild(c.cloneNode(true)));
  iz.classList.add('oto-iz'); let i=0, dur=false;
  kap.addEventListener('mouseenter',()=>dur=true); kap.addEventListener('mouseleave',()=>dur=false);
  if(azHareket) return;
  setInterval(()=>{ if(dur||document.hidden) return;
    const k=iz.children[0]; const adim=k.getBoundingClientRect().width+parseFloat(getComputedStyle(iz).columnGap||24);
    i++; iz.style.transition='transform .7s ease'; iz.style.transform=`translateX(${-adim*i}px)`;
    if(i>=ilk.length){ setTimeout(()=>{iz.style.transition='none';i=0;iz.style.transform='translateX(0)';},720); }
  },5000);
});

/* Footer perdesi: ≥641px ve footer pencereye sığıyorsa sabit; içerik kayınca altından açılır */
(function(){var f=document.querySelector(".ft"),h=document.documentElement;function ayarla(){if(innerWidth<641){h.classList.remove("perde-acik");document.body.style.paddingBlockEnd="";return}var b=f.offsetHeight;if(b>innerHeight){h.classList.remove("perde-acik");document.body.style.paddingBlockEnd=""}else{h.classList.add("perde-acik");document.body.style.paddingBlockEnd=b+"px"}}addEventListener("resize",ayarla);addEventListener("load",ayarla);ayarla()})();

/* Alt menü çip şeridi (liste kabuğu .am): açılışta seçili çip görünür alana gelir (sayfa kaymaz, yalnız şerit);
   oklar şeridi bir görünür genişliğin %80'i kadar kaydırır. Hareket azaltma tercihinde animasyonsuz. */
document.querySelectorAll('.am .ls-cipler').forEach(serit=>{
  const aktif=serit.querySelector('.ls-cip.aktif');
  if(aktif){ const s=serit.getBoundingClientRect(), a=aktif.getBoundingClientRect();
    if(a.left<s.left||a.right>s.right) serit.scrollLeft+= (a.left-s.left)-(s.width-a.width)/2; }
  const kap=serit.closest('.am-ic'); if(!kap) return;
  const oklar=kap.querySelectorAll('.am-ok'); if(oklar.length<2) return;
  const yon=getComputedStyle(serit).direction==='rtl'?-1:1;
  const kaydir=i=>serit.scrollBy({left:i*yon*serit.clientWidth*.8,behavior:azHareket?'auto':'smooth'});
  oklar[0].addEventListener('click',()=>kaydir(-1)); oklar[1].addEventListener('click',()=>kaydir(1));
  const durum=()=>{ oklar[0].disabled=serit.scrollLeft*yon<=1; oklar[1].disabled=serit.scrollLeft*yon+serit.clientWidth>=serit.scrollWidth-1; };
  serit.addEventListener('scroll',durum,{passive:true}); durum();
});

/* Açılır pencereler (C6): [data-acilir="ad"] → <dialog id="pn-ad">; [data-kapat] ya da arka plana tıklama kapatır.
   Kaydet ve yazar/konu takibi üyelik penceresini, Paylaş ve Yazı boyutu düğmeleri kendi pencerelerini açar. */
/* Pencere açılıp kapanınca sayfa yerinden oynamaz (Beyar 2026-11-24: "pop up açınca yukarı çıkıyor"): kaydırma yeri saklanır, odak kaydırmasız verilir, kapanışta geri konur. */
const modalAc=d=>{const y=scrollY, g=document.activeElement; d.showModal(); d._yer=y; d._geri=g; (d.querySelector('[autofocus]')||d.querySelector('.pn-kapat')||d).focus({preventScroll:true});
  const tut=()=>{if(Math.abs(scrollY-y)>1) scrollTo({top:y,behavior:'instant'});}; tut(); requestAnimationFrame(tut);};
const pnAc=ad=>{const d=document.getElementById('pn-'+ad); if(!d) return false; document.querySelectorAll('dialog.pn[open]').forEach(x=>x.close()); modalAc(d); return true;};
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{const y=d._yer; if(y==null) return; const g=d._geri; if(g&&g.focus) g.focus({preventScroll:true}); const tut=()=>{if(Math.abs(scrollY-y)>1) scrollTo({top:y,behavior:'instant'});}; tut(); requestAnimationFrame(tut); d._yer=null;}));
const toast=m=>{const k=document.querySelector('.toast-kap'); if(!k) return; const t=document.createElement('div'); t.className='toast'; t.innerHTML='<i class="fa-solid fa-check"></i>'+m; k.appendChild(t); setTimeout(()=>t.remove(),2600);};
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-acilir]'); if(a&&pnAc(a.dataset.acilir)){e.preventDefault();return;}
  const ty=e.target.closest('[data-toast]'); if(ty) toast(ty.dataset.toast);
  const k=e.target.closest('[data-kapat]'); if(k){const d=k.closest('dialog'); if(d) d.close();}
  const b=e.target.closest('.dt-eylem button,.dt-pay-d'); if(b){const l=b.getAttribute('aria-label')||'';
    if(/Paylaş|kopyala/i.test(l)){e.preventDefault(); if(/kopyala/i.test(l)) toast('Bağlantı kopyalandı'); else pnAc('paylas');}
    else if(/Yazı boyutu/i.test(l)) pnAc('gorunum'); else if(/Kaydet/i.test(l)){ b.classList.toggle('on'); toast(b.classList.contains('on')?'Kaydedildi':'Kayıt kaldırıldı'); }}
});
document.querySelectorAll('dialog.pn').forEach(d=>d.addEventListener('click',e=>{if(e.target===d) d.close();}));
/* Çerez bandı: ilk ziyarette altta (girişte açılır pencere değil, sayfayı kapatmaz); seçim cihazda saklanır */
(()=>{const cz=document.querySelector('.cz'); if(!cz) return; let s=null; try{s=localStorage.getItem('dh-cerez');}catch(_){}
  if(!s) cz.classList.add('acik');
  document.addEventListener('click',e=>{const c=e.target.closest('[data-cerez]'); if(!c) return; try{localStorage.setItem('dh-cerez',c.dataset.cerez);}catch(_){} cz.classList.remove('acik');});})();

/* ===== Misafir ve üye hali (CC kararı; Beyar: iki hal eksiksiz) =====
   Hal localStorage 'dh-oturum' ile sayfalar arasında ve yenilemede korunur; html.oturum sınıfı üye halini açar.
   [data-oturum="ac"] üye haline geçirir (giriş, kayıt, Google/Facebook/Apple), [data-oturum="kapat"] misafir haline döndürür.
   Misafirken üyelik isteyen bağlantılar (Hesabım sayfaları, bildirimler, kaydedilenler) giriş penceresini açar;
   girişten sonra okur gitmek istediği yere ulaşır (sessionStorage 'dh-hedef'). */
const oturum={
  acik(){try{return localStorage.getItem('dh-oturum')==='1'}catch(_){return document.documentElement.classList.contains('oturum')}},
  ayarla(v){try{v?localStorage.setItem('dh-oturum','1'):localStorage.removeItem('dh-oturum')}catch(_){} document.documentElement.classList.toggle('oturum',v);}
};
document.documentElement.classList.toggle('oturum',oturum.acik());
const uyelikIster=h=>/^hesabim(?!-misafir)(-[a-z-]+)?\.html/.test(h||'');
document.addEventListener('click',e=>{
  const ac=e.target.closest('[data-oturum="ac"]'), kapat=e.target.closest('[data-oturum="kapat"]');
  if(ac){ oturum.ayarla(true); let hedef=null; try{hedef=sessionStorage.getItem('dh-hedef'); sessionStorage.removeItem('dh-hedef');}catch(_){}
    if(hedef&&hedef.startsWith('pn:')){ setTimeout(()=>pnAc(hedef.slice(3)),60); }
    else if(hedef){e.preventDefault(); location.href=hedef; return;}
    if(ac.tagName==='A'&&ac.closest('dialog')) e.preventDefault();
    return; }
  if(kapat){ oturum.ayarla(false); toast('Çıkış yaptın'); return; }
  const ist=e.target.closest('[data-acilir="bildirim"],[data-acilir="hesap"]');
  if(ist&&!oturum.acik()){ e.preventDefault(); e.stopPropagation(); try{sessionStorage.setItem('dh-hedef','pn:'+ist.dataset.acilir)}catch(_){} pnAc('giris'); return; }
  const a=e.target.closest('a[href]');
  if(a&&!oturum.acik()&&!a.dataset.acilir&&uyelikIster(a.getAttribute('href'))){ e.preventDefault(); try{sessionStorage.setItem('dh-hedef',a.getAttribute('href'))}catch(_){} pnAc('giris'); }
},true);
/* Misafir bir Hesabım sayfasını doğrudan açarsa giriş penceresi açılır; giriş yapınca sayfada kalır */
if(uyelikIster(location.pathname.split('/').pop())&&!oturum.acik()){ addEventListener('load',()=>pnAc('giris')); }
/* Bildirim paneli: okunmamış süzgeci ve "tümünü okundu işaretle" */
document.addEventListener('click',e=>{
  const s=e.target.closest('[data-bildirim-suz]'); if(s){ s.parentElement.querySelectorAll('button').forEach(b=>b.classList.toggle('aktif',b===s));
    document.querySelectorAll('.pn-bildirim').forEach(x=>x.hidden=s.dataset.bildirimSuz==='yeni'&&!x.classList.contains('yeni')); }
  if(e.target.closest('[data-okundu]')){ document.querySelectorAll('.pn-bildirim.yeni').forEach(x=>x.classList.remove('yeni'));
    document.querySelectorAll('.pn-yeni-say').forEach(x=>x.textContent='0'); document.querySelectorAll('.act .rozet').forEach(r=>r.hidden=true); toast('Bütün bildirimler okundu'); }
});
/* Kaydet ve takip: girişsiz de çalışır görünür (cihazda tutulur, üye olunca hesaba taşınır) */
document.addEventListener('click',e=>{
  const k=e.target.closest('.kaydet:not(.gr-tam),.pc-kaydet'); if(k){ e.preventDefault(); e.stopPropagation(); const on=k.classList.toggle('on');
    toast(on?(oturum.acik()?'Kaydedildi · Kaydedilenler\'e eklendi':'Kaydedildi · cihazında tutuluyor, üye olunca hesabına taşınır'):'Kayıt kaldırıldı'); }
  const tk=e.target.closest('[data-takip]'); if(tk){ e.preventDefault(); const on=tk.classList.toggle('on'); tk.querySelector('span')&&(tk.querySelector('span').textContent=on?'Takip ediliyor':'Takip et');
    toast(on?'Takip ediliyor'+(oturum.acik()?'':' · üye olunca hesabına taşınır'):'Takip bırakıldı'); }
  const bil=e.target.closest('.dt-c-eylem button'); if(bil&&/Bildir/.test(bil.textContent)){ e.preventDefault(); pnAc('bildir'); }
},true);
/* Yukarı çık düğmesi: 600px'ten sonra belirir, yumuşak kaydırır; çerez bandı açıkken onun üstünde durur */
(()=>{const y=document.querySelector('.yukari'); if(!y) return;
  const g=()=>y.classList.toggle('gorunur',scrollY>600); addEventListener('scroll',g,{passive:true}); g();
  y.addEventListener('click',()=>scrollTo({top:0,behavior:azHareket?'auto':'smooth'}));
  const cz=document.querySelector('.cz'); const ayar=()=>document.documentElement.classList.toggle('cz-acik',!!(cz&&cz.classList.contains('acik')));
  ayar(); if(cz) new MutationObserver(ayar).observe(cz,{attributes:true,attributeFilter:['class']});})();
/* Okuma ilerleme çubuğu (haber detayı ve metin sayfaları) */
(()=>{const g=document.querySelector('.dt-govde,.mt-metin'); if(!g) return; const c=document.createElement('div'); c.className='okuma-cubuk'; c.setAttribute('aria-hidden','true'); document.body.appendChild(c);
  const h=()=>{const r=g.getBoundingClientRect(); const p=Math.min(1,Math.max(0,(innerHeight*.35-r.top)/r.height)); c.style.transform=`scaleX(${p})`;}; addEventListener('scroll',h,{passive:true}); h();})();

/* Dokunmatik: açılır menü başlığına ilk dokunuş paneli açar (üstüne gelme yok); ikinci dokunuş sayfaya gider */
if(matchMedia('(hover: none)').matches){ document.querySelectorAll('.mm>.mm-a').forEach(a=>a.addEventListener('click',e=>{const li=a.parentElement;
  if(!li.classList.contains('acik')){e.preventDefault(); document.querySelectorAll('.mm.acik').forEach(x=>x!==li&&x.classList.remove('acik')); li.classList.add('acik');}}));
  document.addEventListener('click',e=>{if(!e.target.closest('.mm')) document.querySelectorAll('.mm.acik').forEach(x=>x.classList.remove('acik'));}); }

/* Kartın tamamı tıklanır (Beyar, 2026-11-23, genel kural): kartın herhangi bir yerine tıklanınca başlık bağlantısının hedefine gidilir.
   Kart içindeki kendi işi olan öğeler (bağlantı, düğme, Kaydet, oynat) kendi işini yapar. Ctrl/Cmd ya da orta tık yeni sekmede açar.
   Yeni kart türü: sınıfı KART listesine eklenir ya da öğeye data-kart verilir. */
(()=>{const KART='.gk,.gy,.go,.g,.pc,.fb-k,[data-kart]';
  const hedef=k=>k.querySelector('h1 a[href],h2 a[href],h3 a[href],h4 a[href],[data-kart-hedef]');
  const ic='a,button,input,select,textarea,label,summary,[role=button],.kaydet,.pc-kaydet,[data-takip],[data-acilir]';
  const git=(e,yeni)=>{const k=e.target.closest(KART); if(!k)return; const ie=e.target.closest(ic); if(ie&&k.contains(ie))return;
    if(String(getSelection()).length)return; const a=hedef(k); if(!a)return;
    if(yeni||e.ctrlKey||e.metaKey||e.button===1){open(a.href,'_blank','noopener');return;} a.click();};
  document.addEventListener('click',e=>git(e,false));
  document.addEventListener('auxclick',e=>{if(e.button===1)git(e,true);});
})();

/* Kayan şerit (Beyar: sığmayan öğe alt satıra inmez; okla ve sürükleyerek yatay kayar). Ortak bileşen: KAYAN listesindeki ya da
   [data-kayar] taşıyan her tek satır. Taşıyorsa uçlarda yapışkan oklar belirir; fareyle sürüklenir (sürükleme sonrası tık yutulur). */
(()=>{const KAYAN='.dt-etk,.dt-pay,.cp-izg,.dt-meta,.cd-kilit ol,.dt-c-filtre,.sw-lejant,.pf-kunye,.mt-kunye,.ls-arac2,.gband .cipler,[data-kayar]';
  const yon=el=>getComputedStyle(el).direction==='rtl'?-1:1;
  const kur=el=>{ if(el.dataset.ks) return; el.dataset.ks='1'; el.classList.add('ks');
    const ok=(s)=>{const b=document.createElement('button'); b.type='button'; b.className='ks-ok ks-'+(s<0?'bas':'son'); b.setAttribute('aria-label',s<0?'Geri kaydır':'İleri kaydır');
      b.innerHTML='<i class="fa-solid fa-chevron-'+(s<0?'left':'right')+'"></i>'; b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();
      el.scrollBy({left:s*yon(el)*el.clientWidth*.7,behavior:azHareket?'auto':'smooth'});}); return b;};
    const bas=ok(-1), son=ok(1); el.prepend(bas); el.append(son);
    const durum=()=>{const b0=bas.hidden,s0=son.hidden; bas.hidden=son.hidden=true; const t=el.scrollWidth>el.clientWidth+2, x=el.scrollLeft*yon(el); bas.hidden=b0; son.hidden=s0;
      bas.hidden=!t||x<=1; son.hidden=!t||x+el.clientWidth>=el.scrollWidth-1;};
    el.addEventListener('scroll',durum,{passive:true}); addEventListener('resize',durum); durum();
    let x0=null,s0=0,surdu=false;
    el.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.target.closest('.ks-ok'))return; x0=e.clientX; s0=el.scrollLeft; surdu=false;});
    addEventListener('pointermove',e=>{if(x0===null)return; const d=e.clientX-x0; if(Math.abs(d)>5){surdu=true; el.classList.add('surukle'); el.scrollLeft=s0-d;}});
    addEventListener('pointerup',()=>{if(x0===null)return; x0=null; setTimeout(()=>el.classList.remove('surukle'),0);});
    el.addEventListener('click',e=>{if(surdu){e.preventDefault();e.stopPropagation();surdu=false;}},true);
    el.addEventListener('dragstart',e=>e.preventDefault());
  };
  document.querySelectorAll(KAYAN).forEach(kur);
})();

/* Görüş bildir formu (CC ekledi; kardeş sitelerdeki geri bildirim penceresinin yapısı): konu sekmesi, ilgili alan, 5'li puan,
   ekran görüntüsü ekleme, alan hatası ve başarı ekranı. Prototip: gönderim yerel, sunucuya bir şey gitmez. */
(()=>{const d=document.getElementById('pn-gorus'); if(!d) return;
  const form=d.querySelector('.gr-form'), basari=d.querySelector('.gr-basari'), metinB=d.querySelector('.gr-metin-b');
  d.querySelectorAll('[data-gorus-konu]').forEach(b=>b.addEventListener('click',()=>{d.querySelectorAll('[data-gorus-konu]').forEach(x=>x.classList.toggle('aktif',x===b)); metinB.textContent=b.dataset.gorusKonu;}));
  d.querySelectorAll('.gr-alan .cp-sec').forEach(b=>b.addEventListener('click',()=>d.querySelectorAll('.gr-alan .cp-sec').forEach(x=>x.classList.toggle('aktif',x===b))));
  d.querySelectorAll('[data-puan]').forEach(b=>b.addEventListener('click',()=>d.querySelectorAll('[data-puan]').forEach(x=>{const on=x===b; x.classList.toggle('aktif',on); x.setAttribute('aria-checked',on);})));
  const dosya=d.querySelector('[data-dosya]'), on=d.querySelector('.fr-dosya-on'), sec=d.querySelector('.fr-dosya');
  dosya.addEventListener('change',()=>{const f=dosya.files[0]; if(!f) return;
    if(f.size>5*1024*1024){toast('Dosya 5 MB\'tan büyük'); dosya.value=''; return;}
    d.querySelector('[data-dosya-ad]').textContent=f.name; d.querySelector('[data-dosya-boy]').textContent=Math.max(1,Math.round(f.size/1024))+' KB';
    const g=d.querySelector('.fr-dosya-g'); g.style.backgroundImage='url('+URL.createObjectURL(f)+')'; on.hidden=false; sec.hidden=true;});
  d.querySelector('[data-dosya-kaldir]').addEventListener('click',()=>{dosya.value=''; on.hidden=true; sec.hidden=false;});
  const hata=(el,var_)=>{const h=el.parentElement.querySelector('.fr-hata'); h.hidden=!var_; el.classList.toggle('hatali',var_);};
  d.querySelector('[data-gorus-gonder]').addEventListener('click',()=>{const m=d.querySelector('[data-gerekli]'), e=d.querySelector('[data-eposta]');
    const mh=m.value.trim().length<10, eh=e.value.trim()!==''&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.value.trim()); hata(m,mh); hata(e,eh);
    if(mh||eh){(mh?m:e).focus(); return;} form.hidden=true; basari.hidden=false;});
  d.querySelector('[data-gorus-yeni]').addEventListener('click',()=>{basari.hidden=true; form.hidden=false;});
})();

/* Konumumu kullan (CC ekledi): tarayıcı konum izni; izin reddi, zaman aşımı ve desteklenmeme halleri ayrı mesajla. */
document.querySelectorAll('[data-konum]').forEach(b=>b.addEventListener('click',()=>{const kap=b.parentElement, du=kap.querySelector('.kn-durum');
  const goster=(baslik,metin)=>{du.querySelector('[data-konum-b]').textContent=baslik; du.querySelector('[data-konum-p]').textContent=metin; du.hidden=false;};
  if(!('geolocation' in navigator)){goster('Tarayıcın konumu desteklemiyor','Şehri aşağıdaki listeden seçebilirsin.'); return;}
  b.disabled=true; b.lastChild.textContent='Konum alınıyor…';
  navigator.geolocation.getCurrentPosition(()=>{b.disabled=false; b.lastChild.textContent='Konumumu kullan'; du.hidden=true; toast('Konumun bulundu: İstanbul'); b.closest('dialog')?.close();},
    e=>{b.disabled=false; b.lastChild.textContent='Konumumu kullan';
      if(e.code===1) goster('Konuma izin verilmedi','Tarayıcı ayarlarından konum iznini açabilir ya da şehri aşağıdan seçebilirsin.');
      else if(e.code===3) goster('Konum zamanında alınamadı','Bağlantını kontrol edip yeniden dene ya da şehri aşağıdan seç.');
      else goster('Konum bulunamadı','Şehri aşağıdaki listeden seçebilirsin.');},{timeout:8000,maximumAge:600000});}));

/* Sesli arama (CC ekledi): tarayıcı destekliyorsa konuşmayı metne çevirip arama kutusuna yazar. */
document.querySelectorAll('[data-sesli]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation();
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR){toast('Tarayıcın sesli aramayı desteklemiyor'); return;}
  const r=new SR(); r.lang=document.documentElement.lang||'tr-TR'; r.interimResults=false; b.classList.add('dinliyor'); toast('Dinliyorum…');
  r.onresult=ev=>{const m=ev.results[0][0].transcript; const h=b.parentElement.querySelector('[data-ara-metin]'); if(h) h.textContent=m;};
  r.onend=()=>b.classList.remove('dinliyor'); r.onerror=()=>{b.classList.remove('dinliyor'); toast('Ses alınamadı, yeniden dene');}; r.start();}));

/* Yazdır (CC ekledi) */
document.querySelectorAll('[data-yazdir]').forEach(b=>b.addEventListener('click',()=>{b.closest('dialog')?.close(); setTimeout(()=>print(),50);}));

/* Sayfa içi görsel önizleme (CC ekledi): haber gövdesindeki ve açılıştaki görsellere tıklanınca büyük görünüm; önceki/sonraki, sayaç, altyazı.
   Görseller div + background-image olduğu için adres stilden okunur. Video düğmesi taşıyan görsel önizleme açmaz. */
(()=>{const d=document.getElementById('pn-gorsel'); if(!d) return;
  const liste=[...document.querySelectorAll('.dt-ana-g,.dt-fig-g')].filter(g=>!g.querySelector('.dt-video'));
  if(!liste.length) return; let i=0;
  const goster=n=>{i=(n+liste.length)%liste.length; const g=liste[i], cap=g.closest('figure')?.querySelector('figcaption')?.textContent||'';
    d.querySelector('.go-g').style.backgroundImage=getComputedStyle(g).backgroundImage; d.querySelector('.go-g').setAttribute('aria-label',cap||'Haber görseli');
    d.querySelector('.go-cap').textContent=cap; d.querySelector('.go-say').textContent=(i+1)+' / '+liste.length;
    d.querySelectorAll('.go-ok').forEach(o=>o.hidden=liste.length<2);};
  liste.forEach((g,n)=>{g.classList.add('go-ac'); g.setAttribute('role','button'); g.setAttribute('tabindex','0'); g.setAttribute('aria-label','Görseli büyüt');
    const ac=()=>{goster(n); modalAc(d);}; g.addEventListener('click',ac); g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault(); ac();}});});
  d.querySelectorAll('[data-go]').forEach(o=>o.addEventListener('click',()=>goster(i+(+o.dataset.go)*(getComputedStyle(d).direction==='rtl'?-1:1))));
  d.addEventListener('keydown',e=>{if(e.key==='ArrowRight')goster(i+1); if(e.key==='ArrowLeft')goster(i-1);});
})();

/* Takvime ekle (format denetimi): düğme açılır/kapanır, bildirim gösterir. Prototip; gerçek takvim dosyası üretilmez. */
document.querySelectorAll('.tk-ekle').forEach(b=>b.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation(); const on=b.classList.toggle('on');
  b.setAttribute('aria-pressed',on); b.lastChild.textContent=on?'Takvimde':'Takvime ekle'; toast(on?'Takvimine eklendi; bir saat önce hatırlatacağız':'Takvimden çıkarıldı');}));

/* Canlı anlatım sabit şeridi: açılışta gizli; başlık ekrandan çıkınca üstte belirir (yer kaplamaz, başlığı tekrar etmez). */
(()=>{const s=document.querySelector('.cd-sabit'), h=document.querySelector('.dt-bas-ic h1'); if(!s||!h) return;
  const ust=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ust-boy'))||100;
  const bak=()=>s.classList.toggle('gorunur',h.getBoundingClientRect().bottom<ust()); addEventListener('scroll',bak,{passive:true}); addEventListener('resize',bak); bak();})();

/* Footer sütunları telefonda açılır-kapanır (Yasin Bey talebi): başlık düğme gibi davranır; masaüstünde CSS listeyi hep açık tutar. */
document.querySelectorAll('.ft-kol').forEach((k,i)=>{const h=k.querySelector('h2'), u=k.querySelector('ul'); if(!h||!u) return;
  u.id=u.id||('ft-liste-'+i); h.setAttribute('role','button'); h.setAttribute('tabindex','0'); h.setAttribute('aria-controls',u.id); h.setAttribute('aria-expanded','false');
  const ac=()=>{const on=k.classList.toggle('acik'); h.setAttribute('aria-expanded',on);};
  h.addEventListener('click',ac); h.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault(); ac();}});});

/* Akordiyon (Yasin Bey): haber detayındaki açılır bölümlerde aynı anda tek bölüm açık; açılışta yalnız ilki açık. */
/* Akordiyon animasyonu (Beyar 2026-11-24: açılış takılıyordu): açılan bölüm yumuşakça uzar, aynı anda kapanan kısalır; yükseklik tek karede atlamaz. Hareket azaltma tercihinde anında. */
const akoAnim=(x,ac)=>{if(x._an){x._an.cancel(); x._an=null;} const sm=x.querySelector(':scope>summary'); if(!sm||azHareket){x.open=ac; return;}
  const cs=getComputedStyle(x), kenar=parseFloat(cs.borderTopWidth)+parseFloat(cs.borderBottomWidth)+parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom);
  const bas=x.offsetHeight; if(ac) x.open=true; const son=ac?x.offsetHeight:sm.offsetHeight+kenar; if(bas===son){x.open=ac; return;}
  x.dataset.anim='1'; x.style.overflow='hidden';
  const a=x._an=x.animate({height:[bas+'px',son+'px']},{duration:260,easing:'cubic-bezier(.22,.61,.36,1)'});
  a.onfinish=()=>{if(!ac) x.open=false; x.style.overflow=''; delete x.dataset.anim; x._an=null;}; a.oncancel=()=>{x.style.overflow=''; delete x.dataset.anim;};};
const akoGrup=d=>d.forEach(y=>{const sm=y.querySelector(':scope>summary'); if(!sm||sm.dataset.akoHazir) return; sm.dataset.akoHazir='1';
  sm.addEventListener('click',e=>{e.preventDefault(); const ac=y._an?!y._acilis:!y.open; y._acilis=ac;
    akoAnim(y,ac); if(ac) d.forEach(z=>{if(z!==y&&z.open){z._acilis=false; akoAnim(z,false);}});});});
document.querySelectorAll('.dt-ako').forEach(k=>{const d=[...k.querySelectorAll(':scope>details')]; d.forEach((x,i)=>{x.open=i===0;}); akoGrup(d);});

/* Izgara / liste görünümü (Yasin Bey): liste düğmesi kartları yatay satıra çevirir; tercih sayfalar arasında hatırlanır. */
(()=>{let tercih=null; try{tercih=localStorage.getItem('dh-gorunum');}catch(_){}
  document.querySelectorAll('.ls-gor').forEach(g=>{const b=g.querySelectorAll('button'); if(b.length<2) return;
    const arac=g.closest('.ls-arac2'); let iz=arac&&arac.nextElementSibling; while(iz&&!iz.matches('.g4,.g3')) iz=iz.nextElementSibling; if(!iz) return;
    const uygula=l=>{iz.classList.toggle('liste',l); b[0].classList.toggle('aktif',!l); b[1].classList.toggle('aktif',l); b[0].setAttribute('aria-pressed',!l); b[1].setAttribute('aria-pressed',l);};
    b[0].addEventListener('click',()=>{uygula(false); try{localStorage.setItem('dh-gorunum','izgara')}catch(_){}});
    b[1].addEventListener('click',()=>{uygula(true); try{localStorage.setItem('dh-gorunum','liste')}catch(_){}});
    if(tercih==='liste') uygula(true);});})();

/* Akordiyon genel kuralı (Yasin Bey): aynı kapta yan yana iki ve daha fazla açılır bölüm varsa aynı anda tek bölüm açık. */
document.querySelectorAll('details').forEach(x=>{const p=x.parentElement; if(!p||p.dataset.akordiyon) return; const d=[...p.children].filter(c=>c.tagName==='DETAILS'); if(d.length<2) return;
  p.dataset.akordiyon='1'; if(!p.matches('.dt-ako')){let ilk=d.find(y=>y.open); d.forEach(y=>y.open=y===ilk);}
  akoGrup(d);});

/* Bölüm başlığı sekmesi (.gs .sekme): sekme adına göre aynı bölümdeki [data-sekme-icerik="Ad"] içeriğini gösterir. */
document.querySelectorAll('.gs .sekme').forEach(s=>{const bol=s.closest('section')||s.closest('.kap'); if(!bol) return;
  const sek=[...s.querySelectorAll(':scope>span')]; sek.forEach(x=>{x.setAttribute('role','tab'); x.tabIndex=0;});
  const sec=x=>{sek.forEach(y=>{y.classList.toggle('a',y===x); y.setAttribute('aria-selected',y===x);});
    bol.querySelectorAll('[data-sekme-icerik]').forEach(p=>p.hidden=p.dataset.sekmeIcerik!==x.textContent.trim());};
  sek.forEach(x=>{x.addEventListener('click',()=>sec(x)); x.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault(); sec(x);}});});});

/* Galeri (Foto Fokus, İnfografik detay): oklar, küçük resim seçimi (sayfa yenilenmez), sayaç, kaydırma ve tam ekran görüntüleyici. */
(()=>{const pn=document.getElementById('pn-gorsel');
  document.querySelectorAll('.gr').forEach(gr=>{const sahne=gr.querySelector('.gr-sahne'), kucuk=[...gr.querySelectorAll('.gr-serit>a')]; if(!sahne||!kucuk.length) return;
    const url=a=>getComputedStyle(a).backgroundImage, say=sahne.querySelector('.gr-say'), top=kucuk.length;
    let i=Math.max(0,kucuk.findIndex(a=>a.classList.contains('sec')));
    const git=n=>{i=(n+kucuk.length)%kucuk.length; sahne.style.backgroundImage=url(kucuk[i]); kucuk.forEach((a,j)=>a.classList.toggle('sec',j===i));
      if(say){const ik=say.querySelector('i'); say.textContent=' '+String(i+1).padStart(2,'0')+' / '+String(top).padStart(2,'0'); if(ik) say.prepend(ik);}
      kucuk[i].scrollIntoView({block:'nearest',inline:'nearest',behavior:azHareket?'auto':'smooth'});};
    const yon=getComputedStyle(gr).direction==='rtl'?-1:1;
    gr.querySelector('.gr-ok.o')?.addEventListener('click',e=>{e.preventDefault(); git(i-yon);});
    gr.querySelector('.gr-ok.s')?.addEventListener('click',e=>{e.preventDefault(); git(i+yon);});
    kucuk.forEach((a,j)=>a.addEventListener('click',e=>{e.preventDefault(); git(j);}));
    let x0=null; sahne.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
    sahne.addEventListener('touchend',e=>{if(x0===null) return; const d=e.changedTouches[0].clientX-x0; if(Math.abs(d)>40) git(i+(d<0?1:-1)*yon); x0=null;});
    const tam=sahne.querySelector('.gr-tam'); if(tam){tam.setAttribute('role','button'); tam.tabIndex=0;
      const ac=e=>{e.preventDefault(); e.stopPropagation(); if(!pn) return; let j=i;
        const goster=n=>{j=(n+kucuk.length)%kucuk.length; pn.querySelector('.go-g').style.backgroundImage=url(kucuk[j]); pn.querySelector('.go-say').textContent=(j+1)+' / '+kucuk.length;
          const cap=gr.parentElement.querySelector('.gr-alt p,.gr-acik,figcaption'); pn.querySelector('.go-cap').textContent=cap?cap.textContent.trim():''; pn.querySelectorAll('.go-ok').forEach(o=>o.hidden=false);};
        pn._galeri=goster; goster(i); modalAc(pn);};
      tam.addEventListener('click',ac,true); tam.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ') ac(e);});}
  });
  if(pn) pn.querySelectorAll('[data-go]').forEach(o=>o.addEventListener('click',e=>{if(!pn._galeri) return; e.stopImmediatePropagation();
    const n=parseInt(pn.querySelector('.go-say').textContent)-1; pn._galeri(n+(+o.dataset.go));},true));
  if(pn) pn.addEventListener('close',()=>{pn._galeri=null;});
})();

/* Görüntüleyici: telefonda parmakla kaydırma (sola/sağa) ve aşağı çekince kapanma */
(()=>{const pn=document.getElementById('pn-gorsel'); if(!pn) return; let x0=null,y0=null;
  pn.addEventListener('touchstart',e=>{x0=e.touches[0].clientX; y0=e.touches[0].clientY;},{passive:true});
  pn.addEventListener('touchend',e=>{if(x0===null) return; const dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0; x0=null;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){const yon=getComputedStyle(pn).direction==='rtl'?-1:1; pn.querySelector(`[data-go="${dx<0?yon:-yon}"]`)?.click();}
    else if(dy>90&&Math.abs(dy)>Math.abs(dx)) pn.close();});})();

/* ===== Sekmeler (Beyar: görünen her kontrol çalışır) =====
   Bütün sekme grupları (.pn-sekme, .sw-sekme, .dt-sekme, .sg, .sekme): tıklanınca seçim değişir (aria-selected).
   1) Süzgeç sekmeleri ("Tümü · 4 | Futbol · 2"): sonraki kardeş kaptaki öğeleri etiket metnine göre süzer.
   2) [data-sekme-icerik] panelleri: ad eşleşeni gösterir.
   3) Özel modlar: arama penceresi (ara / sor), Dada Özet (15 sn / 1 dk / Tam metin), yazı boyutu. */
(()=>{const GRUP='.pn-sekme,.sw-sekme,.dt-sekme,.sg:not([data-mod]),.gs .sekme';
  const ad=b=>b.textContent.replace(/·\s*\d+.*$/,'').replace(/\s+/g,' ').trim();
  const norm=s=>s.toLocaleLowerCase('tr').replace(/\s+/g,' ');
  document.querySelectorAll(GRUP).forEach(g=>{ if(g.dataset.sekmeHazir||g.matches('[data-bildirim-suz]')||g.closest('#pn-gorus')) return; g.dataset.sekmeHazir='1';
    const b=[...g.children].filter(x=>x.matches('button,span,a')); if(b.length<2) return;
    b.forEach(x=>{x.setAttribute('role','tab'); if(!x.matches('button,a')) x.tabIndex=0; x.setAttribute('aria-selected',x.classList.contains('aktif')||x.classList.contains('a'));});
    const sec=x=>{b.forEach(y=>{const on=y===x; y.classList.toggle('aktif',on); if(y.classList.contains('a')||g.matches('.sekme')) y.classList.toggle('a',on); y.setAttribute('aria-selected',on);});
      const etiket=ad(x), kap=g.closest('section,.sw-kutu,.sw-merkez-ic,.pn-ic,.dt-ozet,.hs-kart,.kap')||g.parentElement;
      // 2) paneller
      const pnl=kap.querySelectorAll('[data-sekme-icerik]'); if(pnl.length){pnl.forEach(p=>p.hidden=p.dataset.sekmeIcerik!==etiket); return;}
      // 3) özel modlar
      if(g.closest('#pn-arama,.ar-arama')||/Dada.?.?ya sor/i.test(b.map(ad).join('|'))){const sor=/sor/i.test(etiket), f=kap.querySelector('form,.pn-ara')||kap;
        const m=f.querySelector('[data-ara-metin]'), dg=f.querySelector('.fr-dugme'), ik=f.querySelector('.fr-inp>i');
        if(m) m.textContent=sor?'Asgari ücret ne zaman açıklanacak?':'asgari ücret'; if(dg){dg.textContent=sor?'Sor':'Ara'; dg.setAttribute('href',sor?'dadaya-sor.html':'arama.html');}
        if(f.tagName==='FORM') f.setAttribute('action',sor?'dadaya-sor.html':'arama.html'); const bh=g.closest('dialog')?.querySelector('.pn-bas h2'); if(bh) bh.textContent=sor?"Dada'ya sor":'Ara'; if(ik) ik.className=sor?'fa-solid fa-wand-magic-sparkles':'fa-solid fa-magnifying-glass';
        const not=kap.querySelector('.fr-satir'); if(not&&!not.dataset.ilk) not.dataset.ilk=not.innerHTML;
        if(not) not.innerHTML=sor?'<span>Dada, yanıtını Dada Haber arşivindeki haberlere ve resmî kaynaklara dayandırır.</span>':not.dataset.ilk; return;}
      if(g.closest('#pn-gorunum')||/^(Küçük|Normal|Büyük|Çok büyük)$/.test(etiket)){const o={'Küçük':.92,'Normal':1,'Büyük':1.1,'Çok büyük':1.2}[etiket]||1;
        document.documentElement.style.setProperty('--olcek',o); document.documentElement.dataset.boyut=etiket; try{localStorage.setItem('dh-boyut',etiket)}catch(_){}
        document.querySelectorAll('#pn-gorunum .pn-sekme button,.hs-kart .pn-sekme button').forEach(y=>{if(/^(Küçük|Normal|Büyük|Çok büyük)$/.test(ad(y))) {y.classList.toggle('aktif',ad(y)===etiket);}}); return;}
      if(g.matches('.dt-sekme')||g.closest('.dt-ozet')){const oz=g.closest('.dt-ozet'); if(!oz) return; let ek=oz.querySelector('.dt-ozet-1dk');
        if(!ek){ek=document.createElement('div'); ek.className='dt-ozet-1dk'; const sp=document.querySelector('.dt-spot'), ne=document.querySelector('.dt-ako details p');
          ek.innerHTML=(sp?'<p>'+sp.innerHTML+'</p>':'')+(ne?'<p><b>Neden önemli?</b> '+ne.innerHTML+'</p>':''); oz.appendChild(ek);}
        ek.hidden=!/1 dk/.test(etiket);
        if(/Tam/.test(etiket)){const gv=document.querySelector('.dt-govde'); if(gv) gv.scrollIntoView({behavior:azHareket?'auto':'smooth',block:'start'});} return;}
      // 1) süzgeç: sonraki kardeş kap
      let hedef=g.nextElementSibling; while(hedef&&!hedef.children.length) hedef=hedef.nextElementSibling; if(!hedef) return;
      const ogeler=[...hedef.children].filter(c=>!c.matches('.ks-ok,h2,h3,.sw-fk-gun'));
      if(/^Tümü/.test(etiket)){ogeler.forEach(c=>c.hidden=false); hedef.querySelectorAll('.sw-fk-gun').forEach(c=>c.hidden=false); return;}
      const es=ogeler.filter(c=>norm(c.textContent).includes(norm(etiket)));
      if(es.length){ogeler.forEach(c=>c.hidden=!es.includes(c));}
      else {hedef.animate?.([{opacity:.35},{opacity:1}],{duration:260});}};
    b.forEach(x=>{x.addEventListener('click',e=>{if(x.tagName==='A'&&x.getAttribute('href')&&!x.getAttribute('href').startsWith('#')) return; e.preventDefault(); sec(x);});
      x.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault(); sec(x);}});});
  });
  try{const k=localStorage.getItem('dh-boyut'); if(k&&k!=='Normal'){const o={'Küçük':.92,'Büyük':1.1,'Çok büyük':1.2}[k]; if(o){document.documentElement.style.setProperty('--olcek',o); document.documentElement.dataset.boyut=k;}}}catch(_){}
})();

/* Footer akordiyonu: aynı anda en fazla bir bölüm açık (Beyar kuralı) */
document.addEventListener('click',e=>{const h=e.target.closest('.ft-kol h2'); if(!h) return; const k=h.parentElement;
  if(k.classList.contains('acik')) document.querySelectorAll('.ft-kol.acik').forEach(x=>{if(x!==k){x.classList.remove('acik'); x.querySelector('h2')?.setAttribute('aria-expanded','false');}});});
/* Yukarı çık düğmesi footer'ın en alt satırı görünürken o satırın üstüne kalkar (Beyar 2026-11-24: GaviaWorks'ün üstüne biniyordu) */
(()=>{const y=document.querySelector('.yukari'), a=document.querySelector('.ft-alt'); if(!y||!a) return; let bek=0;
  const f=()=>{bek=0; const ust=innerHeight-a.getBoundingClientRect().top; y.style.setProperty('--ft-ek',(ust>0?Math.max(0,ust-8):0)+'px');};
  const iste=()=>{if(!bek) bek=requestAnimationFrame(f);}; addEventListener('scroll',iste,{passive:true}); addEventListener('resize',iste); f();})();
