import { getEvents, getSettings } from "@/lib/cms";
import EventsPageClient from "./EventsPageClient";

function isEventUpcoming(event: { dates: Array<{ date: string; endDate?: string | null }> }): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if any date in the event is today or in the future
  return event.dates.some((d) => {
    // Use endDate if available, otherwise use date
    const relevantDate = d.endDate || d.date;
    const eventDate = new Date(relevantDate);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });
}

export default async function EventsPage() {
  const [events, settings] = await Promise.all([getEvents(), getSettings()]);

  // Filter out past events
  const upcomingEvents = events.filter(isEventUpcoming);

  return (
    <EventsPageClient
      events={upcomingEvents}
      marqueeText={settings?.marqueeText}
      ffSnippet={settings?.ffSnippet}
    />
  );
}
