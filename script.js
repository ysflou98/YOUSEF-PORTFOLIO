/* Nessun dato viene inviato a server di terze parti. */
(function () {
  "use strict";

  /* ---------- Barra fissa: misura la sua altezza per ancore e parti ferme ---------- */
  var bar = document.querySelector(".site-header");
  if (bar) {
    var measure = function () {
      document.documentElement.style.setProperty("--header-h", bar.offsetHeight + "px");
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
  }

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
  var stage = scene && scene.querySelector(".hero-stage");
  var model = host && host.querySelector(".y3d-model");

  if (host && scene && stage && model) {
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
      key.style.setProperty("--fx", (col - 1) * 170);
      key.style.setProperty("--fy", row ? 170 : -170);
      key.style.setProperty("--rz", SPIN[i]);
      key.style.setProperty("--st", (i * 0.13).toFixed(2));
      stack(key, { w: 128, h: 128, r: 28, z0: 0,  z1: 12, n: 6, color: "#4C956C", top: "#4C956C" });
      stack(key, { w: 112, h: 112, r: 22, z0: 12, z1: 38, n: 9, color: "#166534", top: "#A8D5BA" });
      stack(key, { w: 112, h: 112, z0: 38, z1: 46, n: 5, color: "#0F3D2E", top: "#0F3D2E", text: ch });
      model.appendChild(key);
    });

    host.classList.add("has-3d");

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var countEl = scene.querySelector(".hp-num");
    var labelEl = scene.querySelector(".hp-label");
    var bars = scene.querySelectorAll(".hp-bars i");
    var LABELS = ["Design", "Sviluppo", "SEO locale"];

    // Aggiorna scena 3D e indicatore 01 / 03 in base all'avanzamento (0-1)
    var paint = function (p) {
      model.style.setProperty("--p", p.toFixed(4));
      var idx = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
      if (countEl) countEl.textContent = "0" + (idx + 1);
      if (labelEl) labelEl.textContent = LABELS[idx];
      for (var b = 0; b < bars.length; b++) {
        bars[b].style.setProperty("--f", Math.min(1, Math.max(0, p * 3 - b)).toFixed(3));
      }
    };

    if (reduce) {
      paint(1);
    } else {
      scene.classList.add("is-live");
      var ticking = false;

      var update = function () {
        ticking = false;
        var barH = bar ? bar.offsetHeight : 0;
        var rect = scene.getBoundingClientRect();
        var total = scene.offsetHeight - stage.offsetHeight;
        var p = total > 0 ? (barH - rect.top) / total : 1;
        paint(Math.min(1, Math.max(0, p)));
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

      // Parallax: i tasti si inclinano leggermente seguendo il mouse
      var tx = 0, ty = 0, cx = 0, cy = 0, running = false;
      var glide = function () {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        model.style.setProperty("--mx", cx.toFixed(3));
        model.style.setProperty("--my", cy.toFixed(3));
        if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) {
          window.requestAnimationFrame(glide);
        } else {
          running = false;
        }
      };
      var kick = function () {
        if (!running) { running = true; window.requestAnimationFrame(glide); }
      };
      scene.addEventListener("pointermove", function (event) {
        if (event.pointerType === "touch") return;
        tx = (event.clientX / window.innerWidth - 0.5) * 2;
        ty = (event.clientY / window.innerHeight - 0.5) * 2;
        kick();
      });
      scene.addEventListener("pointerleave", function () { tx = 0; ty = 0; kick(); });
    }
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
    mark("#perche .card");
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
