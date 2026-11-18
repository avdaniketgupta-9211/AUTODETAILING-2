import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Button } from "@/components/ui/Button";
import { fleetOfferings } from "@/data/services";
import { pad2 } from "@/lib/utils";

export function FleetSection() {
  return (
    <section id="fleet" aria-labelledby="fleet-title" className="relative border-t border-line bg-ink py-24 md:py-36 lg:py-44">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <SectionHeading
            id="fleet-title"
            chapter="06"
            label="Fleet maintenance"
            lines={["Keep your", "business", <em key="m">moving.</em>]}
          />
          <p className="mt-10 max-w-lg text-[0.98rem] leading-relaxed text-bone/85" data-reveal="fade">
            Keep your drivers safe and your vehicles working for you, day in and day out. We work with fleets of all sizes and offer custom pricing and service plans — high-quality maintenance with speedy turnaround times.
          </p>
          <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-mute" data-reveal="fade">
            Your business’ reputation is not something we take lightly. We’ll help minimize surprise breakdowns and headaches.
          </p>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row" data-reveal="fade">
            <Button href="/contact?topic=fleet">Discuss fleet maintenance</Button>
            <Button href="/fleet-maintenance" variant="outline">Fleet program</Button>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <ImageReveal
            src="/images/stock/fleet-van.jpg"
            alt="White passenger van parked outside a modern commercial building"
            className="aspect-[16/11] w-full"
            sizes="(min-width: 1024px) 40vw, 100vw"
            tone="tone-deep"
            parallax={8}
          />
          <ul className="mt-10" data-stagger aria-label="What Rollings Automotive provides for fleets">
            {fleetOfferings.map((o, i) => (
              <li key={o} data-stagger-item className="flex items-baseline gap-6 border-t border-line py-4 last:border-b">
                <span className="eyebrow w-6 shrink-0">{pad2(i + 1)}</span>
                <span className="text-[1.02rem] text-bone/90">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
