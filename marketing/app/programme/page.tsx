import { getEvents, getSettings } from "@/lib/cms";
import ProgrammePageClient from "./ProgrammePageClient";

export const dynamic = "force-dynamic";

export default async function ProgrammePage() {
  const [events, settings] = await Promise.all([getEvents(), getSettings()]);

  return (
    <ProgrammePageClient
      events={events}
      marqueeText={settings?.marqueeText}
      ffSnippet={settings?.ffSnippet}
    />
  );
}
