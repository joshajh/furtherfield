import { db } from "./db";
import { events, venues, settings, aboutPage, partners } from "./db/schema";
import { eq, desc } from "drizzle-orm";

export type Event = {
  slug: string;
  title: string;
  date: string | null;
  time: string | null;
  type: "workshop" | "performance" | "exhibition" | "screening" | "talk" | "other";
  venueSlug: string | null;
  venue: Venue | null;
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
  slug: string;
  name: string | null;
  address: string | null;
  type: string | null;
  description: string | null;
  accessibility: readonly string[];
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
};

export async function getSettings(): Promise<Settings | null> {
  try {
    const rows = db.select().from(settings).all();
    if (rows.length === 0) return null;

    const settingsMap: Record<string, string | null> = {};
    for (const row of rows) {
      settingsMap[row.key] = row.value;
    }

    return {
      siteTitle: settingsMap.siteTitle ?? null,
      tagline: settingsMap.tagline ?? null,
      heroTitle: settingsMap.heroTitle ?? null,
      heroSubtitle: settingsMap.heroSubtitle ?? null,
      ctaText: settingsMap.ctaText ?? null,
      ctaUrl: settingsMap.ctaUrl ?? null,
      marqueeText: settingsMap.marqueeText ?? null,
      aboutSnippet: settingsMap.aboutSnippet ?? null,
    };
  } catch {
    return null;
  }
}

export async function getAboutPage(): Promise<AboutPage | null> {
  try {
    const about = db.select().from(aboutPage).limit(1).get();
    if (!about) return null;

    const partnerRows = db
      .select()
      .from(partners)
      .orderBy(partners.sortOrder)
      .all();

    return {
      heroTitle: about.heroTitle,
      heroSubtitle: about.heroSubtitle,
      storyTitle: about.storyTitle,
      storyContent: about.storyContent,
      missionTitle: about.missionTitle,
      missionContent: about.missionContent,
      visionTitle: about.visionTitle,
      visionContent: about.visionContent,
      accessibilityIntro: about.accessibilityIntro,
      contactEmail: about.contactEmail,
      partnersIntro: about.partnersIntro,
      partners: partnerRows.map((p) => ({ name: p.name, logo: p.logo })),
    };
  } catch {
    return null;
  }
}

export async function getVenues(): Promise<Venue[]> {
  try {
    const rows = db.select().from(venues).all();
    return rows.map((v) => ({
      slug: v.slug,
      name: v.name,
      address: v.address,
      type: v.type,
      description: v.description,
      accessibility: v.accessibility ? JSON.parse(v.accessibility) : [],
    }));
  } catch {
    return [];
  }
}

export async function getVenue(slug: string): Promise<Venue | null> {
  try {
    const venue = db.select().from(venues).where(eq(venues.slug, slug)).get();
    if (!venue) return null;
    return {
      slug: venue.slug,
      name: venue.name,
      address: venue.address,
      type: venue.type,
      description: venue.description,
      accessibility: venue.accessibility ? JSON.parse(venue.accessibility) : [],
    };
  } catch {
    return null;
  }
}

export async function getEvents(): Promise<Event[]> {
  try {
    const rows = db
      .select()
      .from(events)
      .leftJoin(venues, eq(events.venueId, venues.id))
      .orderBy(desc(events.date))
      .all();

    return rows.map(({ events: e, venues: v }) => ({
      slug: e.slug,
      title: e.title,
      date: e.date,
      time: e.time,
      type: e.type as Event["type"],
      venueSlug: v?.slug ?? null,
      venue: v
        ? {
            slug: v.slug,
            name: v.name,
            address: v.address,
            type: v.type,
            description: v.description,
            accessibility: v.accessibility ? JSON.parse(v.accessibility) : [],
          }
        : null,
      image: e.image,
      summary: e.summary,
      bookingUrl: e.bookingUrl,
      featured: e.featured ?? false,
    }));
  } catch {
    return [];
  }
}

export async function getEvent(
  slug: string
): Promise<(Event & { description: string }) | null> {
  try {
    const row = db
      .select()
      .from(events)
      .leftJoin(venues, eq(events.venueId, venues.id))
      .where(eq(events.slug, slug))
      .get();

    if (!row) return null;
    const { events: e, venues: v } = row;

    return {
      slug: e.slug,
      title: e.title,
      date: e.date,
      time: e.time,
      type: e.type as Event["type"],
      venueSlug: v?.slug ?? null,
      venue: v
        ? {
            slug: v.slug,
            name: v.name,
            address: v.address,
            type: v.type,
            description: v.description,
            accessibility: v.accessibility ? JSON.parse(v.accessibility) : [],
          }
        : null,
      image: e.image,
      summary: e.summary,
      bookingUrl: e.bookingUrl,
      featured: e.featured ?? false,
      description: e.description || "",
    };
  } catch {
    return null;
  }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const allEvents = await getEvents();
  return allEvents.filter((e) => e.featured);
}
