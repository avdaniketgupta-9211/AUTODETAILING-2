import type { NavItem, GalleryImage } from "@/types";

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Classic Cars", href: "/classic-cars" },
  { label: "Fleet", href: "/fleet-maintenance" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: NavItem[] = [
  ...mainNav,
  { label: "Specials", href: "/specials" },
];

/** Real photography published by Rollings Automotive on its classic-cars page. */
export const classicGallery: GalleryImage[] = [
  {
    src: "/images/business/silver-classic-car-1.png",
    alt: "Silver classic Chevrolet with polished custom wheels parked inside the Rollings Automotive shop",
    caption: "Chrome, steel and patience",
    width: 1920,
    height: 1440,
  },
  {
    src: "/images/business/green-car-engine.png",
    alt: "Show-quality engine bay with chrome components and green pinstriped panels",
    caption: "Detail under the hood",
    width: 1440,
    height: 1080,
  },
  {
    src: "/images/business/Black-classic-car.png",
    alt: "Two-tone navy and silver classic British saloon in the Rollings workshop",
    caption: "Heritage, maintained",
    width: 1920,
    height: 1440,
  },
  {
    src: "/images/business/green-car-chevrolet.png",
    alt: "Green custom Chevrolet with pinstriped rear deck on the workshop alignment rack",
    caption: "Custom work, done right",
    width: 1440,
    height: 1080,
  },
  {
    src: "/images/business/Classic-car-restoration-6.png",
    alt: "Chrome-dressed small-block Chevrolet engine in a red classic car",
    caption: "Mechanical precision",
    width: 1920,
    height: 1440,
  },
  {
    src: "/images/business/Classic-car-restoration-1.png",
    alt: "Cream and black neo-classic roadster parked in the Rollings Automotive showroom",
    caption: "Unique cars welcome",
    width: 1920,
    height: 1440,
  },
  {
    src: "/images/business/WS8-classic-car-e1671263286744-1.png",
    alt: "White classic Corvette convertible photographed in profile",
    caption: "Timeless lines",
    width: 1440,
    height: 1080,
  },
  {
    src: "/images/business/classic-car-jurassic-side.png",
    alt: "Red and silver Jeep Wrangler in custom film-inspired livery",
    caption: "Bring us your vision",
    width: 1920,
    height: 1440,
  },
];
