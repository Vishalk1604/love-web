/* =====================================================================
   app.js — the brain 🧠
   Scene state machine + the whole flow:
   landing → loading → scanner → quiz → big question → success.
   Reads content from DATA, calls into Sound / FX / Achievements / EasterEggs.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- tiny helpers ---------------------------------------- */
  const qs  = (sel, root = document) => root.querySelector(sel);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const pad2 = (n) => String(n).padStart(2, "0");

  // Number tween (used to make the scanner % count up smoothly)
  function tween(from, to, ms, onStep, onDone) {
    const t0 = performance.now();
    (function frame(now) {
      const k = Math.min(1, (now - t0) / ms);
      onStep(from + (to - from) * k);
      if (k < 1) requestAnimationFrame(frame);
      else if (onDone) onDone();
    })(t0);
  }

  /* ---------- shared state ---------------------------------------- */
  let current = "landing";
  let journeyStarted = false;
  let popupTimer = null;
  let complimentCount = 0;
  let accepted = false;

  /* =================================================================
     SCENE SWITCHER
     ================================================================= */
  function showScene(name) {
    if (name === current) return;
    const cur = qs("#scene-" + current);
    const next = qs("#scene-" + name);
    cur.classList.add("is-leaving");
    setTimeout(() => {
      cur.classList.remove("is-active", "is-leaving");
      next.classList.add("is-active");
      current = name;
      window.scrollTo({ top: 0 });
      // Move focus to the first actionable element for keyboard/AT users
      const focusTarget = next.querySelector(".btn, .answer, h1, h2");
      if (focusTarget) {
        if (!focusTarget.matches(".btn, .answer")) focusTarget.setAttribute("tabindex", "-1");
        focusTarget.focus({ preventScroll: true });
      }
    }, 220);
  }

  /* =================================================================
     SCENE 2 — fake boot terminal
     ================================================================= */
  function runBoot() {
    const log = qs("#boot-log");
    const bar = qs("#boot-bar");
    log.textContent = "";
    const lines = DATA.bootLog;
    const total = CONFIG.timings.loadingMs;
    const per = total / lines.length;

    lines.forEach((line, i) => {
      setTimeout(() => {
        log.textContent += (i ? "\n" : "") + line;
        bar.style.width = Math.round(((i + 1) / lines.length) * 100) + "%";
      }, per * i);
    });

    setTimeout(() => { showScene("scanner"); runScanner(); }, total + 300);
  }

  /* =================================================================
     SCENE 3 — compatibility scanner (always reaches 100%)
     ================================================================= */
  function runScanner() {
    const arc = qs("#scanner-arc");
    const pctEl = qs("#scanner-pct");
    const label = qs("#scanner-label");
    const C = 327; // circumference of r=52 circle (2πr)
    let i = 0;
    let lastPct = 0;

    (function step() {
      if (i >= DATA.scannerSteps.length) {
        Achievements.unlock("background-check");
        setTimeout(() => { showScene("questions"); renderStage(0); }, 950);
        return;
      }
      const s = DATA.scannerSteps[i];
      arc.style.strokeDashoffset = C * (1 - s.pct / 100);
      label.textContent = s.label;
      tween(lastPct, s.pct, 650, (v) => { pctEl.textContent = Math.round(v) + "%"; });
      lastPct = s.pct;
      i++;
      setTimeout(step, 780);
    })();
  }

  /* =================================================================
     SCENE 4 — the quiz (questions + meme/error interludes)
     ================================================================= */
  let stageIndex = 0;

  function updateQuizProgress(i) {
    const total = DATA.quiz.length;
    qs("#quiz-bar").style.width = Math.round(((i + 1) / total) * 100) + "%";
    qs("#quiz-step").textContent = `Mission progress · ${i + 1}/${total}`;
  }

  function freshCard(extraClass) {
    const card = document.createElement("div");
    card.className = "card" + (extraClass ? " " + extraClass : "");
    // give every new card a little entrance flourish
    card.style.animation = "sceneIn .45s cubic-bezier(.2,.8,.2,1) both";
    return card;
  }

  function renderStage(i) {
    stageIndex = i;
    updateQuizProgress(i);
    const item = DATA.quiz[i];
    const stage = qs("#quiz-stage");
    stage.innerHTML = "";

    if (item.type === "question") stage.appendChild(buildQuestion(item));
    else if (item.type === "meme") stage.appendChild(buildMeme(item));
    else if (item.type === "error") stage.appendChild(buildError(item));
  }

  function buildQuestion(item) {
    const card = freshCard();
    let answered = false;

    const head = document.createElement("div");
    head.innerHTML = `<div class="q-emoji" aria-hidden="true">${item.emoji}</div>
                      <h2 class="q-prompt">${item.prompt}</h2>`;
    card.appendChild(head);

    const list = document.createElement("div");
    list.className = "answers";
    item.answers.forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "answer";
      b.textContent = a.text;
      b.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        Sound.play("click");
        Array.from(list.children).forEach((c) => (c.disabled = true));
        b.classList.add("is-picked");
        if (a.badge) Achievements.unlock(a.badge);

        const out = document.createElement("div");
        out.className = "outcome";
        out.textContent = a.outcome;
        card.appendChild(out);

        const isLast = stageIndex === DATA.quiz.length - 1;
        const next = document.createElement("button");
        next.type = "button";
        next.className = "btn btn--primary q-next";
        next.textContent = isLast ? "I'm ready 😳" : "Next →";
        next.addEventListener("click", advanceStage);
        card.appendChild(next);
        next.focus({ preventScroll: true });
      });
      list.appendChild(b);
    });
    card.appendChild(list);
    return card;
  }

  function buildMeme(item) {
    const card = freshCard("meme");
    card.innerHTML = `<div class="meme__top">${item.top}</div>
                      <div class="meme__art" aria-hidden="true">${item.art}</div>
                      <p class="meme__caption">${item.caption}</p>`;
    card.appendChild(continueBtn());
    return card;
  }

  function buildError(item) {
    const card = freshCard("errcard shake");
    Sound.play("error");
    card.innerHTML = `<span class="errcard__code">${item.code}</span>
                      <h2 class="errcard__title">${item.title}</h2>
                      <p class="errcard__body">${item.body}</p>`;
    card.appendChild(continueBtn("Ugh, fine, continue →"));
    return card;
  }

  function continueBtn(text) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn--primary q-next";
    b.textContent = text || "Continue →";
    b.addEventListener("click", () => { Sound.play("click"); advanceStage(); });
    return b;
  }

  function advanceStage() {
    // occasionally sprinkle a flirty line as a toast between stages
    if (Math.random() < 0.6) FX.toast(pick(DATA.flirtyLines), { ms: 4500 });
    if (stageIndex + 1 < DATA.quiz.length) {
      renderStage(stageIndex + 1);
    } else {
      Achievements.unlock("overthinker");
      showScene("bigq");
      initBigQ();
    }
  }

  /* =================================================================
     SCENE 5 — the big question + runaway NO button
     ================================================================= */
  function initBigQ() {
    const yes = qs("#btn-yes");
    const no = qs("#btn-no");
    yes.classList.add("is-tempting");
    yes.addEventListener("click", acceptFlow);
    setupRunawayNo(no);
  }

  function setupRunawayNo(no) {
    let dodges = 0;
    let givenUp = false;

    const moveSomewhereElse = () => {
      const pad = 14;
      const w = no.offsetWidth, h = no.offsetHeight;
      const x = Math.max(pad, Math.random() * (window.innerWidth - w - pad));
      const y = Math.max(pad, Math.random() * (window.innerHeight - h - pad));
      no.style.left = x + "px";
      no.style.top = y + "px";
    };

    const dodge = () => {
      if (givenUp) return;
      // First dodge: detach the button to fixed positioning where it stands,
      // so the very first hop animates from its current spot (no jump).
      if (!no.classList.contains("btn--runaway")) {
        const r = no.getBoundingClientRect();
        no.classList.add("btn--runaway");
        no.style.left = r.left + "px";
        no.style.top = r.top + "px";
        void no.offsetWidth; // force reflow
      }
      dodges++;
      moveSomewhereElse();
      no.textContent = pick(DATA.noButtonTexts);
      Sound.play("error");
      if (dodges === 5) Achievements.unlock("dodger");
      if (dodges >= 7) giveUp();
    };

    const giveUp = () => {
      givenUp = true;
      no.classList.remove("btn--runaway");
      no.style.left = no.style.top = "";
      no.textContent = DATA.noGivesUp;
      no.classList.add("is-tempting"); // now it's basically a second YES
      FX.toast("The NO button has officially resigned. 😝", { ms: 3500 });
    };

    // Desktop hover + keyboard focus → flee
    no.addEventListener("pointerenter", dodge);
    no.addEventListener("focus", dodge);
    // Touch / click attempt → flee BEFORE the click lands (mobile-safe)
    no.addEventListener("pointerdown", (e) => {
      if (!givenUp) { e.preventDefault(); dodge(); }
    });
    // Once it gives up, a real click finally means YES
    no.addEventListener("click", () => { if (givenUp) acceptFlow(); });
  }

  /* =================================================================
     SCENE 6 — success + celebration
     ================================================================= */
  function acceptFlow() {
    if (accepted) return;
    accepted = true;
    Sound.play("success");
    Achievements.unlock("mission-complete");
    if (popupTimer) clearInterval(popupTimer); // clean finale, no more popups
    showScene("success");
    // Let the scene swap settle, then celebrate
    setTimeout(() => {
      if (CONFIG.effects.confetti) FX.confettiBurst();
      FX.spawnHeartsBurst(34);
      startCountdown();
    }, 260);
  }

  let cdTimer = null;
  function startCountdown() {
    const target = new Date(CONFIG.dateTarget);
    const cap = qs("#countdown-caption");
    const setCD = (d, h, m, s) => {
      qs("#cd-days").textContent = d;
      qs("#cd-hours").textContent = pad2(h);
      qs("#cd-mins").textContent = pad2(m);
      qs("#cd-secs").textContent = pad2(s);
    };

    if (isNaN(target.getTime())) {
      cap.textContent = "(Pop your date into config.js to start the countdown 😉)";
      return;
    }
    cap.textContent =
      `Counting down to ${CONFIG.dateLabel} — ` +
      target.toLocaleString([], { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }) +
      " 💛";

    const tick = () => {
      const diff = target - new Date();
      if (diff <= 0) {
        setCD(0, 0, 0, 0);
        cap.textContent = "It's date o'clock 💛 — go have fun!";
        clearInterval(cdTimer);
        return;
      }
      setCD(
        Math.floor(diff / 86400000),
        Math.floor(diff / 3600000) % 24,
        Math.floor(diff / 60000) % 60,
        Math.floor(diff / 1000) % 60
      );
    };
    tick();
    cdTimer = setInterval(tick, 1000);
  }

  function setupPlanButton() {
    const plan = qs("#btn-plan");
    if (CONFIG.planDateUrl) {
      plan.href = CONFIG.planDateUrl;
      plan.target = "_blank";
      plan.rel = "noopener";
    } else {
      plan.addEventListener("click", (e) => {
        e.preventDefault();
        Sound.play("success");
        FX.toast("Yay! Screenshot this & text me — let's pick a day 💛", { ms: 6000 });
        FX.spawnHeartsBurst(14);
      });
    }
  }

  /* =================================================================
     Persistent UI: music, badges, compliments, popups, secret button
     ================================================================= */
  function startPopupLoop() {
    if (!CONFIG.effects.popups || popupTimer) return;
    popupTimer = setInterval(() => {
      if (current === "loading") return; // don't cover the boot screen
      FX.toast(pick(DATA.popups), { ms: 4200 });
    }, CONFIG.timings.popupIntervalMs);
  }

  function wireMusicToggle() {
    const mt = qs("#music-toggle");
    mt.addEventListener("click", () => {
      Sound.init();
      const on = Sound.toggleMusic();
      mt.setAttribute("aria-pressed", String(on));
      qs(".chip__text", mt).textContent = "Music: " + (on ? "On" : "Off");
      qs(".chip__icon", mt).textContent = on ? "🎶" : "🎵";
      if (on) Achievements.unlock("dj");
    });
  }

  function wireBadgesToggle() {
    const bt = qs("#badges-toggle");
    const panel = qs("#badges-panel");
    const close = () => { panel.hidden = true; bt.setAttribute("aria-expanded", "false"); };
    bt.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = panel.hidden;
      panel.hidden = !open;
      bt.setAttribute("aria-expanded", String(open));
      if (open) Achievements.render();
    });
    document.addEventListener("click", (e) => {
      if (!panel.hidden && !panel.contains(e.target)) close();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  function wireCompliment() {
    qs("#compliment-btn").addEventListener("click", () => {
      Sound.play("click");
      FX.toast(pick(DATA.compliments), { ms: 5000 });
      FX.spawnHeartsBurst(6);
      complimentCount++;
      if (complimentCount >= 5) Achievements.unlock("smooth-talker");
    });
  }

  /* =================================================================
     INIT
     ================================================================= */
  function init() {
    // Effects + audio + achievements bootstrapping
    FX.initAmbient();
    if (CONFIG.effects.cursorTrail) FX.initCursorTrail();
    Achievements.init();
    Achievements.render();
    EasterEggs.init();

    // Persistent controls
    wireMusicToggle();
    wireBadgesToggle();
    wireCompliment();
    setupPlanButton();
    qs("#btn-replay").addEventListener("click", () => location.reload());

    // Reflect any saved music preference in the toggle label
    if (Sound.isMusicOn()) {
      const mt = qs("#music-toggle");
      mt.setAttribute("aria-pressed", "true");
      qs(".chip__text", mt).textContent = "Music: On";
      qs(".chip__icon", mt).textContent = "🎶";
    }

    // The one button that kicks everything off
    qs("#btn-proceed").addEventListener("click", () => {
      Sound.init();         // unlock audio on a real user gesture
      Sound.play("click");
      Achievements.unlock("first-contact");
      journeyStarted = true;
      qs("#compliment-btn").hidden = false;
      startPopupLoop();
      showScene("loading");
      runBoot();
    });
  }

  // Expose a couple of hooks for easter-eggs.js (e.g. confetti via Konami)
  window.APP = { showScene: () => showScene("success") };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
