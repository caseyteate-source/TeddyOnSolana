
/*
  $TEDDY global dead-link + hover-description cleaner

  Add before </body> on any old page:
  <script src="dead-links.js"></script>

  What it does:
  - Removes browser hover descriptions/tooltips from links/buttons.
  - Keeps real links alone.
  - Sends blank, #, placeholder, TODO, and coming-soon links to under-construction.html.
  - Watches future JS-created links/hotspots too.
*/

(function () {
  const UNDER_CONSTRUCTION_URL = "/under-construction.html";

  const deadHrefValues = new Set([
    "",
    "#",
    "javascript:void(0)",
    "javascript:void(0);",
    "coming-soon",
    "coming-soon.html",
    "placeholder",
    "placeholder.html",
    "todo",
    "todo.html",
    "under-construction",
    "under-construction.html#"
  ]);

  function isDeadHref(rawHref) {
    if (!rawHref) return true;

    const href = String(rawHref).trim();
    const lower = href.toLowerCase();

    if (deadHrefValues.has(lower)) return true;
    if (lower.startsWith("#")) return true;
    if (lower.includes("coming-soon")) return true;
    if (lower.includes("placeholder")) return true;
    if (lower.includes("todo")) return true;

    return false;
  }

  function cleanHoverDescriptions(el) {
    if (!el || !el.removeAttribute) return;

    el.removeAttribute("title");
    el.removeAttribute("aria-label");
    el.removeAttribute("data-tooltip");

    if ("title" in el) {
      try { el.title = ""; } catch (e) {}
    }
  }

  function prepElement(el) {
    cleanHoverDescriptions(el);

    if (el.tagName === "A") {
      const rawHref = el.getAttribute("href");

      if (isDeadHref(rawHref)) {
        el.setAttribute("href", UNDER_CONSTRUCTION_URL);
        el.setAttribute("data-under-construction", "true");
      }
    }

    if (el.tagName === "BUTTON") {
      const rawUrl = el.getAttribute("data-url") || el.getAttribute("data-href");

      if (rawUrl && isDeadHref(rawUrl)) {
        el.setAttribute("data-url", UNDER_CONSTRUCTION_URL);
        el.setAttribute("data-href", UNDER_CONSTRUCTION_URL);
        if (!el.dataset.deadLinkBound) {
          el.dataset.deadLinkBound = "true";
          el.addEventListener("click", function () {
            window.location.href = UNDER_CONSTRUCTION_URL;
          });
        }
      }
    }
  }

  function prepAll(root) {
    const scope = root || document;

    if (scope.matches && (scope.matches("a") || scope.matches("button"))) {
      prepElement(scope);
    }

    scope.querySelectorAll?.("a, button").forEach(prepElement);
  }

  function injectNoTooltipStyle() {
    if (document.getElementById("teddy-no-hover-tooltip-style")) return;

    const style = document.createElement("style");
    style.id = "teddy-no-hover-tooltip-style";
    style.textContent = `
      a[title],
      button[title],
      [data-tooltip] {
        -webkit-tap-highlight-color: transparent;
      }

      [data-tooltip]::before,
      [data-tooltip]::after {
        content: none !important;
        display: none !important;
      }

      a:hover::before,
      a:hover::after,
      button:hover::before,
      button:hover::after {
        /* This only blocks common tooltip pseudo-elements, not page layout. */
        pointer-events: none;
      }
    `;

    document.head.appendChild(style);
  }

  function startObserver() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          prepElement(mutation.target);
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) prepAll(node);
        });
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["title", "aria-label", "data-tooltip", "href", "data-url", "data-href"]
    });
  }

  function init() {
    injectNoTooltipStyle();
    prepAll(document);
    startObserver();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
