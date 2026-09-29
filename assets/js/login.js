/**
 * login.js — demo login page behavior: role tab switching (customer/admin)
 * and a mock sign-in redirect. This is a UI demonstration only; no real
 * authentication is performed and no credentials are validated or stored.
 */
(function () {
  "use strict";

  function init() {
    var role = "customer";
    var tabs = document.querySelectorAll("[data-role]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        role = tab.getAttribute("data-role");
        tabs.forEach(function (t) {
          var active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
          t.style.color = active ? "#fff" : "var(--text-on-dark-muted)";
        });
      });
    });

    var form = document.getElementById("loginForm");
    var error = document.getElementById("loginError");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        error.textContent = "Please enter a valid email and a password of at least 6 characters.";
        return;
      }
      error.textContent = "";
      window.location.href = role === "admin" ? "admin.html" : "dashboard.html";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
