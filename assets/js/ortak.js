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
/* Sayfa yerini koru (Beyar 2026-11-24, ikinci kez): pencere açılıp kapanırken 700ms boyunca her kaydırma eski yerine döner; yumuşak kaydırma bu sürede kapalı (odak ve top-layer değişimi sayfayı oynatmasın). */
const yerTut=y=>{const h=document.documentElement, t0=performance.now(); h.style.scrollBehavior='auto';
  const g=()=>{if(performance.now()-t0>700){removeEventListener('scroll',g); h.style.scrollBehavior=''; return;} if(Math.abs(scrollY-y)>1) scrollTo(0,y);};
  addEventListener('scroll',g,{passive:true}); g(); requestAnimationFrame(g); setTimeout(()=>{removeEventListener('scroll',g); h.style.scrollBehavior=''; if(Math.abs(scrollY-y)>1) scrollTo(0,y);},720);};
const modalAc=d=>{const y=scrollY, g=document.activeElement; document.documentElement.style.scrollBehavior='auto'; d.showModal(); d._yer=y; d._geri=g; (d.querySelector('[autofocus]')||d.querySelector('.pn-kapat')||d).focus({preventScroll:true}); yerTut(y);};
const pnAc=ad=>{const d=document.getElementById('pn-'+ad); if(!d) return false; document.querySelectorAll('dialog.pn[open]').forEach(x=>x.close()); modalAc(d); return true;};
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{const y=d._yer; if(y==null) return; const g=d._geri; if(g&&g.focus) g.focus({preventScroll:true}); yerTut(y); d._yer=null;}));
/* Aynı bildirim tek tıkta iki kez çıkmaz (Beyar 2026-11-25): aynı metin 600 ms içinde tekrar gelirse yok sayılır */
let toastSon='',toastZ=0;
const toast=m=>{const k=document.querySelector('.toast-kap'); if(!k) return; const z=Date.now(); if(m===toastSon&&z-toastZ<600) return; toastSon=m; toastZ=z; const t=document.createElement('div'); t.className='toast'; t.innerHTML='<i class="fa-solid fa-check"></i>'+m; k.appendChild(t); setTimeout(()=>t.remove(),2600);};
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-acilir]'); if(a&&pnAc(a.dataset.acilir)){e.preventDefault();return;}
  const ty=e.target.closest('[data-toast]'); if(ty) toast(ty.dataset.toast);
  const k=e.target.closest('[data-kapat]'); if(k){const d=k.closest('dialog'); if(d) d.close();}
  const b=e.target.closest('.dt-eylem button,.dt-pay-d'); if(b){const l=b.getAttribute('aria-label')||'';
    if(/Paylaş|kopyala/i.test(l)){e.preventDefault(); if(/kopyala/i.test(l)){ try{navigator.clipboard&&navigator.clipboard.writeText(location.href);}catch(_){} if(!b.dataset.toast) toast('Bağlantı kopyalandı'); } else pnAc('paylas');}
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
  const f=()=>{bek=0; const r=a.getBoundingClientRect(), alt=parseFloat(getComputedStyle(y).insetBlockEnd)||24, bAlt=innerHeight-alt, bUst=bAlt-y.offsetHeight;
    /* yalnız düğme ile alt satır dikeyde çakışıyorsa, satırın üstüne çıkacak kadar kalkar (önceden fazla kalkıp footer bağlantılarına biniyordu) */
    y.style.setProperty('--ft-ek',(r.top<bAlt&&r.bottom>bUst?Math.round(bAlt-r.top+8):0)+'px');};
  const iste=()=>{if(!bek) bek=requestAnimationFrame(f);}; addEventListener('scroll',iste,{passive:true}); addEventListener('resize',iste); f();})();
/* Piyasa tabloları (Beyar 2026-11-24): binlerce satırlık listede arama (kod ya da ad) ve sıralama sekmeleri; sayaç güncellenir, sonuç yoksa boş satır. */
document.querySelectorAll('[data-pt]').forEach(k=>{const tb=k.querySelector('tbody'); if(!tb) return; const inp=k.querySelector('.pt-ara input'), say=k.querySelector('.pt-say b'), bos=k.querySelector('.pt-bos');
  const sat=[...tb.querySelectorAll('tr:not(.pt-bos)')], norm=s=>s.toLocaleLowerCase('tr').replace(/\s+/g,' ').trim();
  const sayi=s=>{const m=(s||'').replace(/\./g,'').replace(',','.').match(/-?[\d.]+/); return m?parseFloat(m[0]):0;};
  sat.forEach((r,i)=>{r._s=i; r._m=norm(r.cells[0].textContent); const em=r.querySelector('td em'); r._d=em?sayi(em.textContent)*(em.classList.contains('d')?-1:1):0;
    const hc=[...r.cells].find(c=>/\b(mn|mr|B)\s*$/.test(c.textContent.trim())); r._h=hc?sayi(hc.textContent)*(/mr/.test(hc.textContent)?1000:1):0;});
  const suz=()=>{const q=norm(inp?inp.value:''); let n=0; sat.forEach(r=>{const g=!q||r._m.includes(q); r.hidden=!g; if(g) n++;}); if(say) say.textContent=n.toLocaleString('tr'); if(bos) bos.hidden=n>0;};
  if(inp) inp.addEventListener('input',suz);
  const sek=[...k.querySelectorAll('.pt-sekme button')];
  sek.forEach(b=>b.addEventListener('click',()=>{sek.forEach(x=>{const on=x===b; x.classList.toggle('aktif',on); x.setAttribute('aria-selected',on);});
    const t=b.dataset.sirala, f={artan:(a,c)=>c._d-a._d, azalan:(a,c)=>a._d-c._d, hacim:(a,c)=>c._h-a._h}[t]||((a,c)=>a._s-c._s);
    [...sat].sort(f).forEach(r=>tb.insertBefore(r,bos||null)); const kd=k.querySelector('.pt-kaydir'); if(kd) kd.scrollTop=0;}));});
/* Alt menü çipleri (Beyar 2026-11-24: "sekmeye tıklayınca neden banner'a çekiyor"): çip başka sayfaya gider ama yeni sayfa alt menü ekranda aynı yerde
   duracak şekilde açılır; okura yalnız alttaki içerik değişmiş görünür. Tam yığın sürümde bu geçiş sayfa yenilemeden içerik değişimiyle yapılır. */
(()=>{const am=document.querySelector('.am'); if(!am) return; const K='dh-am';
  const dogal=()=>{const eski=am.style.position; am.style.position='static'; const y=am.getBoundingClientRect().top+scrollY; am.style.position=eski; return y;};
  try{const v=JSON.parse(sessionStorage.getItem(K)||'null'); sessionStorage.removeItem(K);
    if(v&&Date.now()-v.t<15000&&v.y>=0){const git=()=>{const h=Math.max(0,dogal()-v.y); if(h>0) scrollTo({top:h,behavior:'instant'});}; git(); requestAnimationFrame(git); addEventListener('load',git,{once:true});}}catch(_){}
  am.addEventListener('click',e=>{const a=e.target.closest('a.ls-cip'); if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.button!==0) return;
    const u=new URL(a.href,location.href); if(u.origin!==location.origin&&location.protocol!=='file:') return;
    try{sessionStorage.setItem(K,JSON.stringify({y:Math.round(am.getBoundingClientRect().top),t:Date.now()}));}catch(_){}});})();
/* Yüzen Spiker (dadagastro.com mentor.js davranışı; video açılınca yüklenir ve oynar, küçültünce durur): aç / küçült; çerez bandı ve dar ekran alt çubuklarının üstüne oturur; sayfanın sonuna gelince (footer) kenara çekilir; Esc küçültür. */
(()=>{const k=document.getElementById('dadaMentor'); if(!k) return; const ac=k.querySelector('.mp-mini'), kc=k.querySelector('.mp-kucult'), ust=k.querySelector('.mp-ust'), gv=k.querySelector('.mp-govde');
  const ENGEL='.cz,.alt-gez,.dt-eylem.dikey,.cal-bar.gor,.dinle-cubuk:not([hidden])'; let acik=false, bek=0;
  const olc=()=>{bek=0; const sol=k.offsetLeft, sag=sol+(acik?Math.min(360,innerWidth-32):(innerWidth>640?64:56)); let e=0;
    document.querySelectorAll(ENGEL).forEach(o=>{if(o.hidden||!o.getClientRects().length) return; const cs=getComputedStyle(o); if(cs.position!=='fixed'||cs.display==='none'||cs.visibility==='hidden') return;
      const r=o.getBoundingClientRect(); if(r.height>0&&r.top<innerHeight&&r.left<sag&&r.right>sol) e=Math.max(e,Math.round(innerHeight-r.top));});
    k.style.setProperty('--mp-engel',e+'px'); const en=document.documentElement.scrollHeight-innerHeight; k.classList.toggle('ft-gizle',!acik&&en>320&&en-scrollY<260);};
  const iste=()=>{if(!bek) bek=requestAnimationFrame(olc);};
  const vd=k.querySelector('video'), azH=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const durum=y=>{acik=y; if(vd){if(y){if(!vd.getAttribute('src')) vd.src=vd.dataset.src; if(!azH){const p=vd.play(); if(p) p.catch(()=>{});}} else vd.pause();} k.classList.toggle('mini',!y); k.dataset.state=y?'full':'mini'; ac.setAttribute('aria-expanded',y); ac.inert=y; ust.inert=!y; gv.inert=!y;
    (y?kc:ac).focus({preventScroll:true}); iste(); setTimeout(olc,520);};
  ac.addEventListener('click',()=>durum(true)); kc.addEventListener('click',()=>durum(false));
  k.addEventListener('keydown',e=>{if(e.key==='Escape'&&acik){e.preventDefault(); durum(false);}});
  addEventListener('scroll',iste,{passive:true}); addEventListener('resize',iste);
  new MutationObserver(iste).observe(document.documentElement,{attributes:true,attributeFilter:['class']}); olc(); setTimeout(olc,600);})();
/* Haberi dinle (Beyar 2026-11-24: "sol şeritteki ses düğmesine basınca bir şey olmuyor"): sol şeritteki Dinle, içerikteki "Haberi dinle" oynatıcısı ve
   alttaki mini çubuk tek denetleyiciye bağlı. Tarayıcının Türkçe sesiyle başlık + spot + gövde okunur (speechSynthesis); ses yoksa zamanlayıcıyla ilerler.
   Oynarken şerit düğmesi etkin (duraklat ikonu), dalga ilerlemeye göre dolar; oynatıcı ekrandan çıkınca altta mini çubuk görünür. */
(()=>{const bas=document.querySelector('.dt-bas-ic h1'); const ray=document.querySelector('.dt-eylem button[aria-label="Dinle"]'), ic=document.querySelector('.dt-dinle'); if(!bas||(!ray&&!ic)) return;
  const metin=[bas.textContent, document.querySelector('.dt-spot')?.textContent||'', ...[...document.querySelectorAll('.dt-govde p')].map(p=>p.textContent)].join('. ').replace(/\s+/g,' ').trim();
  const ss=window.speechSynthesis, HIZ=[1,1.25,1.5,0.75]; let cal=false, poz=0, hi=0, zam=null, ut=null;
  const sureSn=Math.max(60,Math.round(metin.length/14));
  const cub=document.createElement('div'); cub.className='dinle-cubuk'; cub.hidden=true; cub.setAttribute('role','region'); cub.setAttribute('aria-label','Haber dinleniyor');
  cub.innerHTML='<button type="button" class="dc-oyn" aria-label="Duraklat"><i class="fa-solid fa-pause"></i></button><span class="dc-y"><small>Dinleniyor</small><b></b></span><span class="dc-ilerle"><i></i></span><button type="button" class="dc-hiz" aria-label="Okuma hızı">1x</button><button type="button" class="dc-kapat" aria-label="Dinlemeyi kapat"><i class="fa-solid fa-xmark"></i></button>';
  cub.querySelector('b').textContent=bas.textContent; document.body.appendChild(cub);
  const dalga=ic?[...ic.querySelectorAll('.dt-dalga i')]:[], icOyn=ic?.querySelector('.dt-oyn'), icHiz=ic?.querySelector('.dt-hiz');
  let icGorunur=true; if(ic&&'IntersectionObserver' in window) new IntersectionObserver(e=>{icGorunur=e[0].isIntersecting; boya();}).observe(ic); else icGorunur=false;
  const boya=()=>{const o=Math.min(1,poz/metin.length), n=Math.round(o*dalga.length);
    dalga.forEach((d,i)=>d.classList.toggle('dolu',i<n)); cub.querySelector('.dc-ilerle i').style.inlineSize=(o*100)+'%';
    const ik=cal?'fa-solid fa-pause':'fa-solid fa-play';
    if(icOyn){icOyn.querySelector('i').className=ik; icOyn.setAttribute('aria-label',cal?'Duraklat':'Dinle');}
    cub.querySelector('.dc-oyn i').className=ik; cub.querySelector('.dc-oyn').setAttribute('aria-label',cal?'Duraklat':'Devam et');
    if(ray){ray.classList.toggle('on',cal||poz>0); ray.setAttribute('aria-pressed',cal); ray.querySelector('i').className=cal?'fa-solid fa-pause':'fa-solid fa-headphones';}
    const h=HIZ[hi]+'x'; cub.querySelector('.dc-hiz').textContent=h; if(icHiz) icHiz.textContent=h;
    cub.hidden=!(cal||poz>0)||(icGorunur&&!!ic); document.documentElement.classList.toggle('dinleniyor',!cub.hidden);};
  const bitti=()=>{cal=false; poz=0; boya();};
  const konus=()=>{if(!ss){clearInterval(zam); zam=setInterval(()=>{poz+=metin.length/sureSn*HIZ[hi]; if(poz>=metin.length){clearInterval(zam); bitti();} boya();},1000); return;}
    ss.cancel(); ut=new SpeechSynthesisUtterance(metin.slice(poz)); ut.lang='tr-TR'; ut.rate=HIZ[hi]; const v=ss.getVoices().find(x=>/^tr/i.test(x.lang)); if(v) ut.voice=v;
    const b0=poz; ut.onboundary=e=>{poz=b0+e.charIndex; boya();}; ut.onend=()=>{if(cal) bitti();}; ss.speak(ut);};
  const oynat=()=>{document.dispatchEvent(new Event('dh-dinle')); cal=true; konus(); boya();};
  const durdur=()=>{cal=false; if(ss) ss.cancel(); clearInterval(zam); boya();};
  document.addEventListener('dh-ses',()=>{if(cal){cal=false; clearInterval(zam); boya();}});
  const degis=()=>cal?durdur():oynat();
  ray?.addEventListener('click',degis); icOyn?.addEventListener('click',degis); cub.querySelector('.dc-oyn').addEventListener('click',degis);
  const hizla=()=>{hi=(hi+1)%HIZ.length; if(cal) konus(); boya();}; icHiz?.addEventListener('click',hizla); if(icHiz){icHiz.setAttribute('role','button'); icHiz.tabIndex=0;} cub.querySelector('.dc-hiz').addEventListener('click',hizla);
  cub.querySelector('.dc-kapat').addEventListener('click',()=>{durdur(); poz=0; boya();});
  addEventListener('pagehide',()=>{if(ss) ss.cancel();}); boya();})();
/* ===== Sesli Spiker (Beyar 2026-11-24): bülten kuyruğu gerçek sesle okunur; alttaki kalıcı çalar panel kapansa da çalar (Spotify gibi).
   Ses kaynağı tek yerde (SES.kaynak): şimdilik tarayıcının Türkçe sesi (speechSynthesis), ElevenLabs bağlanınca ses dosyası buradan çalınır.
   Sayfa değişince kaldığı bülten ve haber hatırlanır (sessionStorage), çalar duraklatılmış halde yeniden görünür. ===== */
const BULTEN={
 '16.00 Bülteni':["İyi günler, Dada Haber 16.00 Bülteni'ne hoş geldin. Bugün öne çıkan beş başlık var.","Merkez Bankası politika faizini yüzde 42,5'te sabit tuttu; bir sonraki karar 18 Aralık'ta açıklanacak.","Asgari Ücret Tespit Komisyonu ilk toplantısını 4 Aralık'ta yapacak; kararın yıl sonuna kadar açıklanması bekleniyor.","Meteoroloji, Marmara için turuncu kodlu kar uyarısı yaptı; İstanbul'da okullar yarın da tatil.","Millî takımın aday kadrosu açıklandı; kamp 8 Aralık'ta Antalya'da başlıyor. Dada Haber'i dinlediğin için teşekkürler."],
 'Takip Ettiklerin':["Takip ettiğin konulardan derledim.","Ekonomi: Dolar güne 34,52 liradan başladı, borsa yüzde 0,4 düştü.","Beşiktaş deplasmanda üç puanı iki golle aldı.","İstanbul'da Kirazlı–Halkalı metrosu yarın açılıyor."],
 'Ekonomi Özeti':["Ekonomi özeti.","Merkez Bankası faizi yüzde 42,5'te sabit tuttu.","Dolar 34,52, euro 36,21 liradan işlem görüyor.","Borsa İstanbul günü yüzde 0,4 düşüşle tamamladı."],
 'Spor Özeti':["Spor özeti.","Süper Lig'de 14. hafta derbiyle başlıyor.","Basketbolda Avrupa kupalarında üç galibiyet geldi.","Voleybol Kadın Millî Takımı finalde."]};
const SES=(()=>{const ss=window.speechSynthesis, HIZ=[1,1.25,1.5,.75], K='dh-spiker';
 const bar=document.createElement('div'); bar.className='cal-bar'; bar.setAttribute('role','region'); bar.setAttribute('aria-label','Spiker çalar');
 bar.innerHTML='<div class="cal-kapak" aria-hidden="true"><i></i><i></i><i></i><b>DS</b></div><div class="cal-orta"><div class="cal-ust"><span class="bl"><i></i>Spiker</span><b data-ses-ad></b><small data-ses-sira></small></div><div class="cal-cumle" data-ses-cumle></div><div class="cal-ilerle"><span data-ses-gecen>00:00</span><span class="cal-iz"><i data-ses-dolu></i></span><span data-ses-toplam>00:00</span></div></div><div class="cal-kont"><button type="button" data-ses="geri" aria-label="Önceki haber"><i class="fa-solid fa-backward-step"></i></button><button type="button" class="ana" data-ses="degis" aria-label="Oynat"><i class="fa-solid fa-play"></i></button><button type="button" data-ses="ileri" aria-label="Sonraki haber"><i class="fa-solid fa-forward-step"></i></button><button type="button" class="hz" data-ses="hiz" aria-label="Okuma hızı">1x</button><button type="button" data-ses="metin" aria-label="Bülten metni"><i class="fa-solid fa-align-left"></i></button><button type="button" data-ses="kapat" aria-label="Çaları kapat"><i class="fa-solid fa-xmark"></i></button></div>';
 const mk=document.createElement('div'); mk.className='cal-metin'; mk.setAttribute('aria-label','Bülten metni');
 document.body.append(mk,bar);
 let ad='16.00 Bülteni', kuyruk=BULTEN[ad], i=0, cal=false, hi=0, kar=0, zam=null;
 const sure=x=>Math.max(3,Math.round(x.length/14)), toplam=()=>kuyruk.reduce((a,x)=>a+sure(x),0);
 const fmt=x=>String(Math.floor(x/60)).padStart(2,'0')+':'+String(Math.floor(x%60)).padStart(2,'0');
 const kac=x=>x.replace(/[&<]/g,c=>c==='&'?'&amp;':'&lt;');
 const sakla=()=>{try{sessionStorage.setItem(K,JSON.stringify({ad,i,hi,acik:bar.classList.contains('gor')}));}catch(_){}};
 const ciz=()=>{const x=kuyruk[i]||'', k=Math.min(kar,x.length), u=x.indexOf(' ',k+1)<0?x.length:x.indexOf(' ',k+1);
  document.querySelectorAll('[data-ses-cumle]').forEach(e=>e.innerHTML=x?kac(x.slice(0,k))+'<mark>'+kac(x.slice(k,u))+'</mark>'+kac(x.slice(u)):'');
  document.querySelectorAll('[data-ses-cumle-duz]').forEach(e=>e.textContent=cal?x:'');
  const once=kuyruk.slice(0,i).reduce((a,y)=>a+sure(y),0)+sure(x)*(x.length?k/x.length:0), T=toplam();
  document.querySelectorAll('[data-ses-ad]').forEach(e=>e.textContent=ad); document.querySelectorAll('[data-ses-sira]').forEach(e=>e.textContent=(i+1)+' / '+kuyruk.length);
  document.querySelectorAll('[data-ses-gecen]').forEach(e=>e.textContent=fmt(once)); document.querySelectorAll('[data-ses-toplam]').forEach(e=>e.textContent=fmt(T));
  document.querySelectorAll('[data-ses-sure]').forEach(e=>e.textContent=fmt(once)+' / '+fmt(T)); document.querySelectorAll('[data-ses-dolu]').forEach(e=>e.style.inlineSize=(T?once/T*100:0)+'%');
  document.querySelectorAll('[data-ses="degis"]').forEach(b=>{b.querySelector('i').className='fa-solid '+(cal?'fa-pause':'fa-play'); b.setAttribute('aria-label',cal?'Duraklat':'Oynat');});
  document.querySelectorAll('[data-ses="hiz"]').forEach(b=>b.textContent=HIZ[hi]+'x');
  document.querySelectorAll('[data-bulten]').forEach(b=>b.classList.toggle('a',b.dataset.bulten===ad));
  mk.querySelectorAll('[data-n]').forEach(b=>{const n=+b.dataset.n; b.classList.toggle('on',n===i); b.classList.toggle('gecti',n<i);});
  bar.classList.toggle('calis',cal); document.documentElement.classList.toggle('cal-acik',bar.classList.contains('gor'));};
 const listele=()=>{mk.innerHTML='<h2>'+kac(ad)+' · metin</h2>'+kuyruk.map((x,n)=>'<button type="button" data-n="'+n+'"><b>'+String(n+1).padStart(2,'0')+'</b><span>'+kac(x)+'</span></button>').join('');};
 const sonraki=()=>{i++; if(i<kuyruk.length) konus(); else {cal=false; i=0; kar=0; ciz(); sakla();}};
 /* Ses kaynağı: tarayıcı sesi. ElevenLabs gelince bu fonksiyon cümlenin ses dosyasını <audio> ile çalar, ilerlemeyi timeupdate'ten verir. */
 const konus=()=>{clearInterval(zam); kar=0; const x=kuyruk[i]; if(!x) return;
  if(ss){ss.cancel(); const u=new SpeechSynthesisUtterance(x); u.lang='tr-TR'; u.rate=HIZ[hi]; const v=ss.getVoices().find(y=>/^tr/i.test(y.lang)); if(v) u.voice=v;
   u.onboundary=e=>{kar=e.charIndex; ciz();}; u.onend=()=>{if(cal) sonraki();}; ss.speak(u);}
  else zam=setInterval(()=>{kar=Math.min(x.length,kar+Math.round(14*HIZ[hi]/4)); ciz(); if(kar>=x.length){clearInterval(zam); if(cal) sonraki();}},250);
  ciz(); sakla();};
 const oyna=()=>{document.dispatchEvent(new Event('dh-ses')); cal=true; bar.classList.add('gor'); konus();};
 const durdur=()=>{cal=false; if(ss) ss.cancel(); clearInterval(zam); ciz(); sakla();};
 const degis=()=>cal?durdur():oyna();
 const sec=b=>{if(!BULTEN[b]) return; ad=b; kuyruk=BULTEN[b]; i=0; listele(); oyna();};
 document.addEventListener('dh-dinle',()=>{if(cal){cal=false; clearInterval(zam); ciz();}});
 document.addEventListener('click',e=>{const s_=e.target.closest('[data-ses]'), bl=e.target.closest('[data-bulten]'); if(!s_&&!bl) return; e.preventDefault();
  if(bl){sec(bl.dataset.bulten); return;} const k=s_.dataset.ses;
  if(k==='degis') degis(); else if(k==='ileri'){i=Math.min(kuyruk.length-1,i+1); cal?konus():(kar=0,ciz());} else if(k==='geri'){i=Math.max(0,i-1); cal?konus():(kar=0,ciz());}
  else if(k==='hiz'){hi=(hi+1)%HIZ.length; cal?konus():ciz();} else if(k==='metin'){mk.classList.toggle('gor'); s_.classList.toggle('ac');}
  else if(k==='kapat'){durdur(); bar.classList.remove('gor'); mk.classList.remove('gor'); ciz(); sakla();}});
 bar.querySelector('.cal-iz').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect(); let o=(e.clientX-r.left)/r.width; if(getComputedStyle(bar).direction==='rtl') o=1-o; let T=toplam()*o, n=0; while(n<kuyruk.length-1&&T>sure(kuyruk[n])){T-=sure(kuyruk[n]); n++;} i=n; cal?konus():(kar=0,ciz());});
 mk.addEventListener('click',e=>{const b=e.target.closest('[data-n]'); if(b){i=+b.dataset.n; oyna();}});
 try{const v=JSON.parse(sessionStorage.getItem(K)||'null'); if(v&&BULTEN[v.ad]){ad=v.ad; kuyruk=BULTEN[ad]; i=Math.min(v.i||0,kuyruk.length-1); hi=v.hi||0; if(v.acik) bar.classList.add('gor');}}catch(_){}
 listele(); ciz(); addEventListener('pagehide',()=>{if(ss) ss.cancel();});
 return {oyna,durdur,degis,sec};})();
/* Spiker paneli: altyazı ve "Spiker'a sor" (örnek yanıt) */
(()=>{const k=document.getElementById('dadaMentor'); if(!k) return; const cv=k.querySelector('.sa-cevap');
 k.addEventListener('click',e=>{const c=e.target.closest('[data-cc]'); if(c){c.classList.toggle('a',k.classList.toggle('cc')); return;}
  const q=e.target.closest('[data-sor]'); if(q&&cv){cv.innerHTML='<span class="s"><i class="fa-solid fa-microphone"></i>Dinliyorum…</span><span class="q">“Asgari ücret ne zaman açıklanacak?”</span>'; cv.classList.add('g');
   setTimeout(()=>{cv.innerHTML='<span class="s"><i class="fa-solid fa-microphone" style="animation:none;background:var(--siyah)"></i>Spiker yanıtladı</span><span class="q">“Asgari ücret ne zaman açıklanacak?”</span><span class="c">Komisyon 4 Aralık’ta ilk kez toplanıyor; kararın yılın son haftasında açıklanması bekleniyor. Yeni tutar 1 Ocak 2027’den itibaren geçerli.</span><span class="k"><a href="haber-detay.html">Haberi aç</a><button type="button" data-cv-kapat>Kapat</button></span>';},1500); return;}
  if(e.target.closest('[data-cv-kapat]')&&cv) cv.classList.remove('g');});})();
/* "Tümünü Gör" sekme bağlantısı (arama): [data-sekme-git] aynı sayfadaki eşleşen sekmeyi seçer; sayfa ?sekme= ile açılırsa o sekme açılır */
(()=>{const sec=ad=>{const n=s=>s.toLocaleLowerCase('tr').replace(/·.*$/,'').trim(); const b=[...document.querySelectorAll('.pn-sekme button,.pn-sekme a')].find(x=>n(x.textContent)===n(ad)); if(b){b.click(); return true;} return false;};
 document.addEventListener('click',e=>{const a=e.target.closest('[data-sekme-git]'); if(!a) return; if(sec(a.dataset.sekmeGit)){e.preventDefault(); a.closest('main')?.querySelector('.pn-sekme')?.scrollIntoView({block:'start',behavior:'smooth'});}});
 const q=new URLSearchParams(location.search).get('sekme'); if(q) sec(q.charAt(0).toLocaleUpperCase('tr')+q.slice(1));})();
/* E-bülten kayıt bölümü (ortak parça): e-posta ve onay denetimi, bölüm içinde "Kaydın alındı" durumu (açılır pencere yok); üyeyken e-posta dolu ve abonelik satırı;
   bölüm ekrandayken sabit öğeler (Spiker, Görüş bildir, Yukarı çık) çekilir. */
document.querySelectorAll('[data-eb]').forEach(eb=>{const f=eb.querySelector('.eb-form'), inp=eb.querySelector('[data-eb-eposta]'), onay=eb.querySelector('[data-eb-onay]'), hata=eb.querySelector('.eb-hata'), hm=eb.querySelector('[data-eb-hata-metin]'), tm=eb.querySelector('.eb-tamam'), ab=eb.querySelector('.eb-abone');
 const uye=document.documentElement.classList.contains('oturum'); if(uye){inp.value='ece.yilmaz@eposta.com'; ab.hidden=false;}
 const goster=m=>{hm.textContent=m; hata.hidden=false; eb.classList.add('hatali'); inp.setAttribute('aria-invalid','true');};
 const temizle=()=>{hata.hidden=true; eb.classList.remove('hatali'); inp.removeAttribute('aria-invalid');};
 inp.addEventListener('input',temizle); onay.addEventListener('change',temizle);
 f.addEventListener('submit',e=>{e.preventDefault(); const v=inp.value.trim();
  if(!v) return goster('E-posta adresini yaz.'), inp.focus();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return goster('Geçerli bir e-posta adresi yaz (ör. ad@ornek.com).'), inp.focus();
  if(!eb.querySelector('.eb-cip input:checked')) return goster('En az bir bülten seç.');
  if(!onay.checked) return goster('Devam etmek için Açık Rıza Metni onayı gerekiyor.'), onay.focus();
  temizle(); eb.querySelector('[data-eb-adres]').textContent=v; tm.hidden=false; eb.classList.add('tamam'); tm.querySelector('b').focus?.();});
 let bk=0; const bak=()=>{bk=0; const r=eb.getBoundingClientRect(); document.documentElement.classList.toggle('eb-gorunur',r.top<innerHeight-40&&r.bottom>40);};
 const iste=()=>{if(!bk) bk=setTimeout(bak,60);}; addEventListener("scroll",iste,{passive:true}); addEventListener("resize",iste); bak();});


/* Sayfalama (Beyar 2026-11-25) · ortak bileşen. HTML kalıbı araclar/sayfalama.py ile aynıdır (aynı algoritma).
   Seçili sayfa adresteki ?sayfa= değerinden okunur (data-sekme varsa yalnız o sekme adresteyken). Düğmeler adresi
   günceller (history), bileşen yeniden çizilir, liste o sayfanın kayıtlarını gösterir ve liste başına kayar.
   Prototip notu: kayıtlar örnek veridir; sayfa değişince listedeki kartlar sayfa numarasına göre sıra değiştirir,
   son sayfada kalan kayıt sayısı kadar kart görünür (toplam kayıt .ls-sayi'dan). Sunucuda bu kısım gerçek sorgudur. */
(function(){
 const basla=()=>{
  const navlar=[...document.querySelectorAll('nav.ls-sayfa[data-toplam]')]; if(!navlar.length) return;
  /* Seçili sayfanın çevresinde sabit 5'li kayan pencere; ilk/son numara ve '…' yok (en başa / en sona görür) */
  const ogeler=(T,c)=>{const P=5; if(T<=P) return Array.from({length:T},(_,i)=>i+1); const b=Math.min(Math.max(1,c-2),T-P+1); return Array.from({length:P},(_,i)=>b+i);};
  const dosya=()=>location.pathname.split('/').pop()||'index.html';
  const adres=(nav,n)=>{const p=new URLSearchParams(location.search); if(nav.dataset.sekme) p.set('sekme',nav.dataset.sekme); p.set('sayfa',n); return dosya()+'?'+p.toString();};
  const secili=nav=>{const T=+nav.dataset.toplam||1, q=new URLSearchParams(location.search);
   if(nav.dataset.sekme && (q.get('sekme')||'').toLocaleLowerCase('tr')!==nav.dataset.sekme) return 1;
   const n=parseInt(q.get('sayfa'),10); return Math.min(Math.max(1,isNaN(n)?1:n),T);};
  const ok=(nav,n,etiket,ikon,pasif)=>pasif?`<a class="sf-ok pasif" role="link" aria-disabled="true" aria-label="${etiket}"><i class="fa-solid ${ikon}"></i></a>`
   :`<a class="sf-ok" href="${adres(nav,n)}" aria-label="${etiket}"><i class="fa-solid ${ikon}"></i></a>`;
  const ciz=(nav,c)=>{const T=+nav.dataset.toplam||1; if(T<=1){nav.hidden=true; nav.innerHTML=''; return;}
   const no=ogeler(T,c).map(n=>n===c?`<a class="aktif" href="${adres(nav,n)}" aria-current="page">${n}</a>`:`<a href="${adres(nav,n)}">${n}</a>`).join('');
   nav.innerHTML='<div class="sf-satir">'+ok(nav,1,'İlk sayfa','fa-angles-left',c===1)+ok(nav,c-1,'Önceki sayfa','fa-chevron-left',c===1)
    +`<span class="sf-no">${no}</span><span class="sf-ozet"><span class="sr">Sayfa </span>${c} / ${T}</span>`
    +ok(nav,c+1,'Sonraki sayfa','fa-chevron-right',c===T)+ok(nav,T,'Son sayfa','fa-angles-right',c===T)
    +`</div><span class="sf-toplam">${T.toLocaleString('tr-TR')} sayfa</span>`;};
  /* Kayıtlar: sayfalamadan önceki kardeş bloklardaki kartlar (article ya da a); başlık, bant ve uyarılar yerinde kalır */
  const kayit=nav=>{ if(nav._k) return nav._k; const dugum=[];
   for(let e=nav.previousElementSibling;e;e=e.previousElementSibling){ const k=[...e.children].filter(x=>x.matches('article,a')); if(k.length>1) dugum.unshift(...k); }
   const yer=dugum.map(d=>{const m=document.createComment('sf'); d.before(m); return m;});
   const say=parseInt(((nav.parentElement.querySelector('.ls-sayi b')||{}).textContent||'').replace(/\D/g,''),10);
   return nav._k={dugum,yer,say};};
  const goster=(nav,c)=>{const {dugum,yer,say}=kayit(nav), n=dugum.length; if(n<2) return; const T=+nav.dataset.toplam||1;
   const kay=((c-1)*3)%n; const sira=dugum.map((_,i)=>dugum[(i+kay)%n]);
   const gorunur=(c===T && say && Math.ceil(say/n)===T)?say-(T-1)*n:n;
   sira.forEach((d,i)=>{yer[i].after(d); d.style.display=i>=gorunur?"none":"";});};
  const guncelle=()=>navlar.forEach(nav=>{const c=secili(nav); ciz(nav,c); goster(nav,c);});
  const kaydir=nav=>{const hedef=nav.parentElement, ust=(document.querySelector('header.yapiskan')||{}).offsetHeight||0;
   const y=hedef.getBoundingClientRect().top+scrollY-ust-16, az=matchMedia('(prefers-reduced-motion: reduce)').matches;
   scrollTo({top:Math.max(0,y),behavior:az?'instant':'smooth'});};
  navlar.forEach(nav=>nav.addEventListener('click',e=>{const a=e.target.closest('a[href]'); if(!a||!nav.contains(a)||e.metaKey||e.ctrlKey||e.shiftKey) return;
   e.preventDefault(); history.pushState({sf:1},'',a.getAttribute('href')); guncelle(); kaydir(nav);
   const odak=nav.querySelector('a.aktif')||nav.querySelector('.sf-ozet'); if(odak&&odak.focus) odak.focus({preventScroll:true});}));
  addEventListener('popstate',()=>{guncelle(); const nav=navlar.find(n=>secili(n)>1)||navlar[0]; kaydir(nav);});
  guncelle();
  const ilk=navlar.find(n=>secili(n)>1); if(ilk) requestAnimationFrame(()=>{const ust=(document.querySelector('header.yapiskan')||{}).offsetHeight||0;
   scrollTo({top:Math.max(0,ilk.parentElement.getBoundingClientRect().top+scrollY-ust-16),behavior:'instant'});});
 };
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',basla):basla();
})();
