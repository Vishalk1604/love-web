/* =====================================================================
   data.js  —  All the words. Tweak the jokes to sound like *you*. 😝
   ---------------------------------------------------------------------
   Pure content, no logic. app.js reads everything from window.DATA.
   ===================================================================== */

window.DATA = {

  /* ---- Scene 2: fake boot terminal lines (typed out one by one) ---- */
  bootLog: [
    "$ initializing mission_boot.exe …",
    "> loading charm modules ……… ok",
    "> calibrating butterflies ……… ok",
    "> importing 99% hope, 1% CSS … ok",
    "> disabling chickening-out subroutine … ok",
    "> WARNING: subject detected as dangerously cute",
    "> proceeding anyway 😝"
  ],

  /* ---- Scene 3: compatibility scanner checkpoints ------------------
     The bar eases toward each `pct`, pausing on the funny `label`.     */
  scannerSteps: [
    { pct: 18,  label: "Booting up the love radar…" },
    { pct: 39,  label: "Scanning for red flags… (found none, suspicious)" },
    { pct: 58,  label: "Calibrating vibes…" },
    { pct: 76,  label: "Detecting excessive attractiveness… 😳" },
    { pct: 91,  label: "Cross-checking with the stars…" },
    { pct: 100, label: "PERFECT MATCH 💛  (the math is mathing)" }
  ],

  /* ---- Scene 4: the quiz stage --------------------------------------
     A mixed sequence of "question", "meme" and "error" cards, shown one
     at a time. Add/remove freely — the progress bar adapts.            */
  quiz: [
    {
      type: "question",
      emoji: "😎",
      prompt: "How cool am I on a scale of 1–10?",
      answers: [
        { text: "Solid 10, no notes",  outcome: "Correct. The scanner agrees. 😝" },
        { text: "11 — the scale broke", outcome: "Flattery detected. I'm keeping you.", badge: "flatterer" },
        { text: "404: humility not found", outcome: "Bold. The audacity. I respect it. 😂" },
        { text: "Let me think……… 10",  outcome: "Took you long enough 😏" }
      ]
    },
    {
      type: "meme",
      top: "POV:",
      art: "👁️👄👁️",
      caption: "You clicked this website and now you're emotionally invested."
    },
    {
      type: "question",
      emoji: "🔮",
      prompt: "Do you believe in fate, or should I refresh the page and meet you again?",
      answers: [
        { text: "Fate, obviously", outcome: "Same. Slightly spooky. Mostly cute. 💛" },
        { text: "Refresh it 😝", outcome: "*dramatically presses F5* hi, do I know you?" },
        { text: "Why not both?", outcome: "Overachiever energy. Big fan." },
        { text: "Is this a trick question?", outcome: "Everything is when I'm this nervous." }
      ]
    },
    {
      type: "meme",
      top: "Me trying to act normal around you:",
      art: "🤖🔥",
      caption: "BEEP BOOP. HELLO FELLOW HUMAN. YOU LOOK… acceptable. (it's love, I'm malfunctioning.)"
    },
    {
      type: "question",
      emoji: "🤔",
      prompt: "What's your favorite type of guy?",
      answers: [
        { text: "Funny + a little dramatic", outcome: "…are you reading my résumé? 👀" },
        { text: "Builds whole websites to flirt", outcome: "Suspiciously specific. Anyway." },
        { text: "Tall, dark & online", outcome: "2 out of 3 and VERY online ✅" },
        { text: "Green flags only", outcome: "Loading green flags… 100% 🟩" }
      ]
    },
    {
      type: "error",
      code: "ERROR 404",
      title: "Better Date Candidate Not Found",
      body: "We searched the entire internet. Results: it's just me. So sorry. 😝"
    },
    {
      type: "question",
      emoji: "🪖",
      prompt: "Would you survive a date with me?",
      answers: [
        { text: "Easily, I'm built different", outcome: "Confidence! We absolutely love to see it." },
        { text: "Depends on the snacks", outcome: "Snacks confirmed. Unlimited. Non-negotiable." },
        { text: "I'll allow it", outcome: "Generous of you. Noted. 😝" },
        { text: "Only one way to find out", outcome: "NOW that's the spirit. Keep going →" }
      ]
    }
  ],

  /* ---- Flirty one-liners (shown as little transition captions) ----- */
  flirtyLines: [
    "I may not be a photographer, but I can picture us together. 📸",
    "My love language is quality time — so naturally I built a website instead of sending a normal text. 😝",
    "This website took fewer bugs to fix than my ability to talk to you in person.",
    "I asked the internet how to ask you out. It just said \"good luck, buddy.\"",
    "Warning: prolonged exposure to this page may cause butterflies."
  ],

  /* ---- Random compliment generator pool ---------------------------- */
  compliments: [
    "You have a laugh that should honestly be illegal in several states.",
    "If cuteness were a crime, you'd be serving life. 😝",
    "You're the human version of a warm, sunny afternoon.",
    "Talking to you is my favorite notification.",
    "You make the color yellow look like the best idea anyone ever had.",
    "Plot twist: you're the main character and everyone already knows it.",
    "You're a 10 — and I grade on a brutally strict curve.",
    "Being around you is like finding extra fries at the bottom of the bag.",
    "You're proof that good things happen to people who deserve them.",
    "I'd pick you in every universe. Even the weird, upside-down ones. 💛"
  ],

  /* ---- Surprise timed popups (toast style) ------------------------- */
  popups: [
    "Fun Fact: you're really cute.",
    "System detected excessive attractiveness. 😝",
    "This page runs on 99% hope and 1% CSS.",
    "Friendly reminder: you're doing amazing.",
    "Status: still thinking about you.",
    "Hint: the yellow button is the correct answer.",
    "Loading more compliments… (there are many.)"
  ],

  /* ---- Things the runaway NO button says when cornered ------------- */
  noButtonTexts: [
    "Are you sure?",
    "Think again 😝",
    "Wrong answer",
    "Try the yellow button",
    "Nope, can't click me",
    "My code forbids it",
    "Plot twist: NO is broken",
    "Catch me if you can 🏃",
    "Even my CSS is begging you",
    "Last chance to be reasonable 😝"
  ],

  /* What NO finally becomes after it's done running (it gives up). */
  noGivesUp: "ok fine… YES it is 😝"
};
