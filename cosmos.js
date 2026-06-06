/* Starfield + shooting stars on canvas. Respects --motion and reduced-motion. */
(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W, H, DPR, stars, shooters, raf;
  function motion() {
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion')) || 1;
    return v;
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * DPR;
    H = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    seed();
  }

  function seed() {
    const count = Math.round((W * H) / (DPR * DPR) / 1400);
    stars = [];
    for (let i = 0; i < count; i++) {
      const layer = Math.random();
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: (0.4 + Math.random() * 1.6) * DPR * (0.6 + layer),
        a: 0.2 + Math.random() * 0.8,
        tw: Math.random() * Math.PI * 2,
        tws: 0.6 + Math.random() * 1.8,
        depth: 0.2 + layer * 1.2,
        hue: Math.random() < 0.12 ? (Math.random() < 0.5 ? 'frog' : 'dog') : 'white'
      });
    }
    shooters = [];
  }

  let scrollY = 0;
  addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  const COL = {
    white: [232, 236, 255],
    frog: [124, 255, 155],
    dog: [255, 192, 97]
  };

  let t = 0;
  function frame() {
    const m = motion();
    t += 0.016 * m;
    ctx.clearRect(0, 0, W, H);

    for (const s of stars) {
      const tw = reduce ? 1 : (0.55 + 0.45 * Math.sin(t * s.tws + s.tw));
      const py = (s.y - scrollY * DPR * 0.06 * s.depth) % H;
      const y = py < 0 ? py + H : py;
      const c = COL[s.hue];
      ctx.beginPath();
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${s.a * tw})`;
      ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.r > 1.6 * DPR) {
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${s.a * tw * 0.18})`;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // shooting stars
    if (!reduce && Math.random() < 0.004 * m && shooters.length < 3) {
      shooters.push({
        x: Math.random() * W * 0.6,
        y: Math.random() * H * 0.4,
        vx: (4 + Math.random() * 4) * DPR,
        vy: (2 + Math.random() * 2) * DPR,
        life: 1
      });
    }
    for (let i = shooters.length - 1; i >= 0; i--) {
      const sh = shooters[i];
      sh.x += sh.vx * m; sh.y += sh.vy * m; sh.life -= 0.012 * m;
      const len = 18 * DPR;
      const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 6, sh.y - sh.vy * 6);
      grad.addColorStop(0, `rgba(180,220,255,${sh.life})`);
      grad.addColorStop(1, 'rgba(180,220,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6 * DPR;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - sh.vx * 6, sh.y - sh.vy * 6);
      ctx.stroke();
      if (sh.life <= 0) shooters.splice(i, 1);
    }

    raf = requestAnimationFrame(frame);
  }

  resize();
  addEventListener('resize', resize);
  if (reduce) {
    // draw once, static
    for (const s of stars) {
      const c = COL[s.hue];
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${s.a})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
  } else {
    frame();
  }
})();
