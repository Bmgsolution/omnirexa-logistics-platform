/**
 * dashboard.js — customer dashboard prototype behavior: tab switching,
 * stat cards, sample charts, shipment table, create-shipment mock flow,
 * quotes, notifications, addresses and settings. All data is demo/sample.
 */
(function () {
  "use strict";

  function switchPanel(target) {
    document.querySelectorAll(".dashboard-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === `panel-${target}`);
    });
    document.querySelectorAll(".side-nav-btn").forEach((btn) => {
      const isActive = btn.getAttribute("data-target") === target;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-current", isActive ? "page" : "false");
    });
    const heading = document.getElementById("dashboardHeading");
    const btn = document.querySelector(`.side-nav-btn[data-target="${target}"]`);
    if (heading && btn) heading.textContent = btn.textContent.trim();
    window.location.hash = target;
  }

  function initTabs() {
    const buttons = document.querySelectorAll(".side-nav-btn[data-target]");
    if (!buttons.length) return;
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => switchPanel(btn.getAttribute("data-target")));
    });
    const initial = (window.location.hash || "").replace("#", "") || "overview";
    if (document.getElementById(`panel-${initial}`)) {
      switchPanel(initial);
    } else {
      switchPanel("overview");
    }
  }

  function renderStats() {
    const stats = window.OmniRexaMock?.dashboardStats;
    if (!stats) return;
    const map = {
      activeShipments: "statActive",
      inTransit: "statInTransit",
      delivered: "statDelivered",
      delayed: "statDelayed",
      pendingPickup: "statPending",
    };
    Object.entries(map).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute("data-count-to", stats[key]);
    });
    document.dispatchEvent(new CustomEvent("stats:ready"));
  }

  function renderBarChart() {
    const el = document.getElementById("activityChart");
    const data = window.OmniRexaMock?.monthlyActivity;
    if (!el || !data) return;
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

  function renderShipmentsTable() {
    const tbody = document.getElementById("shipmentsTableBody");
    const shipments = window.OmniRexaMock?.shipments;
    if (!tbody || !shipments) return;
    tbody.innerHTML = shipments
      .map(
        (s) => `
      <tr>
        <td>${s.trackingNumber}</td>
        <td>${s.type}</td>
        <td><span class="badge badge-${s.statusTone}">${s.status}</span></td>
        <td>${s.origin} → ${s.destination}</td>
        <td>${new Date(s.eta).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
        <td><a class="btn btn-outline btn-sm" href="tracking.html?tn=${encodeURIComponent(s.trackingNumber)}">Track</a></td>
      </tr>`
      )
      .join("");
  }

  function renderInvoices() {
    const tbody = document.getElementById("invoicesTableBody");
    const invoices = window.OmniRexaMock?.invoices;
    if (!tbody || !invoices) return;
    tbody.innerHTML = invoices
      .map(
        (inv) => `
      <tr>
        <td>${inv.id}</td>
        <td>${inv.shipment}</td>
        <td>$${inv.amount.toFixed(2)}</td>
        <td><span class="badge ${inv.status === "Paid" ? "badge-success" : "badge-neutral"}">${inv.status}</span></td>
        <td>${new Date(inv.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
      </tr>`
      )
      .join("");
  }

  function renderNotifications() {
    const list = document.getElementById("notificationsList");
    const notifications = window.OmniRexaMock?.notifications;
    if (!list || !notifications) return;
    list.innerHTML = notifications
      .map(
        (n) => `
      <div class="notif-item ${n.unread ? "unread" : ""}">
        <span class="notif-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M12 3v4M5 8a7 7 0 0114 0c0 4 1.5 5.5 1.5 5.5H3.5S5 12 5 8z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 18a2.5 2.5 0 005 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </span>
        <div>
          <div style="font-weight:600;">${n.title}</div>
          <div style="font-size:0.8rem; color:var(--text-on-light-muted);">${n.time}</div>
        </div>
      </div>`
      )
      .join("");
  }

  function renderAddresses() {
    const list = document.getElementById("addressesList");
    const addresses = window.OmniRexaMock?.savedAddresses;
    if (!list || !addresses) return;
    list.innerHTML = addresses
      .map(
        (a) => `
      <div class="card">
        <span class="badge badge-neutral">${a.label}</span>
        <h3 style="margin:0.6rem 0 0.2rem;">${a.name}</h3>
        <p style="margin:0; color:var(--text-on-light-muted);">${a.address}</p>
      </div>`
      )
      .join("");
  }

  function initCreateShipment() {
    const form = document.getElementById("createShipmentForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const weight = Number(data.get("weight")) || 1;
      const methodId = data.get("method") || "standard";
      const insurance = data.get("insurance") === "on";
      const { cost, method } = window.OmniRexaMock.estimateQuote({ weightKg: weight, methodId, insurance });
      const trackingNumber = window.OmniRexaMock.generateTrackingNumber();

      const resultEl = document.getElementById("createShipmentResult");
      if (resultEl) {
        resultEl.hidden = false;
        resultEl.innerHTML = `
          <div class="glass-panel" style="background:var(--color-navy);">
            <span class="badge badge-demo">Demo tracking number generated</span>
            <h3 style="margin:0.7rem 0 0.3rem;">${trackingNumber}</h3>
            <div class="grid grid-3">
              <div><div class="eyebrow">Estimated Cost</div><strong>$${cost.toFixed(2)}</strong></div>
              <div><div class="eyebrow">Transit Time</div><strong>${method.days}</strong></div>
              <div><div class="eyebrow">Tracking</div><strong>Included</strong></div>
            </div>
          </div>`;
      }
      window.OmniRexaToast?.({
        title: "Shipment created (demo)",
        message: `Tracking number ${trackingNumber} generated client-side.`,
        type: "success",
      });
      form.reset();
    });
  }

  function initSettingsToggles() {
    document.querySelectorAll(".settings-toggle").forEach((toggle) => {
      toggle.addEventListener("change", () => {
        window.OmniRexaToast?.({
          title: "Preference updated",
          message: `${toggle.getAttribute("data-label") || "Notification preference"} ${toggle.checked ? "enabled" : "disabled"}.`,
          type: "info",
        });
      });
    });
  }

  function initJumpButtons() {
    document.querySelectorAll("[data-jump-to]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-jump-to");
        document.querySelector(`.side-nav-btn[data-target="${target}"]`)?.click();
      });
    });
  }

  function initSupportForm() {
    const form = document.getElementById("supportForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      window.OmniRexaToast?.({
        title: "Support request submitted (demo)",
        message: "Our team would respond within 24 hours in production.",
        type: "success",
      });
      form.reset();
    });
  }

  function init() {
    if (!document.querySelector(".dashboard-shell")) return;
    initTabs();
    renderStats();
    renderBarChart();
    renderShipmentsTable();
    renderInvoices();
    renderNotifications();
    renderAddresses();
    initCreateShipment();
    initSettingsToggles();
    initJumpButtons();
    initSupportForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
