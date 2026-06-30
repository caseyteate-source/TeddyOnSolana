/* ======================================================
   $TEDDY RABBIT HOLE TV + CLOCK OVERLAYS
   Overlay editor:
   hq.html?overlays=1

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
  },
  {
    id: "clock-1200",
    label: "Clock 12:00",
    type: "clock",
    className: "rabbit-overlay clock-svg-wrap",
    x: 76.9,
    y: 56.68,
    w: 4.25,
    h: 2.2,
    rotate: 6,
    skewX: 0,
    skewY: -2.25,
    opacity: 0
  }
];

const overlayRoot = document.getElementById("rabbitOverlayRoot");
let selectedOverlay = null;

if (isOverlayEditMode) {
  document.body.classList.add("overlay-edit-mode");
}

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
  updateOverlayEditorOutput();
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

  if (overlay.type === "clock") {
    el.innerHTML = `
      <svg class="clock-svg" viewBox="0 0 240 70" xmlns="http://www.w3.org/2000/svg">
        <rect class="clock-seg" x="18" y="10" width="8" height="50" rx="4" />
        <rect class="clock-seg" x="8" y="16" width="16" height="8" rx="4" />

        <rect class="clock-seg" x="47" y="7" width="40" height="8" rx="4" />
        <rect class="clock-seg" x="83" y="11" width="8" height="21" rx="4" />
        <rect class="clock-seg" x="47" y="31" width="40" height="8" rx="4" />
        <rect class="clock-seg" x="43" y="35" width="8" height="21" rx="4" />
        <rect class="clock-seg" x="47" y="55" width="40" height="8" rx="4" />

        <circle class="clock-colon" cx="112" cy="24" r="5" />
        <circle class="clock-colon" cx="112" cy="47" r="5" />

        <rect class="clock-seg" x="135" y="7" width="40" height="8" rx="4" />
        <rect class="clock-seg" x="131" y="11" width="8" height="45" rx="4" />
        <rect class="clock-seg" x="171" y="11" width="8" height="45" rx="4" />
        <rect class="clock-seg" x="135" y="55" width="40" height="8" rx="4" />

        <rect class="clock-seg" x="193" y="7" width="40" height="8" rx="4" />
        <rect class="clock-seg" x="189" y="11" width="8" height="45" rx="4" />
        <rect class="clock-seg" x="229" y="11" width="8" height="45" rx="4" />
        <rect class="clock-seg" x="193" y="55" width="40" height="8" rx="4" />
      </svg>
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
  if (selectedName) {
    selectedName.textContent = `Selected: ${selectedOverlay.label}`;
  }

  const selectBox = document.getElementById("overlaySelect");
  if (selectBox) {
    selectBox.value = selectedOverlay.id;
  }

  drawCornerHandles();
  updateOverlayEditorOutput();
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
    updateOverlayEditorOutput();
  }

  function stopOverlay() {
    try {
      el.releasePointerCapture(event.pointerId);
    } catch {}

    el.removeEventListener("pointermove", moveOverlay);
    el.removeEventListener("pointerup", stopOverlay);
    el.removeEventListener("pointercancel", stopOverlay);

    updateOverlayEditorOutput();
  }

  el.addEventListener("pointermove", moveOverlay);
  el.addEventListener("pointerup", stopOverlay);
  el.addEventListener("pointercancel", stopOverlay);
}

function createOverlayEditorPanel() {
  if (!isOverlayEditMode) return;

  const panel = document.createElement("div");
  panel.className = "overlay-editor-panel";

  const overlayOptions = rabbitOverlaySettings
    .map((overlay) => `<option value="${overlay.id}">${overlay.label}</option>`)
    .join("");

  panel.innerHTML = `
    <strong>TV / Clock Overlay Editor</strong>
    <p>Select TV Static or Clock. Drag the overlay to move it. For TV Static, drag the pink corner dots to bend the screen shape.</p>

    <select id="overlaySelect">
      <option value="">Choose overlay...</option>
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

    <button id="copyOverlaySettings" class="copy" type="button">COPY UPDATED TV/CLOCK SETTINGS</button>
    <textarea id="overlayOutput" readonly></textarea>
  `;

  document.body.appendChild(panel);

  document.getElementById("overlaySelect").addEventListener("change", (event) => {
    if (event.target.value) {
      selectOverlay(event.target.value);
    }
  });

  panel.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      adjustSelectedOverlay(button.dataset.action);
    });
  });

  document.getElementById("copyOverlaySettings").addEventListener("click", async () => {
    updateOverlayEditorOutput();

    const output = document.getElementById("overlayOutput").value;

    try {
      await navigator.clipboard.writeText(output);
      document.getElementById("copyOverlaySettings").textContent = "COPIED!";

      setTimeout(() => {
        document.getElementById("copyOverlaySettings").textContent = "COPY UPDATED TV/CLOCK SETTINGS";
      }, 1200);
    } catch {
      alert("Could not auto-copy. Select the text box and copy manually.");
    }
  });
}

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

  if (action === "op-minus") selectedOverlay.opacity = Math.max(0, Number((selectedOverlay.opacity - 0.05).toFixed(2)));
  if (action === "op-plus") selectedOverlay.opacity = Math.min(1, Number((selectedOverlay.opacity + 0.05).toFixed(2)));

  selectedOverlay.w = Math.max(0.1, selectedOverlay.w);
  selectedOverlay.h = Math.max(0.1, selectedOverlay.h);

  applyOverlayStyle(el, selectedOverlay);
  positionOverlayLabel(selectedOverlay);
  drawCornerHandles();
  updateOverlayEditorOutput();
}

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
    if (el) {
      applyOverlayStyle(el, overlay);
    }

    drawCornerHandles();
    updateOverlayEditorOutput();
  }

  function stopCorner() {
    window.removeEventListener("pointermove", moveCorner);
    window.removeEventListener("pointerup", stopCorner);
    window.removeEventListener("pointercancel", stopCorner);
    updateOverlayEditorOutput();
  }

  window.addEventListener("pointermove", moveCorner);
  window.addEventListener("pointerup", stopCorner);
  window.addEventListener("pointercancel", stopCorner);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updateOverlayEditorOutput() {
  const output = document.getElementById("overlayOutput");
  if (!output) return;

  output.value = `const rabbitOverlaySettings = ${JSON.stringify(rabbitOverlaySettings, null, 2)};`;
}

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

window.addEventListener("load", () => {
  const wrap = document.getElementById("rabbitScrollWrap");

  if (window.innerWidth <= 760 && wrap && !isOverlayEditMode) {
    wrap.scrollLeft = 360;
  }
});

renderRabbitOverlays();
createOverlayEditorPanel();
