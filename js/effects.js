/* =====================================================================
   effects.js — all the eye candy ✨
   Exposes window.FX:
     initAmbient(), initCursorTrail(), spawnHeartsBurst(n),
     confettiBurst(), emojiRain(emoji, n), toast(msg, opts)
   Everything checks prefers-reduced-motion and config toggles.
   ===================================================================== */
window.FX = (function () {
  "use strict";

  const qs = (sel) => document.querySelector(sel);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rand = (min, max) => Math.random() * (max - min) + min;

  // Honour the OS "reduce motion" setting for the heavy stuff
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const HEART_GLYPHS = ["💛", "💛", "💛", "✨", "😝", "⭐"];
  const CONFETTI_COLORS = ["#FFD23F", "#F4B400", "#FFE680", "#FFFFFF", "#FFB13F", "#C98A00"];

  /* ---------- Floating hearts ------------------------------------- */
  function spawnHeart(opts = {}) {
    const layer = qs("#hearts-layer");
    if (!layer) return;
    const h = document.createElement("span");
    h.className = "heart";
    h.textContent = opts.glyph || pick(HEART_GLYPHS);
    h.style.left = (opts.left != null ? opts.left : rand(0, 100)) + "vw";
    h.style.setProperty("--size", rand(16, 34).toFixed(0) + "px");
    h.style.setProperty("--dur", (opts.dur || rand(6, 11)).toFixed(2) + "s");
    h.style.setProperty("--o", rand(0.6, 1).toFixed(2));
    h.style.setProperty("--r", rand(-60, 60).toFixed(0) + "deg");
    h.style.setProperty("--s", rand(0.8, 1.3).toFixed(2));
    layer.appendChild(h);
    h.addEventListener("animationend", () => h.remove());
  }

  function spawnHeartsBurst(n) {
    if (reduce) n = Math.min(n, 8); // a small, calm sprinkle
    for (let i = 0; i < n; i++) {
      setTimeout(() => spawnHeart({ dur: rand(4.5, 7) }), i * 60);
    }
  }

  /* ---------- Twinkling sparkles ---------------------------------- */
  function seedSparkles(count) {
    const layer = qs("#sparkle-layer");
    if (!layer) return;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = "✨";
      s.style.left = rand(2, 98) + "vw";
      s.style.top = rand(4, 96) + "vh";
      s.style.setProperty("--size", rand(10, 22).toFixed(0) + "px");
      s.style.setProperty("--dur", rand(1.8, 3.6).toFixed(2) + "s");
      s.style.animationDelay = rand(0, 3).toFixed(2) + "s";
      layer.appendChild(s);
    }
  }

  /* ---------- Ambient loop (hearts + sparkles) -------------------- */
  function initAmbient() {
    if (reduce) return; // keep things still for reduced-motion users
    if (CONFIG.effects.sparkles) seedSparkles(window.innerWidth < 600 ? 9 : 16);
    if (CONFIG.effects.floatingHearts) {
      setInterval(() => {
        if (document.hidden) return; // pause when tab not visible
        spawnHeart();
      }, 1100);
    }
  }

  /* ---------- Yellow cursor trail (desktop, fine pointer only) ----- */
  function initCursorTrail() {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return;
    let last = 0;
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - last < 38) return; // throttle
      last = now;
      const d = document.createElement("span");
      d.className = "trail-dot";
      d.textContent = Math.random() < 0.5 ? "✨" : "💛";
      d.style.left = e.clientX + "px";
      d.style.top = e.clientY + "px";
      document.body.appendChild(d);
      d.addEventListener("animationend", () => d.remove());
    });
  }

  /* ---------- Confetti (canvas) ----------------------------------- */
  let cctx = null, ccanvas = null, parts = [], raf = null, dpr = 1;

  function resizeCanvas() {
    if (!ccanvas) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    ccanvas.width = window.innerWidth * dpr;
    ccanvas.height = window.innerHeight * dpr;
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function confettiLoop() {
    const W = window.innerWidth, H = window.innerHeight;
    cctx.clearRect(0, 0, W, H);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vy += p.g;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rot);
      cctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
      cctx.fillStyle = p.color;
      if (p.shape === "rect") cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      else { cctx.beginPath(); cctx.arc(0, 0, p.size / 2, 0, 6.283); cctx.fill(); }
      cctx.restore();
      if (p.life > p.max || p.y > H + 50) parts.splice(i, 1);
    }
    if (parts.length) raf = requestAnimationFrame(confettiLoop);
    else { cctx.clearRect(0, 0, W, H); raf = null; }
  }

  function confettiBurst() {
    // Reduced-motion: swap the canvas blast for a gentle heart sprinkle
    if (reduce) { spawnHeartsBurst(10); return; }
    if (!cctx) {
      ccanvas = qs("#confetti-canvas");
      if (!ccanvas) return;
      cctx = ccanvas.getContext("2d");
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
    }
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.6;
    for (let i = 0; i < 180; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = rand(4, 13);
      parts.push({
        x: cx + rand(-90, 90),
        y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 7,   // initial upward "pop"
        g: rand(0.2, 0.32),
        size: rand(6, 13),
        rot: rand(0, 6.28),
        vr: rand(-0.3, 0.3),
        color: pick(CONFETTI_COLORS),
        shape: Math.random() < 0.5 ? "rect" : "circ",
        life: 0,
        max: rand(110, 180)
      });
    }
    if (!raf) confettiLoop();
  }

  /* ---------- Emoji rain (used by the Konami easter egg) ---------- */
  function emojiRain(emoji, n) {
    if (reduce) { spawnHeartsBurst(10); return; }
    for (let i = 0; i < n; i++) {
      const e = document.createElement("span");
      e.className = "rain-emoji";
      e.textContent = emoji;
      e.style.left = rand(0, 98) + "vw";
      e.style.setProperty("--size", rand(20, 42).toFixed(0) + "px");
      e.style.setProperty("--dur", rand(2.5, 5).toFixed(2) + "s");
      e.style.animationDelay = rand(0, 0.8).toFixed(2) + "s";
      document.body.appendChild(e);
      e.addEventListener("animationend", () => e.remove());
    }
  }

  /* ---------- Toast popups ---------------------------------------- */
  function toast(msg, opts = {}) {
    const layer = qs("#toast-layer");
    if (!layer) return;
    const t = document.createElement("div");
    t.className = "toast" + (opts.badge ? " toast--badge" : "");
    if (opts.html) t.innerHTML = msg; else t.textContent = msg;
    layer.appendChild(t);
    // keep the stack tidy
    while (layer.children.length > 4) layer.firstChild.remove();
    const ms = opts.ms || 4000;
    setTimeout(() => {
      t.classList.add("is-leaving");
      setTimeout(() => t.remove(), 320);
    }, ms);
  }

  return { initAmbient, initCursorTrail, spawnHeartsBurst, confettiBurst, emojiRain, toast };
})();
