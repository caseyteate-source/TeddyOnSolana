/* ======================================================
   $TEDDY UNIVERSAL TV POP-OUT
   Full replacement file: tv-popout.js

   What it does:
   - Click a TV/video area and open a larger CRT-style TV pop-out.
   - Matches the site vibe: black rounded CRT frame, scanlines,
     old static texture, neon glow, and close button.
   - Teddy page: uses the currently playing TV video when possible.
   - Rabbit Hole page: TV hotspot/static opens the larger CRT instead
     of taking users to Memory Room.
====================================================== */

(function () {
  if (window.__teddyUniversalTvPopout) return;
  window.__teddyUniversalTvPopout = true;

  let sourceVideo = null;
  let sourceWasPlaying = false;
  let sourceWasMuted = true;

  function installTvPopoutStyles() {
    if (document.getElementById("teddyUniversalTvPopoutStyles")) return;

    const style = document.createElement("style");
    style.id = "teddyUniversalTvPopoutStyles";
    style.textContent = `
      .teddy-tv-popout-backdrop {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background:
          radial-gradient(circle at 50% 36%, rgba(0,245,255,.15), transparent 32%),
          radial-gradient(circle at 42% 56%, rgba(255,42,163,.13), transparent 32%),
          rgba(0,0,0,.86);
        backdrop-filter: blur(5px);
      }

      .teddy-tv-popout-backdrop.active {
        display: flex;
      }

      .teddy-tv-popout-tv {
        position: relative;
        width: min(92vw, 960px);
        aspect-ratio: 16 / 10;
        padding: clamp(18px, 3vw, 42px);
        border-radius: clamp(24px, 4vw, 46px);
        background:
          radial-gradient(circle at 28% 20%, rgba(255,255,255,.12), transparent 22%),
          linear-gradient(145deg, #261713 0%, #08080b 42%, #1b1123 100%);
        border: clamp(8px, 1.4vw, 16px) solid #2b1b17;
        box-shadow:
          0 0 34px rgba(0,245,255,.48),
          0 0 64px rgba(255,42,163,.26),
          inset 0 0 28px rgba(255,255,255,.08),
          inset 0 -18px 32px rgba(0,0,0,.52);
        transform: scale(.96);
        animation: teddyTvPopIn .18s ease-out forwards;
      }

      @keyframes teddyTvPopIn {
        from { transform: scale(.90); opacity: .58; }
        to { transform: scale(1); opacity: 1; }
      }

      .teddy-tv-popout-tv::before {
        content: "";
        position: absolute;
        inset: 9px;
        border-radius: clamp(17px, 3vw, 32px);
        pointer-events: none;
        border: 1px solid rgba(255,255,255,.12);
        box-shadow:
          inset 0 0 22px rgba(0,0,0,.88),
          0 0 18px rgba(0,245,255,.10);
      }

      .teddy-tv-popout-tv::after {
        content: "";
        position: absolute;
        right: clamp(14px, 2vw, 26px);
        bottom: clamp(12px, 2vw, 22px);
        width: clamp(48px, 7vw, 82px);
        height: clamp(16px, 2.2vw, 26px);
        border-radius: 999px;
        background:
          radial-gradient(circle at 18% 50%, #ff2aa3 0 18%, transparent 19%),
          radial-gradient(circle at 50% 50%, #00f5ff 0 14%, transparent 15%),
          radial-gradient(circle at 78% 50%, #ffea00 0 12%, transparent 13%),
          rgba(0,0,0,.55);
        box-shadow: inset 0 0 12px rgba(0,0,0,.75);
        opacity: .82;
        pointer-events: none;
      }

      .teddy-tv-popout-screen {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: clamp(16px, 2.4vw, 28px);
        background:
          repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,.06) 0,
            rgba(255,255,255,.06) 1px,
            transparent 2px,
            transparent 5px
          ),
          radial-gradient(circle at 50% 50%, #071827 0%, #020207 72%);
        box-shadow:
          inset 0 0 34px rgba(0,0,0,.96),
          inset 0 0 16px rgba(0,245,255,.16),
          0 0 18px rgba(0,245,255,.28);
      }

      .teddy-tv-popout-screen::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          linear-gradient(transparent 0%, rgba(255,255,255,.06) 50%, transparent 100%),
          radial-gradient(circle at 50% 50%, transparent 54%, rgba(0,0,0,.38) 100%);
        mix-blend-mode: screen;
        opacity: .42;
      }

      .teddy-tv-popout-video {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #000;
        display: none;
      }

      .teddy-tv-popout-video.active {
        display: block;
      }

      .teddy-tv-popout-static {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        color: #dffcff;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 900;
        text-align: center;
        letter-spacing: .08em;
        line-height: 1.35;
        padding: 20px;
        text-shadow:
          0 0 8px rgba(0,245,255,.9),
          0 0 18px rgba(255,42,163,.55);
        background:
          repeating-radial-gradient(circle at 30% 40%, rgba(255,255,255,.16) 0 1px, transparent 1px 4px),
          repeating-linear-gradient(to bottom, rgba(255,255,255,.08) 0 1px, transparent 1px 4px),
          #020207;
        animation: teddyTvStaticPulse .42s steps(2, end) infinite;
      }

      @keyframes teddyTvStaticPulse {
        0% { filter: brightness(.82) contrast(1.25); transform: translateX(0); }
        50% { filter: brightness(1.28) contrast(1.75); transform: translateX(.32%); }
        100% { filter: brightness(.94) contrast(1.38); transform: translateX(-.26%); }
      }


      .teddy-tv-popout-sound {
        position: absolute;
        left: clamp(18px, 3vw, 42px);
        bottom: clamp(-48px, -4.6vw, -34px);
        z-index: 7;
        min-width: 132px;
        height: 38px;
        border: 1px solid rgba(255,255,255,.62);
        border-radius: 999px;
        background: rgba(0,0,0,.78);
        color: #fff;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: .08em;
        display: none;
        align-items: center;
        justify-content: center;
        gap: 6px;
        cursor: pointer;
        box-shadow:
          0 0 16px rgba(0,245,255,.38),
          inset 0 0 10px rgba(255,255,255,.08);
        -webkit-tap-highlight-color: transparent;
      }

      .teddy-tv-popout-sound.sound-on {
        background: rgba(0, 150, 100, .88);
        border-color: rgba(180,255,220,.95);
        box-shadow:
          0 0 18px rgba(0,255,170,.45),
          inset 0 0 10px rgba(255,255,255,.08);
      }

      .teddy-tv-popout-sound:hover {
        background: rgba(255,42,163,.82);
        box-shadow: 0 0 18px rgba(255,42,163,.66);
      }

      .teddy-tv-popout-close {
        position: absolute;
        right: -13px;
        top: -13px;
        z-index: 6;
        width: 46px;
        height: 46px;
        border: 0;
        border-radius: 999px;
        background: #ff2aa3;
        color: white;
        font-size: 30px;
        line-height: 1;
        font-weight: 900;
        cursor: pointer;
        box-shadow:
          0 0 18px rgba(255,42,163,.9),
          inset 0 -3px 0 rgba(0,0,0,.25);
        -webkit-tap-highlight-color: transparent;
      }

      .teddy-tv-popout-close:hover {
        background: #00aaff;
        box-shadow: 0 0 18px rgba(0,245,255,.9);
      }

      .teddy-tv-popout-label {
        position: absolute;
        left: 24px;
        top: -32px;
        color: #ffea00;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: .12em;
        text-shadow: 0 0 12px rgba(255,234,0,.75);
        pointer-events: none;
      }

      #tvScreenAnim,
      #overlay-tv-screen,
      #tvStaticBox,
      #tv-static,
      .tv-static-wrap,
      .rabbit-hotspot.tv,
      .rabbit-hotspot.crt-tv,
      [data-tv-popout] {
        cursor: zoom-in !important;
      }

      @media (max-width: 760px) {
        .teddy-tv-popout-backdrop {
          padding: 12px;
        }

        .teddy-tv-popout-tv {
          width: 96vw;
          aspect-ratio: 4 / 3;
          border-radius: 26px;
          padding: 18px;
        }

        .teddy-tv-popout-screen {
          border-radius: 16px;
        }


        .teddy-tv-popout-sound {
          left: 14px;
          bottom: -44px;
          height: 36px;
          min-width: 126px;
          font-size: 11px;
        }

        .teddy-tv-popout-close {
          right: -7px;
          top: -7px;
          width: 42px;
          height: 42px;
          font-size: 27px;
        }

        .teddy-tv-popout-label {
          display: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createTvPopout() {
    if (document.getElementById("teddyTvPopout")) return;

    const backdrop = document.createElement("div");
    backdrop.id = "teddyTvPopout";
    backdrop.className = "teddy-tv-popout-backdrop";
    backdrop.setAttribute("aria-hidden", "true");

    backdrop.innerHTML = `
      <div class="teddy-tv-popout-tv" role="dialog" aria-label="Expanded TV">
        <div class="teddy-tv-popout-label">CLICK OUTSIDE OR × TO CLOSE</div>
        <button class="teddy-tv-popout-close" type="button" aria-label="Close expanded TV">×</button>
        <button class="teddy-tv-popout-sound" type="button" aria-label="Toggle expanded TV sound">🔇 SOUND OFF</button>
        <div class="teddy-tv-popout-screen">
          <div class="teddy-tv-popout-static">TV SIGNAL<br>CLICK A PLAYING VIDEO</div>
          <video
            class="teddy-tv-popout-video"
            playsinline
            webkit-playsinline
            controls
          ></video>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", (event) => {
      if (
        event.target === backdrop ||
        event.target.classList.contains("teddy-tv-popout-close")
      ) {
        closeTvPopout();
      }
    });

    const soundButton = backdrop.querySelector(".teddy-tv-popout-sound");
    if (soundButton) {
      soundButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const els = getPopoutEls();
        const popVideo = els.video;
        const turnSoundOn = popVideo ? (popVideo.muted || popVideo.volume === 0) : true;
        setPopoutSound(turnSoundOn);
      });
    }

    const popoutVideo = backdrop.querySelector(".teddy-tv-popout-video");
    if (popoutVideo) {
      popoutVideo.addEventListener("volumechange", updatePopoutSoundButton);
      popoutVideo.addEventListener("play", updatePopoutSoundButton);
      popoutVideo.addEventListener("pause", updatePopoutSoundButton);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeTvPopout();
    });
  }

  function getPopoutEls() {
    return {
      backdrop: document.getElementById("teddyTvPopout"),
      video: document.querySelector("#teddyTvPopout .teddy-tv-popout-video"),
      staticBox: document.querySelector("#teddyTvPopout .teddy-tv-popout-static"),
      soundButton: document.querySelector("#teddyTvPopout .teddy-tv-popout-sound")
    };
  }

  function isVideoActuallyShowing(video) {
    if (!video) return false;

    const style = window.getComputedStyle(video);
    const rect = video.getBoundingClientRect();

    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity || 1) > 0 &&
      rect.width > 0 &&
      rect.height > 0
    );
  }

  function findBestSourceVideo(clickedTarget) {
    if (clickedTarget && clickedTarget.tagName === "VIDEO") return clickedTarget;

    /*
      Teddy page sets this whenever a hidden TV switch changes the video.
      This fixes the reporter/robot clips where the click target is the
      hidden switch, not the TV screen itself.
    */
    if (
      window.__teddyActiveTvVideo &&
      window.__teddyActiveTvVideo.tagName === "VIDEO" &&
      (window.__teddyActiveTvVideo.currentSrc || window.__teddyActiveTvVideo.src)
    ) {
      return window.__teddyActiveTvVideo;
    }

    const localVideo = clickedTarget ? clickedTarget.querySelector?.("video") : null;
    if (localVideo) return localVideo;

    const tvContainers = [
      clickedTarget,
      document.getElementById("tvScreenAnim"),
      document.getElementById("overlay-tv-screen"),
      document.querySelector(".tv-static-wrap"),
      document.getElementById("tv-static"),
      document.body
    ].filter(Boolean);

    for (const container of tvContainers) {
      const videos = [...container.querySelectorAll("video")];
      const showing = videos.find(isVideoActuallyShowing);
      if (showing) return showing;

      const playing = videos.find((video) => !video.paused && video.currentTime > 0);
      if (playing) return playing;
    }

    const allVideos = [...document.querySelectorAll("video")];

    return (
      allVideos.find((video) => !video.paused && video.currentTime > 0) ||
      allVideos.find(isVideoActuallyShowing) ||
      null
    );
  }


  function updatePopoutSoundButton() {
    const { video, soundButton } = getPopoutEls();
    if (!soundButton) return;

    const hasVideo =
      video &&
      video.classList.contains("active") &&
      (video.currentSrc || video.src);

    soundButton.style.display = hasVideo ? "inline-flex" : "none";

    const soundOn = !!(
      hasVideo &&
      !video.muted &&
      Number(video.volume || 0) > 0
    );

    soundButton.textContent = soundOn ? "🔊 SOUND ON" : "🔇 SOUND OFF";
    soundButton.classList.toggle("sound-on", soundOn);
    soundButton.setAttribute("aria-label", soundOn ? "Turn expanded TV sound off" : "Turn expanded TV sound on");
  }

  function setPopoutSound(soundOn) {
    const { video } = getPopoutEls();
    const on = !!soundOn;

    if (video) {
      video.muted = !on;
      video.defaultMuted = !on;
      video.volume = on ? 1 : 0;
    }

    if (sourceVideo) {
      try {
        sourceVideo.muted = !on;
        sourceVideo.defaultMuted = !on;
        sourceVideo.volume = on ? 1 : 0;
      } catch {}
    }

    sourceWasMuted = !on;

    /*
      Teddy page exposes its own sound setter so the little TV sound icon
      stays in sync after using the expanded TV button.
    */
    if (typeof window.__teddySetTvSound === "function") {
      try {
        window.__teddySetTvSound(on);
      } catch {}
    }

    updatePopoutSoundButton();
  }

  function isNoTvPopoutTarget(target) {
    return Boolean(
      target.closest?.(
        "#tvSoundToggle, .tv-sound-toggle, .teddy-tv-popout-sound, [data-no-tv-popout]"
      )
    );
  }

  async function openTvPopout(clickedTarget) {
    installTvPopoutStyles();
    createTvPopout();

    const { backdrop, video, staticBox, soundButton } = getPopoutEls();
    if (!backdrop || !video || !staticBox) return;

    sourceVideo = findBestSourceVideo(clickedTarget);
    sourceWasPlaying = sourceVideo ? !sourceVideo.paused : false;
    sourceWasMuted = sourceVideo ? sourceVideo.muted : true;

    video.pause();
    video.removeAttribute("src");
    video.classList.remove("active");
    staticBox.style.display = "grid";
    staticBox.innerHTML = "TV SIGNAL<br>WAITING FOR VIDEO";

    if (sourceVideo && (sourceVideo.currentSrc || sourceVideo.src)) {
      const src = sourceVideo.currentSrc || sourceVideo.src;

      video.src = src;

      try {
        video.currentTime = Number.isFinite(sourceVideo.currentTime)
          ? sourceVideo.currentTime
          : 0;
      } catch {}

      video.muted = sourceVideo.muted;
      video.volume = sourceVideo.volume ?? 1;
      video.classList.add("active");
      staticBox.style.display = "none";
      updatePopoutSoundButton();

      try {
        sourceVideo.pause();
      } catch {}

      try {
        await video.play();
      } catch {
        /*
          iPhone may require a direct tap. Controls are visible.
        */
      }
    } else {
      staticBox.style.display = "grid";
      staticBox.innerHTML = "TV STATIC<br>NO VIDEO PLAYING";
      if (soundButton) soundButton.style.display = "none";
    }

    backdrop.classList.add("active");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("teddy-tv-popout-open");
  }

  function closeTvPopout() {
    const { backdrop, video } = getPopoutEls();
    if (!backdrop || !video) return;

    const popoutTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;

    video.pause();
    video.classList.remove("active");
    updatePopoutSoundButton();
    backdrop.classList.remove("active");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("teddy-tv-popout-open");

    if (sourceVideo) {
      try {
        sourceVideo.currentTime = popoutTime;
        sourceVideo.muted = sourceWasMuted;

        if (sourceWasPlaying) {
          sourceVideo.play().catch(() => {});
        }
      } catch {}
    }

    sourceVideo = null;
  }

  function isTvClickTarget(target) {
    if (isNoTvPopoutTarget(target)) return false;

    return Boolean(
      target.closest?.(
        "#tvScreenAnim, #overlay-tv-screen, #tvStaticBox, #tv-static, .tv-static-wrap, .rabbit-hotspot.tv, .rabbit-hotspot.crt-tv, [data-tv-popout]"
      )
    );
  }

  function handleTvClick(event) {
    const target = event.target;
    if (isNoTvPopoutTarget(target)) return;
    if (!isTvClickTarget(target)) return;

    if (target.closest("#teddyTvPopout")) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const tvTarget = target.closest(
      "#tvScreenAnim, #overlay-tv-screen, #tvStaticBox, #tv-static, .tv-static-wrap, .rabbit-hotspot.tv, .rabbit-hotspot.crt-tv, [data-tv-popout]"
    );

    openTvPopout(tvTarget);
  }

  function initTvPopout() {
    installTvPopoutStyles();
    createTvPopout();

    /*
      Capture phase is intentional. It lets the Rabbit Hole TV hotspot
      open this pop-out before rabbit-hole.js sends it to Memory Room.
    */
    document.addEventListener("click", handleTvClick, true);

    document.addEventListener("pointerup", (event) => {
      if (event.pointerType === "mouse") return;
      if (!isTvClickTarget(event.target)) return;
      handleTvClick(event);
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTvPopout);
  } else {
    initTvPopout();
  }

  window.openTeddyTvPopout = openTvPopout;
  window.closeTeddyTvPopout = closeTvPopout;

  window.openTeddyTvPopoutVideo = function (videoIdOrEl) {
    const video = typeof videoIdOrEl === "string"
      ? document.getElementById(videoIdOrEl)
      : videoIdOrEl;

    if (video && video.tagName === "VIDEO") {
      window.__teddyActiveTvVideo = video;
      openTvPopout(video);
    } else {
      openTvPopout(document.getElementById("tvScreenAnim") || document.body);
    }
  };
})();
