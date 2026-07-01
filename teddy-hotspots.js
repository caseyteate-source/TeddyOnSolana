/* ======================================================
   $TEDDY PAGE HOTSPOTS + SCREEN EDITOR

   Normal page:
   teddy.html

   Edit mode:
   teddy.html?edit=1

   This version applies your saved coordinates and keeps:
   - editable circle links
   - editable arcade gameplay overlay
   - editable TV overlay
   - yellow draggable corner handles for edge/skew fitting
   - editable rain dry zone
====================================================== */

const TEDDY_CONTRACT = "8KJEWtuq1c1699nAup7WatZfgodS3YFnadBq46FDpump";
const TEDDY_DEX = "https://dexscreener.com/solana/8kjewtuq1c1699naup7watzfgods3yfnadbq46fdpump";
const TEDDY_PUMP = "https://pump.fun/coin/8KJEWtuq1c1699nAup7WatZfgodS3YFnadBq46FDpump";

const editMode = new URLSearchParams(window.location.search).has("edit");

const teddyHotspots = [
  {
    "id": "teddy-dex",
    "label": "$TEDDY Dex",
    "title": "$TEDDY",
    "url": "https://dexscreener.com/solana/8kjewtuq1c1699naup7watzfgods3yfnadbq46fdpump",
    "sameTab": false,
    "x": 23.32,
    "y": 13.79,
    "size": 310,
    "kind": "circle"
  },
  {
    "id": "about-button",
    "label": "About",
    "title": "About $TEDDY",
    "url": "#",
    "sameTab": true,
    "x": 74.95,
    "y": 4.72,
    "size": 116,
    "kind": "circle",
    "action": "open-about"
  },
  {
    "id": "buy-teddy",
    "label": "Buy $TEDDY",
    "title": "Buy $TEDDY",
    "url": "https://pump.fun/coin/8KJEWtuq1c1699nAup7WatZfgodS3YFnadBq46FDpump",
    "sameTab": false,
    "x": 88.45,
    "y": 4.72,
    "size": 150,
    "kind": "circle"
  },
  {
    "id": "arcade",
    "label": "Arcade Play",
    "title": "Arcade Play",
    "url": "index.html",
    "sameTab": true,
    "x": 12.52,
    "y": 81.75,
    "size": 92,
    "kind": "circle"
  },
  {
    "id": "kitty",
    "label": "Kitty Files",
    "title": "Kitty Files",
    "url": "kitty.html",
    "sameTab": true,
    "x": 28.27,
    "y": 81.73,
    "size": 92,
    "kind": "circle"
  },
  {
    "id": "white-rabbit",
    "label": "Rabbit Hole",
    "title": "Follow the White Rabbit",
    "url": "hq.html",
    "sameTab": true,
    "x": 44.74,
    "y": 81.65,
    "size": 96,
    "kind": "circle"
  },
  {
    "id": "emoji",
    "label": "Emoji Timeline",
    "title": "Emoji Timeline",
    "url": "emoji.html",
    "sameTab": true,
    "x": 61.12,
    "y": 81.87,
    "size": 92,
    "kind": "circle"
  },
  {
    "id": "gmebay",
    "label": "GMEBAY",
    "title": "GMEBAY",
    "url": "gmebay.html",
    "sameTab": true,
    "x": 78.03,
    "y": 81.7,
    "size": 98,
    "kind": "circle"
  },
  {
    "id": "secret-tv-switch",
    "label": "Secret TV Switch",
    "title": "",
    "url": "#",
    "sameTab": true,
    "x": 83.22,
    "y": 2.39,
    "size": 42,
    "kind": "secret",
    "action": "switch-tv-easter-egg"
  },
  {
    "id": "secret-video-switch",
    "label": "Secret Video Switch",
    "title": "",
    "url": "#",
    "sameTab": true,
    "x": 86.12,
    "y": 2.39,
    "size": 42,
    "kind": "secret",
    "action": "switch-secret-video"
  }
];

const screenOverlays = [
  {
    "id": "arcade-gameplay",
    "label": "Arcade Gameplay",
    "elementId": "arcadeScreenAnim",
    "x": 22.78,
    "y": 42.42,
    "w": 14.8,
    "h": 16.8,
    "rotate": 0.5,
    "skewX": -1.25,
    "skewY": 0,
    "opacity": 0.93,
    "clipCorners": {
      "tl": {
        "x": 2.95,
        "y": 21.45
      },
      "tr": {
        "x": 85.91,
        "y": 22.1
      },
      "br": {
        "x": 94.18,
        "y": 100
      },
      "bl": {
        "x": 13.33,
        "y": 100
      }
    }
  },
  {
    "id": "tv-screen",
    "label": "TV Video Screen",
    "elementId": "tvScreenAnim",
    "x": 80.41,
    "y": 53.38,
    "w": 10,
    "h": 11.3,
    "rotate": -1,
    "skewX": 0,
    "skewY": 0,
    "opacity": 0.86,
    "clipCorners": {
      "tl": {
        "x": 5,
        "y": 5
      },
      "tr": {
        "x": 96,
        "y": 3
      },
      "br": {
        "x": 96,
        "y": 96
      },
      "bl": {
        "x": 5,
        "y": 97
      }
    }
  }
];

const rainDryZone = {
  id: "rain-dry-zone",
  label: "Rain Dry Zone",
  x: 35.4,
  y: 16.7,
  w: 50.8,
  h: 61.4
};

const stage = document.getElementById("teddyStage");
const hotspotRoot = document.getElementById("teddyHotspotRoot");
const visualRoot = document.getElementById("editorVisualRoot");
const dryMask = document.getElementById("umbrellaDryMask");

let selectedType = null;
let selectedId = null;

if (editMode) {
  document.body.classList.add("edit-mode");
}

/* ======================================================
   CONTRACT COPY
====================================================== */

const copyToast = document.getElementById("copyToast");
const contractCopyButton = document.getElementById("contractCopyButton");
const contractText = document.getElementById("contractText");

async function copyContract() {
  let copied = false;

  try {
    await navigator.clipboard.writeText(TEDDY_CONTRACT);
    copied = true;
  } catch {
    copied = fallbackCopyContract();
  }

  showCopiedState(copied);
}

function fallbackCopyContract() {
  const textarea = document.createElement("textarea");
  textarea.value = TEDDY_CONTRACT;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}

function showCopiedState(copied) {
  if (contractCopyButton && contractText) {
    contractCopyButton.classList.add("copied");
    contractText.textContent = copied ? "COPIED" : TEDDY_CONTRACT;

    setTimeout(() => {
      contractCopyButton.classList.remove("copied");
      contractText.textContent = TEDDY_CONTRACT;
    }, 1300);
  }

  if (copyToast) {
    copyToast.textContent = copied ? "CONTRACT COPIED" : "COPY FAILED — LONG PRESS ADDRESS";
    copyToast.classList.add("show");

    setTimeout(() => {
      copyToast.classList.remove("show");
    }, 1400);
  }
}

contractCopyButton?.addEventListener("click", copyContract);

/* ======================================================
   ABOUT MODAL
====================================================== */

const aboutModal = document.getElementById("aboutModal");
const aboutClose = document.getElementById("aboutClose");

function openAbout() {
  aboutModal.classList.add("active");
  aboutModal.setAttribute("aria-hidden", "false");
}

function closeAbout() {
  aboutModal.classList.remove("active");
  aboutModal.setAttribute("aria-hidden", "true");
}

aboutClose?.addEventListener("click", closeAbout);

aboutModal?.addEventListener("click", (event) => {
  if (event.target === aboutModal) closeAbout();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAbout();
});

/* ======================================================
   HOTSPOTS
====================================================== */

function renderHotspots() {
  if (!hotspotRoot) return;

  hotspotRoot.innerHTML = "";

  teddyHotspots.forEach((spot) => {
    const link = document.createElement("a");

    link.className = "teddy-hotspot";
    link.href = spot.url || "#";
    link.title = spot.title || spot.label;
    link.dataset.id = spot.id;
    link.dataset.label = spot.label;
    link.style.left = spot.x + "%";
    link.style.top = spot.y + "%";
    link.style.width = spot.size + "px";
    link.style.height = spot.size + "px";

    if (!spot.sameTab && !spot.action) {
      link.target = "_blank";
      link.rel = "noopener";
    }

    link.addEventListener("click", (event) => {
      if (editMode) {
        event.preventDefault();
        return;
      }

      if (spot.action === "open-about") {
        event.preventDefault();
        openAbout();
        return;
      }

      if (spot.action === "switch-tv-easter-egg") {
        event.preventDefault();
        toggleTvEasterEgg();
        return;
      }

      if (spot.action === "switch-secret-video") {
        event.preventDefault();
        playTvVideo("secretVideo");
        return;
      }
    });

    if (editMode) {
      link.addEventListener("pointerdown", (event) => {
        selectItem("hotspot", spot.id);
        startHotspotDrag(event, spot, link);
      });
    }

    hotspotRoot.appendChild(link);
  });
}

async function toggleTvEasterEgg() {
  await playTvVideo("angryReporterVideo");
}

function getTvVideoElements() {
  return [
    document.getElementById("perfectStormVideo"),
    document.getElementById("angryReporterVideo"),
    document.getElementById("secretVideo")
  ].filter(Boolean);
}

function turnOffEveryTvVideo() {
  getTvVideoElements().forEach((video) => {
    try { video.pause(); } catch {}
    video.currentTime = 0;
    video.classList.remove("is-playing");
  });
}

async function showTvStaticThenPlay(videoId) {
  const tv = document.getElementById("tvScreenAnim");

  if (!tv) return;

  tv.classList.remove("video-on");
  tv.classList.remove("ready-to-play");
  tv.classList.add("video-switching");

  await new Promise((resolve) => setTimeout(resolve, 650));

  tv.classList.remove("video-switching");
}

async function playTvVideo(videoId) {
  const tv = document.getElementById("tvScreenAnim");
  const selectedVideo = document.getElementById(videoId);

  if (!tv || !selectedVideo) return;

  const sameVideoAlreadyPlaying =
    selectedVideo.classList.contains("is-playing") &&
    !selectedVideo.paused;

  turnOffEveryTvVideo();

  if (sameVideoAlreadyPlaying) {
    tv.classList.remove("video-on");
    tv.classList.remove("video-switching");
    tv.classList.add("ready-to-play");
    return;
  }

  await showTvStaticThenPlay(videoId);

  tv.classList.remove("ready-to-play");
  tv.classList.add("video-on");

  selectedVideo.classList.add("is-playing");
  selectedVideo.muted = false;
  selectedVideo.volume = 1;
  selectedVideo.currentTime = 0;

  try {
    await selectedVideo.play();
  } catch {
    tv.classList.remove("video-on");
    tv.classList.add("ready-to-play");
  }
}

function stopTvVideos() {
  const tv = document.getElementById("tvScreenAnim");

  turnOffEveryTvVideo();

  if (tv) {
    tv.classList.remove("video-on");
    tv.classList.remove("video-switching");
    tv.classList.add("ready-to-play");
  }
}

function prepareTvVideos() {
  const tv = document.getElementById("tvScreenAnim");

  if (!tv) return;

  tv.classList.add("ready-to-play");

  tv.addEventListener("click", async () => {
    if (editMode) return;

    const activeVideo = tv.querySelector(".tv-video.is-playing");

    if (activeVideo && !activeVideo.paused) {
      stopTvVideos();
      return;
    }

    await playTvVideo("perfectStormVideo");
  });

  getTvVideoElements().forEach((video) => {
    video.addEventListener("ended", stopTvVideos);
  });
}

/* ======================================================
   EDITOR PANEL
====================================================== */

function selectItem(type, id) {
  selectedType = type;
  selectedId = id;

  document.querySelectorAll(".screen-overlay").forEach((item) => {
    item.classList.remove("selected-screen");
  });

  if (type === "screen") {
    const setting = screenOverlays.find((item) => item.id === id);
    document.getElementById(setting.elementId)?.classList.add("selected-screen");
  }

  const select = document.getElementById("editorSelect");
  if (select) select.value = `${type}:${id}`;

  const selectedName = document.getElementById("selectedName");
  if (selectedName) selectedName.textContent = "Selected: " + getSelectedLabel();

  drawEditorVisuals();
  updateEditorOutput();
}

function getSelectedLabel() {
  if (selectedType === "hotspot") {
    return teddyHotspots.find((item) => item.id === selectedId)?.label || "none";
  }

  if (selectedType === "screen") {
    return screenOverlays.find((item) => item.id === selectedId)?.label || "none";
  }

  if (selectedType === "dry") {
    return "Rain Dry Zone";
  }

  return "none";
}

function createEditorPanel() {
  if (!editMode) return;

  const panel = document.createElement("div");
  panel.className = "edit-panel";

  const screenOptions = screenOverlays
    .map((item) => `<option value="screen:${item.id}">${item.label}</option>`)
    .join("");

  const hotspotOptions = teddyHotspots
    .map((item) => `<option value="hotspot:${item.id}">${item.label}</option>`)
    .join("");

  panel.innerHTML = `
    <div id="panelDragHandle" class="panel-drag-handle">DRAG THIS EDIT BOX</div>

    <strong>$TEDDY Page Editor</strong>
    <p>
      Select arcade/TV to move, resize, rotate, skew, or drag yellow corners.
      Select links to move/resize circles. Select Rain Dry Zone if rain touches Teddy.
    </p>

    <select id="editorSelect">
      <option value="">Choose item...</option>
      ${screenOptions}
      <option value="dry:rain-dry-zone">Rain Dry Zone</option>
      ${hotspotOptions}
    </select>

    <p id="selectedName">Selected: none</p>

    <div class="button-grid">
      <button data-action="left">←</button>
      <button data-action="up">↑</button>
      <button data-action="down">↓</button>
      <button data-action="right">→</button>

      <button data-action="w-minus" class="blue">W -</button>
      <button data-action="w-plus" class="blue">W +</button>
      <button data-action="h-minus" class="blue">H -</button>
      <button data-action="h-plus" class="blue">H +</button>

      <button data-action="rot-minus" class="yellow">R -</button>
      <button data-action="rot-plus" class="yellow">R +</button>
      <button data-action="sx-minus" class="yellow">SX -</button>
      <button data-action="sx-plus" class="yellow">SX +</button>

      <button data-action="sy-minus" class="yellow">SY -</button>
      <button data-action="sy-plus" class="yellow">SY +</button>
      <button data-action="op-minus" class="yellow">OP -</button>
      <button data-action="op-plus" class="yellow">OP +</button>
    </div>

    <button id="copySettings" class="copy" type="button">COPY SETTINGS</button>
    <div id="copyStatus" class="copy-status"></div>
    <textarea id="editorOutput" readonly></textarea>
  `;

  document.body.appendChild(panel);

  restorePanelPosition(panel);
  makePanelDraggable(panel);

  document.getElementById("editorSelect").addEventListener("change", (event) => {
    if (!event.target.value) return;

    const [type, id] = event.target.value.split(":");
    selectItem(type, id);
  });

  panel.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => adjustSelected(button.dataset.action));
  });

  document.getElementById("copySettings").addEventListener("click", copySettings);

  setTimeout(() => selectItem("screen", "arcade-gameplay"), 200);
}

function restorePanelPosition(panel) {
  const saved = localStorage.getItem("teddyEditorPanelPosition");
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

function makePanelDraggable(panel) {
  const handle = document.getElementById("panelDragHandle");
  if (!handle) return;

  handle.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    const rect = panel.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = rect.left;
    const startTop = rect.top;

    panel.style.left = startLeft + "px";
    panel.style.top = startTop + "px";
    panel.style.right = "auto";
    panel.style.bottom = "auto";

    function move(e) {
      const newLeft = startLeft + (e.clientX - startX);
      const newTop = startTop + (e.clientY - startY);

      const maxLeft = window.innerWidth - panel.offsetWidth - 8;
      const maxTop = window.innerHeight - panel.offsetHeight - 8;

      const left = clamp(newLeft, 8, Math.max(8, maxLeft));
      const top = clamp(newTop, 8, Math.max(8, maxTop));

      panel.style.left = left + "px";
      panel.style.top = top + "px";

      localStorage.setItem("teddyEditorPanelPosition", JSON.stringify({ left, top }));
    }

    function stop() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  });
}

function adjustSelected(action) {
  if (!selectedType) return;

  if (selectedType === "screen") {
    const item = screenOverlays.find((setting) => setting.id === selectedId);
    if (!item) return;

    adjustBox(item, action, true);
    applyScreenOverlayStyle(item);
    drawEditorVisuals();
    updateEditorOutput();
    return;
  }

  if (selectedType === "dry") {
    adjustBox(rainDryZone, action, false);
    applyDryMaskStyle();
    drawEditorVisuals();
    updateEditorOutput();
    return;
  }

  if (selectedType === "hotspot") {
    const item = teddyHotspots.find((setting) => setting.id === selectedId);
    if (!item) return;

    adjustHotspot(item, action);
    renderHotspots();
    selectItem("hotspot", item.id);
    updateEditorOutput();
  }
}

function adjustBox(item, action, allowTransform) {
  if (action === "left") item.x = Number((item.x - 0.25).toFixed(2));
  if (action === "right") item.x = Number((item.x + 0.25).toFixed(2));
  if (action === "up") item.y = Number((item.y - 0.25).toFixed(2));
  if (action === "down") item.y = Number((item.y + 0.25).toFixed(2));

  if (action === "w-minus") item.w = Number((item.w - 0.25).toFixed(2));
  if (action === "w-plus") item.w = Number((item.w + 0.25).toFixed(2));
  if (action === "h-minus") item.h = Number((item.h - 0.25).toFixed(2));
  if (action === "h-plus") item.h = Number((item.h + 0.25).toFixed(2));

  if (allowTransform) {
    if (action === "rot-minus") item.rotate = Number((item.rotate - 0.25).toFixed(2));
    if (action === "rot-plus") item.rotate = Number((item.rotate + 0.25).toFixed(2));

    if (action === "sx-minus") item.skewX = Number((item.skewX - 0.25).toFixed(2));
    if (action === "sx-plus") item.skewX = Number((item.skewX + 0.25).toFixed(2));

    if (action === "sy-minus") item.skewY = Number((item.skewY - 0.25).toFixed(2));
    if (action === "sy-plus") item.skewY = Number((item.skewY + 0.25).toFixed(2));

    if (action === "op-minus") item.opacity = Math.max(0, Number((item.opacity - 0.05).toFixed(2)));
    if (action === "op-plus") item.opacity = Math.min(1, Number((item.opacity + 0.05).toFixed(2)));
  }

  item.w = Math.max(0.5, item.w);
  item.h = Math.max(0.5, item.h);
}

function adjustHotspot(item, action) {
  if (action === "left") item.x = Number((item.x - 0.25).toFixed(2));
  if (action === "right") item.x = Number((item.x + 0.25).toFixed(2));
  if (action === "up") item.y = Number((item.y - 0.25).toFixed(2));
  if (action === "down") item.y = Number((item.y + 0.25).toFixed(2));

  if (action === "w-minus" || action === "h-minus") item.size = Math.max(20, item.size - 4);
  if (action === "w-plus" || action === "h-plus") item.size = item.size + 4;
}

function updateEditorOutput() {
  const output = document.getElementById("editorOutput");
  if (!output) return;

  output.value =
`const teddyHotspots = ${JSON.stringify(teddyHotspots, null, 2)};

const screenOverlays = ${JSON.stringify(screenOverlays, null, 2)};

const rainDryZone = ${JSON.stringify(rainDryZone, null, 2)};`;
}

async function copySettings() {
  updateEditorOutput();

  const output = document.getElementById("editorOutput");
  const status = document.getElementById("copyStatus");

  output.focus();
  output.select();
  output.setSelectionRange(0, output.value.length);

  let copied = false;

  try {
    await navigator.clipboard.writeText(output.value);
    copied = true;
  } catch {
    try {
      copied = document.execCommand("copy");
    } catch {}
  }

  if (status) {
    status.textContent = copied
      ? "Copied."
      : "Could not auto-copy. Text is selected — press Command+C / Ctrl+C.";
  }
}

/* ======================================================
   REALISTIC RAIN
====================================================== */

const rainCanvas = document.getElementById("realRainCanvas");
const rainCtx = rainCanvas ? rainCanvas.getContext("2d") : null;
const rainDrops = [];
let rainW = 0;
let rainH = 0;

function resizeRainCanvas() {
  if (!rainCanvas || !rainCtx || !stage) return;

  const rect = stage.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  rainW = rect.width;
  rainH = rect.height;

  rainCanvas.width = Math.floor(rainW * dpr);
  rainCanvas.height = Math.floor(rainH * dpr);
  rainCanvas.style.width = rainW + "px";
  rainCanvas.style.height = rainH + "px";

  rainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (rainDrops.length === 0) {
    for (let i = 0; i < 240; i++) {
      rainDrops.push(createRainDrop(true));
    }
  }
}

function createRainDrop(randomY = false) {
  return {
    x: Math.random() * rainW,
    y: randomY ? Math.random() * rainH : -30 - Math.random() * 170,
    len: 14 + Math.random() * 46,
    speed: 8 + Math.random() * 12,
    drift: -3.2 - Math.random() * 3.8,
    width: Math.random() > .82 ? 1.25 : .7,
    opacity: .16 + Math.random() * .36
  };
}

function isInsideDryZone(x, y) {
  if (!rainW || !rainH) return false;

  const px = (x / rainW) * 100;
  const py = (y / rainH) * 100;

  const inBox =
    px >= rainDryZone.x &&
    px <= rainDryZone.x + rainDryZone.w &&
    py >= rainDryZone.y &&
    py <= rainDryZone.y + rainDryZone.h;

  if (!inBox) return false;

  const centerX = rainDryZone.x + rainDryZone.w * 0.52;
  const centerY = rainDryZone.y + rainDryZone.h * 0.46;
  const rx = rainDryZone.w * 0.56;
  const ry = rainDryZone.h * 0.62;

  const oval =
    Math.pow((px - centerX) / rx, 2) +
    Math.pow((py - centerY) / ry, 2) < 1.08;

  const teddyColumn =
    px > rainDryZone.x + rainDryZone.w * 0.33 &&
    px < rainDryZone.x + rainDryZone.w * 0.74 &&
    py > rainDryZone.y + rainDryZone.h * 0.28 &&
    py < rainDryZone.y + rainDryZone.h * 0.98;

  return oval || teddyColumn;
}

function animateRain() {
  if (!rainCtx || !rainCanvas) return;

  rainCtx.clearRect(0, 0, rainW, rainH);
  rainCtx.save();
  rainCtx.globalCompositeOperation = "lighter";

  for (let i = 0; i < rainDrops.length; i++) {
    const drop = rainDrops[i];

    const x2 = drop.x + drop.drift;
    const y2 = drop.y + drop.len;

    if (!isInsideDryZone(drop.x, drop.y) && !isInsideDryZone(x2, y2)) {
      const grad = rainCtx.createLinearGradient(drop.x, drop.y, x2, y2);
      grad.addColorStop(0, `rgba(255,255,255,0)`);
      grad.addColorStop(.35, `rgba(210,235,255,${drop.opacity})`);
      grad.addColorStop(1, `rgba(120,210,255,0)`);

      rainCtx.strokeStyle = grad;
      rainCtx.lineWidth = drop.width;
      rainCtx.beginPath();
      rainCtx.moveTo(drop.x, drop.y);
      rainCtx.lineTo(x2, y2);
      rainCtx.stroke();
    }

    drop.x += drop.drift;
    drop.y += drop.speed;

    if (drop.y > rainH + 80 || drop.x < -90) {
      Object.assign(drop, createRainDrop(false));
      drop.x = Math.random() * (rainW + 130);
    }
  }

  rainCtx.restore();
  requestAnimationFrame(animateRain);
}

window.addEventListener("resize", resizeRainCanvas);

/* ======================================================
   ARCADE GAMEPLAY
====================================================== */

const arcadeCanvas = document.getElementById("arcadeGameCanvas");
const arcadeCtx = arcadeCanvas ? arcadeCanvas.getContext("2d") : null;
let arcadeTick = 0;

function drawArcadeGame() {
  if (!arcadeCtx) return;

  const w = arcadeCanvas.width;
  const h = arcadeCanvas.height;

  arcadeTick += 1;

  arcadeCtx.fillStyle = "#020802";
  arcadeCtx.fillRect(0, 0, w, h);

  arcadeCtx.strokeStyle = "rgba(124,255,79,.22)";
  arcadeCtx.lineWidth = 1;

  for (let x = 0; x < w; x += 16) {
    arcadeCtx.beginPath();
    arcadeCtx.moveTo(x, 0);
    arcadeCtx.lineTo(x, h);
    arcadeCtx.stroke();
  }

  for (let y = 0; y < h; y += 16) {
    arcadeCtx.beginPath();
    arcadeCtx.moveTo(0, y);
    arcadeCtx.lineTo(w, y);
    arcadeCtx.stroke();
  }

  for (let i = 0; i < 18; i++) {
    const alienX = 15 + (i % 6) * 20;
    const alienY = 28 + Math.floor(i / 6) * 16 + Math.sin((arcadeTick + i * 5) * 0.08) * 2;

    arcadeCtx.fillStyle = i % 3 === 0 ? "#ff2aa3" : i % 3 === 1 ? "#00f5ff" : "#7cff4f";
    arcadeCtx.fillRect(alienX, alienY, 10, 7);
    arcadeCtx.fillRect(alienX + 2, alienY - 3, 6, 3);
  }

  const playerX = 72 + Math.sin(arcadeTick * 0.08) * 48;

  arcadeCtx.fillStyle = "#ffea00";
  arcadeCtx.fillRect(playerX, 100, 18, 7);
  arcadeCtx.fillRect(playerX + 7, 93, 4, 7);

  arcadeCtx.fillStyle = "#00f5ff";
  for (let i = 0; i < 3; i++) {
    const shotY = 95 - ((arcadeTick * 4 + i * 37) % 95);
    arcadeCtx.fillRect(playerX + 8, shotY, 2, 8);
  }

  arcadeCtx.fillStyle = "#7cff4f";
  arcadeCtx.font = "bold 12px monospace";
  arcadeCtx.fillText("$TEDDY", 46, 14);

  if (Math.floor(arcadeTick / 24) % 2 === 0) {
    arcadeCtx.fillStyle = "#ffea00";
    arcadeCtx.font = "bold 10px monospace";
    arcadeCtx.fillText("LEVEL UP", 50, 114);
  }

  requestAnimationFrame(drawArcadeGame);
}

/* ======================================================
   UTILITIES + START
====================================================== */

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

window.addEventListener("load", () => {
  const wrap = document.getElementById("teddyScrollWrap");

  if (window.innerWidth <= 760 && wrap) {
    wrap.scrollLeft = 380;
  }

  resizeRainCanvas();
  animateRain();
});

renderHotspots();
renderScreenOverlays();
applyDryMaskStyle();
prepareTvVideos();
createEditorPanel();
drawArcadeGame();
