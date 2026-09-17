const polish=document.createElement('link');polish.rel='stylesheet';polish.href='/css/polish.css';document.head.appendChild(polish);
const previewStyles=document.createElement('link');previewStyles.rel='stylesheet';previewStyles.href='/css/preview-lock.css';document.head.appendChild(previewStyles);
const PREVIEW_KEY='rolf-ottesen-preview-access';
const PREVIEW_NAV_KEY='rolf-ottesen-internal-navigation';
const PREVIEW_PASSWORD='1946';

function startHeroVideo(){
 const video=document.querySelector('.hero-video');
 if(!video)return;
 video.muted=true;video.defaultMuted=true;video.playsInline=true;video.loop=true;video.autoplay=true;
 const play=()=>{if(video.paused){const p=video.play();if(p&&p.catch)p.catch(()=>{});}};
 if(video.readyState>=2)play();else video.addEventListener('canplay',play,{once:true});
 video.addEventListener('ended',()=>{video.currentTime=0;play();});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)play();});
 window.addEventListener('focus',play);
 window.addEventListener('pageshow',play);
}

function isInternalNavigation(){
 const allowed=sessionStorage.getItem(PREVIEW_KEY)==='granted';
 const internal=sessionStorage.getItem(PREVIEW_NAV_KEY)==='true';
 sessionStorage.removeItem(PREVIEW_NAV_KEY);
 return allowed&&internal;
}

function createPreviewLock(){
 if(isInternalNavigation()){startHeroVideo();return;}
 sessionStorage.removeItem(PREVIEW_KEY);
 document.documentElement.classList.add('preview-locked');
 const lock=document.createElement('div');lock.className='preview-lock';
 lock.innerHTML=`<div class="preview-lock__panel"><img class="preview-lock__logo" src="/assets/logo/kodela-logo.png" alt="Kodela Studio"><p class="preview-lock__eyebrow">Privat forhåndsvisning</p><h1>Forslag til Rolf Ottesen Grafisk Produksjon.</h1><p class="preview-lock__intro">Denne siden er en privat presentasjon utarbeidet for Rolf Ottesen Grafisk Produksjon. Skriv inn passordet du har mottatt for å se forslaget.</p><form class="preview-lock__form"><input class="preview-lock__input" type="password" name="password" placeholder="Passord" autocomplete="current-password" aria-label="Passord" required><button class="preview-lock__button" type="submit">Åpne →</button></form><p class="preview-lock__error" role="alert" aria-live="polite"></p><p class="preview-lock__note">Utarbeidet av Kodela Studio</p></div>`;
 document.body.appendChild(lock);const form=lock.querySelector('.preview-lock__form'),input=lock.querySelector('.preview-lock__input'),error=lock.querySelector('.preview-lock__error');
 form.addEventListener('submit',event=>{event.preventDefault();if(input.value===PREVIEW_PASSWORD){sessionStorage.setItem(PREVIEW_KEY,'granted');document.documentElement.classList.remove('preview-locked');lock.remove();startHeroVideo();}else{error.textContent='Feil passord. Prøv igjen.';input.value='';input.focus();}});setTimeout(()=>input.focus(),50);
}

function markInternalNavigation(){
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(!link||sessionStorage.getItem(PREVIEW_KEY)!=='granted')return;
  const url=new URL(link.href,window.location.href);
  if(url.origin===window.location.origin&&url.pathname!==window.location.pathname){sessionStorage.setItem(PREVIEW_NAV_KEY,'true');}
 });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{createPreviewLock();markInternalNavigation();});else{createPreviewLock();markInternalNavigation();}
const menuButton=document.querySelector('.menu-toggle'),nav=document.querySelector('.main-nav');if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));document.body.classList.toggle('menu-open',!open)});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menuButton.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){menuButton.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}})}