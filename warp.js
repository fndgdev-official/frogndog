/* Warp starfield: 3D depth stars that streak with scroll velocity, twinkle,
   plus faint constellation lines between near bright stars. Frozen-context safe
   (draws a static frame if rAF never fires). */
(function () {
  const canvas = document.getElementById('warp');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, DPR, stars, cx, cy;

  function motion(){ return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion')) || 1; }

  function resize(){
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * DPR; H = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px';
    cx = W/2; cy = H/2; seed();
  }
  function seed(){
    const count = Math.round((W*H)/(DPR*DPR)/1500);
    stars = [];
    for (let i=0;i<count;i++){
      stars.push({
        x:(Math.random()-0.5)*W, y:(Math.random()-0.5)*H,
        z: Math.random()*W, pz: 0,
        a: 0.3+Math.random()*0.7, tw: Math.random()*Math.PI*2, tws: 0.6+Math.random()*1.6,
        hue: Math.random()<0.14 ? (Math.random()<0.5?'frog':'dog') : 'white'
      });
    }
  }
  const COL = { white:[225,230,255], frog:[124,255,155], dog:[255,192,97] };

  let lastScroll = 0, vel = 0;
  addEventListener('scroll', ()=>{ const y=window.scrollY; vel += Math.min(Math.abs(y-lastScroll),140); lastScroll=y; }, {passive:true});

  let t=0;
  function draw(animate){
    const m = motion();
    ctx.clearRect(0,0,W,H);
    t += 0.016*m;
    vel *= 0.9;
    const speed = (0.6 + vel*0.12) * m * DPR;

    // constellation: collect projected bright points
    const pts = [];
    for (const s of stars){
      if (animate){
        s.pz = s.z;
        s.z -= speed;
        if (s.z < 1){ s.z = W; s.x=(Math.random()-0.5)*W; s.y=(Math.random()-0.5)*H; s.pz=s.z; }
      }
      const k = 128*DPR / s.z;
      const px = cx + s.x * k;
      const py = cy + s.y * k;
      if (px<0||px>W||py<0||py>H) continue;
      const size = (1 - s.z / W) * 2.6 * DPR + 0.3;
      const tw = reduce||!animate ? 0.85 : (0.55 + 0.45*Math.sin(t*s.tws + s.tw));
      const c = COL[s.hue];

      // streak when moving fast
      if (animate && vel > 6){
        const pk = 128*DPR / s.pz;
        const ppx = cx + s.x*pk, ppy = cy + s.y*pk;
        ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${s.a*tw*0.8})`;
        ctx.lineWidth = size*0.7;
        ctx.beginPath(); ctx.moveTo(ppx,ppy); ctx.lineTo(px,py); ctx.stroke();
      }
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${s.a*tw})`;
      ctx.beginPath(); ctx.arc(px,py,size,0,Math.PI*2); ctx.fill();
      if (size > 1.4*DPR){
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${s.a*tw*0.16})`;
        ctx.beginPath(); ctx.arc(px,py,size*3.2,0,Math.PI*2); ctx.fill();
        if (s.z < W*0.4) pts.push([px,py,size]);
      }
    }
    // constellation lines between near bright stars
    ctx.lineWidth = 1*DPR;
    for (let i=0;i<pts.length;i++){
      for (let j=i+1;j<pts.length;j++){
        const dx=pts[i][0]-pts[j][0], dy=pts[i][1]-pts[j][1];
        const d2 = dx*dx+dy*dy;
        if (d2 < (150*DPR)*(150*DPR)){
          const al = (1 - Math.sqrt(d2)/(150*DPR)) * 0.10;
          ctx.strokeStyle = `rgba(150,170,255,${al})`;
          ctx.beginPath(); ctx.moveTo(pts[i][0],pts[i][1]); ctx.lineTo(pts[j][0],pts[j][1]); ctx.stroke();
        }
      }
    }
  }

  resize();
  addEventListener('resize', resize);
  if (reduce){ draw(false); }
  else { (function loop(){ draw(true); requestAnimationFrame(loop); })(); }
})();
