// Scroll "unfold" reveal. Add data-reveal to anything that should unfold in.
// The hidden state is applied by motion.js (in <head>) before first paint and without a transition,
// so the unfold always plays from the start, also on reload and when you arrive from another page.
(function () {
  var de = document.documentElement;
  function ready() { window.__revealGo = true; de.classList.add("is-ready"); }
  if (de.dataset.motion === "reduced" || !("IntersectionObserver" in window)) { ready(); return; }
  var DURATION = 1800, STAGGER = 130;
  var list = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  list = list.filter(function (el) { for (var p = el.parentElement; p; p = p.parentElement) if (p.hasAttribute("data-reveal")) return false; return true; });
  if (!list.length) { ready(); return; }
  de.classList.add("reveal-ready");
  var io = new IntersectionObserver(function (entries) {
    entries.filter(function (e) { return e.isIntersecting; }).forEach(function (entry, i) {
      var el = entry.target; io.unobserve(el);
      el.style.transitionDelay = (i * STAGGER) + "ms";
      el.classList.add("is-in");
      setTimeout(function () { el.removeAttribute("data-reveal"); el.classList.remove("is-in"); el.style.transitionDelay = ""; }, DURATION + i * STAGGER + 150);
    });
  }, { threshold: 0.1 });
  function go() {
    ready();
    requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(function () { list.forEach(function (el) { io.observe(el); }); }, 80); }); });
  }
  function afterLoad() {
    var fonts = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1200); })]) : Promise.resolve();
    fonts.then(go);
  }
  function start() { if (document.readyState === "complete") afterLoad(); else window.addEventListener("load", afterLoad, { once: true }); }
  if (de.classList.contains("is-loading")) document.addEventListener("belvio:loaded", start, { once: true }); else start();
})();
