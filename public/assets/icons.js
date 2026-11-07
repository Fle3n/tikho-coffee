const paths = {
  arrow:'M5 12h14M13 6l6 6-6 6', external:'M7 17 17 7M7 7h10v10',
  plus:'M12 5v14M5 12h14', close:'m6 6 12 12M18 6 6 18', check:'m5 12 4 4L19 6',
  bag:'M5 8h14l1 12H4L5 8ZM9 8V6a3 3 0 0 1 6 0v2',
  chat:'M4 5h16v12H9l-5 4V5Z', menu:'M4 7h16M4 12h16M4 17h16',
  search:'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM16 16l5 5',
  inbox:'M4 4h16v15H4V4ZM4 13h5l1 3h4l1-3h5',
  route:'M6 4v10a4 4 0 0 0 4 4h8M15 14l4 4-4 4M3 4h6M14 4h7M14 8h7',
  file:'M5 3h10l4 4v14H5V3ZM14 3v5h5M8 12h8M8 16h6',
  calc:'M5 3h14v18H5V3ZM8 6h8M8 11h1M15 11h1M8 15h1M15 15h1',
  clock:'M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  calendar:'M4 6h16v15H4V6ZM8 3v6M16 3v6M4 11h16',
  info:'M12 11v6M12 7h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
};
export function icon(name) { return `<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.arrow}"/></svg>`; }
export function hydrateIcons(scope=document) { scope.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon)}); }
