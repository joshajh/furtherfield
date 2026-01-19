import { getAboutPage, getSettings, getVenues } from "@/lib/cms";
import AboutPageClient from "./AboutPageClient";

export default async function AboutPage() {
  const [aboutPage, settings, venues] = await Promise.all([
    getAboutPage(),
    getSettings(),
    getVenues(),
  ]);

  return (
    <AboutPageClient
      aboutPage={aboutPage}
      venues={venues}
      marqueeText={settings?.marqueeText}
      ffSnippet={settings?.ffSnippet}
    />
  );
}
