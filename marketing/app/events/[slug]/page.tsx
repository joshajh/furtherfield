import { getEvent, getEvents, getSettings } from "@/lib/keystatic";
import { notFound } from "next/navigation";
import EventPageClient from "./EventPageClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const [event, allEvents, settings] = await Promise.all([
    getEvent(slug),
    getEvents(),
    getSettings(),
  ]);

  if (!event) {
    notFound();
  }

  const relatedEvents = allEvents
    .filter((e) => e.slug !== slug)
    .slice(0, 4);

  return (
    <EventPageClient
      event={event}
      relatedEvents={relatedEvents}
      marqueeText={settings?.marqueeText}
      aboutSnippet={settings?.aboutSnippet}
    />
  );
}
