import { icon } from './icons.js';
export const money = value => `${value.toLocaleString('ru-RU')} ₽`;
export const escapeHTML = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
export const behavior = () => matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth';
export function downloadText(name,text,type='text/plain;charset=utf-8'){
  const url=URL.createObjectURL(new Blob([text],{type}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export async function copyText(text,button){
  const label=button.innerHTML;
  try{
    if(location.protocol!=='https:'&&!['localhost','127.0.0.1','[::1]'].includes(location.hostname))throw Error('manual');
    await navigator.clipboard.writeText(text);button.innerHTML=`${icon('check')} Скопировано`;
    setTimeout(()=>{if(button.isConnected)button.innerHTML=label},2000);
  }catch{
    const dialog=document.createElement('dialog');dialog.className='copy-dialog';dialog.setAttribute('aria-label','Текст для копирования');
    dialog.innerHTML=`<div class="dialog-body"><div class="dialog-head"><h2>Скопируйте текст</h2><button class="icon-button" aria-label="Закрыть текст">${icon('close')}</button></div><p class="notice">Выделенный текст можно скопировать и отправить в Telegram.</p><textarea readonly aria-label="Готовый текст"></textarea></div>`;
    dialog.querySelector('textarea').value=text;document.body.append(dialog);dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>dialog.remove());dialog.showModal();dialog.querySelector('textarea').select();
  }
}
export function wireDialog(dialog){
  dialog.querySelector('[data-close]')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()});
}
let timer;
export function notify(text){let toast=document.querySelector('.toast');if(!toast){toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');document.body.append(toast)}toast.textContent=text;clearTimeout(timer);timer=setTimeout(()=>toast.textContent='',2600)}
