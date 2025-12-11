import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);

export type Event = {
  slug: string;
  title: string;
  date: string | null;
  time: string | null;
  type: "workshop" | "performance" | "exhibition" | "screening" | "talk" | "other";
  location: string | null;
  image: string | null;
  summary: string | null;
  bookingUrl: string | null;
  featured: boolean;
};

export type Settings = {
  siteTitle: string | null;
  tagline: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  marqueeText: string | null;
  aboutSnippet: string | null;
};

export type Venue = {
  name: string | null;
  address: string | null;
  type: string | null;
  description: string | null;
  accessibility: readonly (string | null)[];
};

export type Partner = {
  name: string | null;
  logo: string | null;
};

export type AboutPage = {
  heroTitle: string | null;
  heroSubtitle: string | null;
  storyTitle: string | null;
  storyContent: string | null;
  missionTitle: string | null;
  missionContent: string | null;
  visionTitle: string | null;
  visionContent: string | null;
  accessibilityIntro: string | null;
  contactEmail: string | null;
  partnersIntro: string | null;
  partners: readonly Partner[];
  venues: readonly Venue[];
};

export async function getSettings(): Promise<Settings | null> {
  try {
    const settings = await reader.singletons.settings.read();
    return settings;
  } catch {
    return null;
  }
}

export async function getAboutPage(): Promise<AboutPage | null> {
  try {
    const aboutPage = await reader.singletons.aboutPage.read();
    return aboutPage;
  } catch {
    return null;
  }
}

export async function getEvents(): Promise<Event[]> {
  try {
    const eventSlugs = await reader.collections.events.list();
    const events = await Promise.all(
      eventSlugs.map(async (slug) => {
        const event = await reader.collections.events.read(slug);
        if (!event) return null;
        // title is a slug field with { name, slug } structure
        const titleName = typeof event.title === 'object' && event.title !== null
          ? (event.title as { name: string }).name
          : String(event.title);
        return {
          slug,
          title: titleName,
          date: event.date,
          time: event.time || null,
          type: event.type,
          location: event.location || null,
          image: event.image,
          summary: event.summary || null,
          bookingUrl: event.bookingUrl,
          featured: event.featured,
        } satisfies Event;
      })
    );
    return events.filter((e): e is Event => e !== null);
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getEvent(slug: string) {
  try {
    const event = await reader.collections.events.read(slug);
    if (!event) return null;

    // title is a slug field with { name, slug } structure
    const titleName = typeof event.title === 'object' && event.title !== null
      ? (event.title as { name: string }).name
      : String(event.title);

    // Read the raw MDX content from the file
    const fs = await import("fs/promises");
    const path = await import("path");
    const contentPath = path.join(process.cwd(), "content", "events", slug, "index.mdx");
    let descriptionContent = "";
    try {
      const fileContent = await fs.readFile(contentPath, "utf-8");
      // Extract content after frontmatter (after second ---)
      const parts = fileContent.split("---");
      if (parts.length >= 3) {
        descriptionContent = parts.slice(2).join("---").trim();
      }
    } catch {
      // File might not exist
    }

    return {
      slug,
      title: titleName,
      date: event.date,
      time: event.time,
      type: event.type,
      location: event.location,
      image: event.image,
      summary: event.summary,
      bookingUrl: event.bookingUrl,
      featured: event.featured,
      description: descriptionContent,
    };
  } catch {
    return null;
  }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const events = await getEvents();
  return events.filter((e) => e.featured);
}
