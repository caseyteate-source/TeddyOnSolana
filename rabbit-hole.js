const isEditMode = new URLSearchParams(window.location.search).has("edit");

const rabbitHotspots = [
  {
    "id": "arcade",
    "title": "Arcade Cabinet",
    "tag": "Play Again",
    "text": "Return to the $TEDDY arcade game.",
    "url": "index.html",
    "sameTab": true,
    "x": 9.53,
    "y": 47.35,
    "size": 64
  },
  {
    "id": "arcade-marquee",
    "title": "$TEDDY Marquee",
    "tag": "Insert Coin",
    "text": "The glowing $TEDDY sign pulls you back to the arcade.",
    "url": "index.html",
    "sameTab": true,
    "x": 8.91,
    "y": 19.77,
    "size": 58
  },
  {
    "id": "coffee-mug",
    "title": "Coffee Mug",
    "tag": "Late Night Clue",
    "text": "Every rabbit hole needs caffeine.",
    "url": "coffee.html",
    "sameTab": true,
    "x": 69.5,
    "y": 74.26,
    "size": 48
  },
  {
    "id": "magnifying-glass",
    "title": "Magnifying Glass",
    "tag": "Investigate",
    "text": "A closer look always reveals another thread.",
    "url": "kitty.html",
    "sameTab": true,
    "x": 61.36,
    "y": 83.14,
    "size": 50
  },
  {
    "id": "kitty-files",
    "title": "Kitty Files",
    "tag": "Case File",
    "text": "Open the Roaring Kitty investigation board.",
    "url": "kitty.html",
    "sameTab": true,
    "x": 84.63,
    "y": 82.42,
    "size": 58
  },
  {
    "id": "emoji",
    "title": "Emoji Timeline",
    "tag": "VHS Tape",
    "text": "Follow the Roaring Kitty emoji timeline.",
    "url": "emoji.html",
    "sameTab": true,
    "x": 25,
    "y": 62,
    "size": 58
  },
  {
    "id": "memory",
    "title": "Memory Room",
    "tag": "VHS Tape",
    "text": "Enter the 1980s memory room.",
    "url": "imagination-room.html",
    "sameTab": true,
    "x": 82.99,
    "y": 71.44,
    "size": 58
  },
  {
    "id": "tv",
    "title": "CRT Television",
    "tag": "Memory Room",
    "text": "The screen is waiting. Step inside the past.",
    "url": "imagination-room.html",
    "sameTab": true,
    "x": 90.55,
    "y": 35.61,
    "size": 70
  },
  {
    "id": "moass",
    "title": "MOASS",
    "tag": "Easter Egg",
    "text": "Click the MOASS sign to hear Mr. T's Mother.",
    "url": "https://youtu.be/RO6JiFztJdg?si=BqHPez0QepkQeCkz",
    "sameTab": false,
    "x": 9.07,
    "y": 7.79,
    "size": 70
  },
  {
    "id": "desk-lamp",
    "title": "The Desk Lamp",
    "tag": "Easter Egg",
    "text": "The lamp leads to Norm Macdonald's legendary moth joke.",
    "url": "https://youtu.be/jJN9mBRX3uo",
    "sameTab": false,
    "x": 96.8,
    "y": 58.34,
    "size": 58
  },
  {
    "id": "phone",
    "title": "Rotary Phone",
    "tag": "Callin' Oates",
    "text": "Sometimes the rabbit hole calls you back.",
    "url": "tel:7192662837",
    "sameTab": true,
    "x": 18.84,
    "y": 81.26,
    "size": 62
  },
  {
    "id": "gamestop",
    "title": "GameStop",
    "tag": "Official Link",
    "text": "Open GameStop's official investor relations page.",
    "url": "https://investor.gamestop.com/",
    "sameTab": false,
    "x": 57.72,
    "y": 7.39,
    "size": 58
  },
  {
    "id": "teddy",
    "title": "The Teddy Files",
    "tag": "Coming Soon",
    "text": "A future page for Teddy, Ryan Cohen's books, and community theories.",
    "url": "teddy.html",
    "sameTab": true,
    "x": 21.26,
    "y": 28.81,
    "size": 60
  },
  {
    "id": "ryan",
    "title": "Ryan Cohen Files",
    "tag": "Coming Soon",
    "text": "Ryan Cohen biography, timeline, Teddy theories, and GameStop connections.",
    "url": "ryan.html",
    "sameTab": true,
    "x": 44.75,
    "y": 10.74,
    "size": 54
  },
  {
    "id": "greg",
    "title": "Greg",
    "tag": "Tinfoil Thread",
    "text": "A future page for the Greg rabbit hole.",
    "url": "greg.html",
    "sameTab": true,
    "x": 54.29,
    "y": 25.69,
    "size": 54
  },
  {
    "id": "keith",
    "title": "Keith Gill",
    "tag": "Roaring Kitty",
    "text": "Open the Keith Gill / Roaring Kitty file.",
    "url": "kitty-bio.html",
    "sameTab": true,
    "x": 43.07,
    "y": 39.38,
    "size": 54
  },
  {
    "id": "buck",
    "title": "Buck the Bunny",
    "tag": "Easter Egg",
    "text": "The rabbit was here first.",
    "url": "buck.html",
    "sameTab": true,
    "x": 84.7,
    "y": 12.82,
    "size": 58
  },
  {
    "id": "gmebay",
    "title": "GMEBAY",
    "tag": "Theory Tape",
    "text": "What could GMEBAY become?",
    "url": "gmebay.html",
    "sameTab": true,
    "x": 62.04,
    "y": 56.37,
    "size": 58
  },
  {
    "id": "roaring-kitty-vhs",
    "title": "Roaring Kitty VHS",
    "tag": "VHS Tape",
    "text": "Open the Roaring Kitty tinfoil collection.",
    "url": "kitty.html",
    "sameTab": true,
    "x": 45,
    "y": 67,
    "size": 58
  },
  {
    "id": "wonka",
    "title": "Willy Wonka VHS",
    "tag": "Pure Imagination",
    "text": "A path toward the Memory Room.",
    "url": "imagination-room.html",
    "sameTab": true,
    "x": 84.16,
    "y": 51.55,
    "size": 54
  },
  {
    "id": "floppy",
    "title": "Floppy Disk",
    "tag": "Secret",
    "text": "You found something that probably should not be here.",
    "url": "secret.html",
    "sameTab": true,
    "x": 31.04,
    "y": 88.16,
    "size": 48
  },
  {
    "id": "hang-in-there",
    "title": "Hang In There",
    "tag": "Poster",
    "text": "The classic cat signal. Hang in there. Follow the thread.",
    "url": "kitty.html",
    "sameTab": true,
    "x": 31.57,
    "y": 14.83,
    "size": 62
  },
  {
    "id": "rocket",
    "title": "Rocket Blueprint",
    "tag": "Launch Plan",
    "text": "A future launch-plan page for the rocket, the timeline, and the moon mission.",
    "url": "rocket.html",
    "sameTab": true,
    "x": 63.39,
    "y": 45.52,
    "size": 58
  },
  {
    "id": "ebay-book",
    "title": "How To Sell Anything On eBay",
    "tag": "GMEBAY Clue",
    "text": "The marketplace clue. Open the GMEBAY theory page.",
    "url": "gmebay.html",
    "sameTab": true,
    "x": 93.02,
    "y": 20.16,
    "size": 62
  },
  {
    "id": "nintendo-controller",
    "title": "Nintendo Controller",
    "tag": "Retro Room",
    "text": "The controller opens the retro room.",
    "url": "retro-room.html",
    "sameTab": true,
    "x": 94.95,
    "y": 74.76,
    "size": 54
  },
  {
    "id": "camcorder",
    "title": "Camcorder",
    "tag": "Video Archive",
    "text": "The camcorder opens the video archive side of the rabbit hole.",
    "url": "retro-room.html",
    "sameTab": true,
    "x": 57.8,
    "y": 65.2,
    "size": 54
  },
  {
    "id": "lava-lamp",
    "title": "Lava Lamp",
    "tag": "Easter Egg",
    "text": "A glowing clue from the old room.",
    "url": "https://youtu.be/jJN9mBRX3uo",
    "sameTab": false,
    "x": 20.66,
    "y": 16.18,
    "size": 50
  },
  {
    "id": "stock-chart",
    "title": "Stock Chart",
    "tag": "Market Clue",
    "text": "Open the GME stock chart.",
    "url": "https://finance.yahoo.com/quote/GME/",
    "sameTab": false,
    "x": 69.63,
    "y": 8.97,
    "size": 54
  }
];

const container = document.getElementById("rabbitHotspots");

if (isEditMode) {
  document.body.classList.add("rabbit-edit-mode");
  createEditorPanel();
}

function renderHotspots() {
  if (!container) return;

  container.innerHTML = "";

  rabbitHotspots.forEach((spot, index) => {
    const button = document.createElement("button");

    button.className = `rabbit-hotspot ${spot.id}`;
    button.type = "button";
    button.style.left = `${spot.x}%`;
    button.style.top = `${spot.y}%`;
    button.style.width = `${spot.size}px`;
    button.style.height = `${spot.size}px`;
    button.title = `${spot.title} — ${spot.tag}`;
    button.setAttribute("aria-label", `${spot.title}. ${spot.text}`);
    button.dataset.index = index;
    button.dataset.label = spot.title;

    if (isEditMode) {
      button.addEventListener("pointerdown", (event) => {
        makeDraggable(event, button, spot);
      });
    } else {
      button.addEventListener("click", () => {
        goToHotspot(spot);
      });
    }

    container.appendChild(button);
  });
}

function goToHotspot(spot) {
  if (!spot.url) return;

  if (spot.sameTab) {
    window.location.href = spot.url;
  } else {
    window.open(spot.url, "_blank", "noopener,noreferrer");
  }
}

function makeDraggable(event, button, spot) {
  event.preventDefault();

  const stage = document.querySelector(".rabbit-stage");
  const rect = stage.getBoundingClientRect();

  button.setPointerCapture(event.pointerId);

  function move(e) {
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    spot.x = Number(Math.max(0, Math.min(100, x)).toFixed(2));
    spot.y = Number(Math.max(0, Math.min(100, y)).toFixed(2));

    button.style.left = `${spot.x}%`;
    button.style.top = `${spot.y}%`;

    updateEditorOutput();
  }

  function stop() {
    button.releasePointerCapture(event.pointerId);
    button.removeEventListener("pointermove", move);
    button.removeEventListener("pointerup", stop);
    button.removeEventListener("pointercancel", stop);
  }

  button.addEventListener("pointermove", move);
  button.addEventListener("pointerup", stop);
  button.addEventListener("pointercancel", stop);
}

function createEditorPanel() {
  const panel = document.createElement("div");
  panel.className = "rabbit-editor-panel";

  panel.innerHTML = `
    <strong>Rabbit Hole Hotspot Editor</strong>
    <p>Drag the circles. Copy the updated array when done.</p>
    <textarea id="rabbitEditorOutput" readonly></textarea>
    <button id="copyRabbitHotspots" type="button">COPY HOTSPOT ARRAY</button>
  `;

  document.body.appendChild(panel);

  document.getElementById("copyRabbitHotspots").addEventListener("click", async () => {
    updateEditorOutput();

    const output = document.getElementById("rabbitEditorOutput").value;

    try {
      await navigator.clipboard.writeText(output);
      document.getElementById("copyRabbitHotspots").textContent = "COPIED!";
      setTimeout(() => {
        document.getElementById("copyRabbitHotspots").textContent = "COPY HOTSPOT ARRAY";
      }, 1200);
    } catch {
      alert("Could not auto-copy. Select the text and copy manually.");
    }
  });
}

function updateEditorOutput() {
  const output = document.getElementById("rabbitEditorOutput");
  if (!output) return;

  output.value = `const rabbitHotspots = ${JSON.stringify(rabbitHotspots, null, 2)};`;
}

renderHotspots();
updateEditorOutput();
