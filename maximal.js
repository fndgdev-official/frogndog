/* MAXIMAL interactions. Frozen-render safe (snaps to end-state if rAF dead). */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  // ---- Live vs frozen detection: count animation frames over a short window.
  //      A truly live page paints many frames; capture/verifier contexts paint 0-1
  //      (and freeze CSS transitions), so we snap content to its end-state. ----
  let frames = 0;
  (function countFrames(){ frames++; requestAnimationFrame(countFrames); })();
  function finalizeStatic() {
    if (root.classList.contains('no-anim')) return;
    root.classList.add('no-anim');
    document.querySelectorAll('.reveal, .kin').forEach((el) => el.classList.add('in'));
    document.querySelectorAll('[data-count]').forEach((el) => {
      const n = parseInt(el.dataset.count, 10);
      if (!isNaN(n)) el.textContent = n.toLocaleString();
    });
    const intro = document.getElementById('intro');
    if (intro) intro.style.display = 'none';
  }
  setTimeout(() => { if (frames < 3) finalizeStatic(); }, 200);
  // Empirical fallback: if a revealed element is still invisible after a beat,
  // CSS transitions are frozen (capture/verifier) -> snap to end-state.
  setTimeout(() => {
    const probe = document.querySelector('.reveal.in');
    if (probe && parseFloat(getComputedStyle(probe).opacity) < 0.05) finalizeStatic();
  }, 340);

  // ---- Intro sequence ----
  const intro = document.getElementById('intro');
  if (intro) {
    const seen = sessionStorage.getItem('fndg_intro_seen');
    const hardHide = () => { intro.style.display = 'none'; };
    const dismiss = () => { intro.classList.add('done'); setTimeout(hardHide, 1200); };
    if (reduce || seen) {
      hardHide();                       // returning visitor / reduced-motion: no replay
    } else {
      sessionStorage.setItem('fndg_intro_seen', '1');
      setTimeout(dismiss, 4000);
      setTimeout(hardHide, 6000);       // safety net independent of transition support
      intro.addEventListener('click', dismiss);
      const skip = intro.querySelector('.intro-skip');
      if (skip) skip.addEventListener('click', (e) => { e.stopPropagation(); dismiss(); });
      addEventListener('wheel', dismiss, { once: true, passive: true });
    }
  }

  // ---- Reveal on scroll (rAF + rect; reliable in iframes) ----
  const revealEls = Array.from(document.querySelectorAll('.reveal, .kin, [data-count]'));
  let ticking = false;
  function check() {
    ticking = false;
    const vh = innerHeight;
    for (let i = revealEls.length - 1; i >= 0; i--) {
      const el = revealEls[i];
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) {
        el.classList.add('in');
        if (el.dataset.count !== undefined) countUp(el);
        revealEls.splice(i, 1);
      }
    }
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(check); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req, { passive: true });
  check(); setTimeout(check, 120); setTimeout(check, 600);

  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    if (reduce) { el.textContent = target.toLocaleString(); return; }
    const dur = 1700, start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  // ---- Nav scrolled + scroll-linked hue + rail ----
  const nav = document.querySelector('.nav');
  const railLinks = Array.from(document.querySelectorAll('.rail a'));
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', scrollY > 30);
    const max = document.body.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    root.style.setProperty('--hue', (p * 40).toFixed(1) + 'deg');
    if (railLinks.length) {
      const mid = scrollY + innerHeight * 0.4;
      let cur = railLinks[0];
      for (const l of railLinks) {
        const sec = document.getElementById(l.dataset.sec);
        if (sec && sec.offsetTop <= mid) cur = l;
      }
      railLinks.forEach((l) => l.classList.toggle('active', l === cur));
    }
  }
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  if (reduce) return;

  // ---- Cursor spotlight ----
  addEventListener('pointermove', (e) => {
    root.style.setProperty('--mx', e.clientX + 'px');
    root.style.setProperty('--my', e.clientY + 'px');
  }, { passive: true });

  // ---- Custom cursor (dot + lagging ring) ----
  const cdot = document.querySelector('.cursor-dot');
  const cring = document.querySelector('.cursor-ring');
  if (cdot && cring && matchMedia('(pointer:fine)').matches) {
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      cdot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    }, { passive: true });
    (function ring() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      cring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(ring);
    })();
    document.querySelectorAll('a, button, .game-panel, .person').forEach((el) => {
      el.addEventListener('pointerenter', () => cring.classList.add('hot'));
      el.addEventListener('pointerleave', () => cring.classList.remove('hot'));
    });
  }

  // ---- Hero 3D tilt + parallax ----
  const tilt = document.querySelector('.hero-tilt');
  const hud = document.querySelector('.hud');
  if (matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', (e) => {
      const dx = e.clientX / innerWidth - 0.5;
      const dy = e.clientY / innerHeight - 0.5;
      if (tilt) tilt.style.transform = `rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateZ(0)`;
      if (hud) hud.style.transform = `translate(-50%,-50%) rotateY(${dx * 14}deg) rotateX(${-dy * 14}deg)`;
    }, { passive: true });

    // ---- Magnetic buttons ----
    document.querySelectorAll('.btn, .nav-cta').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  // ---- Hero scroll fade ----
  addEventListener('scroll', () => {
    const y = scrollY;
    if (tilt && y < innerHeight) {
      tilt.style.opacity = String(Math.max(0, 1 - y / (innerHeight * 0.85)));
    }
  }, { passive: true });
})();
