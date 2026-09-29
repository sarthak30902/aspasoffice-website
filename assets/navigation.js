(function(){
  var header=document.getElementById('aspas-embedded-nav');
  var nav=document.getElementById('aspas-nav-links');
  var toggle=document.getElementById('aspas-nav-toggle');
  if(!header||!nav||!toggle) return;

  var dropdowns=nav.querySelectorAll('.aspas-nav-dropdown');

  function closeDropdowns(except){
    dropdowns.forEach(function(dropdown){
      if(dropdown===except) return;
      dropdown.classList.remove('asp-submenu-open');
      var arrow=dropdown.querySelector('.aspas-nav-arrow');
      var chevron=dropdown.querySelector('.aspas-chevron');
      if(arrow){
        arrow.setAttribute('aria-expanded','false');
        var label=dropdown.querySelector('.aspas-nav-label');
        arrow.setAttribute('aria-label','Open ' + (label ? label.textContent.trim() : '') + ' submenu');
      }
      if(chevron){
        chevron.style.transition='transform .18s ease';
        chevron.style.transform='translateY(-1px) rotate(0deg)';
      }
    });
  }

  function closeMenu(){
    nav.classList.remove('aspas-open');
    toggle.setAttribute('aria-expanded','false');
    closeDropdowns(null);
  }

  toggle.addEventListener('click',function(){
    var open=nav.classList.toggle('aspas-open');
    toggle.setAttribute('aria-expanded',String(open));
  });

  dropdowns.forEach(function(dropdown){
    var arrow=dropdown.querySelector('.aspas-nav-arrow');
    var chevron=dropdown.querySelector('.aspas-chevron');
    var label=dropdown.querySelector('.aspas-nav-label');
    if(!arrow) return;

    arrow.addEventListener('click',function(e){
      if(window.innerWidth>900) return;
      e.preventDefault();
      e.stopPropagation();

      var willOpen=!dropdown.classList.contains('asp-submenu-open');
      closeDropdowns(willOpen ? dropdown : null);
      dropdown.classList.toggle('asp-submenu-open',willOpen);
      arrow.setAttribute('aria-expanded',String(willOpen));
      arrow.setAttribute('aria-label',(willOpen?'Close ':'Open ') + (label ? label.textContent.trim() : '') + ' submenu');

      if(chevron){
        chevron.style.transition='transform .18s ease';
        chevron.style.transform=willOpen
          ? 'translateY(-1px) rotate(180deg)'
          : 'translateY(-1px) rotate(0deg)';
      }
    });

    dropdown.addEventListener('mouseenter',function(){
      if(window.innerWidth<=900 || !chevron) return;
      chevron.style.transition='none';
      chevron.style.transform='translateY(-1px) rotate(0deg)';
      void chevron.offsetWidth;
      chevron.style.transition='transform .18s ease';
      chevron.style.transform='translateY(-1px) rotate(180deg)';
    });

    dropdown.addEventListener('mouseleave',function(){
      if(window.innerWidth<=900 || !chevron) return;
      chevron.style.transition='transform .18s ease';
      chevron.style.transform='translateY(-1px) rotate(360deg)';
      window.setTimeout(function(){
        if(window.innerWidth>900){
          chevron.style.transition='none';
          chevron.style.transform='translateY(-1px) rotate(0deg)';
        }
      },190);
    });
  });

  nav.addEventListener('click',function(e){
    var link=e.target.closest ? e.target.closest('a') : null;
    if(link) closeMenu();
  });

  document.addEventListener('click',function(e){
    if(window.innerWidth<=900 && !header.contains(e.target)){
      closeMenu();
    }
  });

  window.addEventListener('resize',function(){
    if(window.innerWidth>900) closeMenu();
  });
})();