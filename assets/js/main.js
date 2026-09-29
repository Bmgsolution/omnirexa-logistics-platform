/**
 * main.js — shared site-wide behaviors: toast system, animated counters,
 * homepage tracking widget, and reduced-motion helpers.
 * All tracking results shown are DEMO DATA (see assets/js/mock-data.js).
 */
(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------- Toasts ---------------------------- */
  function ensureToastRegion() {
    let region = document.querySelector(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    return region;
  }

  function showToast({ title, message, type = "info", duration = 5000 }) {
    const region = ensureToastRegion();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<div><strong>${title}</strong>${message ? `<p>${message}</p>` : ""}</div>`;
    region.appendChild(toast);
    window.setTimeout(() => {
      toast.style.transition = "opacity 300ms ease, transform 300ms ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(24px)";
      window.setTimeout(() => toast.remove(), 320);
    }, duration);
  }
  window.OmniRexaToast = showToast;

  /* ------------------------- Animated counters --------------------- */
  function animateCounter(el) {
    const target = Number(el.getAttribute("data-count-to"));
    if (Number.isNaN(target)) return;
    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString();
      return;
    }
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll("[data-count-to]");
    if (!counters.length) return;
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => observer.observe(el));
  }

  /* --------------------- Homepage tracking widget -------------------- */
  function initHeroTracking() {
    const form = document.getElementById("heroTrackForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[name='trackingNumber']");
      const value = (input.value || "").trim();
      if (!value) {
        input.focus();
        return;
      }
      window.location.href = `tracking.html?tn=${encodeURIComponent(value)}`;
    });
  }

  /* ----------------------------- Init ------------------------------ */
  document.addEventListener("partials:loaded", () => {
    initCounters();
    initHeroTracking();
  });

  document.addEventListener("stats:ready", () => {
    initCounters();
  });

  document.addEventListener("DOMContentLoaded", () => {
    // Pages without shared header/footer includes still get counters/widget.
    initCounters();
    initHeroTracking();
  });
})();
