// FAQ: the answer slides open (height eases, text wipes in), and closes the same way back.
(function () {
  var reduced = document.documentElement.dataset.motion === "reduced";
  document.querySelectorAll("details.faq").forEach(function (d) {
    var s = d.querySelector("summary"), anim = null;
    s.addEventListener("click", function (e) {
      if (reduced || !d.animate) return;
      e.preventDefault();
      var from = d.offsetHeight, opening = !d.open;
      if (anim) anim.cancel();
      d.style.overflow = "hidden";
      d.classList.remove("is-opening", "is-closing");
      if (opening) { d.open = true; d.classList.add("is-opening"); }
      else { d.classList.add("is-closing"); }
      var to = opening ? d.offsetHeight : s.offsetHeight + 2;
      anim = d.animate({ height: [from + "px", to + "px"] }, { duration: opening ? 560 : 340, easing: "cubic-bezier(.22,.9,.3,1)" });
      anim.onfinish = function () {
        anim = null; d.style.overflow = "";
        if (!opening) { d.open = false; d.classList.remove("is-closing"); }
        d.classList.remove("is-opening");
      };
    });
  });
})();
