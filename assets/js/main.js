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

  /* ------------------------ Shared dashboard UI helpers ------------------------ */
  /**
   * Renders a simple CSS-based bar chart into the target element from an
   * array of { label, value } points. Shared by the customer and admin
   * dashboards to avoid duplicating the same markup/logic in both.
   */
  function renderBarChart(elementId, data) {
    const el = document.getElementById(elementId);
    if (!el || !data || !data.length) return;
    const max = Math.max(...data.map((d) => d.value));
    el.innerHTML = data
      .map(
        (d) => `
      <div class="bar-col">
        <div class="bar" style="height:${(d.value / max) * 100}%" title="${d.value} shipments"></div>
        <span class="bar-label">${d.label}</span>
      </div>`
      )
      .join("");
  }

  /**
   * Creates a side-nav tab controller for a dashboard-style page. `panelPrefix`
   * is prepended to each `data-target` value to find the matching panel id
   * (e.g. "panel-" for the customer dashboard, "admin-" for the admin
   * dashboard). `headingId` is an optional element updated with the active
   * tab's label. Returns the `switchPanel` function so callers can trigger
   * a panel switch programmatically (e.g. "jump to create shipment").
   */
  function createTabController({ panelPrefix, headingId, defaultTarget }) {
    function switchPanel(target) {
      document.querySelectorAll(".dashboard-panel").forEach((panel) => {
        panel.classList.toggle("is-active", panel.id === `${panelPrefix}${target}`);
      });
      document.querySelectorAll(".side-nav-btn").forEach((btn) => {
        const isActive = btn.getAttribute("data-target") === target;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-current", isActive ? "page" : "false");
      });
      const heading = headingId ? document.getElementById(headingId) : null;
      const btn = document.querySelector(`.side-nav-btn[data-target="${target}"]`);
      if (heading && btn) heading.textContent = btn.textContent.trim();
      window.location.hash = target;
    }

    function init() {
      const buttons = document.querySelectorAll(".side-nav-btn[data-target]");
      if (!buttons.length) return;
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => switchPanel(btn.getAttribute("data-target")));
      });
      const initial = (window.location.hash || "").replace("#", "") || defaultTarget;
      if (document.getElementById(`${panelPrefix}${initial}`)) {
        switchPanel(initial);
      } else {
        switchPanel(defaultTarget);
      }
    }

    return { init, switchPanel };
  }

  window.OmniRexaDashboardUI = { renderBarChart, createTabController };

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
