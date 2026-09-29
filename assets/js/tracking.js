/**
 * tracking.js — dedicated tracking portal logic (also used via query param
 * from the homepage hero widget). All results are DEMO DATA.
 */
(function () {
  "use strict";

  const ICONS = {
    completed:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    current:
      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>',
    pending:
      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/></svg>',
    delayed:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 8v5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="16" r="0.5" stroke="currentColor" stroke-width="2"/></svg>',
  };

  function fmtDate(iso, opts) {
    try {
      return new Date(iso).toLocaleString("en-GB", opts || { dateStyle: "medium", timeStyle: "short" });
    } catch (e) {
      return iso;
    }
  }

  function buildRouteSvg(route, progress) {
    const { origin, transit, destination } = route;
    const TRANSIT_Y_OFFSET = 40;
    const transitArcY = transit.y - TRANSIT_Y_OFFSET;
    const path = `M ${origin.x} ${origin.y} Q ${transit.x} ${transitArcY} ${destination.x} ${destination.y}`;
    const vehiclePos = progress < 50 ? transit : destination;
    const vehicleY = vehiclePos === transit ? transitArcY : vehiclePos.y;
    return `
      <svg class="route-svg" viewBox="0 0 480 300" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Illustrative shipment route from ${origin.label} to ${destination.label}">
        <path class="route-path" d="${path}" />
        <path class="route-path-progress" d="${path}" pathLength="500" />
        <circle class="route-node active" cx="${origin.x}" cy="${origin.y}" r="7" />
        <circle class="route-node ${progress > 30 ? "active" : ""}" cx="${transit.x}" cy="${transitArcY}" r="6" />
        <circle class="route-node ${progress >= 100 ? "active" : ""}" cx="${destination.x}" cy="${destination.y}" r="7" />
        <text class="route-label" x="${origin.x - 10}" y="${origin.y + 24}">${origin.label}</text>
        <text class="route-label" x="${transit.x - 30}" y="${transit.y - 52}">${transit.label}</text>
        <text class="route-label" x="${destination.x - 40}" y="${destination.y + 24}">${destination.label}</text>
        <circle class="route-vehicle" cx="${vehiclePos.x}" cy="${vehicleY}" r="6" />
      </svg>`;
  }

  function renderResult(shipment) {
    const container = document.getElementById("trackingResult");
    if (!container) return;

    const timelineHtml = shipment.timeline
      .map((event) => {
        const icon = ICONS[event.state] || ICONS.pending;
        const when = event.estimated ? `Expected — ${fmtDate(event.time, { dateStyle: "medium" })}` : fmtDate(event.time);
        return `
          <li class="${event.state}">
            <span class="dot">${icon}</span>
            <div class="event-title">${event.title}</div>
            <div class="event-meta">${when} · ${event.location}</div>
          </li>`;
      })
      .join("");

    container.innerHTML = `
      <div class="glass-panel" style="margin-bottom:1.5rem;">
        <div style="display:flex; flex-wrap:wrap; gap:1rem; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="badge badge-demo">Demo data</span>
            <h2 style="margin-top:0.6rem;">${shipment.trackingNumber}</h2>
            <p style="color:var(--text-on-dark-muted); margin:0;">${shipment.type} · Shipment ID ${shipment.id}</p>
          </div>
          <span class="badge badge-${shipment.statusTone}">${shipment.status}</span>
        </div>

        <div class="grid grid-4" style="margin-top:1.75rem;">
          <div><div class="eyebrow" style="margin-bottom:2px;">Origin</div><strong>${shipment.origin}</strong></div>
          <div><div class="eyebrow" style="margin-bottom:2px;">Destination</div><strong>${shipment.destination}</strong></div>
          <div><div class="eyebrow" style="margin-bottom:2px;">Current Location</div><strong>${shipment.currentLocation}</strong></div>
          <div><div class="eyebrow" style="margin-bottom:2px;">Estimated Arrival</div><strong>${fmtDate(shipment.eta, { dateStyle: "long" })}</strong></div>
        </div>

        <div style="margin-top:1.75rem;">
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--text-on-dark-muted); margin-bottom:0.4rem;">
            <span>Shipment progress</span><span>${shipment.progress}%</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${shipment.progress}%"></div></div>
        </div>

        <div class="grid grid-4" style="margin-top:1.75rem; font-size:0.9rem;">
          <div><div class="eyebrow" style="margin-bottom:2px;">Carrier</div>${shipment.carrier}</div>
          <div><div class="eyebrow" style="margin-bottom:2px;">Weight</div>${shipment.weightKg} kg</div>
          <div><div class="eyebrow" style="margin-bottom:2px;">Packages</div>${shipment.packages}</div>
          <div><div class="eyebrow" style="margin-bottom:2px;">Shipping Method</div>${shipment.shippingMethod}</div>
        </div>
        <p style="margin-top:1.25rem; font-size:0.8rem; color:var(--text-on-dark-muted);">Last update: ${fmtDate(shipment.lastUpdate)} — visualization is a frontend simulation, not a live GPS/carrier feed.</p>
      </div>

      <div class="grid" style="grid-template-columns: 1.1fr 0.9fr; align-items:start;" id="trackingDetailGrid">
        <div class="route-panel">
          <div class="bg-grid"></div>
          ${buildRouteSvg(shipment.route, shipment.progress)}
        </div>
        <div class="card">
          <h3>Shipment Timeline</h3>
          <ul class="timeline">${timelineHtml}</ul>
        </div>
      </div>`;

    container.hidden = false;
    document.getElementById("trackingEmpty")?.setAttribute("hidden", "hidden");
    document.getElementById("trackingNotFound")?.setAttribute("hidden", "hidden");
  }

  function renderNotFound(value) {
    const notFound = document.getElementById("trackingNotFound");
    const result = document.getElementById("trackingResult");
    const empty = document.getElementById("trackingEmpty");
    if (result) result.hidden = true;
    if (empty) empty.setAttribute("hidden", "hidden");
    if (notFound) {
      notFound.hidden = false;
      const span = notFound.querySelector("[data-query]");
      if (span) span.textContent = value;
    }
  }

  function showLoading() {
    const result = document.getElementById("trackingResult");
    const empty = document.getElementById("trackingEmpty");
    const notFound = document.getElementById("trackingNotFound");
    if (empty) empty.setAttribute("hidden", "hidden");
    if (notFound) notFound.setAttribute("hidden", "hidden");
    if (!result) return;
    result.hidden = false;
    result.innerHTML = `
      <div class="skeleton" style="height:220px; border-radius:20px; margin-bottom:1.5rem;"></div>
      <div class="grid" style="grid-template-columns: 1.1fr 0.9fr;">
        <div class="skeleton" style="height:320px; border-radius:20px;"></div>
        <div class="skeleton" style="height:320px; border-radius:20px;"></div>
      </div>`;
  }

  function performLookup(value) {
    showLoading();
    window.setTimeout(() => {
      const shipment = window.OmniRexaMock.findShipmentByTrackingNumber(value);
      if (shipment) {
        renderResult(shipment);
      } else {
        renderNotFound(value);
      }
    }, 500);
  }

  function init() {
    const form = document.getElementById("trackingForm");
    if (!form || !window.OmniRexaMock) return;
    const input = form.querySelector("input[name='trackingNumber']");

    const params = new URLSearchParams(window.location.search);
    const prefill = params.get("tn");
    if (prefill) {
      input.value = prefill;
      performLookup(prefill);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = (input.value || "").trim();
      if (!value) {
        input.focus();
        return;
      }
      performLookup(value);
    });

    document.querySelectorAll("[data-demo-fill]").forEach((btn) => {
      btn.addEventListener("click", () => {
        input.value = window.OmniRexaMock.DEMO_TRACKING_NUMBER;
        performLookup(input.value);
        input.focus();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
