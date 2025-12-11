import {
  Navigation,
  Footer,
  HeroHeader,
  EventGrid,
  ProgrammeTable,
  CTASection,
  Button,
  AnimatedSprites,
  type Event,
} from "@/components";
import { FullWidthImage } from "@/components/FullWidthImage";
import { getEvents, getSettings } from "@/lib/keystatic";

function formatEventType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" });
}

export default async function Home() {
  const [events, settings] = await Promise.all([getEvents(), getSettings()]);

  const formattedEvents: Event[] = events.map((e) => ({
    slug: e.slug,
    title: e.title,
    type: formatEventType(e.type),
    date: formatDate(e.date),
    image: e.image,
    summary: e.summary,
  }));
  return (
    <div className="min-h-screen flex flex-col gap-2.5 py-2.5">
      <AnimatedSprites />
      <Navigation
        marqueeText={settings?.marqueeText}
        aboutSnippet={settings?.aboutSnippet}
      />

      <main className="flex flex-col gap-2.5">
        <HeroHeader
          title={settings?.heroTitle || "Reimagine\nThis Coastal Town"}
          subtitle={settings?.heroSubtitle || undefined}
        />

        <EventGrid events={formattedEvents} />

        <div className="px-2.5">
          <Button variant="large" href="/events">
            View more
          </Button>
        </div>

        <FullWidthImage
          src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1600&q=80"
          alt="Shipping containers"
        />

        <ProgrammeTable events={formattedEvents} />

        <CTASection
          title={settings?.ctaText || "Book or other CTA"}
          subtitle={settings?.tagline || "Supporting two-liner"}
          buttonText={settings?.ctaText || "CTA"}
          buttonHref={settings?.ctaUrl || "#"}
        />

      </main>

      <Footer />
    </div>
  );
}
