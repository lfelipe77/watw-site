(function(){
var CFG={whatsapp:'5547996437188',email:'we@weautomatetheworld.com',video:'jKK9xbhgNuM'};
window.WATW=CFG;
var ICON='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.45 15.07L2 22l5.07-1.55A9.9 9.9 0 1 0 12.04 2Zm5.8 14.06c-.25.7-1.45 1.34-2 1.4-.52.06-1.17.09-1.89-.12a17 17 0 0 1-1.7-.63c-2.99-1.29-4.94-4.3-5.09-4.5-.15-.2-1.21-1.6-1.21-3.06 0-1.45.77-2.17 1.04-2.46.27-.3.6-.37.8-.37h.58c.19 0 .44-.07.68.52.25.6.85 2.07.93 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.77 1.27 1.66 2.06 1.14 1.02 2.1 1.34 2.4 1.49.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.07.12.07.72-.18 1.42Z"/></svg>';
var page=document.body.getAttribute('data-page')||'';
function wa(msg){return 'https://wa.me/'+CFG.whatsapp+'?text='+encodeURIComponent(msg)}
document.querySelectorAll('[data-wa]').forEach(function(a){
  var m=a.getAttribute('data-wa')||('Olá! Vi a página "'+page+'" da WATW e quero entender como funciona.');
  a.href=wa(m);a.target='_blank';a.rel='noopener';
  if(a.classList.contains('btn')&&!a.querySelector('svg'))a.insertAdjacentHTML('afterbegin',ICON);
});
document.querySelectorAll('[data-mail]').forEach(function(a){
  var s=a.getAttribute('data-mail')||('Página '+page);
  a.href='mailto:'+CFG.email+'?subject='+encodeURIComponent(s);
});
document.querySelectorAll('form.lead-form').forEach(function(f){
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var d=new FormData(f),n=d.get('nome')||'',o=d.get('escritorio')||'',t=d.get('tipo')||'',c=d.get('carteira')||'',x=d.get('obs')||'';
    var msg='Olá! Sou '+n+(o?' do '+o:'')+(t?' ('+t+')':'')+'. Vi a página "'+page+'" da WATW'+(c?' e minha carteira tem cerca de '+c:'')+'. Quero ver o motor rodando com um caso real.'+(x?' Obs.: '+x:'');
    window.open(wa(msg),'_blank','noopener');
  });
  var em=f.querySelector('[data-mail-form]');
  if(em)em.addEventListener('click',function(e){
    e.preventDefault();var d=new FormData(f);
    var body='Nome: '+(d.get('nome')||'')+'\nEscritório: '+(d.get('escritorio')||'')+'\nTipo: '+(d.get('tipo')||'')+'\nCarteira: '+(d.get('carteira')||'')+'\nObs.: '+(d.get('obs')||'')+'\n\n(Página: '+page+')';
    location.href='mailto:'+CFG.email+'?subject='+encodeURIComponent('Quero ver o motor WATW: '+page)+'&body='+encodeURIComponent(body);
  });
});
document.querySelectorAll('[data-video-slot]').forEach(function(s){
  if(CFG.video){s.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+CFG.video+'?rel=0" title="A máquina WATW" allow="accelerometer;encrypted-media;picture-in-picture;fullscreen" allowfullscreen loading="lazy"></iframe>'}
});
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12}):null;
document.querySelectorAll('.reveal').forEach(function(el){io?io.observe(el):el.classList.add('in')});
document.querySelectorAll('[data-count]').forEach(function(el){
  var to=+el.getAttribute('data-count'),fmt=function(v){return Math.round(v).toLocaleString('pt-BR')};
  var done=false;function run(){if(done)return;done=true;var t0=performance.now();(function st(t){var p=Math.min(1,(t-t0)/1200);el.textContent=fmt(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(st)})(t0)}
  if(io){var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){run();o.disconnect()}},{threshold:.4});o.observe(el)}else el.textContent=fmt(to);
});
})();
