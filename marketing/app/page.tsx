import {
  Navigation,
  Footer,
  HeroHeader,
  EventGrid,
  ProgrammeTable,
  CTASection,
  Button,
  type Event,
} from "@/components";
import { FullWidthImage } from "@/components/FullWidthImage";

// Mock data - will be replaced with CMS data
const events: Event[] = [
  {
    slug: "larping-chattanooga",
    title: "LARPing, is that the Chattanooga ChooChoo",
    type: "Workshop",
    date: "Aug 12",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
    summary: "Join us for a LARPing experience",
  },
  {
    slug: "larping-find-out",
    title: "LARPing, Find Out What It Means To Me",
    type: "Workshop",
    date: "Aug 6, 2028",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    summary: "We are all chimeras, theorized and fabricated hybrids",
  },
  {
    slug: "larping-red-light",
    title: "LARPing, You Don't Have To Put On That Red Light",
    type: "Performance",
    date: "Aug 15",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    summary: "For the light leaks and long silences",
  },
  {
    slug: "larp-basics",
    title: "LARP",
    type: "Exhibition",
    date: "Aug 20",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    summary: "Hands-on experience",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-2.5 py-2.5">
      <Navigation />

      <main className="flex flex-col gap-2.5">
        <HeroHeader />

        <EventGrid events={events} />

        <div className="px-2.5">
          <Button variant="large" href="/events">
            View more
          </Button>
        </div>

        <FullWidthImage
          src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1600&q=80"
          alt="Shipping containers"
        />

        <ProgrammeTable events={events} />

        <CTASection
          title="Book or other CTA"
          subtitle="Supporting two-liner"
          buttonText="CTA"
          buttonHref="#"
        />

        {/* Decorative ovals - placeholder for 8-bit sprites */}
        <div className="flex justify-center py-10">
          <div className="flex flex-col gap-4">
            <div className="w-72 h-48 rounded-[50%] border-2 border-text-light/20" />
            <div className="w-72 h-48 rounded-[50%] border-2 border-text-light/20" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
