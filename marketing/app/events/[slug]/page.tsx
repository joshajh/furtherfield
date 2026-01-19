import { getEvent, getEvents, getSettings, getEventPeople } from "@/lib/cms";
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
  const [event, allEvents, settings, eventPeople] = await Promise.all([
    getEvent(slug),
    getEvents(),
    getSettings(),
    getEventPeople(slug),
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
      people={eventPeople}
      marqueeText={settings?.marqueeText}
      ffSnippet={settings?.ffSnippet}
    />
  );
}
