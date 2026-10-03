(function () {
  var root = document.documentElement;
  var theme = document.getElementById('theme');
  if (theme) {
    try {
      if (localStorage.getItem('aspas-theme') === 'dark') root.setAttribute('data-theme', 'dark');
    } catch (error) {}
    function paintTheme() {
      theme.textContent = root.getAttribute('data-theme') === 'dark' ? '☼' : '☾';
    }
    paintTheme();
    theme.addEventListener('click', function () {
      var dark = root.getAttribute('data-theme') !== 'dark';
      if (dark) root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      try { localStorage.setItem('aspas-theme', dark ? 'dark' : 'light'); } catch (error) {}
      paintTheme();
    });
  }

  var nav = document.getElementById('nav');
  var menu = document.getElementById('menuButton');
  if (nav && menu) {
    menu.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
    function openDropdown(item) {
      item.classList.add('open');
      item.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'true');
    }
    function closeDropdown(item) {
      item.classList.remove('open');
      item.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
    }
    function closeDropdowns() {
      nav.querySelectorAll('.nav-dropdown').forEach(closeDropdown);
    }
    nav.querySelectorAll('.nav-dropdown').forEach(function (item) {
      var button = item.querySelector('.dropdown-toggle');
      if (!button) return;
      item.addEventListener('mouseenter', function () {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) openDropdown(item);
      });
      item.addEventListener('mouseleave', function () {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !item.contains(document.activeElement)) closeDropdown(item);
      });
      item.addEventListener('focusin', function (event) {
        if (event.target !== button) openDropdown(item);
      });
      item.addEventListener('focusout', function () {
        setTimeout(function () {
          if (!item.contains(document.activeElement)) closeDropdown(item);
        }, 0);
      });
      button.addEventListener('click', function () {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && item.matches(':hover')) {
          openDropdown(item);
          return;
        }
        var open = item.classList.contains('open');
        closeDropdowns();
        if (!open) openDropdown(item);
      });
    });
    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target)) closeDropdowns();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeDropdowns();
    });
    nav.querySelectorAll('a').forEach(function (anchor) {
      anchor.addEventListener('click', function () {
        closeDropdowns();
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-hero-slideshow]').forEach(function (show) {
    var slides = Array.from(show.querySelectorAll('[data-hero-slide]'));
    if (slides.length < 2) return;
    var active = 0;
    window.setInterval(function () {
      slides[active].classList.remove('active');
      slides[active].setAttribute('aria-hidden', 'true');
      active = (active + 1) % slides.length;
      slides[active].classList.add('active');
      slides[active].setAttribute('aria-hidden', 'false');
    }, 2600);
  });

  document.querySelectorAll('[data-slideshow]').forEach(function (box) {
    var images = Array.from(box.querySelectorAll('img'));
    var dots = Array.from(box.querySelectorAll('.dots i'));
    var button = box.querySelector('.slide-toggle');
    if (images.length < 2) return;
    var index = 0;
    var paused = reducedMotion;
    var timer = null;
    function show(next) {
      images[index].classList.remove('active');
      if (dots[index]) dots[index].classList.remove('on');
      index = next % images.length;
      images[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('on');
    }
    function start() {
      if (!paused && !timer) timer = window.setInterval(function () { show(index + 1); }, 4200);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    if (button) {
      button.addEventListener('click', function () {
        paused = !paused;
        button.setAttribute('aria-pressed', String(paused));
        button.textContent = paused ? '▶' : 'Ⅱ';
        button.setAttribute('aria-label', (paused ? 'Play ' : 'Pause ') + box.getAttribute('aria-label'));
        if (paused) stop(); else start();
      });
    }
    box.addEventListener('mouseenter', stop);
    box.addEventListener('mouseleave', start);
    box.addEventListener('focusin', stop);
    box.addEventListener('focusout', start);
    if (button && paused) button.textContent = '▶';
    else start();
  });
})();

