/* ======================================================
   $TEDDY RABBIT HOLE TV STATIC + PLAIN BLACK BLINK BOX

   Replace this whole file:
   rabbit-overlays.js

   Do not touch hq.html.
   Do not touch rabbit-hole.js.
====================================================== */

const isOverlayEditMode = new URLSearchParams(window.location.search).has("overlays");

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
      tl: { x: 6.06, y: 3.66 },
      tr: { x: 100, y: 7.76 },
      br: { x: 99.77, y: 96.41 },
      bl: { x: 6.75, y: 86.32 }
    }
  },
  {
    id: "black-blink-plaque",
    label: "Black Blink Box",
    type: "plaque",
    className: "rabbit-overlay stage-blink-plaque",

    x: 77.14,
    y: 57.07,
    w: 3.35,
    h: 1.9,

    rotate: 9.75,
    skewX: 0,
    skewY: 0,

    opacityHigh: 0.96,
    opacityLow: 0.08,
    blinkSpeed: 1.1,

    text: "",
    background: "rgba(0,0,0,.98)",
    borderRadius: 5,
    border: "0",
    boxShadow: "none"
  }
];

const overlayRoot = document.getElementById("rabbitOverlayRoot");
let selectedOverlay = null;

if (isOverlayEditMode) {
  document.body.classList.add("overlay-edit-mode");
}

/* ======================================================
   STYLES
====================================================== */

function injectExtraOverlayStyles() {
  const oldStyle = document.getElementById("extraOverlayStyles");
  if (oldStyle) oldStyle.remove();

  const style = document.createElement("style");
  style.id = "extraOverlayStyles";

  style.textContent = `
    .stage-blink-plaque {
      box-sizing: border-box;
      display: block;
      overflow: hidden;
      animation-name: stagePlaqueBlink;
      animation-timing-function: steps(1, end);
      animation-iteration-count: infinite;
    }

    @keyframes stagePlaqueBlink {
      0%, 48% {
        opacity: var(--plaque-opacity-high, .96);
      }

      49%, 100% {
        opacity: var(--plaque-opacity-low, .08);
      }
    }

    .overlay-edit-mode .stage-blink-plaque {
      border: 0 !important;
      box-shadow: none !important;
      outline: 1px dashed rgba(255,255,255,.45) !important;
      outline-offset: 2px;
    }

    .overlay-edit-mode .stage-blink-plaque.selected-overlay {
      border: 0 !important;
      box-shadow: none !important;
      outline: 1px dashed rgba(0,245,255,.75) !important;
    }

    .overlay-panel-drag-handle {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin: -4px 0 8px;
      padding: 9px 10px;
      border-radius: 10px;
      background: linear-gradient(90deg, #ff2aa3, #00aaff);
      color: white;
      font-family: Arial, sans-serif;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .08em;
      text-align: center;
      cursor: grab;
      user-select: none;
      touch-action: none;
    }

    .overlay-panel-drag-handle:active {
      cursor: grabbing;
    }

    .overlay-editor-panel.is-dragging {
      opacity: .84;
      user-select: none;
    }

    .overlay-edit-mode .overlay-editor-panel {
      max-height: 72vh;
      overflow-y: auto;
    }

    .selected-coords-box {
      width: 100%;
      height: 90px;
      background: #050510;
      color: #ffea00;
      border: 1px solid #00f5ff;
      border-radius: 10px;
      padding: 10px;
      font-family: monospace;
      font-size: 10px;
      box-sizing: border-box;
      margin: 8px 0;
    }

    .copy-status-line {
      color: #ffea00;
      font-size: 12px;
      font-weight: 900;
      margin: 6px 0;
      min-height: 16px;
    }

    @media (max-width: 760px) {
      .overlay-edit-mode .overlay-editor-panel {
        max-height: 52vh;
      }
    }
  `;

  document.head.appendChild(style);
}

/* ======================================================
   RENDER OVERLAYS
====================================================== */

function renderRabbitOverlays() {
  if (!overlayRoot) return;

  overlayRoot.innerHTML = "";

  rabbitOverlaySettings.forEach((overlay) => {
    const el = createOverlayElement(overlay);
    applyOverlayStyle(el, overlay);

    if (isOverlayEditMode) {
      el.addEventListener("pointerdown", (event) => {
        selectOverlay(overlay.id);
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

  if (overlay.type === "plaque") {
    el.textContent = overlay.text || "";
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
  el.style.transform = `rotate(${overlay.rotate}deg) skewX(${overlay.skewX}deg) skewY(${overlay.skewY}deg)`;

  const clipPath = getClipPath(overlay);
  el.style.clipPath = clipPath || "";

  if (overlay.type === "plaque") {
    el.style.background = overlay.background || "rgba(0,0,0,.98)";
    el.style.borderRadius = (overlay.borderRadius ?? 5) + "px";
    el.style.border = overlay.border || "0";
    el.style.boxShadow = overlay.boxShadow || "none";
    el.style.animationDuration = (overlay.blinkSpeed || 1.1) + "s";
    el.style.setProperty("--plaque-opacity-high", overlay.opacityHigh ?? 0.96);
    el.style.setProperty("--plaque-opacity-low", overlay.opacityLow ?? 0.08);
    return;
  }

  el.style.opacity = overlay.opacity;
}

/* ======================================================
   LABELS
====================================================== */

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
      selectOverlay(overlay.id);
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

  if (selectedOverlay && selectedOverlay.id === overlay.id) {
    label.classList.add("selected");
  } else {
    label.classList.remove("selected");
  }
}

/* ======================================================
   SELECT + DRAG
====================================================== */

function selectOverlay(overlayId) {
  selectedOverlay = rabbitOverlaySettings.find((overlay) => overlay.id === overlayId);

  document.querySelectorAll(".rabbit-overlay").forEach((item) => {
    item.classList.remove("selected-overlay");
  });

  document.querySelectorAll(".overlay-floating-label").forEach((item) => {
    item.classList.remove("selected");
  });

  if (!selectedOverlay) return;

  const el = document.getElementById(selectedOverlay.id);
  const label = document.getElementById(`overlay-label-${selectedOverlay.id}`);

  if (el) el.classList.add("selected-overlay");
  if (label) label.classList.add("selected");

  const selectedName = document.getElementById("overlaySelectedName");
  if (selectedName) selectedName.textContent = `Selected: ${selectedOverlay.label}`;

  const selectBox = document.getElementById("overlaySelect");
  if (selectBox) selectBox.value = selectedOverlay.id;

  drawCornerHandles();
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

/* ======================================================
   EDITOR PANEL
====================================================== */

function createOverlayEditorPanel() {
  if (!isOverlayEditMode) return;

  const panel = document.createElement("div");
  panel.className = "overlay-editor-panel";

  const overlayOptions = rabbitOverlaySettings
    .map((overlay) => `<option value="${overlay.id}">${overlay.label}</option>`)
    .join("");

  panel.innerHTML = `
    <div id="overlayPanelDragHandle" class="overlay-panel-drag-handle">
      DRAG THIS EDIT BOX
    </div>

    <strong>Overlay Editor</strong>
    <p>
      The black box blinks in editor mode and normal mode.
      The selected item coordinates are shown below even if clipboard copy fails.
    </p>

    <select id="overlaySelect">
      <option value="">Choose item...</option>
      ${overlayOptions}
    </select>

    <div id="overlaySelectedName" class="selected-name">Selected: none</div>

    <textarea id="selectedCoordsBox" class="selected-coords-box" readonly></textarea>

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

    <button id="copySelectedSettings" class="copy" type="button">COPY SELECTED ITEM ONLY</button>
    <button id="copyOverlaySettings" class="copy" type="button">COPY ALL SETTINGS</button>
    <div id="copyStatusLine" class="copy-status-line"></div>
    <textarea id="overlayOutput" readonly></textarea>
  `;

  document.body.appendChild(panel);

  restoreEditorPanelPosition(panel);
  makeEditorPanelMoveable(panel);

  document.getElementById("overlaySelect").addEventListener("change", (event) => {
    if (event.target.value) selectOverlay(event.target.value);
  });

  panel.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      adjustSelectedOverlay(button.dataset.action);
    });
  });

  document.getElementById("copySelectedSettings").addEventListener("click", () => {
    updateEditorOutput();
    const text = getSelectedOutputText();
    copyTextWithFallback(text, "selectedCoordsBox", "COPY SELECTED ITEM ONLY");
  });

  document.getElementById("copyOverlaySettings").addEventListener("click", () => {
    updateEditorOutput();
    const text = document.getElementById("overlayOutput").value;
    copyTextWithFallback(text, "overlayOutput", "COPY ALL SETTINGS");
  });

  setTimeout(() => {
    selectOverlay("black-blink-plaque");
  }, 150);
}

function restoreEditorPanelPosition(panel) {
  const saved = localStorage.getItem("teddyOverlayEditorPanelPosition");
  if (!saved) return;

  try {
    const position = JSON.parse(saved);

    if (typeof position.left === "number" && typeof position.top === "number") {
      panel.style.left = position.left + "px";
      panel.style.top = position.top + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    }
  } catch {}
}

function makeEditorPanelMoveable(panel) {
  const handle = document.getElementById("overlayPanelDragHandle");
  if (!handle) return;

  handle.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    panel.classList.add("is-dragging");

    const rect = panel.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = rect.left;
    const startTop = rect.top;

    panel.style.left = startLeft + "px";
    panel.style.top = startTop + "px";
    panel.style.right = "auto";
    panel.style.bottom = "auto";

    function movePanel(e) {
      const newLeft = startLeft + (e.clientX - startX);
      const newTop = startTop + (e.clientY - startY);

      const maxLeft = window.innerWidth - panel.offsetWidth - 8;
      const maxTop = window.innerHeight - panel.offsetHeight - 8;

      const clampedLeft = clamp(newLeft, 8, Math.max(8, maxLeft));
      const clampedTop = clamp(newTop, 8, Math.max(8, maxTop));

      panel.style.left = clampedLeft + "px";
      panel.style.top = clampedTop + "px";

      localStorage.setItem(
        "teddyOverlayEditorPanelPosition",
        JSON.stringify({ left: clampedLeft, top: clampedTop })
      );
    }

    function stopPanel() {
      panel.classList.remove("is-dragging");
      window.removeEventListener("pointermove", movePanel);
      window.removeEventListener("pointerup", stopPanel);
      window.removeEventListener("pointercancel", stopPanel);
    }

    window.addEventListener("pointermove", movePanel);
    window.addEventListener("pointerup", stopPanel);
    window.addEventListener("pointercancel", stopPanel);
  });
}

/* ======================================================
   BUTTON ADJUSTMENTS
====================================================== */

function adjustSelectedOverlay(action) {
  if (!selectedOverlay) return;

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

  if (selectedOverlay.type === "plaque") {
    if (action === "op-minus") selectedOverlay.opacityHigh = Math.max(0, Number((selectedOverlay.opacityHigh - 0.05).toFixed(2)));
    if (action === "op-plus") selectedOverlay.opacityHigh = Math.min(1, Number((selectedOverlay.opacityHigh + 0.05).toFixed(2)));
  } else {
    if (action === "op-minus") selectedOverlay.opacity = Math.max(0, Number((selectedOverlay.opacity - 0.05).toFixed(2)));
    if (action === "op-plus") selectedOverlay.opacity = Math.min(1, Number((selectedOverlay.opacity + 0.05).toFixed(2)));
  }

  selectedOverlay.w = Math.max(0.1, selectedOverlay.w);
  selectedOverlay.h = Math.max(0.1, selectedOverlay.h);

  applyOverlayStyle(el, selectedOverlay);
  positionOverlayLabel(selectedOverlay);
  drawCornerHandles();
  updateEditorOutput();
}

/* ======================================================
   TV CORNER HANDLES
====================================================== */

function drawCornerHandles() {
  document.querySelectorAll(".overlay-corner-handle").forEach((handle) => handle.remove());

  if (!isOverlayEditMode || !selectedOverlay || !selectedOverlay.clipCorners) return;

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
    if (el) applyOverlayStyle(el, overlay);

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

/* ======================================================
   UTILITIES + OUTPUT
====================================================== */

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getSelectedOutputText() {
  if (!selectedOverlay) return "";

  return `{
  id: "${selectedOverlay.id}",
  label: "${selectedOverlay.label}",
  type: "${selectedOverlay.type}",
  x: ${selectedOverlay.x},
  y: ${selectedOverlay.y},
  w: ${selectedOverlay.w},
  h: ${selectedOverlay.h},
  rotate: ${selectedOverlay.rotate},
  skewX: ${selectedOverlay.skewX},
  skewY: ${selectedOverlay.skewY}${selectedOverlay.type === "plaque" ? `,
  opacityHigh: ${selectedOverlay.opacityHigh},
  opacityLow: ${selectedOverlay.opacityLow},
  blinkSpeed: ${selectedOverlay.blinkSpeed}` : `,
  opacity: ${selectedOverlay.opacity}`}
}`;
}

function updateEditorOutput() {
  const output = document.getElementById("overlayOutput");
  const selectedCoordsBox = document.getElementById("selectedCoordsBox");

  const fullText = `const rabbitOverlaySettings = ${JSON.stringify(rabbitOverlaySettings, null, 2)};`;
  const selectedText = getSelectedOutputText();

  if (output) output.value = fullText;
  if (selectedCoordsBox) selectedCoordsBox.value = selectedText;
}

async function copyTextWithFallback(text, textareaId, buttonOriginalText) {
  const textarea = document.getElementById(textareaId);
  const status = document.getElementById("copyStatusLine");

  if (textarea) {
    textarea.value = text;
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
  }

  let copied = false;

  try {
    await navigator.clipboard.writeText(text);
    copied = true;
  } catch {}

  if (!copied) {
    try {
      copied = document.execCommand("copy");
    } catch {}
  }

  if (status) {
    status.textContent = copied
      ? "Copied."
      : "Could not auto-copy. The text is selected now — press Command+C / Ctrl+C, or long-press and copy.";
  }

  const button = [...document.querySelectorAll("button")].find((btn) => btn.textContent === buttonOriginalText);
  if (button && copied) {
    button.textContent = "COPIED!";
    setTimeout(() => {
      button.textContent = buttonOriginalText;
    }, 1200);
  }
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

  for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

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
    if (staticPlaying) stopStaticSound();
    else startStaticSound();
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

injectExtraOverlayStyles();
renderRabbitOverlays();
createOverlayEditorPanel();
