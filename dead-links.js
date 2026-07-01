/*
  $TEDDY dead link catcher

  Optional use:
  Add this before </body> on any old page:

  <script src="dead-links.js"></script>

  It leaves real working hrefs alone.
  It redirects placeholder/dead links to under-construction.html.
*/

(function () {
  const UNDER_CONSTRUCTION_URL = "under-construction.html";

  const deadHrefValues = new Set([
    "",
    "#",
    "javascript:void(0)",
    "javascript:void(0);",
    "coming-soon",
    "coming-soon.html",
    "under-construction",
    "under-construction.html#"
  ]);

  function isDeadHref(rawHref) {
    if (!rawHref) return true;

    const href = rawHref.trim();
    const lower = href.toLowerCase();

    if (deadHrefValues.has(lower)) return true;
    if (lower.startsWith("#")) return true;
    if (lower.includes("coming-soon")) return true;
    if (lower.includes("placeholder")) return true;
    if (lower.includes("todo")) return true;

    return false;
  }

  function prepDeadLinks() {
    document.querySelectorAll("a").forEach((link) => {
      const rawHref = link.getAttribute("href");

      link.removeAttribute("title");
      link.removeAttribute("aria-label");
      link.removeAttribute("data-tooltip");

      if (isDeadHref(rawHref)) {
        link.setAttribute("href", UNDER_CONSTRUCTION_URL);
        link.setAttribute("data-under-construction", "true");
      }
    });

    document.querySelectorAll("button[data-url], button[data-href]").forEach((button) => {
      const rawUrl = button.getAttribute("data-url") || button.getAttribute("data-href");

      button.removeAttribute("title");
      button.removeAttribute("aria-label");
      button.removeAttribute("data-tooltip");

      if (isDeadHref(rawUrl)) {
        button.setAttribute("data-url", UNDER_CONSTRUCTION_URL);
        button.setAttribute("data-href", UNDER_CONSTRUCTION_URL);
        button.addEventListener("click", function () {
          window.location.href = UNDER_CONSTRUCTION_URL;
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prepDeadLinks);
  } else {
    prepDeadLinks();
  }
})();
