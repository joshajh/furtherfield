import {
  Navigation,
  Footer,
  HeroHeader,
  EventGrid,
  ProgrammeTable,
  Button,
  AnimatedSprites,
  LichenContainer,
  VimeoEmbed,
  type Event,
} from "@/components";
import { getEvents, getSettings } from "@/lib/cms";

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
    <div className="min-h-screen flex flex-col gap-2.5 pt-[calc(56px+20px)] pb-2.5 relative z-10 overflow-x-hidden">
      <AnimatedSprites />
      <Navigation
        marqueeText={settings?.marqueeText}
        ffSnippet={settings?.ffSnippet}
      />

      <main className="flex flex-col gap-2.5">
        <HeroHeader
          title={"Reimagine\nThis Coastal Town"}
          subtitle={settings?.heroSubtitle || undefined}
        />

        <EventGrid events={formattedEvents} />

        <LichenContainer seed={100} density="normal" edges={['top', 'bottom', 'left', 'right']} className="mx-2.5">
          <Button variant="large" href="/programme">
            Programme
          </Button>
        </LichenContainer>

        <LichenContainer seed={200} density="normal" edges={['top', 'bottom', 'left', 'right']} className="mx-2.5">
          <VimeoEmbed videoId="1036303680" fullViewport />
        </LichenContainer>

        <LichenContainer seed={300} density="normal" edges={['top', 'bottom', 'left', 'right']} className="mx-2.5">
          <ProgrammeTable events={formattedEvents} />
        </LichenContainer>

        <LichenContainer seed={400} density="normal" edges={['top', 'bottom', 'left', 'right']} className="mx-2.5">
          <Button variant="large" href="/events">
            Book Now
          </Button>
        </LichenContainer>

      </main>

      <Footer />
    </div>
  );
}
