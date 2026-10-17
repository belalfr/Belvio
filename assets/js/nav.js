(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("menu");
  var OFFSET = 40, lastY = window.scrollY, ticking = false, showTimer = null, locked = false;

  // header: transparent at the top, hides when you scroll down, slides back in (after 0.06s) when you scroll up
  function hide() { clearTimeout(showTimer); showTimer = null; header.classList.add("is-hidden"); }
  function show(now) {
    if (now) { clearTimeout(showTimer); showTimer = null; header.classList.remove("is-hidden"); }
    else if (!showTimer) showTimer = setTimeout(function () { showTimer = null; if (!locked) header.classList.remove("is-hidden"); }, 60);
  }
  function onScroll() {
    var y = window.scrollY, dy = y - lastY;
    if (header) {
      header.classList.toggle("is-scrolled", y > 40);
      if (!document.body.classList.contains("menu-open")) {
        if (y < 90) { locked = false; show(true); }
        else if (dy > 4) hide();
        else if (dy < -4 && !locked) show(false);
      }
    }
    if (Math.abs(dy) > 4) lastY = y;
    spy();
  }
  ["wheel", "touchstart", "keydown"].forEach(function (ev) { window.addEventListener(ev, function () { locked = false; }, { passive: true }); });
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); } }, { passive: true });

  // home page: highlight the nav link for the section you are in
  var order = ["services", "work", "process", "about", "notes"];
  function spy() {
    if (!document.body.hasAttribute("data-home") || !menu) return;
    var y = window.scrollY + window.innerHeight * 0.4, key = "home";
    order.forEach(function (id) { var el = document.getElementById(id); if (el && el.offsetTop <= y) key = id === "notes" ? "" : id; });
    menu.querySelectorAll("a[data-key]").forEach(function (a) {
      var on = a.dataset.key === key; a.classList.toggle("is-active", on); if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }
  onScroll();

  // links to sections on the home page scroll there (smoothly); the section lands near the top, header tucked away
  function go(el, instant) {
    locked = true; if (header) hide();
    if (window.lenis) window.lenis.scrollTo(el.querySelector(".crawl") || el, { offset: -OFFSET, duration: 1.6, immediate: !!instant });
    else window.scrollTo({ top: (el.querySelector(".crawl") || el).getBoundingClientRect().top + window.scrollY - OFFSET });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (a && a.matches("a.btn[aria-current]")) { e.preventDefault(); return; }
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
    if (u.origin !== location.origin || u.pathname !== location.pathname) return;
    if (!u.hash || u.hash.length < 2) {
      if (document.body.hasAttribute("data-home") && a.closest(".nav")) { e.preventDefault(); locked = true; if (window.lenis) window.lenis.scrollTo(0, { duration: 1.6 }); else window.scrollTo(0, 0); history.replaceState(null, "", u.pathname); }
      return;
    }
    var el = document.getElementById(u.hash.slice(1));
    if (!el) return;
    e.preventDefault(); go(el, false);
    history.replaceState(null, "", u.pathname + u.hash);
  });
  // arriving with #section in the URL (reload, link from another page): place it before the first paint, then again once fonts and images settle
  if (location.hash.length > 1) {
    var moved = false;
    ["wheel", "touchstart", "keydown"].forEach(function (ev) { window.addEventListener(ev, function () { moved = true; }, { passive: true, once: true }); });
    var place = function () { if (moved) return; var el = document.getElementById(location.hash.slice(1)); if (el) go(el, true); };
    place();
    window.addEventListener("load", function () { setTimeout(place, 40); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  }

  if (!toggle || !menu) return;
  function set(open) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open && header) header.classList.remove("is-hidden");
    if (window.lenis) { open ? window.lenis.stop() : window.lenis.start(); }
  }
  toggle.addEventListener("click", function () { set(!document.body.classList.contains("menu-open")); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  window.matchMedia("(min-width: 721px)").addEventListener("change", function (m) { if (m.matches) set(false); });
})();
