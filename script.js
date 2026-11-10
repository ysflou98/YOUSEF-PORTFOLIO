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
    // Sei tasti (Y O U S E F) in griglia 3x2. Ogni tasto è una pila di strati arrotondati.
    var WORD = "YOUSEF";
    var COLS = 3;
    var PITCH = 140;
    var SPIN = [-80, 70, -60, 90, -70, 80];
    var canMix = !!(window.CSS && CSS.supports && CSS.supports("background", "color-mix(in srgb, red, blue 10%)"));
    var shade = function (color, pct) {
      return canMix ? "color-mix(in srgb, " + color + ", #F9FCF8 " + Math.round(pct) + "%)" : color;
    };

    var stack = function (parent, o) {
      for (var i = 0; i < o.n; i++) {
        var t = o.n === 1 ? 1 : i / (o.n - 1);
        var layer = document.createElement(o.text ? "span" : "i");
        layer.className = "ly" + (o.text ? " gl" : "");
        layer.style.width = o.w + "px";
        layer.style.height = o.h + "px";
        layer.style.marginLeft = -o.w / 2 + "px";
        layer.style.marginTop = -o.h / 2 + "px";
        layer.style.transform = "translateZ(" + (o.z0 + (o.z1 - o.z0) * t).toFixed(2) + "px)";
        if (o.text) {
          layer.textContent = o.text;
          layer.style.color = i === o.n - 1 ? o.top : shade(o.color, t * 22);
        } else {
          layer.style.borderRadius = o.r + "px";
          layer.style.background = i === o.n - 1 ? o.top : shade(o.color, t * 16);
        }
        parent.appendChild(layer);
      }
    };

    WORD.split("").forEach(function (ch, i) {
      var col = i % COLS;
      var row = Math.floor(i / COLS);
      var key = document.createElement("div");
      key.className = "key3d";
      key.style.setProperty("--x", (col - (COLS - 1) / 2) * PITCH);
      key.style.setProperty("--y", (row - 0.5) * PITCH);
      key.style.setProperty("--fx", (col - 1) * 260);
      key.style.setProperty("--fy", row ? 240 : -240);
      key.style.setProperty("--rz", SPIN[i]);
      key.style.setProperty("--st", (i * 0.13).toFixed(2));
      stack(key, { w: 128, h: 128, r: 28, z0: 0,  z1: 12, n: 6, color: "#0F3D2E", top: "#0F3D2E" });
      stack(key, { w: 112, h: 112, r: 22, z0: 12, z1: 38, n: 9, color: "#166534", top: "#A8D5BA" });
      stack(key, { w: 112, h: 112, z0: 38, z1: 46, n: 5, color: "#0F3D2E", top: "#0F3D2E", text: ch });
      model.appendChild(key);
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

  /* ---------- Card e form: ingresso alternato da sinistra e destra ---------- */
  (function () {
    var calmMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calmMotion || !("IntersectionObserver" in window)) return;

    var mark = function (selector) {
      var list = document.querySelectorAll(selector);
      for (var i = 0; i < list.length; i++) {
        list[i].setAttribute("data-reveal", i % 2 === 0 ? "left" : "right");
        list[i].style.animationDelay = (i % 3) * 90 + "ms";
      }
    };
    mark(".carousel-slide");
    mark("#servizi .card");
    mark(".project");
    mark(".faq details");

    var one = function (selector, side) {
      var el = document.querySelector(selector);
      if (el) el.setAttribute("data-reveal", side);
    };
    one("#contatti .contact > div", "left");
    one("#contact-form", "right");

    var targets = document.querySelectorAll("[data-reveal]");
    document.documentElement.classList.add("js-reveal");

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    for (var i = 0; i < targets.length; i++) io.observe(targets[i]);
  })();

  /* ---------- Modulo contatti: apre il programma di posta ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var TO = "ysflou98@gmail.com";

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
