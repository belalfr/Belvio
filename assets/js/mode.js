// Back end / front end switch. The look is chosen in <head> (motion.js) so there is no flash.
// Control: the sun/moon icon beside the CTA, plus the "Flip the site" button in the footer.
// The change opens the other mode as a ring from the button. Browsers without view transitions just switch.
(function () {
  var de = document.documentElement, busy = false;
  if (de.classList.contains("is-embed")) return;
  function cur() { return de.getAttribute("data-mode") === "front" ? "front" : "back"; }
  function sync() {
    var f = cur() === "front";
    document.querySelectorAll(".tmode").forEach(function (b) { b.setAttribute("aria-label", f ? "Switch to dark mode" : "Switch to light mode"); });
    var tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.setAttribute("content", f ? "#f3eedf" : "#0b0b09");
  }
  function apply(m) {
    de.setAttribute("data-mode", m);
    try { localStorage.setItem("belvio-mode", m); } catch (e) {}
    sync();
  }
  function flip(from) {
    if (busy) return;
    var next = cur() === "front" ? "back" : "front";
    var calm = de.getAttribute("data-motion") === "reduced";
    if (!document.startViewTransition || calm) { apply(next); return; }
    busy = true;
    var r = from.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, vw = de.clientWidth, vh = window.innerHeight;
    var R = Math.ceil(Math.max(Math.hypot(x, y), Math.hypot(vw - x, y), Math.hypot(x, vh - y), Math.hypot(vw - x, vh - y))) + 10;
    var ring = document.createElement("div");
    ring.className = "tm-ring " + (next === "front" ? "to-light" : "to-dark");
    ring.style.cssText = "left:" + (x - R) + "px;top:" + (y - R) + "px;width:" + (2 * R) + "px;height:" + (2 * R) + "px";
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);
    var vt = document.startViewTransition(function () { apply(next); });
    var done = function () { ring.remove(); busy = false; };
    vt.ready.then(function () {
      var o = { duration: 1000, easing: "cubic-bezier(.65,.02,.25,1)", fill: "forwards" };
      de.animate({ clipPath: ["circle(22px at " + x + "px " + y + "px)", "circle(" + R + "px at " + x + "px " + y + "px)"] }, Object.assign({ pseudoElement: "::view-transition-new(root)" }, o));
      ring.animate({ "--rr": ["0px", R + "px"] }, o);
      ring.animate({ transform: ["rotate(0deg)", "rotate(" + (next === "front" ? 50 : -30) + "deg)"] }, o);
    }, done);
    vt.finished.then(done, done);
    setTimeout(done, 2500);
  }
  sync();
  document.querySelectorAll(".tmode, .flip-link").forEach(function (b) { b.addEventListener("click", function () { flip(b); }); });
})();
