import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { BrandIntroduction } from "@/components/sections/BrandIntroduction";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ClassicCarsSection } from "@/components/sections/ClassicCarsSection";
import { FleetSection } from "@/components/sections/FleetSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { WorkshopSection } from "@/components/sections/WorkshopSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandIntroduction />
      <PhilosophySection />
      <ServicesSection />
      <ClassicCarsSection />
      <FleetSection />
      <BrandsSection />
      <WorkshopSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
