(function(){
var page=document.body.getAttribute('data-page')||'';
var EMAIL='we@weautomatetheworld.com';
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12}):null;
document.querySelectorAll('.reveal,.panel').forEach(function(el){io?io.observe(el):el.classList.add('in')});
// flow progress line
var flow=document.querySelector('.flow');
if(flow){var tick=false;function upd(){tick=false;var r=flow.getBoundingClientRect(),h=window.innerHeight;var p=(h*.7-r.top)/(r.height);flow.style.setProperty('--p',Math.max(0,Math.min(1,p)).toFixed(3))}
 window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd()}
// panel tilt + card spotlight (fine pointers only)
if(!rm&&window.matchMedia&&matchMedia('(pointer:fine)').matches){
 document.querySelectorAll('.panel').forEach(function(p){p.addEventListener('pointermove',function(e){var r=p.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;p.style.transform='perspective(900px) rotateY('+(x*5)+'deg) rotateX('+(-y*5)+'deg)'});p.addEventListener('pointerleave',function(){p.style.transform=''})});
 document.querySelectorAll('.sy').forEach(function(c){c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')})});
}
// sticky CTA only after the hero, hidden over the form
var st=document.querySelector('.sticky'),hero=document.querySelector('.hero'),cl=document.querySelector('.closing');
if(st&&io){var vis={h:true,c:false};st.classList.add('hide');var o2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.target===hero)vis.h=e.isIntersecting;else vis.c=e.isIntersecting});st.classList.toggle('hide',vis.h||vis.c)});if(hero)o2.observe(hero);if(cl)o2.observe(cl)}
// status counter in panel
document.querySelectorAll('.panel .status b').forEach(function(b){var n=+b.getAttribute('data-n');if(rm){b.textContent=n;return}var i=0;var t=setInterval(function(){i++;b.textContent=i;if(i>=n)clearInterval(t)},450)});
// YouTube facade: load the real player only on click (no layout shift, no third-party load before)
document.querySelectorAll('.vframe[data-yt]').forEach(function(f){var b=f.querySelector('.vplay');if(!b)return;b.addEventListener('click',function(){var i=f.getAttribute('data-yt');f.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+i+'?autoplay=1&rel=0" title="WATW video" allow="accelerometer;autoplay;encrypted-media;picture-in-picture;fullscreen" allowfullscreen></iframe>'})});
// lead form -> /api/lead (same webhook as /escritorios/)
document.querySelectorAll('form.lead-form').forEach(function(f){
 var err=f.querySelector('.err'),btn=f.querySelector('button[type=submit]');
 function fail(m){err.textContent=m;err.hidden=false}
 f.addEventListener('submit',function(e){
  e.preventDefault();err.hidden=true;
  var d=new FormData(f),v=function(k){return (d.get(k)||'').toString().trim()};
  if(!v('nome')||!v('escritorio'))return fail('Please enter your name and firm.');
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('email')))return fail('Please enter a valid work email.');
  if(!f.querySelector('[name=consent]').checked)return fail('Please tick the box so we can reply to you.');
  var payload={nome:v('nome'),escritorio:v('escritorio'),whatsapp:v('whatsapp'),email:v('email'),tipo:v('tipo'),carteira:v('carteira'),obs:'CALL REQUEST. '+v('obs'),site:v('site'),pagina:'US: '+page,url:location.href,ref:document.referrer};
  btn.disabled=true;btn.textContent='Sending...';
  function done(ok){
   var body='Hi, I am '+v('nome')+' from '+v('escritorio')+'. I saw "'+page+'" on the WATW site and would like to talk about the Plug-In Sprint.';
   f.classList.add('sent');setTimeout(function(){try{f.scrollIntoView({behavior:'smooth',block:'start'})}catch(x){}},50);
   f.innerHTML='<div class="ok" aria-hidden="true">'+(ok?'&#10003;':'&#9993;')+'</div><h3>'+(ok?'Request received. Now pick a time.':(/pages\.dev$/.test(location.hostname)?'Preview mode':'One more step.'))+'</h3><p>'+(ok?'Choose a slot below and the call is booked. No payment has been taken.':(/pages\.dev$/.test(location.hostname)?'Preview mode: saving leads is switched off on this test copy. On the live site your request is saved. Pick a time below.':'We could not record it just now. Please email us and we will reply.'))+'</p><div class="cta-row" style="justify-content:center"><a class="btn btn-ghost" href="mailto:'+EMAIL+'?subject='+encodeURIComponent('Call request: '+page)+'&body='+encodeURIComponent(body)+'">Email WATW</a></div>'+'<div class="cal-embed"><h3>Schedule your call</h3><p>Pick a 20-minute time that suits you. Google Meet, no commitment.</p><iframe src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ06G3KqwIqTNTi139_QxZj6cE35l8unEhnXguoGL85nBLJlh_3exrjpjTQyLtTg2ak0YJHaFz9t?gv=true" title="Schedule your call" loading="lazy" style="width:100%;height:680px;border:0;border-radius:12px;background:#fff"></iframe><a class="btn btn-go" target="_blank" rel="noopener" href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ06G3KqwIqTNTi139_QxZj6cE35l8unEhnXguoGL85nBLJlh_3exrjpjTQyLtTg2ak0YJHaFz9t">Open the calendar in a new tab</a></div>';
   if(window.gtag)try{gtag('event','generate_lead',{page:page})}catch(x){}
  }
  fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(function(r){done(r.ok)}).catch(function(){done(false)});
 });
});
})();
