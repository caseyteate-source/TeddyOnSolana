/* ======================================================
   $TEDDY PAGE HOTSPOTS + SCREEN OVERLAY EDITOR

   Normal:
   teddy.html

   Editor:
   teddy.html?edit=1

   Controls:
   - circle links
   - arcade gameplay screen overlay
   - TV video screen overlay
   - screen bend/warp corners
   - editor panel location
====================================================== */

const teddyEditMode = new URLSearchParams(window.location.search).has("edit");

const teddyHotspots = [
  {
    id: "teddy-dex",
    label: "$TEDDY Dex",
    title: "$TEDDY",
    url: "https://dexscreener.com/solana/8kjewtuq1c1699naup7watzfgods3yfnadbq46fdpump",
    sameTab: false,
    x: 18.5,
    y: 25.1,
    size: 310,
    kind: "circle"
  },
  {
    id: "arcade",
    label: "Arcade Play",
    title: "Arcade Play",
    url: "index.html",
    sameTab: true,
    x: 13.0,
    y: 84.4,
    size: 92,
    kind: "circle"
  },
  {
    id: "kitty",
    label: "Kitty Files",
    title: "Kitty Files",
    url: "kitty.html",
    sameTab: true,
    x: 30.5,
    y: 84.4,
    size: 92,
    kind: "circle"
  },
  {
    id: "white-rabbit",
    label: "Rabbit Hole",
    title: "Follow the White Rabbit",
    url: "hq.html",
    sameTab: true,
    x: 48.0,
    y: 83.7,
    size: 96,
    kind: "circle"
  },
  {
    id: "emoji",
    label: "Emoji Timeline",
    title: "Emoji Timeline",
    url: "emoji.html",
    sameTab: true,
    x: 66.0,
    y: 83.9,
    size: 92,
    kind: "circle"
  },
  {
    id: "gmebay",
    label: "GMEBAY",
    title: "GMEBAY",
    url: "gmebay.html",
    sameTab: true,
    x: 84.0,
    y: 83.2,
    size: 98,
    kind: "circle"
  },
  {
    id: "secret-tv-switch",
    label: "Secret TV Switch",
    title: "",
    url: "#",
    sameTab: true,
    x: 95.4,
    y: 11.8,
    size: 42,
    kind: "secret",
    action: "switch-tv-easter-egg"
  }
];

const screenOverlays = [
  {
    id: "arcade-gameplay",
    label: "Arcade Gameplay",
    elementId: "arcadeScreenAnim",
    x: 27.95,
    y: 41.65,
    w: 16.3,
    h: 18.3,
    rotate: -1.25,
    skewX: -1.25,
    skewY: 0,
    opacity: 0.93,
    clipCorners: {
      tl: { x: 4, y: 4 },
      tr: { x: 97, y: 3 },
      br: { x: 96, y: 96 },
      bl: { x: 5, y: 97 }
    }
  },
  {
    id: "tv-screen",
    label: "TV Video Screen",
    elementId: "tvScreenAnim",
    x: 85.9,
    y: 53.25,
    w: 10.0,
    h: 11.3,
    rotate: -1.0,
    skewX: 0,
    skewY: 0,
    opacity: 0.86,
    clipCorners: {
      tl: { x: 5, y: 5 },
      tr: { x: 96, y: 3 },
      br: { x: 96, y: 96 },
      bl: { x: 5, y: 97 }
    }
  }
];

const teddyHotspotRoot = document.getElementById("teddyHotspotRoot");
const screenHandleRoot = document.getElementById("screenHandleRoot");

let selectedType = null;
let selectedHotspot = null;
let selectedScreen = null;

if (teddyEditMode) {
  document.body.classList.add("teddy-edit-mode");
}

function renderTeddyHotspots() {
  if (!teddyHotspotRoot) return;

  teddyHotspotRoot.innerHTML = "";

  teddyHotspots.forEach((spot) => {
    const link = document.createElement("a");

    link.className = `teddy-hotspot ${spot.kind === "secret" ? "secret-hotspot" : ""}`;
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

    if (!teddyEditMode && spot.action === "switch-tv-easter-egg") {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        if (typeof window.switchTeddyTvVideo === "function") {
          window.switchTeddyTvVideo();
        }
      });
    }

    if (teddyEditMode) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
      });

      link.addEventListener("pointerdown", (event) => {
        selectTeddyItem("hotspot", spot.id);
        startHotspotDrag(event, spot, link);
      });
    }

    teddyHotspotRoot.appendChild(link);
  });

  applyAllScreenOverlays();
  updateEditorOutput();
}

function applyAllScreenOverlays() {
  screenOverlays.forEach((overlay) => {
    applyScreenOverlay(overlay);
  });

  drawScreenCornerHandles();
}

function getClipPath(overlay) {
  if (!overlay.clipCorners) return "";

  const c = overlay.clipCorners;
  return `polygon(${c.tl.x}% ${c.tl.y}%, ${c.tr.x}% ${c.tr.y}%, ${c.br.x}% ${c.br.y}%, ${c.bl.x}% ${c.bl.y}%)`;
}

function applyScreenOverlay(overlay) {
  const el = document.getElementById(overlay.elementId);
  if (!el) return;

  el.style.left = overlay.x + "%";
  el.style.top = overlay.y + "%";
  el.style.width = overlay.w + "%";
  el.style.height = overlay.h + "%";
  el.style.opacity = overlay.opacity;
  el.style.transform = `rotate(${overlay.rotate}deg) skewX(${overlay.skewX}deg) skewY(${overlay.skewY}deg)`;
  el.style.clipPath = getClipPath(overlay);

  if (teddyEditMode && !el.dataset.editorReady) {
    el.dataset.editorReady = "true";

    el.addEventListener("pointerdown", (event) => {
      startScreenDrag(event, overlay, el);
    });
  }
}

function selectTeddyItem(type, id) {
  selectedType = type;

  document.querySelectorAll(".teddy-hotspot").forEach((link) => {
    link.classList.remove("selected");
  });

  document.querySelectorAll(".screen-overlay").forEach((el) => {
    el.classList.remove("selected-screen");
  });

  if (type === "hotspot") {
    selectedHotspot = teddyHotspots.find((spot) => spot.id === id);
    selectedScreen = null;

    const selectedLink = document.querySelector(`.teddy-hotspot[data-id="${id}"]`);
    if (selectedLink) selectedLink.classList.add("selected");

    const selectedName = document.getElementById("teddySelectedItem");
    if (selectedName && selectedHotspot) {
      selectedName.textContent = `Selected: ${selectedHotspot.label}`;
    }

    const select = document.getElementById("teddyItemSelect");
    if (select) select.value = id;
  }

  if (type === "screen") {
    selectedScreen = screenOverlays.find((screen) => screen.id === id);
    selectedHotspot = null;

    const el = selectedScreen ? document.getElementById(selectedScreen.elementId) : null;
    if (el) el.classList.add("selected-screen");

    const selectedName = document.getElementById("teddySelectedItem");
    if (selectedName && selectedScreen) {
      selectedName.textContent = `Selected: ${selectedScreen.label}`;
    }

    const select = document.getElementById("teddyItemSelect");
    if (select) select.value = id;
  }

  drawScreenCornerHandles();
  updateEditorOutput();
}

function startHotspotDrag(event, spot, element) {
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

    updateEditorOutput();
  }

  function stopSpot() {
    try {
      element.releasePointerCapture(event.pointerId);
    } catch {}

    element.removeEventListener("pointermove", moveSpot);
    element.removeEventListener("pointerup", stopSpot);
    element.removeEventListener("pointercancel", stopSpot);

    updateEditorOutput();
  }

  element.addEventListener("pointermove", moveSpot);
  element.addEventListener("pointerup", stopSpot);
  element.addEventListener("pointercancel", stopSpot);
}

function startScreenDrag(event, overlay, element) {
  if (!teddyEditMode) return;

  event.preventDefault();
  event.stopPropagation();

  selectTeddyItem("screen", overlay.id);

  element.setPointerCapture(event.pointerId);

  const stage = document.getElementById("teddyStage");
  const rect = stage.getBoundingClientRect();

  const startX = event.clientX;
  const startY = event.clientY;
  const startOverlayX = overlay.x;
  const startOverlayY = overlay.y;

  function moveScreen(e) {
    const dx = ((e.clientX - startX) / rect.width) * 100;
    const dy = ((e.clientY - startY) / rect.height) * 100;

    overlay.x = Number((startOverlayX + dx).toFixed(2));
    overlay.y = Number((startOverlayY + dy).toFixed(2));

    applyScreenOverlay(overlay);
    drawScreenCornerHandles();
    updateEditorOutput();
  }

  function stopScreen() {
    try {
      element.releasePointerCapture(event.pointerId);
    } catch {}

    element.removeEventListener("pointermove", moveScreen);
    element.removeEventListener("pointerup", stopScreen);
    element.removeEventListener("pointercancel", stopScreen);

    updateEditorOutput();
  }

  element.addEventListener("pointermove", moveScreen);
  element.addEventListener("pointerup", stopScreen);
  element.addEventListener("pointercancel", stopScreen);
}

function drawScreenCornerHandles() {
  if (!screenHandleRoot) return;

  screenHandleRoot.innerHTML = "";

  if (!teddyEditMode || selectedType !== "screen" || !selectedScreen || !selectedScreen.clipCorners) return;

  Object.entries(selectedScreen.clipCorners).forEach(([cornerKey, point]) => {
    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "screen-corner-handle";
    handle.dataset.corner = cornerKey;

    positionScreenCornerHandle(handle, selectedScreen, point);

    handle.addEventListener("pointerdown", (event) => {
      startScreenCornerDrag(event, selectedScreen, cornerKey);
    });

    screenHandleRoot.appendChild(handle);
  });
}

function positionScreenCornerHandle(handle, overlay, point) {
  const x = overlay.x + (overlay.w * point.x) / 100;
  const y = overlay.y + (overlay.h * point.y) / 100;

  handle.style.left = x + "%";
  handle.style.top = y + "%";
}

function startScreenCornerDrag(event, overlay, cornerKey) {
  event.preventDefault();
  event.stopPropagation();

  const stage = document.getElementById("teddyStage");
  const rect = stage.getBoundingClientRect();

  function moveCorner(e) {
    const stageX = ((e.clientX - rect.left) / rect.width) * 100;
    const stageY = ((e.clientY - rect.top) / rect.height) * 100;

    const localX = ((stageX - overlay.x) / overlay.w) * 100;
    const localY = ((stageY - overlay.y) / overlay.h) * 100;

    overlay.clipCorners[cornerKey].x = Number(clamp(localX, 0, 100).toFixed(2));
    overlay.clipCorners[cornerKey].y = Number(clamp(localY, 0, 100).toFixed(2));

    applyScreenOverlay(overlay);
    drawScreenCornerHandles();
    updateEditorOutput();
  }

  function stopCorner() {
    window.removeEventListener("pointermove", moveCorner);
    window.removeEventListener("pointerup", stopCorner);
    window.removeEventListener("pointercancel", stopCorner);
    updateEditorOutput();
  }

  window.addEventListener("pointermove", moveCorner);
  window.addEventListener("pointerup", stopCorner);
  window.addEventListener("pointercancel", stopCorner);
}

function createEditor() {
  if (!teddyEditMode) return;

  const editor = document.createElement("div");
  editor.className = "teddy-editor";

  const options = [
    ...screenOverlays.map((screen) => `<option value="${screen.id}" data-type="screen">${screen.label}</option>`),
    ...teddyHotspots.map((spot) => `<option value="${spot.id}" data-type="hotspot">${spot.label}</option>`)
  ].join("");

  editor.innerHTML = `
    <div id="teddyEditorDragHandle" class="editor-drag-handle">DRAG THIS EDIT BOX</div>

    <strong>$TEDDY Page Editor</strong>
    <p>Select an item. Drag screens or circles on the image. For screens, use the blue corner dots to bend the shape.</p>

    <select id="teddyItemSelect">
      <option value="">Choose item...</option>
      ${options}
    </select>

    <p id="teddySelectedItem">Selected: none</p>

    <div class="editor-buttons">
      <button data-action="left">←</button>
      <button data-action="up">↑</button>
      <button data-action="down">↓</button>
      <button data-action="right">→</button>

      <button data-action="smaller" class="blue">Size -</button>
      <button data-action="bigger" class="blue">Size +</button>
      <button data-action="wide" class="blue">Wide +</button>
      <button data-action="tall" class="blue">Tall +</button>

      <button data-action="rot-minus" class="yellow">R-</button>
      <button data-action="rot-plus" class="yellow">R+</button>
      <button data-action="sx-minus" class="yellow">SX-</button>
      <button data-action="sx-plus" class="yellow">SX+</button>

      <button data-action="sy-minus" class="yellow">SY-</button>
      <button data-action="sy-plus" class="yellow">SY+</button>
      <button data-action="op-minus" class="yellow">OP-</button>
      <button data-action="op-plus" class="yellow">OP+</button>
    </div>

    <button id="copyTeddySettings" class="copy" type="button">COPY SETTINGS</button>
    <textarea id="teddyEditorOutput" readonly></textarea>
  `;

  document.body.appendChild(editor);

  restoreEditorPosition(editor);
  makeEditorMoveable(editor);

  document.getElementById("teddyItemSelect").addEventListener("change", (event) => {
    const value = event.target.value;

    if (!value) return;

    if (screenOverlays.some((screen) => screen.id === value)) {
      selectTeddyItem("screen", value);
      return;
    }

    selectTeddyItem("hotspot", value);
  });

  editor.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      adjustSelectedItem(button.dataset.action);
    });
  });

  document.getElementById("copyTeddySettings").addEventListener("click", async () => {
    updateEditorOutput();

    const output = document.getElementById("teddyEditorOutput");

    output.focus();
    output.select();
    output.setSelectionRange(0, output.value.length);

    try {
      await navigator.clipboard.writeText(output.value);
      document.getElementById("copyTeddySettings").textContent = "COPIED!";

      setTimeout(() => {
        document.getElementById("copyTeddySettings").textContent = "COPY SETTINGS";
      }, 1200);
    } catch {
      alert("The code is selected. Press Command+C or Ctrl+C to copy it.");
    }
  });

  setTimeout(() => {
    selectTeddyItem("screen", "tv-screen");
  }, 200);
}

function restoreEditorPosition(editor) {
  const saved = localStorage.getItem("teddyPageEditorPosition");
  if (!saved) return;

  try {
    const pos = JSON.parse(saved);

    if (typeof pos.left === "number" && typeof pos.top === "number") {
      editor.style.left = pos.left + "px";
      editor.style.top = pos.top + "px";
      editor.style.right = "auto";
      editor.style.bottom = "auto";
    }
  } catch {}
}

function makeEditorMoveable(editor) {
  const handle = document.getElementById("teddyEditorDragHandle");
  if (!handle) return;

  handle.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    editor.classList.add("is-dragging");

    const rect = editor.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = rect.left;
    const startTop = rect.top;

    editor.style.left = startLeft + "px";
    editor.style.top = startTop + "px";
    editor.style.right = "auto";
    editor.style.bottom = "auto";

    function moveEditor(e) {
      const newLeft = startLeft + (e.clientX - startX);
      const newTop = startTop + (e.clientY - startY);

      const maxLeft = window.innerWidth - editor.offsetWidth - 8;
      const maxTop = window.innerHeight - editor.offsetHeight - 8;

      const clampedLeft = clamp(newLeft, 8, Math.max(8, maxLeft));
      const clampedTop = clamp(newTop, 8, Math.max(8, maxTop));

      editor.style.left = clampedLeft + "px";
      editor.style.top = clampedTop + "px";

      localStorage.setItem(
        "teddyPageEditorPosition",
        JSON.stringify({ left: clampedLeft, top: clampedTop })
      );
    }

    function stopEditor() {
      editor.classList.remove("is-dragging");
      window.removeEventListener("pointermove", moveEditor);
      window.removeEventListener("pointerup", stopEditor);
      window.removeEventListener("pointercancel", stopEditor);
    }

    window.addEventListener("pointermove", moveEditor);
    window.addEventListener("pointerup", stopEditor);
    window.addEventListener("pointercancel", stopEditor);
  });
}

function adjustSelectedItem(action) {
  if (selectedType === "screen" && selectedScreen) {
    adjustScreenOverlay(action);
    return;
  }

  if (selectedType === "hotspot" && selectedHotspot) {
    adjustHotspot(action);
  }
}

function adjustHotspot(action) {
  if (!selectedHotspot) return;

  if (action === "left") selectedHotspot.x = Number((selectedHotspot.x - 0.25).toFixed(2));
  if (action === "right") selectedHotspot.x = Number((selectedHotspot.x + 0.25).toFixed(2));
  if (action === "up") selectedHotspot.y = Number((selectedHotspot.y - 0.25).toFixed(2));
  if (action === "down") selectedHotspot.y = Number((selectedHotspot.y + 0.25).toFixed(2));

  if (action === "smaller") selectedHotspot.size = Math.max(20, selectedHotspot.size - 4);
  if (action === "bigger") selectedHotspot.size = selectedHotspot.size + 4;
  if (action === "wide") selectedHotspot.size = selectedHotspot.size + 6;
  if (action === "tall") selectedHotspot.size = selectedHotspot.size + 6;

  const link = document.querySelector(`.teddy-hotspot[data-id="${selectedHotspot.id}"]`);

  if (link) {
    link.style.left = selectedHotspot.x + "%";
    link.style.top = selectedHotspot.y + "%";
    link.style.width = selectedHotspot.size + "px";
    link.style.height = selectedHotspot.size + "px";
  }

  updateEditorOutput();
}

function adjustScreenOverlay(action) {
  if (!selectedScreen) return;

  if (action === "left") selectedScreen.x = Number((selectedScreen.x - 0.25).toFixed(2));
  if (action === "right") selectedScreen.x = Number((selectedScreen.x + 0.25).toFixed(2));
  if (action === "up") selectedScreen.y = Number((selectedScreen.y - 0.25).toFixed(2));
  if (action === "down") selectedScreen.y = Number((selectedScreen.y + 0.25).toFixed(2));

  if (action === "smaller") {
    selectedScreen.w = Number((selectedScreen.w - 0.25).toFixed(2));
    selectedScreen.h = Number((selectedScreen.h - 0.25).toFixed(2));
  }

  if (action === "bigger") {
    selectedScreen.w = Number((selectedScreen.w + 0.25).toFixed(2));
    selectedScreen.h = Number((selectedScreen.h + 0.25).toFixed(2));
  }

  if (action === "wide") selectedScreen.w = Number((selectedScreen.w + 0.25).toFixed(2));
  if (action === "tall") selectedScreen.h = Number((selectedScreen.h + 0.25).toFixed(2));

  if (action === "rot-minus") selectedScreen.rotate = Number((selectedScreen.rotate - 0.25).toFixed(2));
  if (action === "rot-plus") selectedScreen.rotate = Number((selectedScreen.rotate + 0.25).toFixed(2));

  if (action === "sx-minus") selectedScreen.skewX = Number((selectedScreen.skewX - 0.25).toFixed(2));
  if (action === "sx-plus") selectedScreen.skewX = Number((selectedScreen.skewX + 0.25).toFixed(2));

  if (action === "sy-minus") selectedScreen.skewY = Number((selectedScreen.skewY - 0.25).toFixed(2));
  if (action === "sy-plus") selectedScreen.skewY = Number((selectedScreen.skewY + 0.25).toFixed(2));

  if (action === "op-minus") selectedScreen.opacity = Math.max(0, Number((selectedScreen.opacity - 0.05).toFixed(2)));
  if (action === "op-plus") selectedScreen.opacity = Math.min(1, Number((selectedScreen.opacity + 0.05).toFixed(2)));

  selectedScreen.w = Math.max(1, selectedScreen.w);
  selectedScreen.h = Math.max(1, selectedScreen.h);

  applyScreenOverlay(selectedScreen);
  drawScreenCornerHandles();
  updateEditorOutput();
}

function updateEditorOutput() {
  const output = document.getElementById("teddyEditorOutput");
  if (!output) return;

  output.value =
`const teddyHotspots = ${JSON.stringify(teddyHotspots, null, 2)};

const screenOverlays = ${JSON.stringify(screenOverlays, null, 2)};`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

renderTeddyHotspots();
createEditor();
