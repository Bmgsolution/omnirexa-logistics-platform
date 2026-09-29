/**
 * include.js
 * Loads shared header/footer partials into any page that includes
 * <div data-include="header"></div> and <div data-include="footer"></div>.
 * Requires the site to be served over http(s) (see README "Running the app").
 */
(function () {
  "use strict";

  async function loadPartial(el) {
    const name = el.getAttribute("data-include");
    const url = `assets/partials/${name}.html`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      el.innerHTML = await res.text();
    } catch (err) {
      el.innerHTML =
        '<p style="padding:1rem;text-align:center;color:#a9bccf;background:#0b1220;">' +
        "Navigation failed to load. Please run this site with a local server (see README) instead of opening the file directly." +
        "</p>";
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  function markActiveNav() {
    const current = document.body.getAttribute("data-page");
    if (!current) return;
    document.querySelectorAll(".nav-links a[data-nav]").forEach((link) => {
      if (link.getAttribute("data-nav") === current) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function wireMobileNav() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("primaryNav");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  function setFooterYear() {
    const yearEl = document.getElementById("footerYear");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  async function init() {
    const includes = Array.from(document.querySelectorAll("[data-include]"));
    await Promise.all(includes.map(loadPartial));
    markActiveNav();
    wireMobileNav();
    setFooterYear();
    document.dispatchEvent(new CustomEvent("partials:loaded"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
