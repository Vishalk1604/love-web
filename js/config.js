/* =====================================================================
   config.js  —  THE ONLY FILE YOU NEED TO EDIT 💛
   ---------------------------------------------------------------------
   Everything personal lives here. No build step: just save and refresh.
   ===================================================================== */

window.CONFIG = {

  /* ---- The date you're counting down to ----------------------------
     Use 24-hour local time:  "YYYY-MM-DDTHH:MM:SS"
     Example below = 20 June 2026, 7:00 PM.  Change it to your plan!     */
  dateTarget: "2026-06-20T19:00:00",
  dateLabel: "our date",

  /* ---- The "Let's Plan Our Date" button ----------------------------
     Optional. Paste a link to open when she taps it, e.g.
       WhatsApp:  "https://wa.me/911234567890?text=Yay!%20Let's%20plan%20💛"
       Email:     "mailto:you@example.com?subject=Our%20date%20💛"
     Leave "" to just show a sweet confirmation message instead.          */
  planDateUrl: "",

  /* ---- Optional names ----------------------------------------------
     Leave BOTH empty ("") for the name-free version (the default).
     Fill them in to sprinkle names through the copy.                     */
  herName: "",
  yourName: "",

  /* ---- Feature toggles (flip to false to disable) ------------------ */
  musicOnByDefault: false,   // music waits for a tap regardless (browser rule)
  effects: {
    cursorTrail: true,       // yellow sparkle trail (desktop only)
    floatingHearts: true,    // gentle hearts drifting up
    sparkles: true,          // twinkles in the background
    confetti: true,          // the big finale burst
    popups: true             // surprise toast messages while she plays
  },

  /* ---- Timing knobs (milliseconds) --------------------------------- */
  timings: {
    loadingMs: 2600,         // length of the fake "boot" screen
    popupIntervalMs: 15000   // how often a surprise popup may appear
  }
};
