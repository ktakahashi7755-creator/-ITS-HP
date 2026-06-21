/* ==========================================================================
   ITS合同会社 — main.js
   Nav control / smooth scroll / hero canvas particles / contact form
   ========================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NAV_H = 74;

  /* ---------- Sticky nav state ---------- */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 60) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile drawer ---------- */
  function initDrawer() {
    var burger = document.getElementById('nav-burger');
    var drawer = document.getElementById('nav-drawer');
    var overlay = document.getElementById('nav-overlay');
    if (!burger || !drawer) return;

    function open() {
      document.body.classList.add('nav-open');
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'メニューを閉じる');
      drawer.setAttribute('aria-hidden', 'false');
    }
    function close() {
      document.body.classList.remove('nav-open');
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'メニューを開く');
      drawer.setAttribute('aria-hidden', 'true');
    }
    burger.addEventListener('click', function () {
      if (drawer.classList.contains('is-open')) close(); else open();
    });
    overlay.addEventListener('click', close);
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- Smooth scroll with nav offset ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
        window.scrollTo({ top: top, behavior: prefersReduced ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---------- Hero canvas particles ---------- */
  function initHeroCanvas() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas || prefersReduced) return;
    var ctx = canvas.getContext('2d');
    var hero = canvas.parentElement;
    var particles = [];
    var w, h, count;
    var colors = ['rgba(10,132,255,', 'rgba(201,168,76,', 'rgba(255,255,255,'];

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.offsetWidth; h = hero.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      count = Math.min(Math.round(w * h / 12000), 110);
      build();
    }
    function build() {
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 0.6,
          c: colors[Math.floor(Math.random() * colors.length)],
          a: Math.random() * 0.5 + 0.25
        });
      }
    }
    function step() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + p.a + ')';
        ctx.fill();
        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = dx * dx + dy * dy;
          if (dist < 12000) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(10,132,255,' + (0.12 * (1 - dist / 12000)) + ')';
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(step);
  }

  /* ---------- Contact form validation ---------- */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    var success = document.getElementById('contact-success');
    if (!form) return;

    function setError(field, msg) {
      var wrap = field.closest('.form-field');
      var err = wrap.querySelector('.form-error');
      if (msg) { wrap.classList.add('has-error'); if (err) err.textContent = msg; }
      else { wrap.classList.remove('has-error'); if (err) err.textContent = ''; }
    }
    function validate() {
      var ok = true;
      var name = form.querySelector('#cf-name');
      var email = form.querySelector('#cf-email');
      var type = form.querySelector('#cf-type');
      var msg = form.querySelector('#cf-message');

      if (!name.value.trim()) { setError(name, 'お名前を入力してください'); ok = false; } else setError(name, '');
      if (!email.value.trim()) { setError(email, 'メールアドレスを入力してください'); ok = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setError(email, '正しいメールアドレスを入力してください'); ok = false; }
      else setError(email, '');
      if (!type.value) { setError(type, '種別を選択してください'); ok = false; } else setError(type, '');
      if (!msg.value.trim()) { setError(msg, 'お問い合わせ内容を入力してください'); ok = false; } else setError(msg, '');
      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) {
        var firstErr = form.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstErr) firstErr.focus();
        return;
      }
      form.hidden = true;
      if (success) { success.hidden = false; success.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' }); }
    });

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        if (el.closest('.form-field').classList.contains('has-error')) validate();
      });
    });
  }

  /* ---------- Image fallback (external -> local -> hide) ---------- */
  function initImgFallback() {
    var imgs = document.querySelectorAll('img[data-fallback]');
    Array.prototype.forEach.call(imgs, function (img) {
      function onErr() {
        img.removeEventListener('error', onErr);
        var fb = img.getAttribute('data-fallback');
        img.removeAttribute('data-fallback');
        if (fb) {
          img.addEventListener('error', function () { img.style.visibility = 'hidden'; });
          img.src = fb;
        } else {
          img.style.visibility = 'hidden';
        }
      }
      img.addEventListener('error', onErr);
      if (img.complete && img.naturalWidth === 0) onErr();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initDrawer();
    initSmoothScroll();
    initHeroCanvas();
    initContactForm();
    initImgFallback();
  });
}());
