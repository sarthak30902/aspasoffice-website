(function(){
  function initLocationSlideshows(){
    document.querySelectorAll('.aspas-location-slideshow').forEach(function(slideshow){
      var slides=Array.prototype.slice.call(slideshow.querySelectorAll('.aspas-location-slide'));
      var control=slideshow.querySelector('.aspas-location-slideshow-control');
      if(slides.length<2) return;

      var index=0;
      var timer=null;
      var manuallyPaused=!!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      var pointerPaused=false;

      function isPaused(){return manuallyPaused || pointerPaused || document.hidden;}
      function paintControl(){
        if(!control) return;
        control.textContent=manuallyPaused ? '▶' : 'Ⅱ';
        control.setAttribute('aria-label',manuallyPaused ? 'Play location photo slideshow' : 'Pause location photo slideshow');
        control.setAttribute('aria-pressed',String(manuallyPaused));
      }
      function showNext(){
        slides[index].classList.remove('is-active');
        slides[index].setAttribute('aria-hidden','true');
        index=(index+1)%slides.length;
        slides[index].classList.add('is-active');
        slides[index].setAttribute('aria-hidden','false');
      }
      function syncTimer(){
        if(timer){window.clearInterval(timer);timer=null;}
        if(!isPaused()) timer=window.setInterval(showNext,4000);
        paintControl();
      }

      slides.forEach(function(slide,i){
        slide.classList.toggle('is-active',i===0);
        slide.setAttribute('aria-hidden',String(i!==0));
      });
      if(control){
        control.addEventListener('click',function(){
          manuallyPaused=!manuallyPaused;
          syncTimer();
        });
      }
      slideshow.addEventListener('mouseenter',function(){pointerPaused=true;syncTimer();});
      slideshow.addEventListener('mouseleave',function(){pointerPaused=false;syncTimer();});
      document.addEventListener('visibilitychange',syncTimer);
      syncTimer();
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initLocationSlideshows);
  else initLocationSlideshows();
})();