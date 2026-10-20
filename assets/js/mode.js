// Back end / front end switch. The look is chosen in <head> (motion.js) so there is no flash.
// Control: the sun/moon icon beside the CTA.
// The change: the spider spins a web from the icon. A web crawler, literally. Threads shoot out, rings close in, the spider runs out along a thread,
// the web fills in wedge by wedge with the new mode, the page swaps behind it, then the web dissolves. One SVG with a few dozen paths, so it stays light.
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
  var NS = "http://www.w3.org/2000/svg";
  function mk(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function flip(from) {
    if (busy) return;
    var next = cur() === "front" ? "back" : "front";
    if (de.getAttribute("data-motion") === "reduced" || !Element.prototype.animate) { apply(next); return; }
    busy = true;
    var light = next === "front", vw = de.clientWidth, vh = window.innerHeight;
    var r0 = from.getBoundingClientRect(), ox = r0.left + r0.width / 2, oy = r0.top + r0.height / 2;
    var R = Math.max(Math.hypot(ox, oy), Math.hypot(vw - ox, oy), Math.hypot(ox, vh - oy), Math.hypot(vw - ox, vh - oy)) + 30;
    var N = 14, step = 2 * Math.PI / N, rot = Math.random() * step;
    var bg = light ? "#f3eedf" : "#0b0b09", c1 = light ? "#fcd949" : "#2f55f0", c2 = light ? "#111110" : "#8ab4f8";
    var wrap = document.createElement("div"); wrap.className = "tm-web"; wrap.setAttribute("aria-hidden", "true");
    var svg = mk("svg", { viewBox: "0 0 " + vw + " " + vh, width: vw, height: vh, preserveAspectRatio: "none" }, wrap);
    function pt(a, rad) { return [ox + Math.cos(a) * rad, oy + Math.sin(a) * rad]; }
    var wedges = mk("g", {}, svg), webA = mk("g", { fill: "none", stroke: c1, "stroke-width": 2.2, "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
    var webB = mk("g", { fill: "none", stroke: c2, "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }, svg);
    var big = R / Math.cos(step / 2) * 1.04, wd = [];
    for (var i = 0; i < N; i++) {
      var p1 = pt(rot + i * step, big), p2 = pt(rot + (i + 1) * step, big);
      wd.push(mk("polygon", { points: ox + "," + oy + " " + p1[0] + "," + p1[1] + " " + p2[0] + "," + p2[1], fill: bg, opacity: 0 }, wedges));
    }
    var paths = [];
    [webA, webB].forEach(function (g) {
      for (var i = 0; i < N; i++) { var e = pt(rot + i * step, R); paths.push(mk("path", { d: "M" + ox + " " + oy + "L" + e[0] + " " + e[1], pathLength: 1 }, g)); }
      [.07, .15, .26, .4, .58, .8, 1.02].forEach(function (f) {
        var d = ""; for (var i = 0; i <= N; i++) { var q = pt(rot + i * step, R * f); d += (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }
        paths.push(mk("path", { d: d, pathLength: 1, "data-ring": f }, g));
      });
    });
    var sp = mk("g", { style: "transform-origin:0 0" }, svg);
    var col = light ? "#fcd949" : "#2f55f0";
    mk("path", { d: "M-6 0L0-6L6 0L4 7L-4 7Z", fill: col }, sp);
    [[-6,-1,-15,-6],[-6,2,-16,2],[-5,4,-14,11],[-3,6,-8,14],[6,-1,15,-6],[6,2,16,2],[5,4,14,11],[3,6,8,14]].forEach(function (l) { mk("path", { d: "M" + l[0] + " " + l[1] + "L" + l[2] + " " + l[3], stroke: col, "stroke-width": 1.8, "stroke-linecap": "round", fill: "none" }, sp); });
    sp.setAttribute("opacity", 0);
    document.body.appendChild(wrap);
    var DRAW = 640, FILL = 560;
    paths.forEach(function (p) {
      var ring = p.getAttribute("data-ring"), spoke = !ring, grp = p.parentNode === webB;
      p.style.strokeDasharray = "1"; p.style.strokeDashoffset = "1";
      var delay = spoke ? 0 : 160 + parseFloat(ring) * 380;
      p.animate({ strokeDashoffset: [1, 0] }, { duration: spoke ? 420 : 300, delay: delay, easing: "cubic-bezier(.3,.7,.2,1)", fill: "forwards" });
    });
    var ang = Math.atan2(vh / 2 - oy, vw / 2 - ox), far = Math.min(R, Math.hypot(vw, vh) * .6), sx = ox, sy = oy, phone = vw <= 720, spDur = DRAW + 80, spEase = "cubic-bezier(.5,0,.3,1)";
    if (phone) {   // on phones the spider runs right off the edge of the screen
      var cx = Math.cos(ang), cy = Math.sin(ang), tx = cx > 0 ? (vw - ox) / cx : cx < 0 ? -ox / cx : 1e9, ty = cy > 0 ? (vh - oy) / cy : cy < 0 ? -oy / cy : 1e9;
      far = Math.min(tx, ty) + 70; spDur = DRAW + 260; spEase = "cubic-bezier(.4,0,.8,.55)";
    }
    sp.setAttribute("opacity", 1);
    sp.animate({ transform: ["translate(" + sx + "px," + sy + "px) rotate(" + (ang * 180 / Math.PI + 90) + "deg) scale(.9)", "translate(" + (ox + Math.cos(ang) * far) + "px," + (oy + Math.sin(ang) * far) + "px) rotate(" + (ang * 180 / Math.PI + 90) + "deg) scale(2.1)"] }, { duration: spDur, easing: spEase, fill: "forwards" });
    var fillAt = DRAW + 40;
    wd.forEach(function (w, i) { w.animate({ opacity: [0, 1] }, { duration: 170, delay: fillAt + i * (FILL / N), easing: "ease-out", fill: "forwards" }); });
    webB.animate({ opacity: [0, 1] }, { duration: FILL, delay: fillAt, fill: "forwards" });
    var full = fillAt + FILL + 170;
    if (!phone) setTimeout(function () { sp.animate({ opacity: [1, 0] }, { duration: 150, fill: "forwards" }); }, full - 140);
    setTimeout(function () {
      apply(next);
      wrap.animate({ opacity: [1, 0] }, { duration: 380, easing: "ease-in", fill: "forwards" });
      setTimeout(function () { wrap.remove(); busy = false; }, 420);
    }, full + 60);
    setTimeout(function () { if (busy) { wrap.remove(); busy = false; } }, 4500);
  }
  sync();
  document.querySelectorAll(".tmode").forEach(function (b) { b.addEventListener("click", function () { flip(b); }); });
})();
