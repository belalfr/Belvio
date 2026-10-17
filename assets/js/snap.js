// Soft section magnet (all pages, desktop, full motion). When the wheel stops close to a section's top,
// the page eases the last bit into place so the "GET /section" line sits just under the header.
// Proximity only: it never pulls from far away and never traps you.
(function () {
  var de = document.documentElement, OFFSET = 96;
  if (de.dataset.motion === "reduced" || !document.body.hasAttribute("data-snap")) return;
  if (!window.matchMedia("(hover: hover) and (min-width: 900px)").matches) return;
  var sections = Array.prototype.slice.call(document.querySelectorAll(".hero, .sec"));
  if (!sections.length) return;
  var lastInput = 0, timer = null;
  function mark() { lastInput = Date.now(); clearTimeout(timer); timer = setTimeout(tryTo, 260); }
  window.addEventListener("wheel", mark, { passive: true });
  window.addEventListener("keydown", function (e) { if ([" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp"].indexOf(e.key) > -1) mark(); });
  function tryTo() {
    if (!window.lenis || Date.now() - lastInput > 650) return; // scrollbar drags don't count
    var y = window.scrollY, vh = window.innerHeight, best = null, bestD = 1e9;
    sections.forEach(function (s) {
      var top = s.getBoundingClientRect().top + y;
      var target = s.classList.contains("hero") ? 0 : Math.max(0, top - OFFSET);
      var d = Math.abs(target - y);
      if (d < bestD) { bestD = d; best = target; }
    });
    if (best !== null && bestD > 6 && bestD < vh * 0.17) window.lenis.scrollTo(best, { duration: 0.85 });
  }
})();
