/* ======================================================
   $TEDDY RABBIT HOLE TV STATIC + FIXED BLINK PLAQUE

   Overlay editor:
   hq.html?overlays=1

   Do not touch rabbit-hole.js.
   Do not touch hq.html.
====================================================== */

const isOverlayEditMode = new URLSearchParams(window.location.search).has("overlays");

/* ======================================================
   TV STATIC SETTINGS
====================================================== */

const rabbitOverlaySettings = [
  {
    id: "tv-static",
    label: "TV Static",
    type: "tv",
    className: "rabbit-overlay tv-static-wrap",
    x: 80.94,
    y: 25.03,
    w: 18.45,
    h: 21.95,
    rotate: -0.55,
    skewX: -1.5,
    skewY: -0.25,
    opacity: 1,
    clipCorners: {
      tl: {
        x: 6.06,
        y: 3.66
      },
      tr: {
        x: 100,
        y: 7.76
      },
      br: {
        x: 99.77,
        y: 96.41
      },
      bl: {
        x: 6.75,
        y: 86.32
      }
    }
  }
];

/* ======================================================
   FIXED BLACK BLINK PLAQUE SETTINGS

   This is fixed to the browser window, not the room image.
   It will not move when the page/image scrolls.
====================================================== */

const fixedBlinkPlaqueSettings = {
  id: "fixed-blink-plaque",
  label: "Fixed Black Blink Box",
  enabled: true,

  /* x and y are viewport percentages */
  x: 80.5,
  y: 57.5,

  /* width and height are pixels */
  w: 86,
  h: 34,

  rotate: 0,
  opacityHigh: 0.92,
  opacityLow: 0.12,
  blinkSpeed: 1.15,

  background: "rgba(0,0,0,.94)",
  borderRadius: 7,
  border: "1px solid rgba(255,0,0,.28)",
  boxShadow: "0 0 14px rgba(255,0,0,.35)",

  /* Keep blank for a plain black blinking box */
  text: ""
};

const overlayRoot = document.getElementById("rabbitOverlayRoot");
let selectedType = null;
let selectedOverlay = null;

if (isOverlayEditMode) {
  document.body.classList.add("overlay-edit-mode");
}

/* ======================================================
   STYLE INJECTION FOR FIXED PLAQUE
====================================================== */

function injectPlaqueStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .fixed-blink-plaque {
      position: fixed;
      z-index: 6800;
      pointer-events: none;
      transform: translate(-50%, -50%) rotate(0deg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ff1717;
      font-family: Arial, sans-serif;
      font-weight: 900;
      letter-spacing: .12em;
      text-shadow:
        0 0 4px rgba(255,0,0,.95),
        0 0 10px rgba(255,0,0,.75);
      animation-name: fixedPlaqueBlink;
      animation-timing-function: steps(1, end);
      animation-iteration-count: infinite;
    }

    @keyframes fixedPlaqueBlink {
      0%, 48% {
        opacity: var(--plaque-opacity-high);
      }

      49%, 100% {
        opacity: var(--plaque-opacity-low);
      }
    }

    .overlay-edit-mode .fixed-blink-plaque {
      pointer-events: auto;
      cursor: move;
      outline: 3px solid #ffea00;
      outline-offset: 2px;
    }

    .overlay-edit-mode .fixed-blink-plaque.selected-fixed-plaque {
      outline: 3px solid #00f5ff;
      box-shadow:
        0 0 18px rgba(0,245,255,.85),
        0 0 28px rgba(255,42,163,.45) !important;
    }

    .fixed-plaque-label {
      display: none;
      position: fixed;
      z-index: 6900;
      transform: translate(-50%, -50%);
      border: 1px solid rgba(255,255,255,.55);
      border-radius: 999px;
      padding: 5px 8px;
      background: rgba(0,0,0,.9);
      color: #ffea00;
      font-family: Arial, sans-serif;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .03em;
      white-space: nowrap;
      pointer-events: auto;
      cursor: pointer;
      box-shadow:
        0 0 10px rgba(255,234,0,.55),
        0 0 18px rgba(0,245,255,.25);
    }

    .overlay-edit-mode .fixed-plaque-label {
      display: block;
    }

    .fixed-plaque-label.selected {
      color: #00f5ff;
      border-color: #00f5ff;
      box-shadow:
        0 0 14px rgba(0,245,255,.9),
        0 0 24px rgba(255,42,163,.35);
    }
  `;

  document.head.appendChild(style);
}

/* ======================================================
   RENDER TV STATIC OVERLAY
====================================================== */

function renderRabbitOverlays() {
  if (!overlayRoot) return;

  overlayRoot.innerHTML = "";

  rabbitOverlaySettings.forEach((overlay) => {
    const el = createOverlayElement(overlay);
    applyOverlayStyle(el, overlay);

    if (isOverlayEditMode) {
      el.addEventListener("pointerdown", (event) => {
        selectThing("overlay", overlay.id);
        startOverlayDrag(event, overlay, el);
      });
    }

    overlayRoot.appendChild(el);
  });

  if (isOverlayEditMode) {
    renderOverlayLabels();
  }

  setupTvStatic();
  updateEditorOutput();
}

function createOverlayElement(overlay) {
  const el = document.createElement("div");
  el.id = overlay.id;
  el.className = overlay.className;

  if (overlay.type === "tv") {
    el.innerHTML = `
      <canvas id="tvStaticCanvas" class="tv-static-canvas"></canvas>
      <div class="tv-static-lines"></div>
      <div class="tv-static-roll"></div>
    `;
  }

  return el;
}

function getClipPath(overlay) {
  if (!overlay.clipCorners) return "";

  const c = overlay.clipCorners;

  return `polygon(${c.tl.x}% ${c.tl.y}%, ${c.tr.x}% ${c.tr.y}%, ${c.br.x}% ${c.br.y}%, ${c.bl.x}% ${c.bl.y}%)`;
}

function applyOverlayStyle(el, overlay) {
  el.style.left = overlay.x + "%";
  el.style.top = overlay.y + "%";
  el.style.width = overlay.w + "%";
  el.style.height = overlay.h + "%";
  el.style.opacity = overlay.opacity;
  el.style.transform = `rotate(${overlay.rotate}deg) skewX(${overlay.skewX}deg) skewY(${overlay.skewY}deg)`;

  const clipPath = getClipPath(overlay);
  el.style.clipPath = clipPath || "";
}

function renderOverlayLabels() {
  document.querySelectorAll(".overlay-floating-label").forEach((label) => label.remove());

  rabbitOverlaySettings.forEach((overlay) => {
    const label = document.createElement("button");
    label.type = "button";
    label.className = "overlay-floating-label";
    label.id = `overlay-label-${overlay.id}`;
    label.textContent = overlay.label;

    label.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      selectThing("overlay", overlay.id);
    });

    overlayRoot.appendChild(label);
    positionOverlayLabel(overlay);
  });
}

function positionOverlayLabel(overlay) {
  const label = document.getElementById(`overlay-label-${overlay.id}`);
  if (!label) return;

  const x = overlay.x + overlay.w / 2;
  const y = Math.max(2.5, overlay.y - 2.8);

  label.style.left = x + "%";
  label.style.top = y + "%";

  if (selectedType === "overlay" && selectedOverlay && selectedOverlay.id === overlay.id) {
    label.classList.add("selected");
  } else {
    label.classList.remove("selected");
  }
}

/* ======================================================
   FIXED BLINKING PLAQUE
====================================================== */

function renderFixedBlinkPlaque() {
  document.getElementById(fixedBlinkPlaqueSettings.id)?.remove();
  document.getElementById(`${fixedBlinkPlaqueSettings.id}-label`)?.remove();

  if (!fixedBlinkPlaqueSettings.enabled) return;

  const plaque = document.createElement("div");
  plaque.id = fixedBlinkPlaqueSettings.id;
  plaque.className = "fixed-blink-plaque";
  plaque.textContent = fixedBlinkPlaqueSettings.text || "";

  applyPlaqueStyle(plaque);

  if (isOverlayEditMode) {
    plaque.addEventListener("pointerdown", (event) => {
      selectThing("plaque", fixedBlinkPlaqueSettings.id);
      startPlaqueDrag(event, plaque);
    });
  }

  document.body.appendChild(plaque);

  if (isOverlayEditMode) {
    const label = document.createElement("button");
    label.type = "button";
    label.id = `${fixedBlinkPlaqueSettings.id}-label`;
    label.className = "fixed-plaque-label";
    label.textContent = fixedBlinkPlaqueSettings.label;

    label.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      selectThing("plaque", fixedBlinkPlaqueSettings.id);
    });

    document.body.appendChild(label);
    positionPlaqueLabel();
  }
}

function applyPlaqueStyle(plaque) {
  plaque.style.left = fixedBlinkPlaqueSettings.x + "vw";
  plaque.style.top = fixedBlinkPlaqueSettings.y + "vh";
  plaque.style.width = fixedBlinkPlaqueSettings.w + "px";
  plaque.style.height = fixedBlinkPlaqueSettings.h + "px";
  plaque.style.background = fixedBlinkPlaqueSettings.background;
  plaque.style.borderRadius = fixedBlinkPlaqueSettings.borderRadius + "px";
  plaque.style.border = fixedBlinkPlaqueSettings.border;
  plaque.style.boxShadow = fixedBlinkPlaqueSettings.boxShadow;
  plaque.style.animationDuration = fixedBlinkPlaqueSettings.blinkSpeed + "s";
  plaque.style.setProperty("--plaque-opacity-high", fixedBlinkPlaqueSettings.opacityHigh);
  plaque.style.setProperty("--plaque-opacity-low", fixedBlinkPlaqueSettings.opacityLow);
  plaque.style.transform = `translate(-50%, -50%) rotate(${fixedBlinkPlaqueSettings.rotate}deg)`;
}

function positionPlaqueLabel() {
  const label = document.getElementById(`${fixedBlinkPlaqueSettings.id}-label`);
  if (!label) return;

  label.style.left = fixedBlinkPlaqueSettings.x + "vw";
  label.style.top = `calc(${fixedBlinkPlaqueSettings.y}vh - 32px)`;

  if (selectedType === "plaque") {
    label.classList.add("selected");
  } else {
    label.classList.remove("selected");
  }
}

function startPlaqueDrag(event, plaque) {
  if (!isOverlayEditMode) return;

  event.preventDefault();
  event.stopPropagation();

  plaque.setPointerCapture(event.pointerId);

  const startX = event.clientX;
  const startY = event.clientY;
  const startPlaqueX = fixedBlinkPlaqueSettings.x;
  const startPlaqueY = fixedBlinkPlaqueSettings.y;

  function movePlaque(e) {
    const dx = ((e.clientX - startX) / window.innerWidth) * 100;
    const dy = ((e.clientY - startY) / window.innerHeight) * 100;

    fixedBlinkPlaqueSettings.x = Number((startPlaqueX + dx).toFixed(2));
    fixedBlinkPlaqueSettings.y = Number((startPlaqueY + dy).toFixed(2));

    applyPlaqueStyle(plaque);
    positionPlaqueLabel();
    updateEditorOutput();
  }

  function stopPlaque() {
    try {
      plaque.releasePointerCapture(event.pointerId);
    } catch {}

    plaque.removeEventListener("pointermove", movePlaque);
    plaque.removeEventListener("pointerup", stopPlaque);
    plaque.removeEventListener("pointercancel", stopPlaque);

    updateEditorOutput();
  }

  plaque.addEventListener("pointermove", movePlaque);
  plaque.addEventListener("pointerup", stopPlaque);
  plaque.addEventListener("pointercancel", stopPlaque);
}

/* ======================================================
   SELECT / DRAG / EDIT
====================================================== */

function selectThing(type, id) {
  selectedType = type;

  document.querySelectorAll(".rabbit-overlay").forEach((item) => {
    item.classList.remove("selected-overlay");
  });

  document.querySelectorAll(".overlay-floating-label").forEach((item) => {
    item.classList.remove("selected");
  });

  document.getElementById(fixedBlinkPlaqueSettings.id)?.classList.remove("selected-fixed-plaque");
  document.getElementById(`${fixedBlinkPlaqueSettings.id}-label`)?.classList.remove("selected");

  if (type === "overlay") {
    selectedOverlay = rabbitOverlaySettings.find((overlay) => overlay.id === id);

    if (!selectedOverlay) return;

    document.getElementById(selectedOverlay.id)?.classList.add("selected-overlay");
    document.getElementById(`overlay-label-${selectedOverlay.id}`)?.classList.add("selected");

    const selectedName = document.getElementById("overlaySelectedName");
    if (selectedName) selectedName.textContent = `Selected: ${selectedOverlay.label}`;

    const selectBox = document.getElementById("overlaySelect");
    if (selectBox) selectBox.value = selectedOverlay.id;

    drawCornerHandles();
  }

  if (type === "plaque") {
    selectedOverlay = null;

    document.getElementById(fixedBlinkPlaqueSettings.id)?.classList.add("selected-fixed-plaque");
    document.getElementById(`${fixedBlinkPlaqueSettings.id}-label`)?.classList.add("selected");

    const selectedName = document.getElementById("overlaySelectedName");
    if (selectedName) selectedName.textContent = `Selected: ${fixedBlinkPlaqueSettings.label}`;

    const selectBox = document.getElementById("overlaySelect");
    if (selectBox) selectBox.value = fixedBlinkPlaqueSettings.id;

    drawCornerHandles();
  }

  updateEditorOutput();
}

function startOverlayDrag(event, overlay, el) {
  if (!isOverlayEditMode) return;

  event.preventDefault();
  event.stopPropagation();

  el.setPointerCapture(event.pointerId);

  const stage = document.querySelector(".rabbit-stage");
  const rect = stage.getBoundingClientRect();

  const startX = event.clientX;
  const startY = event.clientY;
  const startLeft = overlay.x;
  const startTop = overlay.y;

  function moveOverlay(e) {
    const dx = ((e.clientX - startX) / rect.width) * 100;
    const dy = ((e.clientY - startY) / rect.height) * 100;

    overlay.x = Number((startLeft + dx).toFixed(2));
    overlay.y = Number((startTop + dy).toFixed(2));

    applyOverlayStyle(el, overlay);
    positionOverlayLabel(overlay);
    drawCornerHandles();
    updateEditorOutput();
  }

  function stopOverlay() {
    try {
      el.releasePointerCapture(event.pointerId);
    } catch {}

    el.removeEventListener("pointermove", moveOverlay);
    el.removeEventListener("pointerup", stopOverlay);
    el.removeEventListener("pointercancel", stopOverlay);

    updateEditorOutput();
  }

  el.addEventListener("pointermove", moveOverlay);
  el.addEventListener("pointerup", stopOverlay);
  el.addEventListener("pointercancel", stopOverlay);
}

function createOverlayEditorPanel() {
  if (!isOverlayEditMode) return;

  const panel = document.createElement("div");
  panel.className = "overlay-editor-panel";

  const overlayOptions = `
    <option value="tv-static">TV Static</option>
    <option value="fixed-blink-plaque">Fixed Black Blink Box</option>
  `;

  panel.innerHTML = `
    <strong>Overlay Editor</strong>
    <p>
      TV Static sticks to the TV image.
      Fixed Black Blink Box sticks to the screen/window and will not move when the page moves.
    </p>

    <select id="overlaySelect">
      <option value="">Choose item...</option>
      ${overlayOptions}
    </select>

    <div id="overlaySelectedName" class="selected-name">Selected: none</div>

    <div class="overlay-editor-buttons">
      <button data-action="left">←</button>
      <button data-action="up">↑</button>
      <button data-action="down">↓</button>
      <button data-action="right">→</button>

      <button data-action="w-minus">W-</button>
      <button data-action="w-plus">W+</button>
      <button data-action="h-minus">H-</button>
      <button data-action="h-plus">H+</button>

      <button data-action="rot-minus" class="blue">R-</button>
      <button data-action="rot-plus" class="blue">R+</button>
      <button data-action="sx-minus" class="blue">SX-</button>
      <button data-action="sx-plus" class="blue">SX+</button>

      <button data-action="sy-minus" class="yellow">SY-</button>
      <button data-action="sy-plus" class="yellow">SY+</button>
      <button data-action="op-minus" class="yellow">OP-</button>
      <button data-action="op-plus" class="yellow">OP+</button>
    </div>

    <button id="copyOverlaySettings" class="copy" type="button">COPY UPDATED SETTINGS</button>
    <textarea id="overlayOutput" readonly></textarea>
  `;

  document.body.appendChild(panel);

  document.getElementById("overlaySelect").addEventListener("change", (event) => {
    if (event.target.value === "fixed-blink-plaque") {
      selectThing("plaque", fixedBlinkPlaqueSettings.id);
      return;
    }

    if (event.target.value) {
      selectThing("overlay", event.target.value);
    }
  });

  panel.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      adjustSelectedThing(button.dataset.action);
    });
  });

  document.getElementById("copyOverlaySettings").addEventListener("click", async () => {
    updateEditorOutput();

    const output = document.getElementById("overlayOutput").value;

    try {
      await navigator.clipboard.writeText(output);
      document.getElementById("copyOverlaySettings").textContent = "COPIED!";

      setTimeout(() => {
        document.getElementById("copyOverlaySettings").textContent = "COPY UPDATED SETTINGS";
      }, 1200);
    } catch {
      alert("Could not auto-copy. Select the text box and copy manually.");
    }
  });
}

function adjustSelectedThing(action) {
  if (selectedType === "overlay" && selectedOverlay) {
    adjustSelectedOverlay(action);
    return;
  }

  if (selectedType === "plaque") {
    adjustFixedPlaque(action);
  }
}

function adjustSelectedOverlay(action) {
  const el = document.getElementById(selectedOverlay.id);
  if (!el) return;

  if (action === "left") selectedOverlay.x = Number((selectedOverlay.x - 0.25).toFixed(2));
  if (action === "right") selectedOverlay.x = Number((selectedOverlay.x + 0.25).toFixed(2));
  if (action === "up") selectedOverlay.y = Number((selectedOverlay.y - 0.25).toFixed(2));
  if (action === "down") selectedOverlay.y = Number((selectedOverlay.y + 0.25).toFixed(2));

  if (action === "w-minus") selectedOverlay.w = Number((selectedOverlay.w - 0.25).toFixed(2));
  if (action === "w-plus") selectedOverlay.w = Number((selectedOverlay.w + 0.25).toFixed(2));
  if (action === "h-minus") selectedOverlay.h = Number((selectedOverlay.h - 0.25).toFixed(2));
  if (action === "h-plus") selectedOverlay.h = Number((selectedOverlay.h + 0.25).toFixed(2));

  if (action === "rot-minus") selectedOverlay.rotate = Number((selectedOverlay.rotate - 0.25).toFixed(2));
  if (action === "rot-plus") selectedOverlay.rotate = Number((selectedOverlay.rotate + 0.25).toFixed(2));

  if (action === "sx-minus") selectedOverlay.skewX = Number((selectedOverlay.skewX - 0.25).toFixed(2));
  if (action === "sx-plus") selectedOverlay.skewX = Number((selectedOverlay.skewX + 0.25).toFixed(2));

  if (action === "sy-minus") selectedOverlay.skewY = Number((selectedOverlay.skewY - 0.25).toFixed(2));
  if (action === "sy-plus") selectedOverlay.skewY = Number((selectedOverlay.skewY + 0.25).toFixed(2));

  if (action === "op-minus") selectedOverlay.opacity = Math.max(0, Number((selectedOverlay.opacity - 0.05).toFixed(2)));
  if (action === "op-plus") selectedOverlay.opacity = Math.min(1, Number((selectedOverlay.opacity + 0.05).toFixed(2)));

  selectedOverlay.w = Math.max(0.1, selectedOverlay.w);
  selectedOverlay.h = Math.max(0.1, selectedOverlay.h);

  applyOverlayStyle(el, selectedOverlay);
  positionOverlayLabel(selectedOverlay);
  drawCornerHandles();
  updateEditorOutput();
}

function adjustFixedPlaque(action) {
  const plaque = document.getElementById(fixedBlinkPlaqueSettings.id);
  if (!plaque) return;

  if (action === "left") fixedBlinkPlaqueSettings.x = Number((fixedBlinkPlaqueSettings.x - 0.4).toFixed(2));
  if (action === "right") fixedBlinkPlaqueSettings.x = Number((fixedBlinkPlaqueSettings.x + 0.4).toFixed(2));
  if (action === "up") fixedBlinkPlaqueSettings.y = Number((fixedBlinkPlaqueSettings.y - 0.4).toFixed(2));
  if (action === "down") fixedBlinkPlaqueSettings.y = Number((fixedBlinkPlaqueSettings.y + 0.4).toFixed(2));

  if (action === "w-minus") fixedBlinkPlaqueSettings.w = Math.max(8, fixedBlinkPlaqueSettings.w - 4);
  if (action === "w-plus") fixedBlinkPlaqueSettings.w = fixedBlinkPlaqueSettings.w + 4;
  if (action === "h-minus") fixedBlinkPlaqueSettings.h = Math.max(8, fixedBlinkPlaqueSettings.h - 3);
  if (action === "h-plus") fixedBlinkPlaqueSettings.h = fixedBlinkPlaqueSettings.h + 3;

  if (action === "rot-minus") fixedBlinkPlaqueSettings.rotate = Number((fixedBlinkPlaqueSettings.rotate - 0.25).toFixed(2));
  if (action === "rot-plus") fixedBlinkPlaqueSettings.rotate = Number((fixedBlinkPlaqueSettings.rotate + 0.25).toFixed(2));

  if (action === "op-minus") {
    fixedBlinkPlaqueSettings.opacityHigh = Math.max(0, Number((fixedBlinkPlaqueSettings.opacityHigh - 0.05).toFixed(2)));
  }

  if (action === "op-plus") {
    fixedBlinkPlaqueSettings.opacityHigh = Math.min(1, Number((fixedBlinkPlaqueSettings.opacityHigh + 0.05).toFixed(2)));
  }

  applyPlaqueStyle(plaque);
  positionPlaqueLabel();
  updateEditorOutput();
}

/* ======================================================
   TV CORNER HANDLES
====================================================== */

function drawCornerHandles() {
  document.querySelectorAll(".overlay-corner-handle").forEach((handle) => handle.remove());

  if (!isOverlayEditMode || selectedType !== "overlay" || !selectedOverlay || !selectedOverlay.clipCorners) return;

  Object.entries(selectedOverlay.clipCorners).forEach(([cornerKey, point]) => {
    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "overlay-corner-handle";
    handle.dataset.corner = cornerKey.toUpperCase();
    handle.setAttribute("aria-label", `${selectedOverlay.label} ${cornerKey}`);

    positionCornerHandle(handle, selectedOverlay, point);

    handle.addEventListener("pointerdown", (event) => {
      startCornerDrag(event, selectedOverlay, cornerKey);
    });

    overlayRoot.appendChild(handle);
  });
}

function positionCornerHandle(handle, overlay, point) {
  const x = overlay.x + (overlay.w * point.x) / 100;
  const y = overlay.y + (overlay.h * point.y) / 100;

  handle.style.left = x + "%";
  handle.style.top = y + "%";
}

function startCornerDrag(event, overlay, cornerKey) {
  event.preventDefault();
  event.stopPropagation();

  const stage = document.querySelector(".rabbit-stage");
  const rect = stage.getBoundingClientRect();

  function moveCorner(e) {
    const stageX = ((e.clientX - rect.left) / rect.width) * 100;
    const stageY = ((e.clientY - rect.top) / rect.height) * 100;

    const localX = ((stageX - overlay.x) / overlay.w) * 100;
    const localY = ((stageY - overlay.y) / overlay.h) * 100;

    overlay.clipCorners[cornerKey].x = Number(clamp(localX, 0, 100).toFixed(2));
    overlay.clipCorners[cornerKey].y = Number(clamp(localY, 0, 100).toFixed(2));

    const el = document.getElementById(overlay.id);
    if (el) {
      applyOverlayStyle(el, overlay);
    }

    drawCornerHandles();
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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/* ======================================================
   OUTPUT
====================================================== */

function updateEditorOutput() {
  const output = document.getElementById("overlayOutput");
  if (!output) return;

  output.value =
`const rabbitOverlaySettings = ${JSON.stringify(rabbitOverlaySettings, null, 2)};

const fixedBlinkPlaqueSettings = ${JSON.stringify(fixedBlinkPlaqueSettings, null, 2)};`;
}

/* ======================================================
   TV STATIC ANIMATION
====================================================== */

function setupTvStatic() {
  const tvCanvas = document.getElementById("tvStaticCanvas");
  if (!tvCanvas) return;

  const tvCtx = tvCanvas.getContext("2d", { willReadFrequently: true });
  const staticWidth = 180;
  const staticHeight = 120;

  tvCanvas.width = staticWidth;
  tvCanvas.height = staticHeight;

  function drawTvStatic() {
    const imageData = tvCtx.createImageData(staticWidth, staticHeight);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const shade = Math.random() * 255;
      const pop = Math.random() > 0.985 ? 255 : shade;

      data[i] = pop;
      data[i + 1] = pop;
      data[i + 2] = pop;
      data[i + 3] = 115 + Math.random() * 75;
    }

    tvCtx.putImageData(imageData, 0, 0);

    tvCtx.fillStyle = "rgba(80, 210, 255, 0.04)";
    tvCtx.fillRect(0, 0, staticWidth, staticHeight);

    if (Math.random() > 0.92) {
      tvCtx.fillStyle = "rgba(255,255,255,0.16)";
      tvCtx.fillRect(0, Math.random() * staticHeight, staticWidth, 2 + Math.random() * 4);
    }

    requestAnimationFrame(drawTvStatic);
  }

  drawTvStatic();
}

/* ======================================================
   OPTIONAL TV STATIC SOUND
====================================================== */

const staticSoundToggle = document.getElementById("staticSoundToggle");
let audioContext = null;
let staticNode = null;
let staticGain = null;
let staticPlaying = false;

function startStaticSound() {
  if (staticPlaying) return;

  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  staticNode = audioContext.createBufferSource();
  staticNode.buffer = noiseBuffer;
  staticNode.loop = true;

  staticGain = audioContext.createGain();
  staticGain.gain.value = 0.018;

  const filter = audioContext.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1150;
  filter.Q.value = 0.55;

  staticNode.connect(filter);
  filter.connect(staticGain);
  staticGain.connect(audioContext.destination);

  staticNode.start();
  staticPlaying = true;

  staticSoundToggle.textContent = "TV STATIC: ON";
  staticSoundToggle.classList.add("on");
}

function stopStaticSound() {
  if (!staticPlaying) return;

  try { staticNode.stop(); } catch {}
  try { audioContext.close(); } catch {}

  audioContext = null;
  staticNode = null;
  staticGain = null;
  staticPlaying = false;

  staticSoundToggle.textContent = "TV STATIC: OFF";
  staticSoundToggle.classList.remove("on");
}

if (staticSoundToggle) {
  staticSoundToggle.addEventListener("click", () => {
    if (staticPlaying) {
      stopStaticSound();
    } else {
      startStaticSound();
    }
  });
}

/* ======================================================
   MOBILE START POSITION
====================================================== */

window.addEventListener("load", () => {
  const wrap = document.getElementById("rabbitScrollWrap");

  if (window.innerWidth <= 760 && wrap && !isOverlayEditMode) {
    wrap.scrollLeft = 360;
  }
});

/* ======================================================
   START
====================================================== */

injectPlaqueStyles();
renderRabbitOverlays();
renderFixedBlinkPlaque();
createOverlayEditorPanel();
