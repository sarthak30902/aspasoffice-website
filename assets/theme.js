/* ASPAS Office - shared dark/light mode logic */

/* Apply saved theme immediately, before the page paints, to avoid a light-mode flash */
(function(){
  try{
    var t=localStorage.getItem('aspas-theme');
    if(t==='dark'){ document.documentElement.setAttribute('data-theme','dark'); }
  }catch(e){}
})();

/* Wire up the toggle button once the page has loaded */
document.addEventListener('DOMContentLoaded', function(){
  var btn=document.getElementById('aspas-theme-toggle');
  if(!btn) return;

  function currentTheme(){
    return document.documentElement.getAttribute('data-theme')==='dark' ? 'dark' : 'light';
  }
  function paintIcon(){
    var icon = currentTheme()==='dark'
      ? '<svg class="aspas-theme-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v2M12 19.5v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2.5 12h2m15 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/></svg>'
      : '<svg class="aspas-theme-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5a8.5 8.5 0 1 0 12 12Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>';
    btn.innerHTML = icon;
  }
  paintIcon();

  btn.addEventListener('click', function(){
    var next = currentTheme()==='dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('aspas-theme', next); }catch(e){}
    paintIcon();
  });
});
