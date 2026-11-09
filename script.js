/* Modulo contatti: apre il programma di posta con il messaggio già pronto.
   Nessun dato viene inviato a server di terze parti. */
(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

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
})();
