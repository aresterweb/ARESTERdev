
const $=(q,el=document)=>el.querySelector(q), $$=(q,el=document)=>[...el.querySelectorAll(q)];
const langBtn=$('#langBtn'); let lang=localStorage.getItem('aresterLang')||'ID';
function setLang(v){lang=v;localStorage.setItem('aresterLang',v);if(langBtn)langBtn.textContent=v==='ID'?'EN':'ID';
 $$('[data-id]').forEach(el=>el.textContent=v==='ID'?el.dataset.id:el.dataset.en||el.dataset.id);}
setLang(lang);
langBtn?.addEventListener('click',()=>setLang(lang==='ID'?'EN':'ID'));
$('#menuBtn')?.addEventListener('click',()=>{const m=$('#mobileMenu');m.hidden=!m.hidden});
const search=$('#productSearch'); if(search) search.addEventListener('input',e=>{
 const q=e.target.value.toLowerCase(); $$('.product-card').forEach(c=>c.style.display=c.innerText.toLowerCase().includes(q)?'':'none');
});
$$('[data-demo-submit]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();alert(lang==='ID'?'Demo tersimpan secara lokal. Tidak ada transaksi atau pengiriman nyata.':'Demo saved locally. No real transaction or delivery was performed.');}));
$('#billingToggle')?.addEventListener('click',e=>{e.target.classList.toggle('yearly'); $$('.billing-price').forEach(el=>{el.textContent=e.target.classList.contains('yearly')?el.dataset.year:el.dataset.month})});
