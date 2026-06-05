/* =====================================================================
   easter-eggs.js — the hidden fun 🥚
   • Konami code → 😝 rain + badge
   • Secret "©" footer button → surprise meme + badge
   • Triple-click the big title → a burst of hearts
   Exposes window.EasterEggs: init()
   ===================================================================== */
window.EasterEggs = (function () {
  "use strict";

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Lines the secret button whispers when discovered
  const SECRET_LINES = [
    "🤫 You found the secret button. Of course you did — you're nosy AND cute.",
    "🥚 Easter egg unlocked: I've practiced asking you out 14 times in the mirror.",
    "👀 Secret intel: you've been the wallpaper of my brain for a while now.",
    "🛸 Classified: this entire site is just an elaborate excuse to talk to you."
  ];

  function initKonami() {
    const CODE = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
    let buffer = [];
    window.addEventListener("keydown", (e) => {
      buffer.push((e.key || "").toLowerCase());
      if (buffer.length > CODE.length) buffer.shift();
      if (CODE.every((k, i) => buffer[i] === k)) {
        buffer = [];
        Achievements.unlock("konami");
        FX.emojiRain("😝", 44);
        FX.toast("😝 KONAMI MODE: maximum tongue-out energy unlocked!", { ms: 4200 });
        if (window.Sound) Sound.play("success");
      }
    });
  }

  function initSecretButton() {
    const btn = document.getElementById("secret-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      Achievements.unlock("secret-agent");
      if (window.Sound) Sound.play("click");
      FX.toast(pick(SECRET_LINES), { ms: 6000 });
      FX.spawnHeartsBurst(10);
    });
  }

  function initTitlePoke() {
    // The first .title on the page (the landing headline)
    const title = document.querySelector(".title");
    if (!title) return;
    let clicks = 0, timer = null;
    title.style.cursor = "pointer";
    title.addEventListener("click", () => {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => (clicks = 0), 700);
      if (clicks >= 3) {
        clicks = 0;
        FX.spawnHeartsBurst(14);
        FX.toast("Hey, stop poking me 😝 (do it again though)", { ms: 3000 });
      }
    });
  }

  function init() {
    initKonami();
    initSecretButton();
    initTitlePoke();
  }

  return { init };
})();
