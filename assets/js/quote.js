/**
 * quote.js — interactive shipping quote calculator (demo pricing logic).
 * Estimates are illustrative only and are not connected to a real rating
 * engine or carrier API.
 */
(function () {
  "use strict";

  function renderOptions(inputs) {
    const list = document.getElementById("quoteOptions");
    if (!list || !window.OmniRexaMock) return;
    const { shippingMethods, estimateQuote } = window.OmniRexaMock;

    const cards = shippingMethods
      .map((method) => {
        const { cost } = estimateQuote({ weightKg: inputs.weightKg, methodId: method.id, insurance: inputs.insurance });
        const recommended = method.id === inputs.methodId;
        return `
          <div class="quote-option ${recommended ? "is-recommended" : ""}">
            ${recommended ? '<span class="badge badge-info">Selected method</span>' : ""}
            <h3 style="margin:0;">${method.name}</h3>
            <div class="price">$${cost.toFixed(2)} <small>estimated</small></div>
            <p style="margin:0; color:var(--text-on-light-muted);">Transit time: ${method.days}</p>
            <p style="margin:0; font-size:0.8rem; color:var(--text-on-light-muted);">Tracking included · ${inputs.insurance ? "Insurance applied" : "No insurance"}</p>
          </div>`;
      })
      .join("");

    list.innerHTML = cards;
    const summary = document.getElementById("quoteSummary");
    if (summary) {
      summary.hidden = false;
      summary.querySelector("[data-summary-route]").textContent = `${inputs.origin} → ${inputs.destination}`;
      summary.querySelector("[data-summary-weight]").textContent = `${inputs.weightKg} kg`;
    }
  }

  function init() {
    const form = document.getElementById("quoteForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const inputs = {
        origin: data.get("origin") || "Accra, Ghana",
        destination: data.get("destination") || "London, United Kingdom",
        weightKg: Number(data.get("weight")) || 1,
        dimensions: data.get("dimensions") || "—",
        methodId: data.get("method") || "standard",
        packageType: data.get("packageType") || "Parcel",
        insurance: data.get("insurance") === "on",
      };
      renderOptions(inputs);
      window.OmniRexaToast?.({
        title: "Quote generated",
        message: "Estimated pricing shown below. This is demo pricing logic.",
        type: "success",
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
