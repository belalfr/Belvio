// The background grid brightens around the cursor.
(function () {
  if (document.documentElement.dataset.motion === "reduced" || !window.matchMedia("(hover: hover)").matches) return;
  var de = document.documentElement, x = -999, y = -999, queued = false;
  window.addEventListener("pointermove", function (e) {
    x = e.clientX; y = e.clientY;
    if (!queued) { queued = true; requestAnimationFrame(function () { de.style.setProperty("--gx", x + "px"); de.style.setProperty("--gy", y + "px"); queued = false; }); }
  }, { passive: true });
  document.addEventListener("mouseleave", function () { de.style.setProperty("--gx", "-999px"); });
})();
