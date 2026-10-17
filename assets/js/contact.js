// Contact form: validates, posts to the endpoint set in the form's action, falls back to opening an email.
(function () {
  var form = document.querySelector("form.form");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var btn = form.querySelector("button[type=submit]");
  function show(kind, msg) { status.className = "form-status is-on " + kind; status.textContent = msg; }
  function bad(field, on) { field.classList.toggle("has-error", on); }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll(".field").forEach(function (f) {
      var i = f.querySelector("input,textarea");
      var v = i.value.trim(), good = !i.required || v !== "";
      if (good && i.type === "email") good = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
      bad(f, !good); if (!good) ok = false;
    });
    if (form.querySelector(".hp input").value) return; // spam trap
    if (!ok) { show("bad", "Some fields need a fix. Check the ones marked in red and send again."); return; }
    var data = new FormData(form), action = form.getAttribute("action") || "";
    function done() { show("ok", "Got it. I'll reply within 48 hours."); form.reset(); }
    if (action.indexOf("FORM_ENDPOINT_URL") > -1 || !action) {
      var body = "Name: " + data.get("name") + "\nWebsite: " + data.get("site") + "\n\n" + data.get("message");
      location.href = "mailto:hello@belvio.com?subject=" + encodeURIComponent("Site audit request") + "&body=" + encodeURIComponent(body);
      show("ok", "Opening your email app with your message. Press send there and I'll reply within 48 hours.");
      return;
    }
    fetch(action, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (r) { if (r.ok) done(); else throw new Error("bad"); })
      .catch(function () { show("bad", "The message didn't send. Try again, or email hello@belvio.com directly."); });
  });
})();
