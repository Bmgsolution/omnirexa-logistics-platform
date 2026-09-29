/**
 * admin.js — admin dashboard prototype behavior: tab switching, analytics,
 * shipment management table, fleet tracking, audit trail placeholder.
 * All data is demo/sample and not connected to a real backend.
 */
(function () {
  "use strict";

  function switchPanel(target) {
    document.querySelectorAll(".dashboard-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === `admin-${target}`);
    });
    document.querySelectorAll(".side-nav-btn").forEach((btn) => {
      const isActive = btn.getAttribute("data-target") === target;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-current", isActive ? "page" : "false");
    });
    const heading = document.getElementById("adminHeading");
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
    const initial = (window.location.hash || "").replace("#", "") || "dashboard";
    if (document.getElementById(`admin-${initial}`)) {
      switchPanel(initial);
    } else {
      switchPanel("dashboard");
    }
  }

  function renderStats() {
    const stats = window.OmniRexaMock?.adminStats;
    if (!stats) return;
    const map = {
      totalShipments: "adminStatTotal",
      activeShipments: "adminStatActive",
      delivered: "adminStatDelivered",
      delayed: "adminStatDelayed",
      customers: "adminStatCustomers",
      drivers: "adminStatDrivers",
      vehicles: "adminStatVehicles",
      securityAlerts: "adminStatAlerts",
    };
    Object.entries(map).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute("data-count-to", stats[key]);
    });
    const revenueEl = document.getElementById("adminStatRevenue");
    if (revenueEl) revenueEl.textContent = `$${stats.revenue.toLocaleString()}`;
    document.dispatchEvent(new CustomEvent("stats:ready"));
  }

  function renderBarChart() {
    const el = document.getElementById("adminActivityChart");
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
    const tbody = document.getElementById("adminShipmentsTableBody");
    const shipments = window.OmniRexaMock?.shipments;
    const drivers = window.OmniRexaMock?.drivers;
    if (!tbody || !shipments) return;
    tbody.innerHTML = shipments
      .map((s, i) => {
        const driver = drivers[i % drivers.length];
        return `
      <tr>
        <td>${s.id}</td>
        <td>${s.trackingNumber}</td>
        <td>${s.sender}</td>
        <td>${s.recipient}</td>
        <td><span class="badge badge-${s.statusTone}">${s.status}</span></td>
        <td>${driver.name}</td>
        <td>
          <button type="button" class="btn btn-outline btn-sm admin-action" data-action="update-status" data-id="${s.id}">Update Status</button>
        </td>
      </tr>`;
      })
      .join("");

    tbody.querySelectorAll("[data-action='update-status']").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.OmniRexaToast?.({
          title: "Status update queued (demo)",
          message: `${btn.getAttribute("data-id")} would be updated via the admin API in production.`,
          type: "info",
        });
      });
    });
  }

  function renderFleet() {
    const tbody = document.getElementById("fleetTableBody");
    const drivers = window.OmniRexaMock?.drivers;
    const vehicles = window.OmniRexaMock?.vehicles;
    if (!tbody || !drivers || !vehicles) return;
    tbody.innerHTML = drivers
      .map((d, i) => {
        const v = vehicles[i];
        const tone =
          d.status === "Available"
            ? "success"
            : d.status === "On Delivery"
            ? "info"
            : d.status === "Delayed"
            ? "danger"
            : "neutral";
        return `
      <tr>
        <td>${d.name}</td>
        <td><span class="badge badge-${tone}">${d.status}</span></td>
        <td>${v.id} (${v.type})</td>
        <td>${d.location}</td>
        <td>${d.shipment}</td>
        <td>
          <div class="progress-track" style="width:110px;"><div class="progress-fill" style="width:${d.progress}%"></div></div>
        </td>
      </tr>`;
      })
      .join("");
  }

  function renderAudit() {
    const list = document.getElementById("auditList");
    if (!list) return;
    const events = [
      { who: "admin@omnirexa.demo", action: "Updated shipment SHP-100198 status to Delayed", time: "2026-09-28 18:05" },
      { who: "ops@omnirexa.demo", action: "Assigned driver Yaw Darko to SHP-100301", time: "2026-09-24 09:00" },
      { who: "admin@omnirexa.demo", action: "Uploaded proof of delivery for SHP-100301", time: "2026-09-24 16:50" },
      { who: "security@omnirexa.demo", action: "Reviewed tamper alert on vehicle OMX-3390 (false positive)", time: "2026-09-23 11:20" },
    ];
    list.innerHTML = events
      .map(
        (e) => `
      <li class="completed">
        <span class="dot"><svg viewBox="0 0 24 24" fill="none" width="14" height="14"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg></span>
        <div class="event-title">${e.action}</div>
        <div class="event-meta">${e.time} · ${e.who}</div>
      </li>`
      )
      .join("");
  }

  function init() {
    if (!document.querySelector(".dashboard-shell[data-app='admin']")) return;
    initTabs();
    renderStats();
    renderBarChart();
    renderShipmentsTable();
    renderFleet();
    renderAudit();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
