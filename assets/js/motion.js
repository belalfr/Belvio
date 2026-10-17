// look: back end (dark, default) or front end (cream). Chosen before first paint so there is no flash.
(function () {
  var m = null;
  try {
    var q = new URLSearchParams(location.search).get("mode");
    if (q === "front" || q === "back") localStorage.setItem("belvio-mode", q);
    m = localStorage.getItem("belvio-mode");
  } catch (e) {}
  document.documentElement.setAttribute("data-mode", m === "front" ? "front" : "back");
  if (m === "front") { var tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.setAttribute("content", "#f3eedf"); }
})();
// Sets <html data-motion="full|reduced">. Visitors with reduced-motion on get a calm site.
// Preview full motion with ?motion=on, calm with ?motion=off (remembered for the session).
(function () {
  var de = document.documentElement, mode = null;
  try {
    var q = new URLSearchParams(location.search).get("motion");
    if (q === "on" || q === "off") sessionStorage.setItem("belvio-motion", q);
    mode = sessionStorage.getItem("belvio-motion");
  } catch (e) {}
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (mode === "on") reduced = false;
  if (mode === "off") reduced = true;
  de.setAttribute("data-motion", reduced ? "reduced" : "full");
  // reload / back / arriving at #section: keep the page hidden until the browser (or nav.js) has put it in place, so you never see the top first
  try {
    var nt = performance.getEntriesByType("navigation")[0], ty = nt && nt.type;
    var hold = !reduced && (location.hash.length > 1 || ty === "back_forward" || (ty === "reload" && location.pathname !== "/"));
    if (hold) {
      de.classList.add("pos-hold");
      var rel = function () { requestAnimationFrame(function () { requestAnimationFrame(function () { de.classList.remove("pos-hold"); }); }); };
      if (document.readyState === "complete") setTimeout(rel, 200); else window.addEventListener("load", function () { setTimeout(rel, 200); });
      setTimeout(function () { de.classList.remove("pos-hold"); }, 2500);
    }
  } catch (e) {}
  // hidden state for [data-reveal] is applied now, before first paint, so there is no flash and no transition into it
  if (reduced) { de.classList.add("is-ready"); }
  else {
    de.classList.add("reveal-ready");
    setTimeout(function () { if (!window.__revealGo) { de.classList.remove("reveal-ready"); de.classList.add("is-ready"); } }, 9000);
  }
})();
