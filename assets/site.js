
var BASE=window.SITE_BASE||'';

// ---------- мега-меню: открывается по наведению, закрывается само ----------
(function(){
  var timer=null, header=document.querySelector('header');
  function closeAll(){
    document.querySelectorAll('.mega').forEach(function(m){m.classList.remove('open')});
    document.querySelectorAll('nav.main button[data-mega]').forEach(function(x){x.setAttribute('aria-expanded','false')});
  }
  function open(b){
    var panel=document.getElementById(b.dataset.mega);
    if(!panel) return;
    closeAll(); panel.classList.add('open'); b.setAttribute('aria-expanded','true');
  }
  document.querySelectorAll('nav.main button[data-mega]').forEach(function(b){
    b.addEventListener('mouseenter',function(){clearTimeout(timer); timer=setTimeout(function(){open(b)},90)});
    b.addEventListener('click',function(e){
      e.preventDefault(); e.stopPropagation(); clearTimeout(timer);
      var panel=document.getElementById(b.dataset.mega);
      panel && panel.classList.contains('open') ? closeAll() : open(b);
    });
    b.addEventListener('focus',function(){open(b)});
  });
  document.querySelectorAll('.mega').forEach(function(m){
    m.addEventListener('mouseenter',function(){clearTimeout(timer)});
  });
  if(header){
    header.addEventListener('mouseleave',function(){clearTimeout(timer); timer=setTimeout(closeAll,160)});
    header.addEventListener('mouseenter',function(){clearTimeout(timer)});
  }
  document.addEventListener('click',function(e){ if(!e.target.closest('header')) closeAll(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeAll(); });
  // ссылка внутри меню закрывает панель сразу, без подвисания
  document.querySelectorAll('.mega a').forEach(function(a){a.addEventListener('click',closeAll)});
})();

// ---------- мобильное меню ----------
(function(){
  var mob=document.getElementById('mob'), bg=document.getElementById('bg');
  var mu=document.getElementById('mobU'), mc=document.getElementById('mobC');
  var m1=document.querySelector('#m1 .wrap'), m2=document.querySelector('#m2 .wrap');
  if(mu&&m1) mu.innerHTML=m1.innerHTML;
  if(mc&&m2) mc.innerHTML=m2.innerHTML;
  if(bg&&mob) bg.addEventListener('click',function(){mob.classList.toggle('open')});
  document.querySelectorAll('.mob .acc>button').forEach(function(b){
    b.addEventListener('click',function(){b.parentNode.classList.toggle('open')});
  });
})();

// ---------- каталог: поиск, фильтр, аккордеон на телефоне ----------
var q=document.getElementById('q')||{value:'',addEventListener:function(){}},empty=document.getElementById('empty')||{style:{}}, filter='all';
function apply(){
  if(!q) return;
  var v=(q.value||'').trim().toLowerCase(), found=0;
  document.querySelectorAll('.cgroup').forEach(function(g){
    var vis=0;
    g.querySelectorAll('.sv').forEach(function(a){
      var ok=(!v||(a.dataset.n||'').indexOf(v)>-1)&&(filter==='all'||g.dataset.g===filter);
      a.classList.toggle('hide',!ok); if(ok)vis++;
    });
    g.classList.toggle('hide',vis===0); found+=vis;
    if(window.innerWidth<=700) g.classList.toggle('open', !!v && vis>0);
  });
  if(empty) empty.style.display=found?'none':'block';
}
if(q){
  q.addEventListener('input',apply);
  var qs=new URLSearchParams(location.search).get('q');
  if(qs){ q.value=qs; }
  apply();
}
document.querySelectorAll('.tab').forEach(function(t){
  t.addEventListener('click',function(){
    document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('on')});
    t.classList.add('on'); filter=t.dataset.f; apply();
  });
});
function collapseMobile(){
  var narrow=window.innerWidth<=700;
  document.querySelectorAll('.cgroup').forEach(function(g){
    g.classList.toggle('acc',narrow);
    if(!narrow) g.classList.remove('open');
  });
}
document.querySelectorAll('.cgroup .chead').forEach(function(h){
  h.addEventListener('click',function(e){
    if(window.innerWidth>700) return;
    if(e.target.closest('a')) return;
    h.parentNode.classList.toggle('open');
  });
});
collapseMobile();
window.addEventListener('resize',collapseMobile);

// ---------- переходы в каталог с готовым запросом ----------
function toCatalog(v){
  location.href=BASE+'/uslugi/'+(v?('?q='+encodeURIComponent(v)):'');
}
function goCat(e){
  e.preventDefault();
  var f=document.getElementById('hq');
  toCatalog(f?f.value.trim():'');
  return false;
}
(function(){
  var pgo=document.getElementById('pgo');
  if(!pgo) return;
  pgo.addEventListener('click',function(){
    var a=(document.getElementById('p1')||{}).value||'';
    var b=(document.getElementById('p2')||{}).value||'';
    toCatalog((b||a).trim());
  });
})();

// ---------- на телефоне показываем шесть направлений, остальные по кнопке ----------
(function(){
  var wrap=document.querySelector('.dirs');
  if(!wrap) return;
  var cards=[].slice.call(wrap.querySelectorAll('.dir'));
  if(cards.length<=6) return;
  var btn=document.createElement('button');
  btn.className='morebtn'; btn.type='button';
  var open=false;
  function paint(){
    var narrow=window.innerWidth<=700;
    cards.forEach(function(c,i){ c.style.display=(narrow&&!open&&i>=6)?'none':'' });
    btn.style.display=narrow?'block':'none';
    btn.textContent=open?'Свернуть направления':('Ещё '+(cards.length-6)+' направления');
  }
  btn.addEventListener('click',function(){open=!open;paint()});
  wrap.parentNode.insertBefore(btn,wrap.nextSibling);
  paint();
  window.addEventListener('resize',paint);
})();

// ---------- премиальная подсветка карточек за курсором ----------
(function(){
  if(window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.card,.task,.dir,.step').forEach(function(el){
    el.addEventListener('mousemove',function(e){
      var r=el.getBoundingClientRect();
      el.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
      el.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
    });
  });
})();

// ---------- вопросы ----------
document.querySelectorAll('.q button').forEach(function(b){
  b.addEventListener('click',function(){b.parentNode.classList.toggle('open')});
});
