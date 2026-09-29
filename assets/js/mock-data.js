/**
 * mock-data.js
 * ---------------------------------------------------------------------------
 * ALL DATA IN THIS FILE IS DEMO / SAMPLE DATA for prototype purposes only.
 * Nothing here represents a real shipment, customer, GPS feed, or financial
 * record. When wiring up a real backend, replace `window.OmniRexaMock` with
 * calls to actual services (see README "Mocked data & integration points").
 * ---------------------------------------------------------------------------
 */
(function (global) {
  "use strict";

  const DEMO_TRACKING_NUMBER = "GSL-2026-847291-XP";

  const shipments = [
    {
      id: "SHP-100234",
      trackingNumber: DEMO_TRACKING_NUMBER,
      type: "Air Freight",
      status: "In Transit",
      statusTone: "info",
      origin: "Accra, Ghana",
      destination: "London, United Kingdom",
      currentLocation: "Casablanca International Transit Hub, Morocco",
      eta: "2026-10-03",
      carrier: "OmniRexa Air Cargo",
      weightKg: 84.5,
      packages: 3,
      shippingMethod: "Express Air",
      lastUpdate: "2026-09-29T08:20:00",
      progress: 62,
      insured: true,
      recipient: "Nyah Boateng",
      sender: "Kojo Mensah Textiles Ltd.",
      timeline: [
        {
          state: "completed",
          title: "Order Created",
          location: "Accra, Ghana",
          time: "2026-09-26T09:12:00",
        },
        {
          state: "completed",
          title: "Package Received at Origin Hub",
          location: "Accra Logistics Hub",
          time: "2026-09-26T14:35:00",
        },
        {
          state: "completed",
          title: "Processing & Security Screening",
          location: "Accra Logistics Hub",
          time: "2026-09-27T07:40:00",
        },
        {
          state: "completed",
          title: "Departed Origin Facility",
          location: "Kotoka International Airport, Accra",
          time: "2026-09-28T14:35:00",
        },
        {
          state: "current",
          title: "In Transit — International Transfer",
          location: "Casablanca International Transit Hub, Morocco",
          time: "2026-09-29T08:20:00",
        },
        {
          state: "pending",
          title: "Arrived at Destination Hub",
          location: "London Heathrow Cargo Terminal, UK",
          time: "2026-09-30T00:00:00",
          estimated: true,
        },
        {
          state: "pending",
          title: "Out for Delivery",
          location: "London, United Kingdom",
          time: "2026-10-03T00:00:00",
          estimated: true,
        },
        {
          state: "pending",
          title: "Delivered",
          location: "London, United Kingdom",
          time: "2026-10-03T00:00:00",
          estimated: true,
        },
      ],
      route: {
        origin: { label: "Accra, GH", x: 60, y: 210 },
        transit: { label: "Casablanca Hub", x: 220, y: 120 },
        destination: { label: "London, UK", x: 420, y: 60 },
      },
    },
    {
      id: "SHP-100198",
      trackingNumber: "GSL-2026-203841-RD",
      type: "Sea Freight",
      status: "Delayed",
      statusTone: "danger",
      origin: "Tema Port, Ghana",
      destination: "Rotterdam, Netherlands",
      currentLocation: "Port of Las Palmas, Canary Islands",
      eta: "2026-10-09",
      carrier: "OmniRexa Ocean Lines",
      weightKg: 4200,
      packages: 1,
      shippingMethod: "Sea Freight (FCL)",
      lastUpdate: "2026-09-28T18:05:00",
      progress: 40,
      insured: true,
      recipient: "Van Dijk Import B.V.",
      sender: "Golden Coast Exports",
      timeline: [
        { state: "completed", title: "Order Created", location: "Tema Port, Ghana", time: "2026-09-18T10:00:00" },
        { state: "completed", title: "Container Loaded", location: "Tema Port, Ghana", time: "2026-09-19T16:20:00" },
        { state: "completed", title: "Departed Origin Port", location: "Tema Port, Ghana", time: "2026-09-20T05:00:00" },
        { state: "delayed", title: "Weather Delay — Rerouted", location: "Port of Las Palmas, Canary Islands", time: "2026-09-28T18:05:00" },
        { state: "pending", title: "Arrived at Destination Port", location: "Rotterdam, Netherlands", time: "2026-10-08T00:00:00", estimated: true },
        { state: "pending", title: "Customs Clearance", location: "Rotterdam, Netherlands", time: "2026-10-09T00:00:00", estimated: true },
        { state: "pending", title: "Delivered", location: "Rotterdam, Netherlands", time: "2026-10-09T00:00:00", estimated: true },
      ],
      route: {
        origin: { label: "Tema, GH", x: 60, y: 220 },
        transit: { label: "Las Palmas", x: 200, y: 160 },
        destination: { label: "Rotterdam, NL", x: 420, y: 70 },
      },
    },
    {
      id: "SHP-100301",
      trackingNumber: "GSL-2026-556120-QK",
      type: "Road Freight",
      status: "Delivered",
      statusTone: "success",
      origin: "Kumasi, Ghana",
      destination: "Lomé, Togo",
      currentLocation: "Lomé Distribution Center",
      eta: "2026-09-24",
      carrier: "OmniRexa Road Network",
      weightKg: 320,
      packages: 6,
      shippingMethod: "Standard Road",
      lastUpdate: "2026-09-24T16:45:00",
      progress: 100,
      insured: false,
      recipient: "Adjoa Trading Co.",
      sender: "Kumasi Craft Cooperative",
      timeline: [
        { state: "completed", title: "Order Created", location: "Kumasi, Ghana", time: "2026-09-22T08:00:00" },
        { state: "completed", title: "Package Received", location: "Kumasi Depot", time: "2026-09-22T11:00:00" },
        { state: "completed", title: "Departed Origin", location: "Kumasi Depot", time: "2026-09-22T15:00:00" },
        { state: "completed", title: "Border Crossing Cleared", location: "Aflao Border Post", time: "2026-09-23T09:30:00" },
        { state: "completed", title: "Out for Delivery", location: "Lomé Distribution Center", time: "2026-09-24T09:00:00" },
        { state: "completed", title: "Delivered — Signed by Recipient", location: "Lomé, Togo", time: "2026-09-24T16:45:00" },
      ],
      route: {
        origin: { label: "Kumasi, GH", x: 60, y: 200 },
        transit: { label: "Aflao Border", x: 220, y: 180 },
        destination: { label: "Lomé, TG", x: 420, y: 200 },
      },
    },
    {
      id: "SHP-100355",
      trackingNumber: "GSL-2026-771403-MP",
      type: "Express",
      status: "Pending Pickup",
      statusTone: "neutral",
      origin: "Takoradi, Ghana",
      destination: "Abidjan, Côte d'Ivoire",
      currentLocation: "Awaiting pickup — Takoradi Depot",
      eta: "2026-10-02",
      carrier: "OmniRexa Express",
      weightKg: 12.2,
      packages: 1,
      shippingMethod: "Express Road",
      lastUpdate: "2026-09-29T07:00:00",
      progress: 8,
      insured: true,
      recipient: "Bakary Traoré",
      sender: "Takoradi Marine Supplies",
      timeline: [
        { state: "completed", title: "Order Created", location: "Takoradi, Ghana", time: "2026-09-29T07:00:00" },
        { state: "pending", title: "Package Received", location: "Takoradi Depot", time: "2026-09-29T00:00:00", estimated: true },
        { state: "pending", title: "Departed Origin", location: "Takoradi Depot", time: "2026-09-30T00:00:00", estimated: true },
        { state: "pending", title: "Out for Delivery", location: "Abidjan, Côte d'Ivoire", time: "2026-10-02T00:00:00", estimated: true },
        { state: "pending", title: "Delivered", location: "Abidjan, Côte d'Ivoire", time: "2026-10-02T00:00:00", estimated: true },
      ],
      route: {
        origin: { label: "Takoradi, GH", x: 60, y: 210 },
        transit: { label: "Coastal Route", x: 220, y: 190 },
        destination: { label: "Abidjan, CI", x: 420, y: 210 },
      },
    },
  ];

  const dashboardStats = {
    activeShipments: 12,
    inTransit: 8,
    delivered: 31,
    delayed: 1,
    pendingPickup: 3,
  };

  const monthlyActivity = [
    { label: "Apr", value: 18 },
    { label: "May", value: 24 },
    { label: "Jun", value: 21 },
    { label: "Jul", value: 30 },
    { label: "Aug", value: 27 },
    { label: "Sep", value: 34 },
  ];

  const adminStats = {
    totalShipments: 4820,
    activeShipments: 612,
    delivered: 3940,
    delayed: 38,
    revenue: 1284650,
    customers: 1206,
    drivers: 84,
    vehicles: 96,
    securityAlerts: 2,
  };

  const drivers = [
    { name: "Kwabena Owusu", status: "On Delivery", vehicle: "OMX-1042 (Van)", location: "Tema Motorway, GH", shipment: "SHP-100234", progress: 62 },
    { name: "Ama Serwaa", status: "Available", vehicle: "OMX-2210 (Truck)", location: "Kumasi Depot, GH", shipment: "—", progress: 0 },
    { name: "Yaw Darko", status: "On Delivery", vehicle: "OMX-1187 (Van)", location: "Lomé Distribution Center, TG", shipment: "SHP-100301", progress: 96 },
    { name: "Efua Mensah", status: "Delayed", vehicle: "OMX-3390 (Truck)", location: "Aflao Border Post", shipment: "SHP-100355", progress: 22 },
    { name: "Kofi Asante", status: "Offline", vehicle: "OMX-1560 (Van)", location: "Takoradi Depot, GH", shipment: "—", progress: 0 },
  ];

  const vehicles = [
    { id: "OMX-1042", type: "Cargo Van", status: "On Delivery", driver: "Kwabena Owusu", location: "Tema Motorway, GH" },
    { id: "OMX-2210", type: "Heavy Truck", status: "Available", driver: "Ama Serwaa", location: "Kumasi Depot, GH" },
    { id: "OMX-1187", type: "Cargo Van", status: "On Delivery", driver: "Yaw Darko", location: "Lomé Distribution Center, TG" },
    { id: "OMX-3390", type: "Heavy Truck", status: "Delayed", driver: "Efua Mensah", location: "Aflao Border Post" },
    { id: "OMX-1560", type: "Cargo Van", status: "Offline", driver: "Kofi Asante", location: "Takoradi Depot, GH" },
  ];

  const invoices = [
    { id: "INV-88231", shipment: "SHP-100234", amount: 842.5, status: "Paid", date: "2026-09-26" },
    { id: "INV-88214", shipment: "SHP-100198", amount: 6120.0, status: "Pending", date: "2026-09-18" },
    { id: "INV-88190", shipment: "SHP-100301", amount: 210.0, status: "Paid", date: "2026-09-22" },
    { id: "INV-88176", shipment: "SHP-100355", amount: 95.0, status: "Pending", date: "2026-09-29" },
  ];

  const notifications = [
    { icon: "package", title: "Shipment SHP-100234 departed origin facility", time: "2 hours ago", unread: true },
    { icon: "alert", title: "Shipment SHP-100198 delayed due to weather rerouting", time: "1 day ago", unread: true },
    { icon: "check", title: "Shipment SHP-100301 delivered and signed for", time: "3 days ago", unread: false },
    { icon: "quote", title: "Your quote request Q-4471 is ready to review", time: "4 days ago", unread: false },
  ];

  const savedAddresses = [
    { label: "Head Office", name: "Kojo Mensah Textiles Ltd.", address: "12 Liberation Road, Accra, Ghana" },
    { label: "Warehouse", name: "Golden Coast Exports", address: "Tema Port Free Zone, Tema, Ghana" },
    { label: "Home", name: "Nyah Boateng", address: "44 Baker Street, London, United Kingdom" },
  ];

  const shippingMethods = [
    { id: "standard", name: "Standard Road", days: "5-8 days", multiplier: 1 },
    { id: "express", name: "Express", days: "1-3 days", multiplier: 2.1 },
    { id: "air", name: "Air Freight", days: "2-4 days", multiplier: 2.8 },
    { id: "sea", name: "Sea Freight", days: "14-30 days", multiplier: 0.6 },
    { id: "road", name: "Road Freight", days: "3-10 days", multiplier: 0.85 },
  ];

  function generateTrackingNumber() {
    const year = new Date().getFullYear();
    const digits = String(Math.floor(100000 + Math.random() * 900000));
    const suffix = Math.random().toString(36).slice(2, 4).toUpperCase();
    return `GSL-${year}-${digits}-${suffix}`;
  }

  function findShipmentByTrackingNumber(value) {
    const query = String(value || "").trim().toUpperCase();
    return shipments.find((s) => s.trackingNumber.toUpperCase() === query) || null;
  }

  function estimateQuote({ weightKg, methodId, insurance }) {
    const method = shippingMethods.find((m) => m.id === methodId) || shippingMethods[0];
    const base = 18;
    const perKg = 3.4;
    let cost = base + weightKg * perKg * method.multiplier;
    if (insurance) cost += Math.max(12, cost * 0.06);
    return {
      method,
      cost: Math.round(cost * 100) / 100,
    };
  }

  global.OmniRexaMock = {
    DEMO_TRACKING_NUMBER,
    shipments,
    dashboardStats,
    monthlyActivity,
    adminStats,
    drivers,
    vehicles,
    invoices,
    notifications,
    savedAddresses,
    shippingMethods,
    generateTrackingNumber,
    findShipmentByTrackingNumber,
    estimateQuote,
  };
})(window);
