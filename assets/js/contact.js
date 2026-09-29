/**
 * contact.js — demo contact form behavior. Validates required fields and
 * shows a success toast; no message is actually sent (prototype only).
 */
(function () {
  "use strict";

  function init() {
    var form = document.getElementById("contactForm");
    var error = document.getElementById("contactError");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        error.textContent = "Please fill in all required fields with valid values.";
        return;
      }
      error.textContent = "";
      window.OmniRexaToast && window.OmniRexaToast({
        title: "Message sent (demo)",
        message: "This prototype does not send real messages yet.",
        type: "success",
      });
      form.reset();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
