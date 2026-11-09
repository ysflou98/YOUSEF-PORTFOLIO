/* Nessun dato viene inviato a server di terze parti. */
(function () {
  "use strict";

  /* ---------- Logo: sulla home riporta in cima senza ricaricare ---------- */
  var brand = document.querySelector(".brand");
  if (brand) {
    brand.addEventListener("click", function (event) {
      var path = window.location.pathname;
      var onHome = path === "/" || /\/index\.html$/.test(path) || path === "";
      if (onHome && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  /* ---------- Y 3D che si compone scrollando ---------- */
  var host = document.getElementById("y3d");
  var scene = document.getElementById("y-scene");
  var yTrack = document.getElementById("y-track");
  var model = host && host.querySelector(".y3d-model");

  if (host && scene && yTrack && model) {
    // Ogni pezzo è una pila di strati arrotondati (estrusione).
    var PARTS = [
      { cls: "p-base",  w: 276, h: 276, r: 56, z0: 0,  z1: 20, n: 10, color: "#0F3D2E", top: "#0F3D2E" },
      { cls: "p-body",  w: 236, h: 236, r: 46, z0: 20, z1: 62, n: 16, color: "#166534", top: "#A8D5BA" },
      { cls: "p-arm-l", w: 16,  h: 90,  r: 7,  z0: 62, z1: 76, n: 6,  color: "#0F3D2E", top: "#0F3D2E" },
      { cls: "p-arm-r", w: 16,  h: 90,  r: 7,  z0: 62, z1: 76, n: 6,  color: "#0F3D2E", top: "#0F3D2E" },
      { cls: "p-stem",  w: 16,  h: 52,  r: 7,  z0: 62, z1: 76, n: 6,  color: "#0F3D2E", top: "#0F3D2E" }
    ];
    var canMix = !!(window.CSS && CSS.supports && CSS.supports("background", "color-mix(in srgb, red, blue 10%)"));

    PARTS.forEach(function (p) {
      var part = document.createElement("div");
      part.className = "part " + p.cls;
      for (var i = 0; i < p.n; i++) {
        var t = p.n === 1 ? 1 : i / (p.n - 1);
        var layer = document.createElement("i");
        layer.className = "ly";
        layer.style.width = p.w + "px";
        layer.style.height = p.h + "px";
        layer.style.marginLeft = -p.w / 2 + "px";
        layer.style.marginTop = -p.h / 2 + "px";
        layer.style.borderRadius = p.r + "px";
        layer.style.transform = "translateZ(" + (p.z0 + (p.z1 - p.z0) * t).toFixed(2) + "px)";
        layer.style.background = p.color;
        if (i === p.n - 1) {
          layer.style.background = p.top;
        } else if (canMix) {
          layer.style.background =
            "color-mix(in srgb, " + p.color + ", #F9FCF8 " + Math.round(t * 16) + "%)";
        }
        part.appendChild(layer);
      }
      model.appendChild(part);
    });

    host.classList.add("has-3d");

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      model.style.setProperty("--p", "1");
    } else {
      scene.classList.add("is-live");
      var ticking = false;

      var update = function () {
        ticking = false;
        var rect = yTrack.getBoundingClientRect();
        var total = yTrack.offsetHeight - window.innerHeight;
        var start = window.innerHeight * 0.12;
        var p = total > 0 ? (start - rect.top) / (total + start) : 1;
        p = Math.min(1, Math.max(0, p));
        model.style.setProperty("--p", p.toFixed(4));
      };
      var request = function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      };

      window.addEventListener("scroll", request, { passive: true });
      window.addEventListener("resize", request);
      update();
    }
  }

  /* ---------- Carosello "Perché lavorare con me" ---------- */
  var car = document.getElementById("perche-carousel");
  if (car) {
    var track = car.querySelector(".carousel-track");
    var slides = track.querySelectorAll(".carousel-slide");
    var controls = car.querySelector(".carousel-controls");
    var prev = car.querySelector('[data-dir="-1"]');
    var next = car.querySelector('[data-dir="1"]');
    var count = car.querySelector(".carousel-count");
    var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    controls.hidden = false;

    var closest = function () {
      var best = 0, bestDist = Infinity;
      for (var i = 0; i < slides.length; i++) {
        var d = Math.abs(slides[i].offsetLeft - track.scrollLeft);
        if (d < bestDist) { bestDist = d; best = i; }
      }
      return best;
    };
    var refresh = function () {
      var atStart = track.scrollLeft <= slides[0].offsetLeft + 2;
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      prev.disabled = atStart;
      next.disabled = atEnd;
      count.textContent = (atEnd ? slides.length : closest() + 1) + " / " + slides.length;
    };
    var go = function (dir) {
      var i = Math.min(slides.length - 1, Math.max(0, closest() + dir));
      track.scrollTo({ left: slides[i].offsetLeft, behavior: calm ? "auto" : "smooth" });
    };

    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    var raf = false;
    track.addEventListener("scroll", function () {
      if (!raf) { raf = true; window.requestAnimationFrame(function () { raf = false; refresh(); }); }
    }, { passive: true });
    window.addEventListener("resize", refresh);
    refresh();
  }

  /* ---------- Modulo contatti: apre il programma di posta ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var TO = "hello@yousefloulid.it";

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var name = form.elements["nome"].value.trim();
      var email = form.elements["email"].value.trim();
      var message = form.elements["messaggio"].value.trim();

      var subject = "Richiesta dal sito – " + name;
      var body = message + "\n\n—\nNome: " + name + "\nEmail: " + email;

      window.location.href =
        "mailto:" + TO +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (status) {
        status.textContent =
          "Si è aperto il tuo programma di posta con il messaggio pronto. Premi Invia per spedirlo.";
      }
    });
  }
})();
