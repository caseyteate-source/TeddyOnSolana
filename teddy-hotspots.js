/* ======================================================
   $TEDDY PAGE CIRCLE HOTSPOTS

   Normal page:
   teddy.html

   Hotspot editor:
   teddy.html?edit=1

   Move circles, then copy the full array from the editor.
====================================================== */

const teddyEditMode = new URLSearchParams(window.location.search).has("edit");

const teddyHotspots = [
  {
    id: "teddy-dex",
    label: "$TEDDY Dex",
    title: "$TEDDY",
    url: "https://dexscreener.com/solana/8kjewtuq1c1699naup7watzfgods3yfnadbq46fdpump",
    sameTab: false,
    x: 20.4,
    y: 27.8,
    size: 300
  },
  {
    id: "arcade",
    label: "Arcade",
    title: "Arcade",
    url: "index.html",
    sameTab: true,
    x: 44.35,
    y: 64.1,
    size: 88
  },
  {
    id: "emoji",
    label: "Emoji Timeline",
    title: "Emoji Timeline",
    url: "emoji.html",
    sameTab: true,
    x: 83.25,
    y: 52.1,
    size: 62
  },
  {
    id: "kitty",
    label: "Kitty Files",
    title: "Kitty Files",
    url: "kitty.html",
    sameTab: true,
    x: 90.55,
    y: 17.3,
    size: 70
  },
  {
    id: "memory-room",
    label: "Memory Room",
    title: "Memory Room",
    url: "imagination-room.html",
    sameTab: true,
    x: 91.15,
    y: 68.25,
    size: 82
  },
  {
    id: "rabbit-hole",
    label: "Rabbit Hole",
    title: "Rabbit Hole",
    url: "hq.html",
    sameTab: true,
    x: 23.2,
    y: 69.5,
    size: 82
  },
  {
    id: "gmebay",
    label: "GMEBAY",
    title: "GMEBAY",
    url: "gmebay.html",
    sameTab: true,
    x: 75.25,
    y: 42.85,
    size: 82
  }
];

const teddyHotspotRoot = document.getElementById("teddyHotspotRoot");
let selectedTeddyHotspot = null;

if (teddyEditMode) {
  document.body.classList.add("teddy-edit-mode");
}

function renderTeddyHotspots() {
  if (!teddyHotspotRoot) return;

  teddyHotspotRoot.innerHTML = "";

  teddyHotspots.forEach((spot) => {
    const link = document.createElement("a");

    link.className = "teddy-hotspot";
    link.href = spot.url;
    link.title = spot.title;
    link.dataset.id = spot.id;
    link.dataset.label = spot.label;
    link.style.left = spot.x + "%";
    link.style.top = spot.y + "%";
    link.style.width = spot.size + "px";
    link.style.height = spot.size + "px";

    if (!spot.sameTab) {
      link.target = "_blank";
      link.rel = "noopener";
    }

    if (teddyEditMode) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
      });

      link.addEventListener("pointerdown", (event) => {
        selectTeddyHotspot(spot.id);
        startTeddyHotspotDrag(event, spot, link);
      });
    }

    teddyHotspotRoot.appendChild(link);
  });

  updateTeddyHotspotOutput();
}

function selectTeddyHotspot(id) {
  selectedTeddyHotspot = teddyHotspots.find((spot) => spot.id === id);

  document.querySelectorAll(".teddy-hotspot").forEach((link) => {
    link.classList.remove("selected");
  });

  const selectedLink = document.querySelector(`.teddy-hotspot[data-id="${id}"]`);
  if (selectedLink) {
    selectedLink.classList.add("selected");
  }

  const select = document.getElementById("teddyHotspotSelect");
  if (select) {
    select.value = id;
  }

  const selectedName = document.getElementById("teddySelectedHotspot");
  if (selectedName && selectedTeddyHotspot) {
    selectedName.textContent = `Selected: ${selectedTeddyHotspot.label}`;
  }

  updateTeddyHotspotOutput();
}

function startTeddyHotspotDrag(event, spot, element) {
  if (!teddyEditMode) return;

  event.preventDefault();
  event.stopPropagation();

  element.setPointerCapture(event.pointerId);

  const stage = document.getElementById("teddyStage");
  const rect = stage.getBoundingClientRect();

  const startX = event.clientX;
  const startY = event.clientY;
  const startSpotX = spot.x;
  const startSpotY = spot.y;

  function moveSpot(e) {
    const dx = ((e.clientX - startX) / rect.width) * 100;
    const dy = ((e.clientY - startY) / rect.height) * 100;

    spot.x = Number((startSpotX + dx).toFixed(2));
    spot.y = Number((startSpotY + dy).toFixed(2));

    element.style.left = spot.x + "%";
    element.style.top = spot.y + "%";

    updateTeddyHotspotOutput();
  }

  function stopSpot() {
    try {
      element.releasePointerCapture(event.pointerId);
    } catch {}

    element.removeEventListener("pointermove", moveSpot);
    element.removeEventListener("pointerup", stopSpot);
    element.removeEventListener("pointercancel", stopSpot);

    updateTeddyHotspotOutput();
  }

  element.addEventListener("pointermove", moveSpot);
  element.addEventListener("pointerup", stopSpot);
  element.addEventListener("pointercancel", stopSpot);
}

function createTeddyHotspotEditor() {
  if (!teddyEditMode) return;

  const editor = document.createElement("div");
  editor.className = "teddy-hotspot-editor";

  const options = teddyHotspots
    .map((spot) => `<option value="${spot.id}">${spot.label}</option>`)
    .join("");

  editor.innerHTML = `
    <strong>$TEDDY Circle Link Editor</strong>
    <p>Drag a circle to move it. Use size buttons if needed. Copy the full array when done.</p>

    <select id="teddyHotspotSelect">
      <option value="">Choose circle...</option>
      ${options}
    </select>

    <p id="teddySelectedHotspot">Selected: none</p>

    <div class="hotspot-buttons">
      <button data-action="left">←</button>
      <button data-action="up">↑</button>
      <button data-action="down">↓</button>
      <button data-action="right">→</button>

      <button data-action="smaller" class="blue">Size -</button>
      <button data-action="bigger" class="blue">Size +</button>
      <button data-action="tiny" class="blue">Tiny</button>
      <button data-action="large" class="blue">Large</button>
    </div>

    <button id="copyTeddyHotspots" class="copy" type="button">COPY HOTSPOT CODE</button>
    <textarea id="teddyHotspotOutput" readonly></textarea>
  `;

  document.body.appendChild(editor);

  document.getElementById("teddyHotspotSelect").addEventListener("change", (event) => {
    if (event.target.value) {
      selectTeddyHotspot(event.target.value);
    }
  });

  editor.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      adjustSelectedTeddyHotspot(button.dataset.action);
    });
  });

  document.getElementById("copyTeddyHotspots").addEventListener("click", async () => {
    updateTeddyHotspotOutput();

    const output = document.getElementById("teddyHotspotOutput");

    output.focus();
    output.select();
    output.setSelectionRange(0, output.value.length);

    try {
      await navigator.clipboard.writeText(output.value);
      document.getElementById("copyTeddyHotspots").textContent = "COPIED!";

      setTimeout(() => {
        document.getElementById("copyTeddyHotspots").textContent = "COPY HOTSPOT CODE";
      }, 1200);
    } catch {
      alert("The code is selected. Press Command+C or Ctrl+C to copy it.");
    }
  });
}

function adjustSelectedTeddyHotspot(action) {
  if (!selectedTeddyHotspot) return;

  if (action === "left") selectedTeddyHotspot.x = Number((selectedTeddyHotspot.x - 0.25).toFixed(2));
  if (action === "right") selectedTeddyHotspot.x = Number((selectedTeddyHotspot.x + 0.25).toFixed(2));
  if (action === "up") selectedTeddyHotspot.y = Number((selectedTeddyHotspot.y - 0.25).toFixed(2));
  if (action === "down") selectedTeddyHotspot.y = Number((selectedTeddyHotspot.y + 0.25).toFixed(2));

  if (action === "smaller") selectedTeddyHotspot.size = Math.max(20, selectedTeddyHotspot.size - 4);
  if (action === "bigger") selectedTeddyHotspot.size = selectedTeddyHotspot.size + 4;
  if (action === "tiny") selectedTeddyHotspot.size = 42;
  if (action === "large") selectedTeddyHotspot.size = 90;

  const link = document.querySelector(`.teddy-hotspot[data-id="${selectedTeddyHotspot.id}"]`);

  if (link) {
    link.style.left = selectedTeddyHotspot.x + "%";
    link.style.top = selectedTeddyHotspot.y + "%";
    link.style.width = selectedTeddyHotspot.size + "px";
    link.style.height = selectedTeddyHotspot.size + "px";
  }

  updateTeddyHotspotOutput();
}

function updateTeddyHotspotOutput() {
  const output = document.getElementById("teddyHotspotOutput");
  if (!output) return;

  output.value = `const teddyHotspots = ${JSON.stringify(teddyHotspots, null, 2)};`;
}

renderTeddyHotspots();
createTeddyHotspotEditor();
