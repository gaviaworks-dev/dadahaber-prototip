/* Dada Haber · ortak betik. Belirme animasyonu, otomatik ray, takım seçimi, footer perdesi (Gastro gibi). Sayfada öğe yoksa sessizce geçer. */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('gorundu');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.belir').forEach(el=>io.observe(el));
// Süper Lig T2: kutucuğa tıklayınca seçili takım ve panel güncellenir (önizlemede haberler örnek)
document.querySelectorAll('.tc-a').forEach(a=>a.addEventListener('click',e=>{const h=a.getAttribute('href'); if(h&&h!=='#') return; e.preventDefault();document.querySelectorAll('.tc-a').forEach(x=>x.classList.remove('sec'));a.classList.add('sec');a.closest('.kap').querySelectorAll('.tk-adi').forEach(s=>s.textContent=a.dataset.ad);}));
document.querySelectorAll('.tk-serit .tk').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();
  document.querySelectorAll('.tk-serit .tk').forEach(x=>x.classList.remove('sec'));a.classList.add('sec');
  const p=a.closest('.kap').querySelector('.tk-panel'); if(!p) return;
  p.querySelectorAll('.tk-adi').forEach(s=>s.textContent=a.dataset.ad);
  const ar=p.querySelector('.tk-arma .arma'); ar.textContent=a.dataset.kod; ar.style.background=a.dataset.renk;}));
// Otomatik dönen raylar: her 5 sn'de bir kart kayar; üstüne gelince ve sekme görünmezken durur; prefers-reduced-motion'da kapalı.
const azHareket=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-oto]').forEach(kap=>{
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
const pnAc=ad=>{const d=document.getElementById('pn-'+ad); if(!d) return false; document.querySelectorAll('dialog.pn[open]').forEach(x=>x.close()); d.showModal(); return true;};
const toast=m=>{const k=document.querySelector('.toast-kap'); if(!k) return; const t=document.createElement('div'); t.className='toast'; t.innerHTML='<i class="fa-solid fa-check"></i>'+m; k.appendChild(t); setTimeout(()=>t.remove(),2600);};
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-acilir]'); if(a&&pnAc(a.dataset.acilir)){e.preventDefault();return;}
  const ty=e.target.closest('[data-toast]'); if(ty) toast(ty.dataset.toast);
  const k=e.target.closest('[data-kapat]'); if(k){const d=k.closest('dialog'); if(d) d.close();}
  const kay=e.target.closest('.kaydet,.pc-kaydet,.inf3-kaydet'); if(kay){e.preventDefault(); pnAc('uyelik'); return;}
  const b=e.target.closest('.dt-eylem button,.dt-pay-d'); if(b){const l=b.getAttribute('aria-label')||'';
    if(/Paylaş|kopyala/i.test(l)){e.preventDefault(); if(/kopyala/i.test(l)) toast('Bağlantı kopyalandı'); else pnAc('paylas');}
    else if(/Yazı boyutu/i.test(l)) pnAc('gorunum'); else if(/Kaydet/i.test(l)) pnAc('uyelik');}
});
document.querySelectorAll('dialog.pn').forEach(d=>d.addEventListener('click',e=>{if(e.target===d) d.close();}));
/* Çerez bandı: ilk ziyarette altta (girişte açılır pencere değil, sayfayı kapatmaz); seçim cihazda saklanır */
(()=>{const cz=document.querySelector('.cz'); if(!cz) return; let s=null; try{s=localStorage.getItem('dh-cerez');}catch(_){}
  if(!s) cz.classList.add('acik');
  document.addEventListener('click',e=>{const c=e.target.closest('[data-cerez]'); if(!c) return; try{localStorage.setItem('dh-cerez',c.dataset.cerez);}catch(_){} cz.classList.remove('acik');});})();
