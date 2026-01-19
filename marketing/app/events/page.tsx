import { getEvents, getSettings } from "@/lib/cms";
import EventsPageClient from "./EventsPageClient";

export default async function EventsPage() {
  const [events, settings] = await Promise.all([getEvents(), getSettings()]);

  return (
    <EventsPageClient
      events={events}
      marqueeText={settings?.marqueeText}
      ffSnippet={settings?.ffSnippet}
    />
  );
}
