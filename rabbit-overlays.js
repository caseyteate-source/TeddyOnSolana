
/* ======================================================
   $TEDDY RABBIT HOLE ANIMATION OVERLAYS
   Movable overlay editor:
   hq.html?overlays=1
====================================================== */

const isOverlayEditMode = new URLSearchParams(window.location.search).has("overlays");

const rabbitOverlaySettings = [
  {
    id: "moass-neon",
    label: "MOASS Neon",
    type: "simple",
    className: "rabbit-overlay overlay-moass",
    x: 1.4,
    y: 4.8,
    w: 19.5,
    h: 12,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "bunny-neon",
    label: "Bunny Neon",
    type: "simple",
    className: "rabbit-overlay overlay-bunny",
    x: 82.8,
    y: 3.5,
    w: 12.4,
    h: 21,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "arcade-glow",
    label: "Arcade Glow",
    type: "simple",
    className: "rabbit-overlay overlay-arcade",
    x: 1.8,
    y: 24.2,
    w: 21,
    h: 39,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "lava-glow",
    label: "Lava Lamp Glow",
    type: "simple",
    className: "rabbit-overlay overlay-lava-glow",
    x: 24.8,
    y: 13.5,
    w: 4.6,
    h: 17,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "lava-bubble-one",
    label: "Lava Bubble 1",
    type: "simple",
    className: "rabbit-overlay overlay-lava-bubble",
    x: 25.75,
    y: 16.5,
    w: 0.9,
    h: 1.8,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "lava-bubble-two",
    label: "Lava Bubble 2",
    type: "simple",
    className: "rabbit-overlay overlay-lava-bubble yellow",
    x: 26.9,
    y: 22.5,
    w: 0.7,
    h: 1.4,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "lava-bubble-three",
    label: "Lava Bubble 3",
    type: "simple",
    className: "rabbit-overlay overlay-lava-bubble blue",
    x: 25.35,
    y: 26,
    w: 0.75,
    h: 1.5,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "phone-glow",
    label: "Phone Glow",
    type: "simple",
    className: "rabbit-overlay overlay-phone",
    x: 4.8,
    y: 77,
    w: 15,
    h: 15,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "heart-gme",
    label: "I Heart GME Pulse",
    type: "simple",
    className: "rabbit-overlay overlay-heart-gme",
    x: 22.1,
    y: 52.2,
    w: 5.2,
    h: 6.4,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "power-players",
    label: "Power To Players Glow",
    type: "simple",
    className: "rabbit-overlay overlay-power",
    x: 70.8,
    y: 30.5,
    w: 8.8,
    h: 10.6,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "hang-poster",
    label: "Hang In There Poster",
    type: "simple",
    className: "rabbit-overlay overlay-hang-poster",
    x: 5.9,
    y: 13.2,
    w: 8.4,
    h: 17,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "stock-chart",
    label: "Stock Chart Shimmer",
    type: "simple",
    className: "rabbit-overlay overlay-chart",
    x: 73.9,
    y: 5.9,
    w: 9.2,
    h: 15.3,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "magnify-glint",
    label: "Magnifying Glass Glint",
    type: "simple",
    className: "rabbit-overlay overlay-magnify",
    x: 63.5,
    y: 82.4,
    w: 5.8,
    h: 6.8,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "diamond-sparkle",
    label: "Diamond Sparkle",
    type: "simple",
    className: "rabbit-overlay overlay-diamond",
    x: 56.6,
    y: 46.2,
    w: 6,
    h: 8.5,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "kitty-pulse",
    label: "Kitty Pulse",
    type: "simple",
    className: "rabbit-overlay overlay-kitty",
    x: 54.7,
    y: 60.3,
    w: 8,
    h: 14.5,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "vhs-glow",
    label: "VHS Glow",
    type: "simple",
    className: "rabbit-overlay overlay-vhs",
    x: 45.4,
    y: 77.2,
    w: 15.8,
    h: 6.4,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "notebook-pulse",
    label: "Notebook Pulse",
    type: "simple",
    className: "rabbit-overlay overlay-notebook",
    x: 46.5,
    y: 83.5,
    w: 17,
    h: 11,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "coffee-steam",
    label: "Coffee Steam",
    type: "steam",
    className: "rabbit-overlay overlay-coffee-steam",
    x: 75.6,
    y: 75,
    w: 5,
    h: 10,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "dust-one",
    label: "Dust 1",
    type: "simple",
    className: "rabbit-overlay overlay-dust",
    x: 12,
    y: 20,
    w: 0.4,
    h: 0.4,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },
  {
    id: "dust-two",
    label: "Dust 2",
    type: "simple",
    className: "rabbit-overlay overlay-dust two",
    x: 42,
    y: 31,
    w: 0.4,
    h: 0.4,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1
  },

  /* The TV values below are the dialed-in skew setup we had before. */
  {
    id: "tv-static",
    label: "TV Static",
    type: "tv",
    className: "rabbit-overlay tv-static-wrap",
    x: 81.92,
    y: 36.55,
    w: 13.7,
    h: 15.7,
    rotate: -1.1,
    skewX: -1.5,
    skewY: 0.3,
    opacity: 0.72,
    clipPath: "polygon(4% 5%, 96% 2%, 98% 94%, 5% 98%)"
  },

  {
    id: "clock-1200",
    label: "Clock 12:00",
    type: "clock",
    className: "rabbit-overlay clock-svg-wrap",
    x: 80.08,
    y: 67.06,
    w: 4.25,
    h: 2.2,
    rotate: 6,
    skewX: 0,
    skewY: 0,
    opacity: 1
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
      el.dataset.label = overlay.label;
      el.addEventListener("pointerdown", (event) => {
        selectOverlay(overlay, el);
        startOverlayDrag(event, overlay, el);
      });
    }

    overlayRoot.appendChild(el);
  });

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

  if (overlay.type === "steam") {
    el.innerHTML = `<span></span><span></span><span></span>`;
  }

  return el;
}

function applyOverlayStyle(el, overlay) {
  el.style.left = overlay.x + "%";
  el.style.top = overlay.y + "%";
  el.style.width = overlay.w + "%";
  el.style.height = overlay.h + "%";
  el.style.opacity = overlay.opacity;
  el.style.transform = `rotate(${overlay.rotate}deg) skewX(${overlay.skewX}deg) skewY(${overlay.skewY}deg)`;

  if (overlay.clipPath) {
    el.style.clipPath = overlay.clipPath;
  }
}

function selectOverlay(overlay, el) {
  selectedOverlay = overlay;

  document.querySelectorAll(".rabbit-overlay").forEach((item) => {
    item.classList.remove("selected-overlay");
  });

  el.classList.add("selected-overlay");

  const selectedName = document.getElementById("overlaySelectedName");
  if (selectedName) {
    selectedName.textContent = `Selected: ${overlay.label}`;
  }

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

  panel.innerHTML = `
    <strong>Overlay Editor</strong>
    <p>Tap an overlay to select it. Drag it into place. Use buttons for size, rotate, skew, and opacity. Then copy the updated overlay settings.</p>

    <div id="overlaySelectedName" class="selected-name">Selected: none</div>

    <div class="overlay-editor-buttons">
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

    <button id="copyOverlaySettings" class="copy" type="button">COPY UPDATED OVERLAYS</button>
    <textarea id="overlayOutput" readonly></textarea>
  `;

  document.body.appendChild(panel);

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
        document.getElementById("copyOverlaySettings").textContent = "COPY UPDATED OVERLAYS";
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
  updateOverlayEditorOutput();
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
      data[i + 3] = 135 + Math.random() * 95;
    }

    tvCtx.putImageData(imageData, 0, 0);

    tvCtx.fillStyle = "rgba(80, 210, 255, 0.06)";
    tvCtx.fillRect(0, 0, staticWidth, staticHeight);

    if (Math.random() > 0.9) {
      tvCtx.fillStyle = "rgba(255,255,255,0.25)";
      tvCtx.fillRect(0, Math.random() * staticHeight, staticWidth, 2 + Math.random() * 6);
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
  staticGain.gain.value = 0.025;

  const filter = audioContext.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 850;

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

renderRabbitOverlays();
createOverlayEditorPanel();
