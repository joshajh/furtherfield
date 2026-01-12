import { getEvents, getSettings } from "@/lib/cms";
import ProgrammePageClient from "./ProgrammePageClient";

export default async function ProgrammePage() {
  const [events, settings] = await Promise.all([getEvents(), getSettings()]);

  return (
    <ProgrammePageClient
      events={events}
      marqueeText={settings?.marqueeText}
      aboutSnippet={settings?.aboutSnippet}
    />
  );
}
