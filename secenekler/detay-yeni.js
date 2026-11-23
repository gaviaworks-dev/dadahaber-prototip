/* Haber detayı · telefon · yeni tasarım yönleri: küçük etkileşimler (taslak) */
(()=>{
  // okuma ilerlemesi
  const cubuk=document.querySelector('.oc-ilerleme i'), gv=document.querySelector('.gv');
  if(cubuk&&gv){const g=()=>{const r=gv.getBoundingClientRect(), y=Math.min(1,Math.max(0,(innerHeight*.6-r.top)/r.height)); cubuk.style.inlineSize=(y*100)+'%';}; addEventListener('scroll',g,{passive:true}); g();}
  // kaydet / takip aç-kapa
  document.querySelectorAll('[data-ac]').forEach(b=>b.addEventListener('click',()=>{const on=b.classList.toggle('on'); b.setAttribute('aria-pressed',on);
    if(b.dataset.ac==='takip') b.textContent=on?'Takipte':'Takip et';
    const i=b.querySelector('i'); if(i&&b.dataset.ac==='kaydet') i.className=on?'fa-solid fa-bookmark':'fa-solid fa-bookmark';}));
  // bölümlü düğmeler (15 sn / 1 dk / tam metin)
  document.querySelectorAll('.sg[data-mod]').forEach(sg=>sg.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
    sg.querySelectorAll('button').forEach(x=>{x.classList.toggle('aktif',x===b); x.setAttribute('aria-selected',x===b);});
    document.querySelectorAll('.md').forEach(m=>m.classList.toggle('on',m.dataset.md===b.dataset.md));})));
  document.querySelectorAll('.sg:not([data-mod])').forEach(sg=>sg.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>sg.querySelectorAll('button').forEach(x=>x.classList.toggle('aktif',x===b)))));
  // özet kartları: nokta göstergesi
  const kr=document.querySelector('.kr'), nk=document.querySelectorAll('.nk i');
  if(kr&&nk.length){kr.addEventListener('scroll',()=>{const w=kr.firstElementChild.getBoundingClientRect().width+12, n=Math.round(kr.scrollLeft/w); nk.forEach((x,i)=>x.classList.toggle('on',i===n));},{passive:true});}
  // kapaklı düzende üst bar kaydırınca dolar
  const ub=document.querySelector('.e2 .ub'), kp=document.querySelector('.kp');
  if(ub&&kp){const f=()=>ub.classList.toggle('dolu',kp.getBoundingClientRect().bottom<70); addEventListener('scroll',f,{passive:true}); f();}
})();
/* akordiyon: aynı anda tek bölüm açık */
document.querySelectorAll('.e1-ne').forEach(k=>{const d=[...k.querySelectorAll('details')]; d.forEach(x=>x.addEventListener('toggle',()=>{if(x.open) d.forEach(y=>{if(y!==x) y.open=false;});}));});
