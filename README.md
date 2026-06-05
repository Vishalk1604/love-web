# 💛 A Highly Classified Mission

An interactive, meme-filled, slightly-too-dramatic website built for exactly one purpose: **asking someone out on a date.** It's part mini-game, part rom-com, part meme dump — wrapped in a cheerful yellow aesthetic with floating hearts, a runaway "No" button, fake error screens, and a confetti finale.

> ⚠️ *Warning: you are about to enter a highly classified mission.* 😝

Built with plain **HTML, CSS & JavaScript** — no frameworks, no build step. Just open it or push it to GitHub Pages.

---

## ✨ What's inside

- **A whole storyline** — Warning screen → fake "boot" sequence → compatibility scanner (always hits 100% 😉) → flirty multiple-choice quiz → the big question → confetti celebration.
- **The runaway NO button** — dodges your cursor *and* your taps, taunts you with random text, and eventually gives up. The **YES** button just sits there glowing.
- **Live countdown** to your date, on the success screen.
- **Bonus / Easter eggs:**
  - 🎮 **Konami code** (`↑ ↑ ↓ ↓ ← → ← → B A`) rains 😝 everywhere
  - 🕵️ a **secret button** hiding in the footer
  - 🏆 **achievement badges** you unlock as you explore
  - 💬 a **random compliment generator** (floating button)
  - 🎶 **background music** toggle — synthesized live in the browser (no audio files!)
  - ✨ a **yellow cursor trail**, floating hearts, sparkles & surprise popups
- **Polished & considerate** — mobile + desktop responsive, keyboard accessible, and it honors `prefers-reduced-motion`.

---

## 🚀 Quick start (run it locally)

**Easiest:** just double-click `index.html` to open it in your browser.

**Recommended** (a couple of features behave best over `http://`): run a tiny local server from this folder —

```powershell
# Option 1 — Node (no install needed)
npx serve .

# Option 2 — Python
python -m http.server 8000
```

Then visit the URL it prints (e.g. `http://localhost:3000` or `http://localhost:8000`).

---

## 🎨 Make it yours

**You only need to edit one file:** [`js/config.js`](js/config.js).

```js
window.CONFIG = {
  dateTarget: "2026-06-20T19:00:00", // ← when's the date? (24h local time)
  dateLabel:  "our date",
  planDateUrl: "",   // optional: a WhatsApp / calendar / mailto link for the final button
  herName: "",       // leave "" for the name-free version (default)
  yourName: "",
  musicOnByDefault: false,
  effects: { cursorTrail: true, floatingHearts: true, sparkles: true, confetti: true, popups: true },
  timings: { loadingMs: 2600, popupIntervalMs: 15000 }
};
```

Want to rewrite the jokes, questions, or compliments so they sound like *you*? Everything lives in [`js/data.js`](js/data.js) — it's all plain text, clearly labelled. No code knowledge needed.

---

## 🌍 Deploy to GitHub Pages

### Option A — the one-command way (Windows)

You'll need [git](https://git-scm.com) and the [GitHub CLI](https://cli.github.com).

```powershell
gh auth login        # one-time: log into GitHub
.\setup.ps1          # creates the repo, pushes, and turns on Pages
```

The script prints your live URL (`https://<you>.github.io/love-web/`). Give it ~1–2 minutes for the first deploy.

### Option B — manual

```bash
git init -b main
git add .
git commit -m "love-web: interactive date proposal site"
gh repo create love-web --public --source . --remote origin --push
```

Then on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions.**

Either way, the included workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) redeploys automatically on every push to `main`. (The `.nojekyll` file tells Pages to serve everything as-is.)

> 💡 All asset paths are **relative**, so the site works whether it's served from the repo root or a `/love-web/` sub-path.

---

## 📁 Project structure

```
love-web/
├── index.html              # all six "scenes" live here
├── css/
│   ├── styles.css          # yellow theme, layout, components, responsive
│   └── animations.css      # keyframes + reduced-motion handling
├── js/
│   ├── config.js           # ← EDIT ME (date, names, toggles)
│   ├── data.js             # ← EDIT ME (questions, jokes, compliments)
│   ├── audio.js            # Web Audio melody + sound effects
│   ├── effects.js          # hearts, sparkles, confetti, cursor trail, toasts
│   ├── achievements.js     # the badge system
│   ├── easter-eggs.js      # Konami code, secret button, title poke
│   └── app.js              # the scene state machine + flow
├── assets/favicon.svg
├── .github/workflows/deploy.yml
├── .nojekyll
└── setup.ps1               # one-command publish helper
```

---

## ♿ Notes

- **Accessibility:** semantic markup, visible focus rings, `aria-live` announcements, and the NO button always gives up so keyboard users are never trapped.
- **No tracking, no dependencies, no audio files** — the music is generated with the Web Audio API at runtime.
- **Reset progress:** achievements + music preference are stored in `localStorage`. Clear site data to start fresh.

---

Made with 💛, 99% hope, and 1% CSS.
