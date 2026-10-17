// Back end / front end switch. The look is chosen in <head> (motion.js) so there is no flash; this wires the buttons.
(function () {
  var de = document.documentElement, btns = document.querySelectorAll(".mode"), busy = false;
  if (!btns.length) return;
  function cur() { return de.getAttribute("data-mode") === "front" ? "front" : "back"; }
  function sync() {
    var f = cur() === "front";
    btns.forEach(function (b) {
      b.setAttribute("aria-pressed", f ? "true" : "false");
      b.setAttribute("aria-label", f ? "Front end view is on. Switch to back end view" : "Back end view is on. Switch to front end view");
    });
    var tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.setAttribute("content", f ? "#f3eedf" : "#0b0b09");
  }
  function apply(m) {
    de.setAttribute("data-mode", m);
    try { localStorage.setItem("belvio-mode", m); } catch (e) {}
    sync();
  }
  sync();
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      if (busy) return;
      var next = cur() === "front" ? "back" : "front";
      if (de.getAttribute("data-motion") === "reduced") { apply(next); return; }
      busy = true;
      var w = document.createElement("div");
      w.className = "mode-wipe"; w.setAttribute("aria-hidden", "true");
      w.style.background = next === "front" ? "#f3eedf" : "#0b0b09";
      w.style.boxShadow = "-18px 0 0 " + (next === "front" ? "#fcd949" : "#8ab4f8");
      document.body.appendChild(w);
      requestAnimationFrame(function () { requestAnimationFrame(function () { w.classList.add("in"); }); });
      setTimeout(function () { apply(next); w.classList.remove("in"); w.classList.add("out"); }, 560);
      setTimeout(function () { w.remove(); busy = false; }, 1150);
    });
  });
})();
