import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-end bg-ink pb-24 pt-40">
      <div className="wrap">
        <p className="eyebrow">Error 404</p>
        <h1 className="display mt-8 max-w-[14ch] text-[clamp(2.6rem,8vw,7rem)]">
          Wrong <em>turn.</em>
        </h1>
        <p className="mt-8 max-w-md text-mute">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/">Back to home</Button>
          <Button href="/contact" variant="outline">Contact us</Button>
        </div>
      </div>
    </section>
  );
}
