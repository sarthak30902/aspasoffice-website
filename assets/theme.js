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
    btn.textContent = currentTheme()==='dark' ? '☀' : '🌙';
  }
  paintIcon();

  btn.addEventListener('click', function(){
    var next = currentTheme()==='dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('aspas-theme', next); }catch(e){}
    paintIcon();
  });
});
