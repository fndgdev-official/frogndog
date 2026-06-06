/* Scroll reveals, nav state, count-up, magnetic buttons, hero parallax */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Detect frozen/static render contexts (no animation frames available).
  //      In such contexts CSS transitions stick at their start value and rAF never
  //      fires, which would leave fade-in content invisible. setTimeout still runs,
  //      so if rAF hasn't fired shortly after load, snap everything to end-state. ----
  let rafAlive = false;
  requestAnimationFrame(() => { rafAlive = true; });
  function finalizeStatic() {
    document.documentElement.classList.add('no-anim');
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    document.querySelectorAll('[data-count]').forEach((el) => {
      const n = parseInt(el.dataset.count, 10);
      if (!isNaN(n)) el.textContent = n.toLocaleString();
    });
  }
  setTimeout(() => { if (!rafAlive) finalizeStatic(); }, 180);

  // ---- Reveal on scroll (rAF + getBoundingClientRect — reliable inside iframes) ----
  const revealEls = Array.from(document.querySelectorAll('.reveal, [data-count]'));
  let ticking = false;
  function checkReveals() {
    ticking = false;
    const vh = window.innerHeight;
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
  function requestCheck() {
    if (!ticking) { ticking = true; requestAnimationFrame(checkReveals); }
  }
  addEventListener('scroll', requestCheck, { passive: true });
  addEventListener('resize', requestCheck, { passive: true });
  checkReveals();
  // a couple of deferred passes catch late layout (fonts, images)
  setTimeout(checkReveals, 120);
  setTimeout(checkReveals, 500);

  // ---- Count-up ----
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    if (reduce) { el.textContent = target.toLocaleString(); return; }
    const dur = 1500, start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---- Nav scrolled ----
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Hero parallax (wordmark + orbs follow pointer / scroll) ----
  const wordmark = document.querySelector('.wordmark');
  const orbitStage = document.querySelector('.orbit-stage');
  if (!reduce) {
    addEventListener('pointermove', (e) => {
      const dx = (e.clientX / innerWidth - 0.5);
      const dy = (e.clientY / innerHeight - 0.5);
      if (wordmark) wordmark.style.transform = `translate3d(${dx * 18}px, ${dy * 12}px, 0)`;
      if (orbitStage) orbitStage.style.transform = `translate3d(${dx * -26}px, ${dy * -18}px, 0)`;
    }, { passive: true });

    addEventListener('scroll', () => {
      const y = window.scrollY;
      const hero = document.querySelector('.hero-inner');
      if (hero && y < innerHeight) {
        hero.style.transform = `translateY(${y * 0.18}px)`;
        hero.style.opacity = String(Math.max(0, 1 - y / (innerHeight * 0.8)));
      }
    }, { passive: true });
  }

  // ---- Magnetic buttons ----
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.btn, .nav-cta').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  // ---- Smooth anchor scroll already via CSS; offset for nav handled by scroll-margin ----
})();
