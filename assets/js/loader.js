// Page opener (home only). A short crawl log, then the page lifts away.
// Shown on the first visit of a session and on reload. ?loader=on forces it. Skipped for reduced motion.
(function () {
  var de = document.documentElement, el = document.getElementById("loader");
  if (!el) return;
  if (!de.classList.contains("is-loading")) { return; }
  try { history.scrollRestoration = "manual"; } catch (e) {}
  window.scrollTo(0, 0);
  if (window.lenis) window.lenis.stop();
  var log = document.getElementById("loader-log"), num = document.getElementById("loader-num"),
      bar = document.getElementById("loader-bar"), state = document.getElementById("loader-state");
  var rows = [["GET /", "0.18s"], ["GET /#services", "0.21s"], ["GET /#work", "0.19s"], ["GET /#process", "0.22s"], ["GET /#about", "0.17s"], ["GET /blog/", "0.24s"], ["GET /sitemap.xml", "0.12s"]];
  var STEP = 230, i = 0, finished = false;
  function set(p) { num.textContent = Math.round(p); bar.style.width = p + "%"; }
  function done() {
    if (finished) return; finished = true;
    set(100); state.textContent = "indexed ✓  7 of 7 pages"; state.classList.add("is-done");
    setTimeout(function () {
      el.classList.add("is-leaving");
      de.classList.remove("is-loading");
      if (window.lenis) window.lenis.start();
      document.dispatchEvent(new Event("belvio:loaded"));
      setTimeout(function () { de.classList.remove("has-loader"); }, 1100);
    }, 520);
  }
  function next() {
    if (i >= rows.length) return done();
    var li = document.createElement("li");
    li.innerHTML = "<span>" + rows[i][0] + "</span><b>200</b><span style=\"color:var(--faint)\">" + rows[i][1] + "</span>";
    log.appendChild(li); void li.offsetWidth; li.classList.add("is-in");
    i++; set(i / rows.length * 100 - (i < rows.length ? 4 : 0));
    state.textContent = "crawling " + i + " of " + rows.length;
    setTimeout(next, STEP);
  }
  setTimeout(next, 350);
  setTimeout(done, 6000);
})();
