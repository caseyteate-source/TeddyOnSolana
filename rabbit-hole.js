/* ======================================================
   $TEDDY RABBIT HOLE HOTSPOTS
   Full replacement rabbit-hole.js

   Rebuilt from the later Rabbit Hole hotspot set:
   - keeps Callin' Oates phone
   - keeps the added coffee mug, $TEDDY marquee, magnifying glass,
     Hang In There, rocket, eBay book, controller, camcorder,
     lava lamp, stock chart, and Xtra circle
   - keeps Mr. T / MOASS TV video
   - all unfinished/dead pages say COMING SOON and route to /under-construction.html
   - no browser hover descriptions on the live page
   - edit mode still works with ?edit=1
====================================================== */

const isEditMode = new URLSearchParams(window.location.search).has("edit");

const UNDER_CONSTRUCTION_URL = "/under-construction.html";
const MR_T_MOTHER_VIDEO_URL = "/mr-t-mother.mp4";

/*
  Fallback TV placement only runs if rabbit-overlays.js does not create
  the normal .tv-static-wrap. The preferred behavior is to place the video
  inside the existing TV static overlay so alignment matches the static.
*/
const RABBIT_TV_FALLBACK_PLACEMENT = {
  left: 84.35,
  top: 27.6,
  width: 12.2,
  height: 14.6,
  rotate: -1.5
};

let rabbitTvSoundOn = true;
let rabbitTvWrap = null;
let rabbitTvVideo = null;
let rabbitTvVolumeToggle = null;

/*
  Anything in this set is treated like a dead/unfinished page:
  modal tag = COMING SOON
  button text = COMING SOON
  button URL = /under-construction.html
*/
const comingSoonIds = new Set([
  "coffee-mug",
  "memory",
  "memory-room",
  "tv",
  "crt-tv",
  "wonka",
  "willy-wonka",
  "pure-imagination",
  "teddy",
  "teddy-files",
  "ryan",
  "ryan-cohen",
  "ryan-cohen-files",
  "greg",
  "keith",
  "keith-gill",
  "kitty-bio",
  "buck",
  "buck-the-bunny",
  "floppy",
  "secret",
  "secret-file",
  "rocket",
  "rocket-blueprint",
  "retro-room",
  "nintendo-controller",
  "camcorder",
  "video-archive",
  "lava-lamp",
  "desk-lamp",
  "xtra",
  "xtra-circle",
  "extra",
  "extra-circle"
]);

const deadUrlParts = [
  "coffee.html",
  "imagination-room.html",
  "memory",
  "ryan.html",
  "greg.html",
  "kitty-bio.html",
  "buck.html",
  "secret.html",
  "rocket.html",
  "retro-room.html",
  "video-archive.html",
  "xtra",
  "extra"
];

const rabbitHotspots = [
  {
    id: "arcade",
    title: "Arcade Cabinet",
    tag: "Play Again",
    text: "Return to the $TEDDY arcade game.",
    url: "/index.html",
    sameTab: true,
    x: 9.53,
    y: 47.35,
    size: 64
  },
  {
    id: "arcade-marquee",
    title: "$TEDDY Marquee",
    tag: "Insert Coin",
    text: "The glowing $TEDDY sign pulls you back to the arcade.",
    url: "/index.html",
    sameTab: true,
    x: 8.91,
    y: 19.77,
    size: 58
  },
  {
    id: "coffee-mug",
    title: "Coffee Mug",
    tag: "Coming Soon",
    text: "Every rabbit hole needs caffeine. This clue page is coming soon.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 69.5,
    y: 74.26,
    size: 48
  },
  {
    id: "magnifying-glass",
    title: "Magnifying Glass",
    tag: "Investigate",
    text: "A closer look always reveals another thread.",
    url: "/kitty.html",
    sameTab: true,
    x: 61.36,
    y: 83.14,
    size: 50
  },
  {
    id: "kitty-files",
    title: "Kitty Files",
    tag: "Case File",
    text: "Open the Roaring Kitty investigation board.",
    url: "/kitty.html",
    sameTab: true,
    x: 84.63,
    y: 82.42,
    size: 58
  },
  {
    id: "emoji",
    title: "Emoji Timeline",
    tag: "VHS Tape",
    text: "Follow the Roaring Kitty emoji timeline.",
    url: "/emoji.html",
    sameTab: true,
    x: 25,
    y: 62,
    size: 58
  },
  {
    id: "memory",
    title: "Memory Room",
    tag: "Coming Soon",
    text: "The Memory Room is still under construction.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 82.99,
    y: 71.44,
    size: 58
  },
  {
    id: "tv",
    title: "CRT Television",
    tag: "Coming Soon",
    text: "The TV portal is still under construction.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 90.55,
    y: 35.61,
    size: 70
  },
  {
    id: "moass",
    title: "MOASS",
    tag: "Video File",
    text: "Mr. T's Mother plays on the Rabbit Hole TV.",
    url: MR_T_MOTHER_VIDEO_URL,
    sameTab: true,
    video: MR_T_MOTHER_VIDEO_URL,
    buttonText: "PLAY ON TV",
    x: 9.07,
    y: 7.79,
    size: 70
  },
  {
    id: "desk-lamp",
    title: "The Desk Lamp",
    tag: "Coming Soon",
    text: "The Norm Macdonald moth joke file is parked for now. This lamp clue is coming soon.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
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
    x: 18.84,
    y: 81.26,
    size: 62
  },
  {
    id: "gamestop",
    title: "GameStop",
    tag: "Official Link",
    text: "Open GameStop's official investor relations page.",
    url: "https://investor.gamestop.com/",
    sameTab: false,
    x: 57.72,
    y: 7.39,
    size: 58
  },
  {
    id: "teddy",
    title: "The Teddy Files",
    tag: "Coming Soon",
    text: "A future page for Teddy, Ryan Cohen's books, and community theories.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 21.26,
    y: 28.81,
    size: 60
  },
  {
    id: "ryan",
    title: "Ryan Cohen Files",
    tag: "Coming Soon",
    text: "Ryan Cohen biography, timeline, Teddy theories, and GameStop connections. Coming soon.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 44.75,
    y: 10.74,
    size: 54
  },
  {
    id: "greg",
    title: "Greg",
    tag: "Coming Soon",
    text: "The Greg rabbit-hole page is coming soon.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 54.29,
    y: 25.69,
    size: 54
  },
  {
    id: "keith",
    title: "Keith Gill",
    tag: "Coming Soon",
    text: "The Keith Gill / Roaring Kitty bio file is coming soon.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 43.07,
    y: 39.38,
    size: 54
  },
  {
    id: "buck",
    title: "Buck the Bunny",
    tag: "Coming Soon",
    text: "The Buck the Bunny page is coming soon.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 84.7,
    y: 12.82,
    size: 58
  },
  {
    id: "gmebay",
    title: "GMEBAY",
    tag: "Theory Tape",
    text: "What could GMEBAY become?",
    url: "/gmebay.html",
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
    url: "/kitty.html",
    sameTab: true,
    x: 45,
    y: 67,
    size: 58
  },
  {
    id: "wonka",
    title: "Willy Wonka VHS",
    tag: "Coming Soon",
    text: "The Pure Imagination / Memory Room path is coming soon.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 84.16,
    y: 51.55,
    size: 54
  },
  {
    id: "floppy",
    title: "Floppy Disk",
    tag: "Coming Soon",
    text: "The secret file is coming soon.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 31.04,
    y: 88.16,
    size: 48
  },
  {
    id: "hang-in-there",
    title: "Hang In There",
    tag: "Poster",
    text: "The classic cat signal. Hang in there. Follow the thread.",
    url: "/kitty.html",
    sameTab: true,
    x: 31.57,
    y: 14.83,
    size: 62
  },
  {
    id: "rocket",
    title: "Rocket Blueprint",
    tag: "Coming Soon",
    text: "The future launch-plan page is coming soon.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 63.39,
    y: 45.52,
    size: 58
  },
  {
    id: "ebay-book",
    title: "How To Sell Anything On eBay",
    tag: "GMEBAY Clue",
    text: "The marketplace clue. Open the GMEBAY theory page.",
    url: "/gmebay.html",
    sameTab: true,
    x: 93.02,
    y: 20.16,
    size: 62
  },
  {
    id: "nintendo-controller",
    title: "Nintendo Controller",
    tag: "Coming Soon",
    text: "The retro room is coming soon.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 94.95,
    y: 74.76,
    size: 54
  },
  {
    id: "camcorder",
    title: "Camcorder",
    tag: "Coming Soon",
    text: "The video archive side of the rabbit hole is coming soon.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 57.8,
    y: 65.2,
    size: 54
  },
  {
    id: "lava-lamp",
    title: "Lava Lamp",
    tag: "Coming Soon",
    text: "A glowing clue from the old room. Coming soon.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 20.66,
    y: 16.18,
    size: 50
  },
  {
    id: "stock-chart",
    title: "Stock Chart",
    tag: "Market Clue",
    text: "Open the GME stock chart.",
    url: "https://finance.yahoo.com/quote/GME/",
    sameTab: false,
    x: 69.63,
    y: 8.97,
    size: 54
  },
  {
    id: "xtra-circle",
    title: "Xtra Circle",
    tag: "Coming Soon",
    text: "This extra clue is coming soon.",
    url: UNDER_CONSTRUCTION_URL,
    sameTab: true,
    comingSoon: true,
    x: 68,
    y: 31,
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

function injectRabbitTvStyles() {
  if (document.getElementById("rabbitTvStyles")) return;

  const style = document.createElement("style");
  style.id = "rabbitTvStyles";
  style.textContent = `
    .rabbit-tv-video-fallback {
      position: absolute;
      z-index: 140;
      overflow: hidden;
      pointer-events: none;
      border-radius: 15px;
      background: #000;
      box-shadow:
        inset 0 0 18px rgba(255,255,255,.12),
        0 0 12px rgba(80,210,255,.18);
      transform-origin: center center;
      mix-blend-mode: screen;
    }

    .tv-static-wrap {
      position: absolute;
    }

    .tv-static-wrap.rabbit-video-playing .tv-static-canvas,
    .tv-static-wrap.rabbit-video-playing .tv-static-lines,
    .tv-static-wrap.rabbit-video-playing .tv-static-roll {
      opacity: .08 !important;
    }

    .rabbit-tv-video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      pointer-events: none;
      background: #000;
      transform: scale(1.015);
      filter:
        contrast(1.08)
        brightness(.92)
        saturate(1.05)
        blur(.08px);
      transition: opacity .16s ease;
    }

    .rabbit-tv-video.active {
      opacity: .92;
    }

    .rabbit-tv-glass {
      position: absolute;
      inset: 0;
      opacity: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 46% 24%, rgba(255,255,255,.16), transparent 33%),
        repeating-linear-gradient(
          to bottom,
          rgba(255,255,255,.10) 0,
          rgba(255,255,255,.10) 1px,
          transparent 1px,
          transparent 4px
        );
      mix-blend-mode: screen;
      transition: opacity .16s ease;
    }

    .rabbit-tv-video.active + .rabbit-tv-glass {
      opacity: .38;
    }

    .rabbit-tv-volume-toggle {
      position: fixed;
      right: 18px;
      top: 66px;
      z-index: 7001;
      border: 2px solid #ff2aa3;
      border-radius: 999px;
      background: rgba(0,0,0,.78);
      color: white;
      padding: 10px 13px;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 0 16px rgba(255,42,163,.75);
      letter-spacing: .03em;
    }

    .rabbit-tv-volume-toggle.off {
      border-color: #777;
      color: #ddd;
      box-shadow: 0 0 10px rgba(255,255,255,.22);
    }

    .rabbit-tv-toast {
      position: fixed;
      left: 50%;
      top: 18px;
      transform: translateX(-50%);
      z-index: 7002;
      max-width: min(620px, 90vw);
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid rgba(0,245,255,.72);
      background: rgba(0,0,0,.84);
      color: #fff;
      font-weight: 900;
      text-align: center;
      box-shadow:
        0 0 14px rgba(0,245,255,.42),
        0 0 20px rgba(255,42,163,.24);
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s ease;
    }

    .rabbit-tv-toast.active {
      opacity: 1;
    }

    @media (max-width: 760px) {
      .rabbit-tv-volume-toggle {
        right: 10px;
        top: 86px;
        font-size: 11px;
        padding: 9px 10px;
      }

      .rabbit-tv-toast {
        top: 9px;
        font-size: 11px;
      }
    }
  `;

  document.head.appendChild(style);
}

function createRabbitTvVolumeToggle() {
  if (rabbitTvVolumeToggle) return rabbitTvVolumeToggle;

  rabbitTvVolumeToggle = document.createElement("button");
  rabbitTvVolumeToggle.id = "rabbitTvVolumeToggle";
  rabbitTvVolumeToggle.className = "rabbit-tv-volume-toggle";
  rabbitTvVolumeToggle.type = "button";

  document.body.appendChild(rabbitTvVolumeToggle);

  rabbitTvVolumeToggle.addEventListener("click", () => {
    rabbitTvSoundOn = !rabbitTvSoundOn;
    updateRabbitTvVolumeToggle();

    if (rabbitTvVideo) {
      rabbitTvVideo.muted = !rabbitTvSoundOn;
      rabbitTvVideo.volume = rabbitTvSoundOn ? 1 : 0;
    }
  });

  updateRabbitTvVolumeToggle();
  return rabbitTvVolumeToggle;
}

function updateRabbitTvVolumeToggle() {
  if (!rabbitTvVolumeToggle) return;

  rabbitTvVolumeToggle.textContent = rabbitTvSoundOn
    ? "TV VOLUME: ON"
    : "TV VOLUME: OFF";

  rabbitTvVolumeToggle.classList.toggle("off", !rabbitTvSoundOn);
}

function createRabbitTvToast() {
  let toast = document.getElementById("rabbitTvToast");
  if (toast) return toast;

  toast = document.createElement("div");
  toast.id = "rabbitTvToast";
  toast.className = "rabbit-tv-toast";
  document.body.appendChild(toast);

  return toast;
}

function showRabbitTvToast(message, duration = 1800) {
  const toast = createRabbitTvToast();
  toast.textContent = message;
  toast.classList.add("active");

  clearTimeout(showRabbitTvToast.timer);
  showRabbitTvToast.timer = setTimeout(() => {
    toast.classList.remove("active");
  }, duration);
}

function ensureRabbitTv() {
  injectRabbitTvStyles();
  createRabbitTvVolumeToggle();

  const overlayRoot = document.getElementById("rabbitOverlayRoot");

  rabbitTvWrap =
    document.querySelector(".tv-static-wrap") ||
    document.getElementById("tvStaticWrap") ||
    document.getElementById("rabbitTvStaticWrap") ||
    rabbitTvWrap;

  if (!rabbitTvWrap && overlayRoot) {
    rabbitTvWrap = document.createElement("div");
    rabbitTvWrap.id = "rabbitTvFallbackWrap";
    rabbitTvWrap.className = "rabbit-tv-video-fallback";
    rabbitTvWrap.style.left = RABBIT_TV_FALLBACK_PLACEMENT.left + "%";
    rabbitTvWrap.style.top = RABBIT_TV_FALLBACK_PLACEMENT.top + "%";
    rabbitTvWrap.style.width = RABBIT_TV_FALLBACK_PLACEMENT.width + "%";
    rabbitTvWrap.style.height = RABBIT_TV_FALLBACK_PLACEMENT.height + "%";
    rabbitTvWrap.style.transform = `rotate(${RABBIT_TV_FALLBACK_PLACEMENT.rotate}deg)`;
    overlayRoot.appendChild(rabbitTvWrap);
  }

  if (!rabbitTvWrap) return false;

  rabbitTvWrap.style.pointerEvents = "none";

  rabbitTvVideo = document.getElementById("rabbitTvVideo");

  if (!rabbitTvVideo) {
    rabbitTvVideo = document.createElement("video");
    rabbitTvVideo.id = "rabbitTvVideo";
    rabbitTvVideo.className = "rabbit-tv-video";
    rabbitTvVideo.playsInline = true;
    rabbitTvVideo.preload = "auto";
    rabbitTvVideo.controls = false;

    const glass = document.createElement("div");
    glass.id = "rabbitTvGlass";
    glass.className = "rabbit-tv-glass";

    rabbitTvWrap.appendChild(rabbitTvVideo);
    rabbitTvWrap.appendChild(glass);

    rabbitTvVideo.addEventListener("ended", resetRabbitTvToStatic);
    rabbitTvVideo.addEventListener("error", () => {
      resetRabbitTvToStatic();
      showRabbitTvToast("MP4 file missing or still deploying. Upload the MP4 files to the site root.", 3200);
    });
  }

  return true;
}

function resetRabbitTvToStatic() {
  if (!rabbitTvVideo) return;

  try {
    rabbitTvVideo.pause();
    rabbitTvVideo.classList.remove("active");
    rabbitTvVideo.controls = false;
    rabbitTvVideo.removeAttribute("src");
    rabbitTvVideo.load();
  } catch {}

  if (rabbitTvWrap) {
    rabbitTvWrap.classList.remove("rabbit-video-playing");
  }
}

async function checkVideoFileExists(videoUrl) {
  try {
    const response = await fetch(videoUrl, { method: "HEAD", cache: "no-store" });
    return response.ok;
  } catch {
    return true;
  }
}

async function playRabbitTvVideo(videoUrl, label = "Video") {
  if (!ensureRabbitTv()) {
    showRabbitTvToast("TV video screen is not ready yet.", 2600);
    return;
  }

  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  const exists = await checkVideoFileExists(videoUrl);
  if (!exists) {
    showRabbitTvToast(`Missing file: ${videoUrl}. Upload it as a separate root file.`, 3800);
    return;
  }

  resetRabbitTvToStatic();

  rabbitTvVideo.src = videoUrl;
  rabbitTvVideo.currentTime = 0;
  rabbitTvVideo.muted = !rabbitTvSoundOn;
  rabbitTvVideo.volume = rabbitTvSoundOn ? 1 : 0;
  rabbitTvVideo.controls = false;

  if (rabbitTvWrap) {
    rabbitTvWrap.classList.add("rabbit-video-playing");
  }

  rabbitTvVideo.classList.add("active");
  showRabbitTvToast(`${label} playing on TV`);

  try {
    await rabbitTvVideo.play();
  } catch {
    try {
      rabbitTvVideo.muted = true;
      rabbitTvVideo.controls = true;
      await rabbitTvVideo.play();
      showRabbitTvToast("Browser blocked sound. Use the TV controls or toggle volume.", 3300);
    } catch {
      rabbitTvVideo.controls = true;
      showRabbitTvToast("Tap the video screen or confirm the MP4 file uploaded separately.", 3600);
    }
  }
}

function normalizeUrl(url) {
  return String(url || "").trim();
}

function isMp4Url(url) {
  return /\.mp4($|\?)/i.test(normalizeUrl(url));
}

function isComingSoonSpot(spot) {
  const id = String(spot.id || "").toLowerCase();
  const url = normalizeUrl(spot.url).toLowerCase();

  if (spot.comingSoon) return true;
  if (comingSoonIds.has(id)) return true;

  return deadUrlParts.some(part => url.includes(part));
}

function getSafeSpot(spot) {
  const comingSoon = isComingSoonSpot(spot);
  const videoUrl = spot.video || (isMp4Url(spot.url) ? spot.url : "");

  return {
    ...spot,
    tag: comingSoon ? "Coming Soon" : spot.tag,
    text: comingSoon ? (spot.text || "This part of the rabbit hole is coming soon.") : spot.text,
    url: comingSoon ? UNDER_CONSTRUCTION_URL : spot.url,
    sameTab: comingSoon ? true : spot.sameTab,
    video: comingSoon ? "" : videoUrl,
    comingSoon
  };
}

function renderHotspots() {
  if (!container) return;

  container.innerHTML = "";

  rabbitHotspots.forEach((rawSpot, index) => {
    const spot = getSafeSpot(rawSpot);

    const button = document.createElement("button");
    button.className = `rabbit-hotspot ${spot.id}`;
    button.type = "button";
    button.style.left = spot.x + "%";
    button.style.top = spot.y + "%";
    button.style.width = spot.size + "px";
    button.style.height = spot.size + "px";
    button.dataset.index = index;
    button.dataset.label = spot.title;

    /*
      No browser hover popups on the live page.
      Edit mode still shows CSS labels from data-label.
    */
    button.removeAttribute("title");

    if (isEditMode) {
      button.setAttribute("aria-label", spot.title);
      makeDraggable(button, rawSpot, index);
    } else {
      button.removeAttribute("aria-label");
      button.addEventListener("click", () => handleHotspotClick(spot));
    }

    container.appendChild(button);
  });
}

function handleHotspotClick(spot) {
  const safeSpot = getSafeSpot(spot);

  if (safeSpot.video) {
    playRabbitTvVideo(safeSpot.video, safeSpot.title);
    return;
  }

  openRabbitModal(safeSpot);
}

function openRabbitModal(spot) {
  if (!modal || !tag || !title || !text || !link) return;

  const safeSpot = getSafeSpot(spot);

  tag.textContent = safeSpot.comingSoon ? "COMING SOON" : safeSpot.tag;
  title.textContent = safeSpot.title;
  text.textContent = safeSpot.text;

  link.href = safeSpot.comingSoon ? UNDER_CONSTRUCTION_URL : safeSpot.url;
  link.textContent = safeSpot.comingSoon
    ? "COMING SOON"
    : (safeSpot.buttonText || (safeSpot.sameTab ? "ENTER" : "OPEN LINK"));

  link.target = safeSpot.sameTab ? "_self" : "_blank";
  link.rel = safeSpot.sameTab ? "" : "noopener noreferrer";
  link.onclick = null;
  link.removeAttribute("title");
  link.removeAttribute("aria-label");

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function makeDraggable(button, spot) {
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    try {
      button.setPointerCapture(event.pointerId);
    } catch {}

    const stage = document.querySelector(".rabbit-stage");
    if (!stage) return;

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
  if (document.querySelector(".rabbit-editor-panel")) return;

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

  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      updateEditorOutput();

      const output = document.getElementById("rabbitHotspotOutput");
      const value = output ? output.value : "";

      try {
        await navigator.clipboard.writeText(value);
        copyButton.textContent = "COPIED!";
        setTimeout(() => {
          copyButton.textContent = "COPY UPDATED HOTSPOTS";
        }, 1200);
      } catch {
        alert("Could not auto-copy. Select the text box and copy manually.");
      }
    });
  }
}

function updateEditorOutput() {
  const output = document.getElementById("rabbitHotspotOutput");
  if (!output) return;

  output.value = `const rabbitHotspots = ${JSON.stringify(rabbitHotspots, null, 2)};`;
}

if (closeBtn && modal) {
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  });
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }
});

function initRabbitHole() {
  renderHotspots();
  updateEditorOutput();

  /*
    Give rabbit-overlays.js a moment to create the actual static TV overlay.
    If it does not exist, ensureRabbitTv() creates a fallback.
  */
  setTimeout(ensureRabbitTv, 80);
  setTimeout(ensureRabbitTv, 450);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initRabbitHole);
} else {
  initRabbitHole();
}
