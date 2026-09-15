/* Harbor behaviour. Mobile menu. Dual-heading annotate — the same Rough
   Notation 0.5 `highlight` Breakdance Dual Heading runs (4 strokes,
   strokeWidth forced to 0.95×height). Hero is a single frame (John waived
   a slider, 2026-08-25). */
(function () {
  document.documentElement.classList.add('har-js');

  var toggle = document.querySelector('.har-menu-toggle');
  var list = document.querySelector('.har-nav__list');
  if (toggle && list) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      list.classList.toggle('is-open', !open);
    });
  }

  function start() {
    var RN = window.RoughNotation;
    var marks = document.querySelectorAll('.har-annotate__word');
    if (!RN || !marks.length) return;
    function arm(word) {
      if (word.notation) return;
      var n = RN.annotate(word, {
        type: 'highlight',
        color: 'var(--har-cta)',
        animate: true,
        animationDuration: 3000,
        strokeWidth: 4,
        multiline: true,
        iterations: 4
      });
      word.notation = n;
      n.show();
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      marks.forEach(function (el) {
        var n = RN.annotate(el, {
          type: 'highlight',
          color: 'var(--har-cta)',
          animate: false,
          strokeWidth: 4,
          multiline: true,
          iterations: 4
        });
        el.notation = n;
        n.show();
      });
      return;
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          arm(en.target);
          io.unobserve(en.target);
        });
      }, { root: null, rootMargin: '0px', threshold: 0.5 });
      marks.forEach(function (n) { io.observe(n); });
    } else {
      marks.forEach(arm);
    }
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
  } else {
    start();
  }

  document.querySelectorAll('.har-faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.har-faq__item');
      if (!item) return;
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.querySelectorAll('.har-acc__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = btn.closest('.har-acc');
      if (!wrap) return;
      var open = wrap.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var ioEnter = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        ioEnter.unobserve(en.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-enter]').forEach(function (n) { ioEnter.observe(n); });
  } else {
    document.querySelectorAll('[data-enter]').forEach(function (n) { n.classList.add('is-in'); });
  }

  var slider = document.querySelector('.har-reviews__slider');
  if (slider) {
    var slides = slider.querySelectorAll('.har-review');
    var dots = slider.querySelectorAll('.har-reviews__dot');
    var i = 0;
    var timer;
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
    }
    function play() {
      stop();
      if (reduce || slides.length < 2) return;
      timer = setInterval(function () { go(i + 1); }, 5000);
    }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    dots.forEach(function (d, k) {
      d.addEventListener('click', function () { go(k); play(); });
    });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', play);
    play();
  }
})();
