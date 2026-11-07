import { hydrateIcons } from './icons.js';
hydrateIcons();
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.head-nav');
function closeNav(){nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
nav?.addEventListener('click',event=>{if(event.target.closest('a'))closeNav()});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeNav()});
document.addEventListener('click',event=>{if(!event.target.closest('.site-head'))closeNav()});
matchMedia('(min-width:721px)').addEventListener('change',closeNav);
