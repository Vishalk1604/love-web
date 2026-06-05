/* =====================================================================
   achievements.js — unlockable badges 🏆
   Tracks progress in localStorage so it survives a refresh.
   Exposes window.Achievements: init(), unlock(id), isUnlocked(id),
   count(), render().
   ===================================================================== */
window.Achievements = (function () {
  "use strict";

  const KEY = "love-web-badges";

  // The full badge list. `id`s here must match the ones used elsewhere
  // (in data.js answers and the unlock() calls in app/easter-eggs).
  const DEFS = [
    { id: "first-contact",    icon: "🟡", name: "First Contact",      desc: "Began the mission." },
    { id: "background-check", icon: "🔍", name: "Background Check",   desc: "Survived the compatibility scan." },
    { id: "flatterer",        icon: "😳", name: "Flatterer",          desc: "Told me the scale broke." },
    { id: "overthinker",      icon: "🤔", name: "Overthinker",        desc: "Answered every single question." },
    { id: "dodger",           icon: "🏃", name: "Catch Me If You Can", desc: "Chased the NO button 5 times." },
    { id: "konami",           icon: "🎮", name: "Konami Cupid",       desc: "Entered the secret code." },
    { id: "secret-agent",     icon: "🕵️", name: "Secret Agent",       desc: "Found the hidden button." },
    { id: "dj",               icon: "🎶", name: "Resident DJ",        desc: "Played the background music." },
    { id: "smooth-talker",    icon: "💬", name: "Compliment Addict",  desc: "Asked for 5 compliments." },
    { id: "mission-complete", icon: "💛", name: "Mission Complete",   desc: "Said YES. 🎉" }
  ];

  let unlocked = new Set();

  function init() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      unlocked = new Set(saved);
    } catch (e) { unlocked = new Set(); }
    updateCount();
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify([...unlocked])); } catch (e) {}
  }

  function isUnlocked(id) { return unlocked.has(id); }
  function count() { return unlocked.size; }

  function updateCount() {
    const el = document.getElementById("badge-count");
    if (el) el.textContent = `${unlocked.size}/${DEFS.length}`;
  }

  function unlock(id) {
    if (unlocked.has(id)) return;            // only fire once
    if (!DEFS.some((d) => d.id === id)) return;
    unlocked.add(id);
    save();
    updateCount();
    const def = DEFS.find((d) => d.id === id);
    // celebrate it
    if (window.FX) FX.toast(`🏆 <strong>Achievement:</strong> ${def.name}`, { badge: true, html: true, ms: 3600 });
    if (window.Sound) Sound.play("click");
    // refresh the drawer if it happens to be open
    const panel = document.getElementById("badges-panel");
    if (panel && !panel.hidden) render(id);
  }

  // `justId` (optional) gets a little pop animation
  function render(justId) {
    const list = document.getElementById("badges-list");
    if (!list) return;
    list.innerHTML = "";
    DEFS.forEach((d) => {
      const on = unlocked.has(d.id);
      const li = document.createElement("li");
      li.className = "badge" + (on ? " is-unlocked" : "") + (d.id === justId ? " just-unlocked" : "");
      li.innerHTML = `
        <span class="badge__icon" aria-hidden="true">${on ? d.icon : "🔒"}</span>
        <span>
          <span class="badge__name">${on ? d.name : "???"}</span><br/>
          <span class="badge__desc">${on ? d.desc : "Still locked — keep exploring 😝"}</span>
        </span>`;
      list.appendChild(li);
    });
    updateCount();
  }

  return { init, unlock, isUnlocked, count, render };
})();
