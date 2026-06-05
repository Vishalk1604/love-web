/* =====================================================================
   audio.js — sound, with zero audio files 🎶
   Everything is synthesized live with the Web Audio API:
     • SFX: click / success / error
     • Music: a gentle, looping major-key motif
   Exposes window.Sound: init(), play(name), toggleMusic(), isMusicOn()
   Browsers block audio until a user gesture, so init() runs on first tap.
   ===================================================================== */
window.Sound = (function () {
  "use strict";

  const KEY = "love-web-music"; // remembers her music preference
  let ctx = null, master = null, sfxGain = null, musicGain = null;

  // Music preference: saved value wins; otherwise fall back to config.
  let musicPref = (function () {
    const stored = localStorage.getItem(KEY);
    if (stored === null) return !!(window.CONFIG && CONFIG.musicOnByDefault);
    return stored === "1";
  })();
  let playing = false;

  /* ---------- set up the audio graph once (on a gesture) ---------- */
  function init() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return; // very old browser → silently no-op
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.85; master.connect(ctx.destination);
      sfxGain = ctx.createGain(); sfxGain.gain.value = 0.4; sfxGain.connect(master);
      musicGain = ctx.createGain(); musicGain.gain.value = 0.0; musicGain.connect(master);
    }
    if (ctx.state === "suspended") ctx.resume();
    // If she'd previously turned music on, resume it now that we're allowed.
    if (musicPref && !playing) startMusic();
  }

  /* ---------- a single short synth note --------------------------- */
  function voice(freq, start, dur, type, peak, dest) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g).connect(dest);
    o.start(start);
    o.stop(start + dur + 0.02);
  }

  /* ---------- sound effects --------------------------------------- */
  function play(name) {
    if (!ctx) return;
    const t = ctx.currentTime;
    if (name === "click") {
      voice(720, t, 0.12, "triangle", 0.3, sfxGain);
    } else if (name === "success") {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        voice(f, t + i * 0.09, 0.22, "triangle", 0.32, sfxGain));
    } else if (name === "error") {
      // soft, playful "nope" — never harsh
      voice(330, t, 0.12, "square", 0.16, sfxGain);
      voice(247, t + 0.1, 0.16, "square", 0.16, sfxGain);
    }
  }

  /* ---------- looping background melody --------------------------- */
  // A cheerful little motif in C major (frequencies in Hz). One per beat.
  const MELODY = [
    659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25, 587.33,
    659.25, 783.99, 880.0, 1046.5, 880.0, 783.99, 659.25, 587.33
  ];
  // Gentle bass root notes, one every two beats.
  const BASS = [130.81, 130.81, 174.61, 196.0, 130.81, 174.61, 196.0, 130.81];
  const BEAT = 0.36; // seconds per beat (~light & breezy)

  let step = 0, nextNoteTime = 0, schedTimer = null;

  function scheduler() {
    // schedule a little ahead of the clock for rock-solid timing
    while (nextNoteTime < ctx.currentTime + 0.12) {
      voice(MELODY[step % MELODY.length], nextNoteTime, BEAT * 0.9, "triangle", 0.5, musicGain);
      if (step % 2 === 0) {
        voice(BASS[(step / 2) % BASS.length], nextNoteTime, BEAT * 1.6, "sine", 0.45, musicGain);
      }
      nextNoteTime += BEAT;
      step++;
    }
    schedTimer = setTimeout(scheduler, 25);
  }

  function startMusic() {
    if (!ctx || playing) return;
    playing = true;
    step = 0;
    nextNoteTime = ctx.currentTime + 0.08;
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    musicGain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.6); // fade in
    scheduler();
  }

  function stopMusic() {
    playing = false;
    if (schedTimer) { clearTimeout(schedTimer); schedTimer = null; }
    if (musicGain && ctx) {
      musicGain.gain.cancelScheduledValues(ctx.currentTime);
      musicGain.gain.setValueAtTime(musicGain.gain.value, ctx.currentTime);
      musicGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3); // fade out
    }
  }

  /* ---------- public toggle --------------------------------------- */
  function toggleMusic() {
    init();
    musicPref = !musicPref;
    localStorage.setItem(KEY, musicPref ? "1" : "0");
    if (musicPref) startMusic(); else stopMusic();
    return musicPref;
  }

  function isMusicOn() { return musicPref; }

  return { init, play, toggleMusic, isMusicOn };
})();
