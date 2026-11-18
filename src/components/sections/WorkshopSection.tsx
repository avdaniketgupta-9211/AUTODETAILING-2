import { ImageReveal } from "@/components/ui/ImageReveal";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { Lines } from "@/components/ui/SectionHeading";

const NOTES = [
  { k: "Diagnostics", v: "The latest diagnostic tools and equipment, so we find the real cause." },
  { k: "Technicians", v: "Expert mechanics and technicians with in-depth knowledge and experience." },
  { k: "Equipment", v: "We’ve invested in high-quality repair equipment and the best staff." },
  { k: "Materials", v: "We never cheap out on important parts or materials." },
];

export function WorkshopSection() {
  return (
    <section aria-labelledby="workshop-title" className="relative border-t border-line bg-ink">
      {/* Ambient film band */}
      <div className="grain relative flex min-h-[80svh] items-end overflow-hidden">
        <VideoBackground
          sources={[{ src: "/videos/workshop-960.mp4", minWidth: 0 }]}
          poster="/images/workshop-poster.jpg"
          posterAlt="Mechanic working beneath a raised car inside a dimly lit garage"
          lazy
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,17,18,0.9)_0%,rgba(16,17,18,0.35)_45%,rgba(16,17,18,0.95)_100%)]" />
        <div className="wrap relative z-10 pb-20 pt-32 md:pb-28">
          <p className="eyebrow mb-8 flex items-center gap-4" data-reveal="fade">
            <span className="text-bone">08</span>
            <span aria-hidden className="h-px w-10 bg-line" />
            Inside the workshop
          </p>
          <h2 id="workshop-title" className="display max-w-[14ch] text-[clamp(2.4rem,7.5vw,7.5rem)]" data-reveal="lines">
            <Lines lines={["The craft", "behind the", <em key="r">result.</em>]} />
          </h2>
        </div>
      </div>

      {/* Collage */}
      <div className="wrap grid grid-cols-12 gap-4 py-20 md:gap-6 md:py-32">
        <ImageReveal
          src="/images/stock/mechanic-tool.jpg"
          alt="Mechanic holding a precision tool over an engine during a repair"
          className="col-span-12 aspect-[4/3] md:col-span-7 md:aspect-[16/11]"
          sizes="(min-width: 768px) 58vw, 100vw"
          parallax={10}
          caption="Mechanical precision"
        />
        <div className="col-span-12 flex flex-col justify-between gap-10 md:col-span-4 md:col-start-9">
          <ul data-stagger>
            {NOTES.map((n) => (
              <li key={n.k} data-stagger-item className="border-t border-line py-5">
                <h3 className="eyebrow text-bone">{n.k}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{n.v}</p>
              </li>
            ))}
          </ul>
          <ImageReveal
            src="/images/stock/camshaft.jpg"
            alt="Technician handling camshafts and a cylinder head on the workbench"
            className="aspect-[4/5] w-full"
            sizes="(min-width: 768px) 30vw, 100vw"
            caption="Quality components"
          />
        </div>
        <ImageReveal
          src="/images/stock/engine-bench.jpg"
          alt="Engine and metal components laid out on a workbench in a repair shop"
          className="col-span-12 mt-4 aspect-[16/9] md:col-span-6 md:col-start-2 md:mt-10"
          sizes="(min-width: 768px) 50vw, 100vw"
          parallax={8}
          caption="Professional equipment"
        />
        <ImageReveal
          src="/images/business/green-car-engine.png"
          alt="Show-quality engine bay with chrome detailing, photographed at Rollings Automotive"
          className="col-span-12 aspect-[4/3] md:col-span-4 md:col-start-8 md:mt-32"
          sizes="(min-width: 768px) 34vw, 100vw"
          caption="From the Rollings shop floor"
        />
      </div>
    </section>
  );
}
