/* ======================================================
   $TEDDY PAGE HOTSPOTS + ARCADE OVERLAY EDITOR

   Normal page:
   teddy.html

   Editor:
   teddy.html?edit=1

   This editor controls:
   - circle link locations
   - arcade gameplay overlay location/size/tilt
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
    size: 300,
    kind: "circle"
  },
  {
    id: "arcade",
    label: "Arcade",
    title: "Arcade",
    url: "index.html",
    sameTab: true,
    x: 44.35,
    y: 64.1,
    size: 88,
    kind: "circle"
  },
  {
    id: "white-rabbit",
    label: "White Rabbit",
    title: "Follow the White Rabbit",
    url: "hq.html",
    sameTab: true,
    x: 89.7,
    y: 82.4,
    size: 66,
    kind: "bunny"
  },
  {
    id: "gmebay",
    label: "GMEBAY",
    title: "GMEBAY",
    url: "gmebay.html",
    sameTab: true,
    x: 75.25,
    y: 42.85,
    size: 82,
    kind: "circle"
  }
];

const arcadeGameplayOverlay = {
  id: "arcade-gameplay",
  label: "Arcade Gameplay",
  x: 42.58,
  y: 56.35,
  w: 7.22,
  h: 8.38,
  rotate: -2,
  skewX: -1,
  skewY: 0,
  opacity: 0.92
};

const teddyHotspotRoot = document.getElementById("teddyHotspotRoot");
let selectedTeddyItemType = null;
let selectedTeddyHotspot = null;

if (teddyEditMode) {
  document.body.classList.add("teddy-edit-mode");
}

function renderTeddyHotspots() {
  if (!teddyHotspotRoot) return;

  teddyHotspotRoot.innerHTML = "";

  teddyHotspots.forEach((spot) => {
    const link = document.createElement("a");

    link.className = `teddy-hotspot ${spot.kind === "bunny" ? "bunny-hotspot" : ""}`;
    link.href = spot.url;
    link.title = spot.title;
    link.dataset.id = spot.id;
    link.dataset.label = spot.label;
    link.style.left = spot.x + "%";
    link.style.top = spot.y + "%";
    link.style.width = spot.size + "px";
    link.style.height = spot.size + "px";

    if (spot.kind === "bunny") {
      link.innerHTML = getPixelBunnySvg();
    }

    if (!spot.sameTab) {
      link.target = "_blank";
      link.rel = "noopener";
    }

    if (teddyEditMode) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
      });

      link.addEventListener("pointerdown", (event) => {
        selectTeddyItem("hotspot", spot.id);
        startTeddyHotspotDrag(event, spot, link);
      });
    }

    teddyHotspotRoot.appendChild(link);
  });

  applyArcadeGameplayOverlay();
  updateTeddyEditorOutput();
}

function getPixelBunnySvg() {
  return `
    <svg class="pixel-bunny-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="32" height="32" fill="transparent"/>
      <rect x="9" y="2" width="4" height="11" fill="#ffffff"/>
      <rect x="19" y="2" width="4" height="11" fill="#ffffff"/>
      <rect x="8" y="12" width="16" height="13" fill="#ffffff"/>
      <rect x="6" y="16" width="20" height="8" fill="#ffffff"/>
      <rect x="10" y="14" width="3" height="3" fill="#00f5ff"/>
      <rect x="19" y="14" width="3" height="3" fill="#00f5ff"/>
      <rect x="15" y="18" width="3" height="3" fill="#ff2aa3"/>
      <rect x="12" y="23" width="8" height="3" fill="#ffffff"/>
      <rect x="5" y="25" width="8" height="4" fill="#ffffff"/>
      <rect x="19" y="25" width="8" height="4" fill="#ffffff"/>
      <rect x="9" y="4" width="2" height="7" fill="#d7f6ff"/>
      <rect x="21" y="4" width="2" height="7" fill="#d7f6ff"/>
      <rect x="7" y="28" width="18" height="2" fill="#00f5ff" opacity=".55"/>
    </svg>
  `;
}

function applyArcadeGameplayOverlay() {
  const arcade = document.getElementById("arcadeScreenAnim");
  if (!arcade) return;

  arcade.style.left = arcadeGameplayOverlay.x + "%";
  arcade.style.top = arcadeGameplayOverlay.y + "%";
  arcade.style.width = arcadeGameplayOverlay.w + "%";
  arcade.style.height = arcadeGameplayOverlay.h + "%";
  arcade.style.opacity = arcadeGameplayOverlay.opacity;
  arcade.style.transform = `rotate(${arcadeGameplayOverlay.rotate}deg) skewX(${arcadeGameplayOverlay.skewX}deg) skewY(${arcadeGameplayOverlay.skewY}deg)`;

  if (teddyEditMode) {
    arcade.addEventListener("pointerdown", startArcadeOverlayDrag);
  }
}

function selectTeddyItem(type, id) {
  selectedTeddyItemType = type;

  document.querySelectorAll(".teddy-hotspot").forEach((link) => {
    link.classList.remove("selected");
  });

  document.getElementById("arcadeScreenAnim")?.classList.remove("selected-arcade");

  if (type === "hotspot") {
    selectedTeddyHotspot = teddyHotspots.find((spot) => spot.id === id);

    const selectedLink = document.querySelector(`.teddy-hotspot[data-id="${id}"]`);
    if (selectedLink) selectedLink.classList.add("selected");

    const selectedName = document.getElementById("teddySelectedHotspot");
    if (selectedName && selectedTeddyHotspot) {
      selectedName.textContent = `Selected: ${selectedTeddyHotspot.label}`;
    }

    const select = document.getElementById("teddyHotspotSelect");
    if (select) select.value = id;
  }

  if (type === "arcade") {
    selectedTeddyHotspot = null;

    document.getElementById("arcadeScreenAnim")?.classList.add("selected-arcade");

    const selectedName = document.getElementById("teddySelectedHotspot");
    if (selectedName) {
      selectedName.textContent = "Selected: Arcade Gameplay";
    }

    const select = document.getElementById("teddyHotspotSelect");
    if (select) select.value = "arcade-gameplay";
  }

  updateTeddyEditorOutput();
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

    updateTeddyEditorOutput();
  }

  function stopSpot() {
    try {
      element.releasePointerCapture(event.pointerId);
    } catch {}

    element.removeEventListener("pointermove", moveSpot);
    element.removeEventListener("pointerup", stopSpot);
    element.removeEventListener("pointercancel", stopSpot);

    updateTeddyEditorOutput();
  }

  element.addEventListener("pointermove", moveSpot);
  element.addEventListener("pointerup", stopSpot);
  element.addEventListener("pointercancel", stopSpot);
}

function startArcadeOverlayDrag(event) {
  if (!teddyEditMode) return;

  event.preventDefault();
  event.stopPropagation();

  selectTeddyItem("arcade", "arcade-gameplay");

  const arcade = document.getElementById("arcadeScreenAnim");
  arcade.setPointerCapture(event.pointerId);

  const stage = document.getElementById("teddyStage");
  const rect = stage.getBoundingClientRect();

  const startX = event.clientX;
  const startY = event.clientY;
  const startOverlayX = arcadeGameplayOverlay.x;
  const startOverlayY = arcadeGameplayOverlay.y;

  function moveArcade(e) {
    const dx = ((e.clientX - startX) / rect.width) * 100;
    const dy = ((e.clientY - startY) / rect.height) * 100;

    arcadeGameplayOverlay.x = Number((startOverlayX + dx).toFixed(2));
    arcadeGameplayOverlay.y = Number((startOverlayY + dy).toFixed(2));

    applyArcadeGameplayOverlay();
    updateTeddyEditorOutput();
  }

  function stopArcade() {
    try {
      arcade.releasePointerCapture(event.pointerId);
    } catch {}

    arcade.removeEventListener("pointermove", moveArcade);
    arcade.removeEventListener("pointerup", stopArcade);
    arcade.removeEventListener("pointercancel", stopArcade);

    updateTeddyEditorOutput();
  }

  arcade.addEventListener("pointermove", moveArcade);
  arcade.addEventListener("pointerup", stopArcade);
  arcade.addEventListener("pointercancel", stopArcade);
}

function createTeddyHotspotEditor() {
  if (!teddyEditMode) return;

  const editor = document.createElement("div");
  editor.className = "teddy-hotspot-editor";

  const options = [
    `<option value="arcade-gameplay">Arcade Gameplay</option>`,
    ...teddyHotspots.map((spot) => `<option value="${spot.id}">${spot.label}</option>`)
  ].join("");

  editor.innerHTML = `
    <strong>$TEDDY Link + Arcade Editor</strong>
    <p>Select an item. Drag it on the image, or use buttons. Copy the full settings when done.</p>

    <select id="teddyHotspotSelect">
      <option value="">Choose item...</option>
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

      <button data-action="rot-minus" class="yellow">R-</button>
      <button data-action="rot-plus" class="yellow">R+</button>
      <button data-action="sx-minus" class="yellow">SX-</button>
      <button data-action="sx-plus" class="yellow">SX+</button>
    </div>

    <button id="copyTeddyHotspots" class="copy" type="button">COPY SETTINGS</button>
    <textarea id="teddyHotspotOutput" readonly></textarea>
  `;

  document.body.appendChild(editor);

  document.getElementById("teddyHotspotSelect").addEventListener("change", (event) => {
    if (event.target.value === "arcade-gameplay") {
      selectTeddyItem("arcade", "arcade-gameplay");
      return;
    }

    if (event.target.value) {
      selectTeddyItem("hotspot", event.target.value);
    }
  });

  editor.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      adjustSelectedTeddyItem(button.dataset.action);
    });
  });

  document.getElementById("copyTeddyHotspots").addEventListener("click", async () => {
    updateTeddyEditorOutput();

    const output = document.getElementById("teddyHotspotOutput");

    output.focus();
    output.select();
    output.setSelectionRange(0, output.value.length);

    try {
      await navigator.clipboard.writeText(output.value);
      document.getElementById("copyTeddyHotspots").textContent = "COPIED!";

      setTimeout(() => {
        document.getElementById("copyTeddyHotspots").textContent = "COPY SETTINGS";
      }, 1200);
    } catch {
      alert("The code is selected. Press Command+C or Ctrl+C to copy it.");
    }
  });

  setTimeout(() => {
    selectTeddyItem("arcade", "arcade-gameplay");
  }, 200);
}

function adjustSelectedTeddyItem(action) {
  if (selectedTeddyItemType === "arcade") {
    adjustArcadeOverlay(action);
    return;
  }

  if (selectedTeddyItemType === "hotspot" && selectedTeddyHotspot) {
    adjustSelectedTeddyHotspot(action);
  }
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

  updateTeddyEditorOutput();
}

function adjustArcadeOverlay(action) {
  if (action === "left") arcadeGameplayOverlay.x = Number((arcadeGameplayOverlay.x - 0.25).toFixed(2));
  if (action === "right") arcadeGameplayOverlay.x = Number((arcadeGameplayOverlay.x + 0.25).toFixed(2));
  if (action === "up") arcadeGameplayOverlay.y = Number((arcadeGameplayOverlay.y - 0.25).toFixed(2));
  if (action === "down") arcadeGameplayOverlay.y = Number((arcadeGameplayOverlay.y + 0.25).toFixed(2));

  if (action === "smaller") {
    arcadeGameplayOverlay.w = Number((arcadeGameplayOverlay.w - 0.25).toFixed(2));
    arcadeGameplayOverlay.h = Number((arcadeGameplayOverlay.h - 0.25).toFixed(2));
  }

  if (action === "bigger") {
    arcadeGameplayOverlay.w = Number((arcadeGameplayOverlay.w + 0.25).toFixed(2));
    arcadeGameplayOverlay.h = Number((arcadeGameplayOverlay.h + 0.25).toFixed(2));
  }

  if (action === "rot-minus") arcadeGameplayOverlay.rotate = Number((arcadeGameplayOverlay.rotate - 0.25).toFixed(2));
  if (action === "rot-plus") arcadeGameplayOverlay.rotate = Number((arcadeGameplayOverlay.rotate + 0.25).toFixed(2));

  if (action === "sx-minus") arcadeGameplayOverlay.skewX = Number((arcadeGameplayOverlay.skewX - 0.25).toFixed(2));
  if (action === "sx-plus") arcadeGameplayOverlay.skewX = Number((arcadeGameplayOverlay.skewX + 0.25).toFixed(2));

  arcadeGameplayOverlay.w = Math.max(1, arcadeGameplayOverlay.w);
  arcadeGameplayOverlay.h = Math.max(1, arcadeGameplayOverlay.h);

  applyArcadeGameplayOverlay();
  updateTeddyEditorOutput();
}

function updateTeddyEditorOutput() {
  const output = document.getElementById("teddyHotspotOutput");
  if (!output) return;

  output.value =
`const teddyHotspots = ${JSON.stringify(teddyHotspots, null, 2)};

const arcadeGameplayOverlay = ${JSON.stringify(arcadeGameplayOverlay, null, 2)};`;
}

renderTeddyHotspots();
createTeddyHotspotEditor();
