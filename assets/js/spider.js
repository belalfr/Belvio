// Spider CTA: it hangs from the search result on a thread and follows the cursor.
// The label stays still, so it is always easy to click. Near the label, the spider settles above it.
(function () {
  var stage = document.querySelector(".spider-stage");
  if (!stage) return;
  var spider = stage.querySelector(".spider"), tag = stage.querySelector(".spider__tag");
  var line = stage.querySelector(".thread line"), knot = stage.querySelector(".thread circle");
  var reduced = document.documentElement.dataset.motion === "reduced";
  var BASE_Y = 112, x = 0, y = 0, tx = 0, ty = 0, rot = 0, t0 = performance.now();
  var busy = false, running = false;
  var fine = window.matchMedia("(hover: hover)").matches;

  function draw(now) {
    var w = stage.clientWidth, t = (now - t0) / 1000;
    var wantX = tx + (reduced ? 0 : Math.sin(t * 0.9) * 5);
    var wantY = ty + (reduced ? 0 : Math.sin(t * 1.4) * 3);
    var px = x, py = y;
    x += (wantX - x) * 0.08; y += (wantY - y) * 0.08;
    var speed = Math.hypot(x - px, y - py);
    rot += ((x - px) * -0.9 - rot) * 0.12;
    spider.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) rotate(" + rot.toFixed(2) + "deg)";
    spider.classList.toggle("is-moving", speed > 0.35);
    line.setAttribute("x1", w / 2); line.setAttribute("y1", 0);
    line.setAttribute("x2", (w / 2 + x).toFixed(1)); line.setAttribute("y2", (BASE_Y + y + 41).toFixed(1));
    knot.setAttribute("cx", w / 2); knot.setAttribute("cy", 0);
    if (running) requestAnimationFrame(draw);
  }
  function start() { if (!running) { running = true; requestAnimationFrame(draw); } }
  if (reduced) { draw(performance.now()); } else {
    new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : (running = false); }).observe(stage);
    start();
  }

  if (fine && !reduced) {
    window.addEventListener("pointermove", function (e) {
      if (busy) return;
      var r = stage.getBoundingClientRect(), hero = document.querySelector(".hero");
      var hr = hero ? hero.getBoundingClientRect() : r, tr = tag.getBoundingClientRect(), m = 36;
      var onTag = e.clientX > tr.left - m && e.clientX < tr.right + m && e.clientY > tr.top - m && e.clientY < tr.bottom + m;
      stage.classList.toggle("is-hot", e.clientX >= tr.left && e.clientX <= tr.right && e.clientY >= tr.top && e.clientY <= tr.bottom);
      if (onTag || e.clientY < hr.top || e.clientY > hr.bottom) { tx = 0; ty = 0; return; }   // rest above the label
      tx = Math.max(-150, Math.min(110, (e.clientX - (r.left + r.width / 2)) * 0.55));
      ty = Math.max(-64, Math.min(8, (e.clientY - (r.top + BASE_Y + 60)) * 0.4));
    }, { passive: true });
    document.addEventListener("mouseleave", function () { tx = 0; ty = 0; stage.classList.remove("is-hot"); });
  }
  tag.addEventListener("focus", function () { stage.classList.add("is-hot"); });
  tag.addEventListener("blur", function () { stage.classList.remove("is-hot"); });

  function go(e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    location.href = tag.href;
  }
  tag.addEventListener("click", go);
  spider.addEventListener("click", go);
})();
