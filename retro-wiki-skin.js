
/* ======================================================
   $TEDDY RETRO WIKI SKIN
   Forces all wiki/modal boxes into radical 80s style.
   Add this AFTER wiki.js on pages that use wiki popups.
====================================================== */

(function () {
  const style = document.createElement("style");
  style.id = "retroWikiSkinForced";

  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Monoton&family=Orbitron:wght@500;700;900&family=Permanent+Marker&family=Space+Mono:wght@400;700&display=swap');

    :root {
      --rw-cyan: #22f3ff;
      --rw-pink: #ff39b7;
      --rw-yellow: #ffe76a;
      --rw-purple: #170026;
      --rw-purple2: #2a0446;
      --rw-deep: #05000d;
      --rw-white: #f8fbff;
    }

    #wikiModal,
    .wiki-modal,
    .modal,
    #clueModal {
      align-items: center !important;
      justify-content: center !important;
      padding: 24px !important;
      background:
        radial-gradient(circle at 50% 15%, rgba(34,243,255,.16), transparent 30%),
        radial-gradient(circle at 50% 85%, rgba(255,57,183,.14), transparent 34%),
        rgba(0,0,0,.84) !important;
      backdrop-filter: blur(8px) saturate(1.1) !important;
    }

    #wikiModal.active,
    .wiki-modal.active,
    .modal.active,
    #clueModal.active {
      display: flex !important;
    }

    #wikiModal > div,
    #clueModal > div,
    .wiki-modal > div,
    .modal > div,
    .wiki-modal-box,
    .modal-box,
    .wiki-box,
    .clue-box {
      width: min(790px, 94vw) !important;
      max-width: 790px !important;
      margin: 0 auto !important;
      padding: 32px 28px 28px !important;
      border-radius: 30px !important;
      border: 3px solid var(--rw-pink) !important;
      text-align: center !important;
      position: relative !important;
      overflow: hidden !important;

      background:
        linear-gradient(135deg, rgba(34,243,255,.12), transparent 26%),
        linear-gradient(315deg, rgba(255,57,183,.14), transparent 32%),
        linear-gradient(180deg, var(--rw-purple2), var(--rw-purple) 54%, var(--rw-deep)) !important;

      box-shadow:
        0 0 20px rgba(255,57,183,.95),
        0 0 52px rgba(34,243,255,.28),
        0 0 88px rgba(255,57,183,.22),
        inset 0 0 24px rgba(34,243,255,.08) !important;
    }

    #wikiModal > div::before,
    #clueModal > div::before,
    .wiki-modal > div::before,
    .modal > div::before,
    .wiki-modal-box::before,
    .modal-box::before,
    .wiki-box::before,
    .clue-box::before {
      content: "" !important;
      position: absolute !important;
      inset: 9px !important;
      border-radius: 22px !important;
      pointer-events: none !important;
      z-index: 0 !important;
      border: 1px solid rgba(34,243,255,.24) !important;
      box-shadow:
        inset 0 0 20px rgba(34,243,255,.10),
        inset 0 0 28px rgba(255,57,183,.08) !important;
    }

    #wikiModal > div::after,
    #clueModal > div::after,
    .wiki-modal > div::after,
    .modal > div::after,
    .wiki-modal-box::after,
    .modal-box::after,
    .wiki-box::after,
    .clue-box::after {
      content: "" !important;
      position: absolute !important;
      inset: 0 !important;
      pointer-events: none !important;
      z-index: 0 !important;
      background:
        repeating-linear-gradient(
          to bottom,
          rgba(255,255,255,.045) 0px,
          rgba(255,255,255,.045) 1px,
          transparent 2px,
          transparent 5px
        ) !important;
      opacity: .2 !important;
      mix-blend-mode: screen !important;
    }

    #wikiModal > div > *,
    #clueModal > div > *,
    .wiki-modal > div > *,
    .modal > div > *,
    .wiki-modal-box > *,
    .modal-box > *,
    .wiki-box > *,
    .clue-box > * {
      position: relative !important;
      z-index: 2 !important;
    }

    #wikiClose,
    #closeModal,
    .close,
    .modal-close,
    .close-modal {
      position: absolute !important;
      top: 12px !important;
      right: 18px !important;
      z-index: 10 !important;
      background: transparent !important;
      border: 0 !important;
      color: white !important;
      font-family: "Orbitron", sans-serif !important;
      font-size: 38px !important;
      font-weight: 900 !important;
      line-height: 1 !important;
      cursor: pointer !important;
      text-shadow:
        0 0 8px var(--rw-pink),
        0 0 18px var(--rw-pink) !important;
    }

    #wikiTag,
    .wiki-tag,
    .modal-tag,
    .tag,
    .tagline {
      display: inline-block !important;
      margin: 0 auto 14px !important;
      padding: 8px 15px !important;
      border-radius: 999px !important;
      border: 1px solid rgba(255,231,106,.5) !important;
      background: rgba(255,231,106,.11) !important;
      color: var(--rw-yellow) !important;
      font-family: "Orbitron", sans-serif !important;
      font-size: clamp(11px, 1.1vw, 13px) !important;
      font-weight: 900 !important;
      letter-spacing: 2px !important;
      line-height: 1.2 !important;
      text-transform: uppercase !important;
      text-align: center !important;
      text-shadow:
        0 0 8px rgba(255,231,106,.65),
        0 0 16px rgba(255,231,106,.25) !important;
    }

    #wikiTitle,
    #modalTitle,
    .wiki-title,
    .modal-title,
    #wikiModal h1,
    #wikiModal h2,
    #clueModal h1,
    #clueModal h2,
    .modal h1,
    .modal h2,
    .wiki-modal h1,
    .wiki-modal h2 {
      display: block !important;
      width: 100% !important;
      margin: 0 auto 10px !important;
      text-align: center !important;
      font-family: "Bungee", sans-serif !important;
      font-size: clamp(38px, 5vw, 70px) !important;
      font-weight: 400 !important;
      line-height: .9 !important;
      letter-spacing: 1px !important;
      text-transform: uppercase !important;

      background: linear-gradient(
        180deg,
        #fff8fd 0%,
        #ffd4ef 12%,
        #ff84ca 28%,
        #ff42b2 45%,
        #48ecff 70%,
        #1b8fff 100%
      ) !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      color: transparent !important;
      text-shadow: none !important;
      filter:
        drop-shadow(0 4px 0 rgba(0,0,0,.25))
        drop-shadow(0 0 7px rgba(255,57,183,.28)) !important;
    }

    #wikiDate,
    .wiki-date,
    .modal-date,
    .modal-subtitle,
    #wikiModal h3,
    #clueModal h3,
    .modal h3,
    .wiki-modal h3 {
      display: block !important;
      margin: 0 auto 20px !important;
      text-align: center !important;
      font-family: "Permanent Marker", cursive !important;
      font-size: clamp(19px, 2.2vw, 30px) !important;
      font-weight: 400 !important;
      line-height: 1.1 !important;
      letter-spacing: .3px !important;
      color: #ff74c6 !important;
      text-shadow:
        0 0 10px rgba(255,57,183,.6),
        0 0 18px rgba(255,57,183,.24) !important;
    }

    #wikiDate::after,
    .wiki-date::after,
    .modal-date::after,
    .modal-subtitle::after,
    #wikiModal h3::after,
    #clueModal h3::after,
    .modal h3::after,
    .wiki-modal h3::after {
      content: "" !important;
      display: block !important;
      width: min(360px, 72%) !important;
      height: 2px !important;
      margin: 14px auto 0 !important;
      background: linear-gradient(to right, transparent, var(--rw-cyan), var(--rw-pink), transparent) !important;
      box-shadow: 0 0 10px rgba(34,243,255,.38) !important;
    }

    #wikiText,
    #modalText,
    .wiki-text,
    .modal-text,
    #wikiModal p,
    #clueModal p,
    .modal p,
    .wiki-modal p {
      max-width: 620px !important;
      margin-left: auto !important;
      margin-right: auto !important;
      text-align: center !important;
      font-family: "Space Mono", monospace !important;
      font-size: clamp(15px, 1.25vw, 18px) !important;
      line-height: 1.72 !important;
      color: var(--rw-white) !important;
    }

    #wikiModal h4,
    #clueModal h4,
    .modal h4,
    .wiki-modal h4,
    .section-label,
    .wiki-section-title {
      display: block !important;
      width: 100% !important;
      margin: 24px auto 12px !important;
      text-align: center !important;
      font-family: "Monoton", cursive !important;
      font-size: clamp(20px, 2.3vw, 32px) !important;
      line-height: 1.05 !important;
      font-weight: 400 !important;
      letter-spacing: 1px !important;
      color: var(--rw-cyan) !important;
      text-shadow:
        0 0 8px rgba(34,243,255,.8),
        0 0 20px rgba(34,243,255,.34) !important;
    }

    #wikiTheoryInput,
    #theoryInput,
    textarea,
    .theory-input {
      width: min(590px, 100%) !important;
      min-height: 118px !important;
      display: block !important;
      margin: 0 auto !important;
      padding: 16px 18px !important;
      box-sizing: border-box !important;
      border-radius: 18px !important;
      border: 2px solid var(--rw-cyan) !important;
      background: linear-gradient(180deg, rgba(0,10,28,.96), rgba(2,0,18,.98)) !important;
      color: #e4fcff !important;
      font-family: "Space Mono", monospace !important;
      font-size: clamp(15px, 1.15vw, 17px) !important;
      line-height: 1.55 !important;
      text-align: left !important;
      resize: vertical !important;
      outline: none !important;
      box-shadow:
        inset 0 0 18px rgba(34,243,255,.08),
        0 0 16px rgba(34,243,255,.16) !important;
    }

    #savedTheories,
    .saved-theories,
    .theory-list {
      width: min(590px, 100%) !important;
      margin: 16px auto 0 !important;
      padding: 14px !important;
      border-radius: 18px !important;
      border: 1px solid rgba(255,57,183,.3) !important;
      background: rgba(255,57,183,.06) !important;
      box-shadow: inset 0 0 12px rgba(255,57,183,.07) !important;
      text-align: center !important;
    }

    .wiki-actions,
    .modal-actions,
    .button-row,
    .modal-buttons,
    .wiki-buttons,
    #wikiModal .actions,
    #clueModal .actions {
      display: flex !important;
      flex-wrap: wrap !important;
      justify-content: center !important;
      align-items: center !important;
      gap: 12px !important;
      margin-top: 18px !important;
    }

    #wikiModal button:not(#wikiClose),
    #clueModal button:not(#closeModal),
    .modal button:not(.close):not(.modal-close):not(.close-modal),
    .wiki-modal button:not(.close):not(.modal-close):not(.close-modal),
    #wikiModal a,
    #clueModal a,
    .modal a,
    .wiki-modal a {
      min-width: 220px !important;
      min-height: 56px !important;
      padding: 14px 22px !important;
      border-radius: 18px !important;
      border: 2px solid transparent !important;
      display: inline-flex !important;
      justify-content: center !important;
      align-items: center !important;
      text-decoration: none !important;
      cursor: pointer !important;
      color: white !important;
      font-family: "Orbitron", sans-serif !important;
      font-size: clamp(14px, 1.2vw, 17px) !important;
      font-weight: 900 !important;
      letter-spacing: .8px !important;
      text-transform: uppercase !important;
      transition: transform .18s ease, filter .18s ease, border-color .18s ease !important;
    }

    #saveTheory,
    .save-btn,
    .primary,
    #wikiModal button:first-of-type:not(#wikiClose),
    #clueModal button:first-of-type:not(#closeModal) {
      background: linear-gradient(180deg, #ff4bbd, #eb1587) !important;
      box-shadow:
        0 0 18px rgba(255,57,183,.55),
        inset 0 -3px 0 rgba(0,0,0,.25) !important;
    }

    #openXPost,
    .xpost-btn,
    .secondary,
    .modal-link,
    .wiki-link,
    #wikiModal a,
    #clueModal a,
    .modal a,
    .wiki-modal a {
      background: linear-gradient(180deg, #31cfff, #0e86de) !important;
      box-shadow:
        0 0 18px rgba(34,243,255,.45),
        inset 0 -3px 0 rgba(0,0,0,.25) !important;
    }

    #wikiModal button:hover,
    #clueModal button:hover,
    .modal button:hover,
    .wiki-modal button:hover,
    #wikiModal a:hover,
    #clueModal a:hover,
    .modal a:hover,
    .wiki-modal a:hover {
      transform: translateY(-2px) scale(1.015) !important;
      border-color: white !important;
      filter: brightness(1.1) !important;
    }

    @media (max-width: 700px) {
      #wikiModal > div,
      #clueModal > div,
      .wiki-modal > div,
      .modal > div,
      .wiki-modal-box,
      .modal-box,
      .wiki-box,
      .clue-box {
        width: min(94vw, 680px) !important;
        padding: 24px 16px 22px !important;
        border-radius: 24px !important;
      }

      #wikiTitle,
      #modalTitle,
      #wikiModal h1,
      #wikiModal h2,
      #clueModal h1,
      #clueModal h2,
      .modal h1,
      .modal h2 {
        font-size: 31px !important;
      }

      #wikiModal button:not(#wikiClose),
      #clueModal button:not(#closeModal),
      .modal button:not(.close):not(.modal-close):not(.close-modal),
      .wiki-modal button:not(.close):not(.modal-close):not(.close-modal),
      #wikiModal a,
      #clueModal a,
      .modal a,
      .wiki-modal a {
        width: 100% !important;
        min-width: 100% !important;
      }
    }
  `;

  document.head.appendChild(style);

  function markWikiCards() {
    const candidates = document.querySelectorAll(
      "#wikiModal, #clueModal, .wiki-modal, .modal"
    );

    candidates.forEach((modal) => {
      modal.classList.add("retro-wiki-forced");
    });
  }

  markWikiCards();

  const observer = new MutationObserver(markWikiCards);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"]
  });
})();
