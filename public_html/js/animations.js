/* ==========================================================================
   ITS合同会社 — animations.js
   Scroll-driven reveals, counters, cursor, magnetic, tilt, page curtain
   ========================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCoarse = window.matchMedia('(pointer: coarse)').matches;

  /* ---------- Page reveal curtain ---------- */
  function initPageReveal() {
    var el = document.getElementById('page-reveal');
    if (!el) return;
    if (prefersReduced) { el.remove(); return; }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add('is-done');
        setTimeout(function () { if (el.parentNode) el.remove(); }, 900);
      });
    });
  }

  /* ---------- Scroll progress bar ---------- */
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    function update() {
      var h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var ratio = h > 0 ? window.scrollY / h : 0;
      bar.style.transform = 'scaleX(' + ratio + ')';
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  /* ---------- Generic fade-up ---------- */
  function initFade() {
    var els = document.querySelectorAll('.js-fade');
    if (!els.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Stagger ---------- */
  function initStagger() {
    var groups = document.querySelectorAll('.js-stagger');
    if (!groups.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var items = entry.target.querySelectorAll('.js-stagger-item');
        items.forEach(function (item, i) {
          setTimeout(function () { item.classList.add('is-visible'); }, i * 130);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    groups.forEach(function (g) { obs.observe(g); });
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    document.querySelectorAll('.js-counter').forEach(function (el) {
      var target = +el.dataset.target;
      var suffix = el.dataset.suffix || '';
      var duration = 2000;
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.unobserve(el);
          if (prefersReduced) { el.textContent = target + suffix; return; }
          var start = performance.now();
          function tick(now) {
            var t = Math.min((now - start) / duration, 1);
            var ease = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * ease) + suffix;
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  }

  /* ---------- Text reveal (per-line clip-path) ---------- */
  function initTextReveal() {
    var groups = document.querySelectorAll('.js-text-reveal');
    if (!groups.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var lines = entry.target.querySelectorAll('.js-text-reveal__line');
        lines.forEach(function (line, i) {
          setTimeout(function () { line.classList.add('is-revealed'); }, i * 110);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    groups.forEach(function (g) { obs.observe(g); });
  }

  /* ---------- Line reveal (eyebrow underline) ---------- */
  function initLineReveal() {
    var els = document.querySelectorAll('.js-line-reveal');
    if (!els.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Nav active link highlight ---------- */
  function initNavHighlight() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
    if (!links.length) return;
    var sections = links.map(function (l) {
      var id = l.getAttribute('href');
      return (id && id.charAt(0) === '#') ? document.querySelector(id) : null;
    });
    function update() {
      var pos = window.scrollY + 120;
      var activeIdx = -1;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i] && sections[i].offsetTop <= pos) activeIdx = i;
      }
      links.forEach(function (l, i) { l.classList.toggle('is-active', i === activeIdx); });
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- Parallax ---------- */
  function initParallax() {
    var els = document.querySelectorAll('.js-parallax');
    if (!els.length) return;
    function update() {
      els.forEach(function (el) {
        var speed = parseFloat(el.dataset.parallaxSpeed) || 0.2;
        el.style.transform = 'translateY(' + (window.scrollY * speed) + 'px)';
      });
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (isCoarse) return;
    document.querySelectorAll('.js-magnetic').forEach(function (el) {
      var strength = parseFloat(el.dataset.magneticStrength) || 0.28;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + (x * strength) + 'px,' + (y * strength) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Custom cursor ---------- */
  function initCursor() {
    if (isCoarse) return;
    var cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    cursor.style.opacity = '0';
    var mx = -100, my = -100;
    var cx = mx, cy = my;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY; cursor.style.opacity = '1';
    }, { passive: true });
    function render() {
      cx += (mx - cx) * 0.14; cy += (my - cy) * 0.14;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(render);
    }
    render();
    document.querySelectorAll('a, button, .js-magnetic, .js-tilt, input, select, textarea').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hover'); });
    });
  }

  /* ---------- Card 3D tilt ---------- */
  function initCardTilt() {
    if (isCoarse) return;
    document.querySelectorAll('.js-tilt').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(800px) rotateY(' + (px * 5) + 'deg) rotateX(' + (-py * 5) + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPageReveal();
    initScrollProgress();
    initFade();
    initStagger();
    initCounters();
    initTextReveal();
    initLineReveal();
    initNavHighlight();
    if (!prefersReduced) {
      initMagnetic();
    }
  });
}());
