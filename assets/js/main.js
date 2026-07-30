/* ============================================
   main.js — Cormati Landing Page
   ============================================ */

/**
 * Mobile menu toggle
 */
(function initMenu() {
  'use strict';

  var toggle = document.querySelector('.menu-toggle');
  var links = document.querySelector('.nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '\u2715' : '\u2630';
  });

  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.textContent = '\u2630';
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/**
 * Active nav link highlight on scroll
 */
(function initNavScroll() {
  'use strict';

  var nav = document.querySelector('.nav');
  var navLinkEls = [].slice.call(document.querySelectorAll('.nav-links a'));
  var sections = [].slice.call(document.querySelectorAll('.section[id]'));

  if (!nav) return;

  function updateNav() {
    nav.classList.toggle('nav-scrolled', window.scrollY > 80);

    var current = '';
    sections.forEach(function (s) {
      var top = s.getBoundingClientRect().top;
      if (top < 200) current = s.getAttribute('id');
    });

    navLinkEls.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('load', updateNav);
})();

/**
 * Scroll reveal — IntersectionObserver
 */
(function initReveal() {
  'use strict';

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    observer.observe(el);
  });
})();

/**
 * Particle Engine — Ambient Energy Particles (Layer 05)
 */
(function initParticles() {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var q = document.querySelector('.bg-ambient');
  if (!q) return;

  // Container
  var c = document.createElement('div');
  c.className = 'bg-particles';
  var a = document.createElement('canvas');
  c.appendChild(a);
  q.appendChild(c);

  // Pre-render glow sprites per color
  var colors = ['118,38,251', '155,92,255', '218,191,255', '163,91,255'];
  var glowSize = 9;
  var spriteSize = glowSize * 2 + 4;
  var sprites = {};

  colors.forEach(function (cl) {
    var o = document.createElement('canvas');
    o.width = spriteSize;
    o.height = spriteSize;
    var ox = o.getContext('2d');
    var hs = spriteSize / 2;
    var gr = ox.createRadialGradient(hs, hs, 0, hs, hs, hs);
    gr.addColorStop(0, 'rgba(' + cl + ',1)');
    gr.addColorStop(0.3, 'rgba(' + cl + ',0.33)');
    gr.addColorStop(0.7, 'rgba(' + cl + ',0.08)');
    gr.addColorStop(1, 'rgba(' + cl + ',0)');
    ox.fillStyle = gr;
    ox.fillRect(0, 0, spriteSize, spriteSize);
    sprites[cl] = o;
  });

  var x = a.getContext('2d');
  var W, H, particles = [];
  var frameId = null;
  var running = true;

  function resize() {
    W = a.width = innerWidth;
    H = a.height = innerHeight;
  }

  function createParticle() {
    var s = 0.08 + Math.random() * 0.22;
    var d = Math.random() * 6.2832;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: 1.5 + Math.random() * 3.5,
      dx: Math.cos(d) * s,
      dy: Math.sin(d) * s - 0.04,
      o: 0.08 + Math.random() * 0.25,
      bs: 0.003 + Math.random() * 0.007,
      bd: Math.random() > 0.5 ? 1 : -1,
      cl: colors[Math.floor(Math.random() * colors.length)],
      ph: Math.random() * 6.2832
    };
  }

  function init() {
    resize();
    particles = [];
    var count = innerWidth < 640 ? 8 : 24;
    for (var i = 0; i < count; i++) particles.push(createParticle());
  }

  function update() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.dx;
      p.y += p.dy;
      p.o += p.bs * p.bd;
      if (p.o > 0.35) p.bd = -1;
      if (p.o < 0.05) p.bd = 1;
      if (p.x < -100) p.x = W + 100;
      if (p.x > W + 100) p.x = -100;
      if (p.y < -100) p.y = H + 100;
      if (p.y > H + 100) p.y = -100;
    }
  }

  function draw() {
    x.clearRect(0, 0, W, H);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var g = p.r * 2.5;
      var hs = g * 2 + 4;

      // Outer glow — pre-rendered sprite blit
      x.globalAlpha = p.o * 1.8;
      x.drawImage(sprites[p.cl], p.x - g - 2, p.y - g - 2, hs, hs);

      // Inner core
      x.globalAlpha = p.o * 0.6;
      x.beginPath();
      x.arc(p.x, p.y, p.r * 0.5, 0, 6.2832);
      x.fillStyle = 'rgba(' + p.cl + ',1)';
      x.fill();
    }
    x.globalAlpha = 1;
  }

  function loop() {
    if (!running) return;
    update();
    draw();
    frameId = requestAnimationFrame(loop);
  }

  function start() {
    if (frameId) return;
    running = true;
    frameId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  function debouncedResize() {
    clearTimeout(window._resizeTimer);
    window._resizeTimer = setTimeout(resize, 80);
  }

  addEventListener('resize', debouncedResize);
  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
    e.matches ? stop() : start();
  });

  init();
  start();
})();
