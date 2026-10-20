// The background grid brightens around the cursor. Vars live on the glow layer only, so moving the mouse never restyles the page.
(function () {
  if (document.documentElement.dataset.motion === "reduced" || !window.matchMedia("(hover: hover)").matches) return;
  var g = document.querySelector(".bg-glow"); if (!g) return;
  var x = -999, y = -999, queued = false;
  window.addEventListener("pointermove", function (e) {
    x = e.clientX; y = e.clientY;
    if (!queued) { queued = true; requestAnimationFrame(function () { g.style.setProperty("--gx", x + "px"); g.style.setProperty("--gy", y + "px"); queued = false; }); }
  }, { passive: true });
  document.addEventListener("mouseleave", function () { g.style.setProperty("--gx", "-999px"); });
})();
