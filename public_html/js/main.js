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

    var submitBtn = form.querySelector('.contact__submit');
    var errorBox = document.getElementById('contact-error');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errorBox) errorBox.hidden = true;
      if (!validate()) {
        var firstErr = form.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstErr) firstErr.focus();
        return;
      }
      var btnLabel = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '送信中…'; }

      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (res) { return res.json().catch(function () { return { ok: res.ok }; }).then(function (data) { return { status: res.status, data: data }; }); })
        .then(function (r) {
          if (r.data && r.data.ok) {
            form.hidden = true;
            if (success) { success.hidden = false; success.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' }); }
          } else {
            throw new Error('send-failed');
          }
        })
        .catch(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = btnLabel; }
          if (errorBox) { errorBox.hidden = false; errorBox.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' }); }
        });
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

  /* ---------- Hoku Produce showcase (spotlight carousel) ---------- */
  function initHokuStage() {
    var stage = document.querySelector('.js-hoku');
    if (!stage) return;
    // Build figures from JSON config (#hoku-data) so new Hoku = 1 config line + a webp
    var viewport = stage.querySelector('.hoku-stage__viewport');
    var dataEl = document.getElementById('hoku-data');
    if (viewport && dataEl) {
      try {
        var list = JSON.parse(dataEl.textContent);
        if (list && list.length) {
          viewport.innerHTML = '';
          list.forEach(function (h) {
            var btn = document.createElement('button');
            btn.className = 'hoku-fig'; btn.type = 'button';
            btn.setAttribute('data-role', h.role || ''); btn.setAttribute('data-sub', h.sub || '');
            btn.setAttribute('aria-label', h.role || 'Hoku');
            var img = document.createElement('img');
            img.src = h.file; img.alt = h.role || 'Hoku'; img.loading = 'lazy'; img.decoding = 'async';
            btn.appendChild(img); viewport.appendChild(btn);
          });
        }
      } catch (e) {}
    }
    var figs = Array.prototype.slice.call(stage.querySelectorAll('.hoku-fig'));
    if (!figs.length) return;
    var roleEl = stage.querySelector('.hoku-stage__role');
    var subEl = stage.querySelector('.hoku-stage__sub');
    var dotsWrap = stage.querySelector('.hoku-stage__dots');
    var n = figs.length, active = 0, timer = null;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var dots = [];
    figs.forEach(function (f, i) {
      f.addEventListener('click', function () { go(i); restart(); });
      var d = document.createElement('button');
      d.className = 'hoku-dot'; d.type = 'button';
      d.setAttribute('aria-label', (i + 1) + '番目のHokuを表示');
      d.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(d); dots.push(d);
    });

    function layout() {
      var step = window.innerWidth < 700 ? 118 : 190;
      figs.forEach(function (f, i) {
        var rel = i - active;
        if (rel > n / 2) rel -= n;
        if (rel < -n / 2) rel += n;
        var ar = Math.abs(rel);
        var off = rel * step;
        var scale = rel === 0 ? 1 : (ar === 1 ? 0.6 : 0.42);
        var op = rel === 0 ? 1 : (ar === 1 ? 0.5 : (ar === 2 ? 0.16 : 0));
        f.style.transform = 'translate(calc(-50% + ' + off + 'px), -50%) scale(' + scale + ')';
        f.style.opacity = op;
        f.style.zIndex = String(10 - ar);
        f.classList.toggle('is-active', rel === 0);
        f.setAttribute('aria-hidden', rel === 0 ? 'false' : 'true');
        f.tabIndex = rel === 0 ? 0 : -1;
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === active); });
      var af = figs[active];
      if (roleEl) roleEl.textContent = af.getAttribute('data-role');
      if (subEl) subEl.textContent = af.getAttribute('data-sub');
    }
    function go(i) { active = (i % n + n) % n; layout(); }
    function next() { go(active + 1); }
    function start() { if (reduce || timer) return; timer = setInterval(next, 2800); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    layout();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) start(); else stop(); });
    }, { threshold: 0.2 });
    io.observe(stage);
    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', start);
    window.addEventListener('resize', layout, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initDrawer();
    initSmoothScroll();
    initHeroCanvas();
    initContactForm();
    initImgFallback();
    initHokuStage();
  });
}());
