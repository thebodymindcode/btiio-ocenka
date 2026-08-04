
// мега-меню
document.querySelectorAll('nav.main button[data-mega]').forEach(function(b){
  b.addEventListener('click',function(e){
    e.stopPropagation();
    var id=b.dataset.mega, panel=document.getElementById(id), open=panel.classList.contains('open');
    document.querySelectorAll('.mega').forEach(function(m){m.classList.remove('open')});
    document.querySelectorAll('nav.main button').forEach(function(x){x.setAttribute('aria-expanded','false')});
    if(!open){panel.classList.add('open');b.setAttribute('aria-expanded','true')}
  });
});
document.addEventListener('click',function(e){
  if(!e.target.closest('.mega')){
    document.querySelectorAll('.mega').forEach(function(m){m.classList.remove('open')});
    document.querySelectorAll('nav.main button').forEach(function(x){x.setAttribute('aria-expanded','false')});
  }
});
// мобильное меню: собираем из мега-меню
var mob=document.getElementById('mob');
document.getElementById('mobU').innerHTML=document.querySelector('#m1 .wrap').innerHTML;
document.getElementById('mobC').innerHTML=document.querySelector('#m2 .wrap').innerHTML;
document.getElementById('bg').addEventListener('click',function(){mob.classList.toggle('open')});
document.querySelectorAll('.mob .acc>button').forEach(function(b){
  b.addEventListener('click',function(){b.parentNode.classList.toggle('open')});
});
// поиск и фильтр каталога
var q=document.getElementById('q')||{value:'',addEventListener:function(){}},empty=document.getElementById('empty')||{style:{}}, filter='all';
function apply(){
  var v=(q.value||'').trim().toLowerCase(), found=0;
  document.querySelectorAll('.cgroup').forEach(function(g){
    var vis=0;
    g.querySelectorAll('.sv').forEach(function(a){
      var ok=(!v||a.dataset.n.indexOf(v)>-1)&&(filter==='all'||g.dataset.g===filter);
      a.classList.toggle('hide',!ok); if(ok)vis++;
    });
    g.classList.toggle('hide',vis===0); found+=vis;
    // при поиске раздел с попаданиями раскрываем сам
    if(window.innerWidth<=700) g.classList.toggle('open', !!v && vis>0);
  });
  empty.style.display=found?'none':'block';
}
q.addEventListener('input',apply);
document.querySelectorAll('.tab').forEach(function(t){
  t.addEventListener('click',function(){
    document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('on')});
    t.classList.add('on'); filter=t.dataset.f; apply();
  });
});
// подбор услуги из первого экрана: переносит человека в каталог с готовым фильтром
if(document.getElementById('pgo'))document.getElementById('pgo').addEventListener('click',function(){
  var a=document.getElementById('p1').value, b=document.getElementById('p2').value;
  q.value=(b||a||'').trim();
  document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('on')});
  document.querySelector('.tab[data-f="all"]').classList.add('on'); filter='all';
  apply();
  document.getElementById('katalog').scrollIntoView({behavior:'smooth'});
});

// на телефоне каталог становится аккордеоном, иначе страница уходит в 20 экранов
function collapseMobile(){
  var narrow=window.innerWidth<=700;
  document.querySelectorAll('.cgroup').forEach(function(g){
    g.classList.toggle('acc',narrow);
    if(!narrow) g.classList.remove('open');
  });
}
document.querySelectorAll('.cgroup .chead').forEach(function(h){
  h.addEventListener('click',function(){
    if(window.innerWidth>700) return;
    h.parentNode.classList.toggle('open');
  });
});
collapseMobile();
window.addEventListener('resize',collapseMobile);

// вопросы
document.querySelectorAll('.q button').forEach(function(b){
  b.addEventListener('click',function(){b.parentNode.classList.toggle('open')});
});
