import { getAboutPage, getSettings } from "@/lib/keystatic";
import AboutPageClient from "./AboutPageClient";

export default async function AboutPage() {
  const [aboutPage, settings] = await Promise.all([getAboutPage(), getSettings()]);

  return (
    <AboutPageClient
      aboutPage={aboutPage}
      marqueeText={settings?.marqueeText}
      aboutSnippet={settings?.aboutSnippet}
    />
  );
}
