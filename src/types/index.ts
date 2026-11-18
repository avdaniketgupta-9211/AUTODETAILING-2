export type Service = {
  slug: string;
  name: string;
  summary: string;
  image: string;
  alt: string;
};

export type Testimonial = {
  name: string;
  date: string;
  quote: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};
