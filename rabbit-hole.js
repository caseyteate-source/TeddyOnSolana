/* ======================================================
   $TEDDY RABBIT HOLE HOTSPOTS
   Circle hotspot version with editor mode
   Includes 16 extra placeholder circles
====================================================== */

const isEditMode = new URLSearchParams(window.location.search).has("edit");

const rabbitHotspots = [
  {
    id: "arcade",
    title: "Arcade Cabinet",
    tag: "Play Again",
    text: "Return to the $TEDDY arcade game.",
    url: "index.html",
    sameTab: true,
    x: 9.53,
    y: 47.35,
    size: 64
  },
  {
    id: "kitty-files",
    title: "Kitty Files",
    tag: "Case File",
    text: "Open the Roaring Kitty investigation board.",
    url: "kitty.html",
    sameTab: true,
    x: 84.63,
    y: 82.42,
    size: 58
  },
  {
    id: "emoji",
    title: "Emoji Timeline",
    tag: "VHS Tape",
    text: "Follow the emoji timeline.",
    url: "emoji.html",
    sameTab: true,
    x: 25,
    y: 62,
    size: 58
  },
  {
    id: "memory",
    title: "Memory Room",
    tag: "VHS Tape",
    text: "Enter the 1980s memory room.",
    url: "imagination-room.html",
    sameTab: true,
    x: 82.99,
    y: 71.44,
    size: 58
  },
  {
    id: "tv",
    title: "CRT Television",
    tag: "Memory Room",
    text: "The screen is waiting. Step inside the past.",
    url: "imagination-room.html",
    sameTab: true,
    x: 90.55,
    y: 35.61,
    size: 70
  },
  {
    id: "moass",
    title: "MOASS",
    tag: "Easter Egg",
    text: "Click the MOASS sign to hear Mr. T's Mother.",
    url: "https://youtu.be/RO6JiFztJdg?si=BqHPez0QepkQeCkz",
    sameTab: false,
    x: 9.07,
    y: 7.79,
    size: 70
  },
  {
    id: "desk-lamp",
    title: "The Lamp",
    tag: "Easter Egg",
    text: "The lamp leads to Norm Macdonald's legendary moth joke.",
    url: "https://youtu.be/jJN9mBRX3uo",
    sameTab: false,
    x: 97.38,
    y: 59.29,
    size: 58
  },
  {
    id: "phone",
    title: "Rotary Phone",
    tag: "Callin' Oates",
    text: "Sometimes the rabbit hole calls you back.",
    url: "tel:7192662837",
    sameTab: true,
    x: 13,
    y: 80,
    size: 62
  },
  {
    id: "gamestop",
    title: "GameStop",
    tag: "Official Link",
    text: "Open GameStop's official investor relations page.",
    url: "https://investor.gamestop.com/",
    sameTab: false,
    x: 52,
    y: 9,
    size: 58
  },
  {
    id: "teddy",
    title: "The Teddy Files",
    tag: "Coming Soon",
    text: "A future page for Teddy, Ryan Cohen's books, and community theories.",
    url: "teddy.html",
    sameTab: true,
    x: 21.26,
    y: 28.3,
    size: 60
  },
  {
    id: "ryan",
    title: "Ryan Cohen Files",
    tag: "Coming Soon",
    text: "Ryan Cohen biography, timeline, Teddy theories, and GameStop connections.",
    url: "ryan.html",
    sameTab: true,
    x: 44.75,
    y: 10.74,
    size: 54
  },
  {
    id: "greg",
    title: "Greg",
    tag: "Tinfoil Thread",
    text: "A future page for the Greg rabbit hole.",
    url: "greg.html",
    sameTab: true,
    x: 54.29,
    y: 25.69,
    size: 54
  },
  {
    id: "keith",
    title: "Keith Gill",
    tag: "Roaring Kitty",
    text: "Open the Keith Gill / Roaring Kitty file.",
    url: "kitty-bio.html",
    sameTab: true,
    x: 43.07,
    y: 39.38,
    size: 54
  },
  {
    id: "buck",
    title: "Buck the Bunny",
    tag: "Easter Egg",
    text: "The rabbit was here first.",
    url: "buck.html",
    sameTab: true,
    x: 84.7,
    y: 12.82,
    size: 58
  },
  {
    id: "gmebay",
    title: "GMEBAY",
    tag: "Theory Tape",
    text: "What could GMEBAY become?",
    url: "gmebay.html",
    sameTab: true,
    x: 62.87,
    y: 56.76,
    size: 58
  },
  {
    id: "roaring-kitty-vhs",
    title: "Roaring Kitty VHS",
    tag: "VHS Tape",
    text: "Open the Roaring Kitty tinfoil collection.",
    url: "kitty.html",
    sameTab: true,
    x: 45,
    y: 67,
    size: 58
  },
  {
    id: "wonka",
    title: "Willy Wonka VHS",
    tag: "Pure Imagination",
    text: "A path toward the Memory Room.",
    url: "imagination-room.html",
    sameTab: true,
    x: 84.16,
    y: 51.55,
    size: 54
  },
  {
    id: "floppy",
    title: "Floppy Disk",
    tag: "Secret",
    text: "You found something that probably should not be here.",
    url: "secret.html",
    sameTab: true,
    x: 32,
    y: 86,
    size: 48
  },

  /* ======================================================
     16 NEW PLACEHOLDER CIRCLES
     Drag these in editor mode.
     We can rename and link them later.
  ====================================================== */

  {
    id: "extra-1",
    title: "Extra Circle 1",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 14,
    y: 14,
    size: 54
  },
  {
    id: "extra-2",
    title: "Extra Circle 2",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 22,
    y: 14,
    size: 54
  },
  {
    id: "extra-3",
    title: "Extra Circle 3",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 30,
    y: 14,
    size: 54
  },
  {
    id: "extra-4",
    title: "Extra Circle 4",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 38,
    y: 14,
    size: 54
  },
  {
    id: "extra-5",
    title: "Extra Circle 5",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 46,
    y: 14,
    size: 54
  },
  {
    id: "extra-6",
    title: "Extra Circle 6",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 54,
    y: 14,
    size: 54
  },
  {
    id: "extra-7",
    title: "Extra Circle 7",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 62,
    y: 14,
    size: 54
  },
  {
    id: "extra-8",
    title: "Extra Circle 8",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 70,
    y: 14,
    size: 54
  },
  {
    id: "extra-9",
    title: "Extra Circle 9",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 78,
    y: 14,
    size: 54
  },
  {
    id: "extra-10",
    title: "Extra Circle 10",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 86,
    y: 14,
    size: 54
  },
  {
    id: "extra-11",
    title: "Extra Circle 11",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 18,
    y: 84,
    size: 54
  },
  {
    id: "extra-12",
    title: "Extra Circle 12",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 28,
    y: 84,
    size: 54
  },
  {
    id: "extra-13",
    title: "Extra Circle 13",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 38,
    y: 84,
    size: 54
  },
  {
    id: "extra-14",
    title: "Extra Circle 14",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 48,
    y: 84,
    size: 54
  },
  {
    id: "extra-15",
    title: "Extra Circle 15",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 58,
    y: 84,
    size: 54
  },
  {
    id: "extra-16",
    title: "Extra Circle 16",
    tag: "New Clue",
    text: "Placeholder circle. We will name and link this later.",
    url: "#",
    sameTab: true,
    x: 68,
    y: 84,
    size: 54
  }
];

const container = document.getElementById("rabbitHotspots");
const modal = document.getElementById("rabbitModal");
const closeBtn = document.getElementById("rabbitClose");
const tag = document.getElementById("rabbitTag");
const title = document.getElementById("rabbitTitle");
const text = document.getElementById("rabbitText");
const link = document.getElementById("rabbitLink");

if (isEditMode) {
  document.body.classList.add("rabbit-edit-mode");
  createEditorPanel();
}

function renderHotspots() {
  if (!container) return;

  container.innerHTML = "";

  rabbitHotspots.forEach((spot) => {
    const button = document.createElement("button");

    button.className = `rabbit-hotspot ${spot.id}`;
    button.style.left = spot.x + "%";
    button.style.top = spot.y + "%";
    button.style.width = spot.size + "px";
    button.style.height = spot.size + "px";
    button.setAttribute("aria-label", spot.title);
    button.title = spot.title;
    button.dataset.label = spot.title;
    button.type = "button";

    if (isEditMode) {
      makeDraggable(button, spot);
    } else {
      button.addEventListener("click", () => openRabbitModal(spot));
    }

    container.appendChild(button);
  });
}

function openRabbitModal(spot) {
  if (!modal || !tag || !title || !text || !link) return;

  tag.textContent = spot.tag;
  title.textContent = spot.title;
  text.textContent = spot.text;

  link.href = spot.url;
  link.textContent = spot.url === "#" ? "NAME THIS LATER" : spot.sameTab ? "ENTER" : "OPEN LINK";
  link.target = spot.sameTab ? "_self" : "_blank";
  link.rel = spot.sameTab ? "" : "noopener noreferrer";

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeRabbitModal() {
  if (!modal) return;

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
}

function makeDraggable(button, spot) {
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();

    button.setPointerCapture(event.pointerId);

    const stage = document.querySelector(".rabbit-stage");
    const rect = stage.getBoundingClientRect();

    startX = event.clientX;
    startY = event.clientY;
    startLeft = spot.x;
    startTop = spot.y;

    function moveCircle(e) {
      const dx = ((e.clientX - startX) / rect.width) * 100;
      const dy = ((e.clientY - startY) / rect.height) * 100;

      spot.x = Number((startLeft + dx).toFixed(2));
      spot.y = Number((startTop + dy).toFixed(2));

      button.style.left = spot.x + "%";
      button.style.top = spot.y + "%";

      updateEditorOutput();
    }

    function stopMove() {
      try {
        button.releasePointerCapture(event.pointerId);
      } catch {}

      button.removeEventListener("pointermove", moveCircle);
      button.removeEventListener("pointerup", stopMove);
      button.removeEventListener("pointercancel", stopMove);

      updateEditorOutput();
    }

    button.addEventListener("pointermove", moveCircle);
    button.addEventListener("pointerup", stopMove);
    button.addEventListener("pointercancel", stopMove);
  });
}

function createEditorPanel() {
  const panel = document.createElement("div");
  panel.className = "rabbit-editor-panel";

  panel.innerHTML = `
    <strong>Rabbit Hole Hotspot Editor</strong>
    <p>Drag the circles into place. Then copy the updated coordinates.</p>
    <button id="copyRabbitHotspots" type="button">COPY UPDATED HOTSPOTS</button>
    <textarea id="rabbitHotspotOutput" readonly></textarea>
  `;

  document.body.appendChild(panel);

  const copyButton = document.getElementById("copyRabbitHotspots");

  copyButton.addEventListener("click", async () => {
    updateEditorOutput();

    const output = document.getElementById("rabbitHotspotOutput").value;

    try {
      await navigator.clipboard.writeText(output);
      copyButton.textContent = "COPIED!";

      setTimeout(() => {
        copyButton.textContent = "COPY UPDATED HOTSPOTS";
      }, 1200);
    } catch {
      alert("Could not auto-copy. Select the text box and copy manually.");
    }
  });
}

function updateEditorOutput() {
  const output = document.getElementById("rabbitHotspotOutput");
  if (!output) return;

  output.value = `const rabbitHotspots = ${JSON.stringify(rabbitHotspots, null, 2)};`;
}

if (closeBtn) {
  closeBtn.addEventListener("click", closeRabbitModal);
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeRabbitModal();
    }
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeRabbitModal();
  }
});

renderHotspots();
updateEditorOutput();
