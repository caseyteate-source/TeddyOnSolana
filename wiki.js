
const modal = document.getElementById("wikiModal");
const close = document.getElementById("closeWiki");
const title = document.getElementById("wikiTitle");
const list = document.getElementById("wikiTheoryList");
const notes = document.getElementById("communityNotes");
const save = document.getElementById("saveTheory");

const theories = {
  "🎥 Movie Clip": [
    "Kansas City Shuffle",
    "Reverse merger theory",
    "Misdirection"
  ],

  "🇺🇸 Flag Tweet": [
    "National event",
    "Market catalyst",
    "Political symbolism"
  ],

  "👀 Looking Eyes": [
    "Watch closely",
    "Something hidden",
    "Announcement approaching"
  ],

  "🔥 Fire Tweet": [
    "Momentum beginning",
    "Transformation phase",
    "Catalyst event"
  ],

  "💥 Boom Tweet": [
    "Big reveal",
    "Corporate action",
    "Merger announcement"
  ],

  "🐸": [
    "Beginning of timeline",
    "Transformation",
    "Early clue"
  ],

  "🍦": [
    "McDonald's theory",
    "Summer reference",
    "Soft serve clue"
  ],

  "💀": [
    "Death of old system",
    "Transformation",
    "End of an era"
  ],

  "🇺🇸": [
    "America",
    "Political event",
    "Independence"
  ],

  "🎤": [
    "Announcement",
    "Earnings call",
    "Public statement"
  ],

  "👀": [
    "Pay attention",
    "Something hidden",
    "Watching"
  ],

  "🔥": [
    "Momentum",
    "Ignition",
    "Catalyst"
  ],

  "💥": [
    "Boom",
    "Reveal",
    "Major event"
  ],

  "🍻": [
    "Celebration",
    "Victory",
    "Cheers"
  ]
};

document.querySelectorAll(".pin, .emoji-pin").forEach(btn => {
  btn.addEventListener("click", () => {

    if (btn.classList.contains("center-pin")) {
      return;
    }

    title.textContent = btn.textContent;

    list.innerHTML = "";

    const items =
      theories[btn.textContent.trim()] || [];

    items.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    notes.value =
      localStorage.getItem(btn.textContent) || "";

    modal.classList.add("active");

    save.onclick = () => {
      localStorage.setItem(
        btn.textContent,
        notes.value
      );
    };
  });
});

close.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});
