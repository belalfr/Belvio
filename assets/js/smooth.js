// Lenis smooth scroll. Lower lerp = floatier. Anchor links are handled in nav.js.
(function () {
  if (document.documentElement.dataset.motion === "reduced" || typeof Lenis === "undefined") return;
  var lenis = new Lenis({ lerp: 0.045, wheelMultiplier: 0.85 });
  window.lenis = lenis;
  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
})();
