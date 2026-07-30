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
 * Fires once per element (unobserves after reveal)
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
 * Story Cinematic Observer — toggles .cinematic-visible
 * Replays when section re-enters viewport
 */
(function initStoryCinematic() {
  'use strict';

  var section = document.querySelector('.story');
  if (!section) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('cinematic-visible', entry.isIntersecting);
      });
    },
    { threshold: 0.12 }
  );

  observer.observe(section);
})();

/**
 * Timeline Loop — Live Activity Panel
 * Items enter one-by-one, accumulate, then exit together and restart.
 * Controlled by Story cinematic reveal (step 5: 800ms delay).
 */
(function initTimeline() {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var sf = document.querySelector('.sp-feed');
    if (sf) {
      [].slice.call(sf.querySelectorAll('.tl-item')).forEach(function (el) {
        el.classList.add('tl-visible');
      });
    }
    return;
  }

  var feed = document.querySelector('.sp-feed');
  if (!feed) return;

  var section = document.querySelector('.story');
  if (!section) return;

  var items = [].slice.call(feed.querySelectorAll('.tl-item'));
  if (items.length === 0) return;

  var ENTER_GAP  = 1500;
  var HOLD_MS    = 4000;
  var EXIT_MS    = 800;
  var RESET_MS   = 600;

  var timer = null;

  function resetTimeline() {
    if (timer) { clearTimeout(timer); timer = null; }
    items.forEach(function (el) {
      el.classList.remove('tl-visible', 'tl-exit');
    });
  }

  function cycle() {
    items.forEach(function (el) {
      el.classList.remove('tl-visible', 'tl-exit');
    });

    items.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('tl-visible');
        if (typeof window.pulseKpi === 'function') window.pulseKpi();
      }, i * ENTER_GAP);
    });

    var entryEnd = (items.length - 1) * ENTER_GAP + 500;
    setTimeout(function () {
      items.forEach(function (el) {
        el.classList.add('tl-exit');
      });
    }, entryEnd + HOLD_MS);

    var cycleLen = entryEnd + HOLD_MS + EXIT_MS + RESET_MS;
    timer = setTimeout(cycle, cycleLen);
  }

  // Start when cinematic reveals the section
  function startAfterCinematic() {
    if (section.classList.contains('cinematic-visible')) {
      resetTimeline();
      timer = setTimeout(cycle, 800); // step 5
    }
  }

  // Watch for class toggle
  var obs = new MutationObserver(function () {
    if (section.classList.contains('cinematic-visible')) {
      resetTimeline();
      timer = setTimeout(cycle, 800);
    } else {
      resetTimeline();
    }
  });
  obs.observe(section, { attributes: true, attributeFilter: ['class'] });

  // Also check in case already visible
  startAfterCinematic();
})();

/**
 * KPI Counters — Animated business metrics
 * Smooth ease-out counter, pulses on timeline events.
 */
(function initKpiCounters() {
  'use strict';

  var section = document.querySelector('.story');
  if (!section) return;

  var metrics = [].slice.call(section.querySelectorAll('.core-metric-value'));
  if (metrics.length < 3) return;

  // Config: label, target, suffix
  var targets = [248, 18, 12];
  var suffixes = ['', ' h', ''];

  var DURATION = 5200; // ms — matches timeline entry window
  var startTime = null;
  var frameId = null;
  var pulseIdx = 0;

  // Ease-out cubic
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Pulse the next KPI in rotation
  window.pulseKpi = function () {
    var el = metrics[pulseIdx % metrics.length];
    el.classList.remove('kpi-pulse');
    void el.offsetWidth; // reflow
    el.classList.add('kpi-pulse');
    setTimeout(function () {
      el.classList.remove('kpi-pulse');
    }, 280);
    pulseIdx++;
  };

  // Animate frame
  function tick(now) {
    if (!startTime) startTime = now;
    var elapsed = now - startTime;
    var progress = Math.min(elapsed / DURATION, 1);
    var eased = easeOut(progress);

    metrics.forEach(function (el, i) {
      var raw = targets[i] * eased;
      el.textContent = suffixes[i] === ' h'
        ? raw.toFixed(1)
        : Math.round(raw).toString();
    });

    if (progress < 1) {
      frameId = requestAnimationFrame(tick);
    }
  }

  function reset() {
    if (frameId) { cancelAnimationFrame(frameId); frameId = null; }
    startTime = null;
    pulseIdx = 0;
    metrics.forEach(function (el) { el.textContent = '0'; });
  }

  function start() {
    reset();
    frameId = requestAnimationFrame(tick);
  }

  // React to cinematic-visible toggle
  var obs = new MutationObserver(function () {
    if (section.classList.contains('cinematic-visible')) {
      start();
    } else {
      reset();
    }
  });
  obs.observe(section, { attributes: true, attributeFilter: ['class'] });

  if (section.classList.contains('cinematic-visible')) start();
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
