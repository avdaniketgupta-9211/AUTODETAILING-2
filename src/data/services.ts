import type { Service } from "@/types";

/**
 * Services listed on https://rollingsautomotive.com/services/ and the homepage.
 * Descriptions are editorial rewrites that avoid unverified technical claims.
 * Images: licensed Pexels photography (see ASSETS.md) — replace with shop photography when available.
 */
export const services: Service[] = [
  {
    slug: "engine-repair",
    name: "Engine Repair",
    summary: "From warning lights to rough running — diagnosed properly, repaired with quality parts.",
    image: "/images/stock/engine-repair.jpg",
    alt: "Technician working inside an open engine bay with hand tools",
  },
  {
    slug: "brakes",
    name: "Brake Service",
    summary: "Inspection, pads, rotors and complete brake jobs, front or rear.",
    image: "/images/stock/brake-caliper.jpg",
    alt: "Close detail of a brake caliper behind a performance wheel, in monochrome",
  },
  {
    slug: "oil-change",
    name: "Oil Changes",
    summary: "Routine lube and oil service that respects factory-recommended intervals.",
    image: "/images/stock/mechanic-hands.jpg",
    alt: "Mechanic’s hands working on engine components during routine maintenance",
  },
  {
    slug: "tire-rotation",
    name: "Tire Rotation",
    summary: "Even wear, longer tire life and a smoother, quieter drive.",
    image: "/images/stock/bmw-wheel.jpg",
    alt: "Detail of an alloy wheel, tire sidewall and brake disc",
  },
  {
    slug: "wheel-alignment",
    name: "Wheel Alignment",
    summary: "Straight tracking and correct geometry so your car drives the way it should.",
    image: "/images/stock/wheel-lowlight.jpg",
    alt: "Car wheel and rim photographed in low, directional light",
  },
  {
    slug: "suspension",
    name: "Suspension",
    summary: "Shocks, struts and steering components assessed for comfort and control.",
    image: "/images/stock/garage-car.jpg",
    alt: "Mechanic beside a dark car inside a workshop",
  },
  {
    slug: "battery",
    name: "Battery",
    summary: "Testing and replacement to keep starting reliable in every season.",
    image: "/images/stock/battery.jpg",
    alt: "Car battery inside an engine bay with jump leads connected",
  },
  {
    slug: "transmission",
    name: "Transmission",
    summary: "Transmission service and repair handled with care and clear explanations.",
    image: "/images/stock/engine-part.jpg",
    alt: "Mechanic focused on a precision drivetrain component on the bench",
  },
  {
    slug: "vehicle-electronics",
    name: "Vehicle Electronics",
    summary: "Electrical faults traced methodically with modern diagnostic equipment.",
    image: "/images/stock/diagnostics.jpg",
    alt: "Technician using a diagnostic tool on a modern engine",
  },
  {
    slug: "air-conditioning",
    name: "Air Conditioning",
    summary: "A/C performance checks and repairs for Southern California summers.",
    image: "/images/stock/engine-bay.jpg",
    alt: "Open hood revealing the engine bay during an inspection",
  },
  {
    slug: "hybrid",
    name: "Hybrid Vehicle Service",
    summary: "Maintenance and repair for hybrid cars alongside conventional drivetrains.",
    image: "/images/stock/diagnostics-vw.jpg",
    alt: "Close view of a technician diagnosing a modern engine with specialist equipment",
  },
  {
    slug: "smog-check",
    name: "Smog Checks",
    summary: "Smog check inspections, handled as part of your routine visit.",
    image: "/images/stock/mechanic-closeup.jpg",
    alt: "Close-up of a mechanic working carefully on a car engine",
  },
  {
    slug: "towing",
    name: "Towing",
    summary: "Can’t drive it in? Call us and we’ll help arrange getting your vehicle to the shop.",
    image: "/images/stock/technician-engine.jpg",
    alt: "Technician in coveralls inspecting an engine in the repair shop",
  },
];

/** Additional items listed on the source services page. */
export const additionalServices = ["Head & Tail Lights", "Car Washes"] as const;

/** Fleet services listed on https://rollingsautomotive.com/fleet-maintenance/ */
export const fleetOfferings = [
  "Quality preventative maintenance",
  "Minimize unnecessary downtime and costs",
  "Fast turnarounds",
  "Comprehensive care plans",
  "Extended vehicle safety and service life",
] as const;

export const fleetServices = [
  { title: "Preventative Inspections", body: "Problems found early — before they become roadside breakdowns." },
  { title: "High-Quality Repairs On Demand", body: "When something does go wrong, we get the vehicle back in service quickly." },
  { title: "Efficient Maintenance & Servicing", body: "Scheduled servicing planned around your operation, not ours." },
] as const;

export const fleetMisc = [
  "Tire rotations",
  "Tire inflations",
  "Wheel balancing",
  "Alignment",
  "A/C",
  "Brakes",
  "Transmissions",
  "Electrical systems",
  "Steering systems",
  "Lube & oil",
  "Fluid top-offs",
] as const;
