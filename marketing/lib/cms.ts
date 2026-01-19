import { db } from "./db";
import { events, venues, settings, aboutPage, partners, eventDates, people, eventPeople } from "./db/schema";
import { eq, desc, asc } from "drizzle-orm";

export type EventDate = {
  date: string;
  endDate?: string | null;
  time?: string | null;
  isQualitative?: boolean;
  qualitativeText?: string | null;
};

export type Event = {
  slug: string;
  title: string;
  date: string | null;
  time: string | null;
  dates: EventDate[]; // Multiple dates support
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
  siteDescription: string | null;
  heroSubtitle: string | null;
  marqueeText: string | null;
  ffSnippet: string | null;
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

export type Person = {
  id: number;
  name: string;
  bio: string | null;
  image: string | null;
  link: string | null;
  type: "team" | "collaborator" | "advisor" | "partner";
  role?: string; // Optional role when associated with an event
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
  physicalAccessTitle: string | null;
  physicalAccessContent: string | null;
  sensoryCommTitle: string | null;
  sensoryCommContent: string | null;
  needAssistanceTitle: string | null;
  needAssistanceContent: string | null;
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
      siteTitle: settingsMap.site_title ?? null,
      siteDescription: settingsMap.site_description ?? null,
      heroSubtitle: settingsMap.hero_subtitle ?? null,
      marqueeText: settingsMap.marquee_text ?? null,
      ffSnippet: settingsMap.ff_snippet ?? null,
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
      physicalAccessTitle: about.physicalAccessTitle,
      physicalAccessContent: about.physicalAccessContent,
      sensoryCommTitle: about.sensoryCommTitle,
      sensoryCommContent: about.sensoryCommContent,
      needAssistanceTitle: about.needAssistanceTitle,
      needAssistanceContent: about.needAssistanceContent,
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

    // Fetch all event dates in one query for efficiency
    const allEventDates = db
      .select()
      .from(eventDates)
      .orderBy(asc(eventDates.date))
      .all();

    // Group dates by event ID
    const datesByEventId = new Map<number, EventDate[]>();
    for (const d of allEventDates) {
      if (!datesByEventId.has(d.eventId)) {
        datesByEventId.set(d.eventId, []);
      }
      datesByEventId.get(d.eventId)!.push({
        date: d.date,
        endDate: d.endDate,
        time: d.time,
        isQualitative: d.isQualitative ?? false,
        qualitativeText: d.qualitativeText,
      });
    }

    return rows.map(({ events: e, venues: v }) => {
      const dates = datesByEventId.get(e.id) || [];
      // Fall back to legacy date if no dates in new table
      const effectiveDates = dates.length > 0 ? dates : (e.date ? [{ date: e.date, time: e.time }] : []);

      return {
        slug: e.slug,
        title: e.title,
        date: e.date,
        time: e.time,
        dates: effectiveDates,
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
      };
    });
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

    // Fetch dates for this event
    const dateRows = db
      .select()
      .from(eventDates)
      .where(eq(eventDates.eventId, e.id))
      .orderBy(asc(eventDates.date))
      .all();

    const dates = dateRows.map((d) => ({
      date: d.date,
      endDate: d.endDate,
      time: d.time,
      isQualitative: d.isQualitative ?? false,
      qualitativeText: d.qualitativeText,
    }));
    // Fall back to legacy date if no dates in new table
    const effectiveDates = dates.length > 0 ? dates : (e.date ? [{ date: e.date, time: e.time }] : []);

    return {
      slug: e.slug,
      title: e.title,
      date: e.date,
      time: e.time,
      dates: effectiveDates,
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

export async function getEventPeople(eventSlug: string): Promise<Person[]> {
  try {
    // First get the event ID from the slug
    const event = db.select().from(events).where(eq(events.slug, eventSlug)).get();
    if (!event) return [];

    // Get all people linked to this event
    const rows = db
      .select({
        person: people,
        role: eventPeople.role,
      })
      .from(eventPeople)
      .innerJoin(people, eq(eventPeople.personId, people.id))
      .where(eq(eventPeople.eventId, event.id))
      .orderBy(asc(people.sortOrder), asc(people.name))
      .all();

    return rows.map(({ person: p, role }) => ({
      id: p.id,
      name: p.name,
      bio: p.bio,
      image: p.image,
      link: p.link,
      type: p.type as Person["type"],
      role: role || undefined,
    }));
  } catch {
    return [];
  }
}

export async function getAllPeople(): Promise<Person[]> {
  try {
    const rows = db
      .select()
      .from(people)
      .orderBy(asc(people.sortOrder), asc(people.name))
      .all();

    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      bio: p.bio,
      image: p.image,
      link: p.link,
      type: p.type as Person["type"],
    }));
  } catch {
    return [];
  }
}
