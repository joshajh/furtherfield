import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../lib/db/schema";
import fs from "fs";
import path from "path";
import yaml from "yaml";
import matter from "gray-matter";

const dbPath = path.join(process.cwd(), "data", "cms.db");

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

// Store venue slugs to IDs for event linking
const venueSlugToId: Record<string, number> = {};

async function migrateSettings() {
  const settingsPath = path.join(process.cwd(), "content", "settings.yaml");
  if (!fs.existsSync(settingsPath)) {
    console.log("No settings.yaml found, skipping settings migration");
    return;
  }

  const content = fs.readFileSync(settingsPath, "utf-8");
  const data = yaml.parse(content);

  const settingsMap: [string, string | undefined][] = [
    ["siteTitle", data.siteTitle],
    ["tagline", data.tagline],
    ["heroTitle", data.heroTitle],
    ["heroSubtitle", data.heroSubtitle],
    ["ctaText", data.ctaText],
    ["ctaUrl", data.ctaUrl],
    ["marqueeText", data.marqueeText],
    ["aboutSnippet", data.aboutSnippet],
  ];

  for (const [key, value] of settingsMap) {
    if (value !== undefined) {
      db.insert(schema.settings)
        .values({ key, value })
        .onConflictDoUpdate({
          target: schema.settings.key,
          set: { value },
        })
        .run();
    }
  }
  console.log("Settings migrated");
}

async function migrateAboutPage() {
  const aboutPath = path.join(process.cwd(), "content", "about-page.yaml");
  if (!fs.existsSync(aboutPath)) {
    console.log("No about-page.yaml found, skipping about page migration");
    return;
  }

  const content = fs.readFileSync(aboutPath, "utf-8");
  const data = yaml.parse(content);

  // Migrate about page content
  db.insert(schema.aboutPage)
    .values({
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      storyTitle: data.storyTitle,
      storyContent: data.storyContent?.trim(),
      missionTitle: data.missionTitle,
      missionContent: data.missionContent?.trim(),
      visionTitle: data.visionTitle,
      visionContent: data.visionContent?.trim(),
      accessibilityIntro: data.accessibilityIntro?.trim(),
      contactEmail: data.contactEmail,
      partnersIntro: data.partnersIntro?.trim(),
    })
    .run();

  // Migrate partners
  if (data.partners && Array.isArray(data.partners)) {
    for (let i = 0; i < data.partners.length; i++) {
      const partner = data.partners[i];
      db.insert(schema.partners)
        .values({
          name: partner.name,
          logo: partner.logo,
          sortOrder: i,
        })
        .run();
    }
    console.log(`${data.partners.length} partners migrated`);
  }

  // Migrate venues from about-page.yaml
  if (data.venues && Array.isArray(data.venues)) {
    for (const venue of data.venues) {
      const slug = venue.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const result = db.insert(schema.venues)
        .values({
          slug,
          name: venue.name,
          address: venue.address,
          type: venue.type,
          description: venue.description,
          accessibility: JSON.stringify(venue.accessibility || []),
        })
        .returning({ id: schema.venues.id })
        .get();

      if (result) {
        venueSlugToId[slug] = result.id;
        venueSlugToId[venue.name] = result.id; // Also map by name
      }
    }
    console.log(`${data.venues.length} venues migrated`);
  }

  console.log("About page migrated");
}

async function migrateEvents() {
  const eventsDir = path.join(process.cwd(), "content", "events");
  if (!fs.existsSync(eventsDir)) {
    console.log("No events directory found, skipping events migration");
    return;
  }

  const files = fs.readdirSync(eventsDir).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const slug = file.replace(".mdx", "");
    const filePath = path.join(eventsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data, content: mdxContent } = matter(content);

    // Try to match venue by slug or name
    let venueId: number | null = null;
    if (data.venue) {
      const venueRef = String(data.venue);
      const venueSlug = venueRef
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      venueId = venueSlugToId[venueSlug] || venueSlugToId[venueRef] || null;
    }

    db.insert(schema.events)
      .values({
        slug,
        title: data.title,
        date: data.date,
        time: data.time,
        type: data.type || "other",
        venueId,
        image: data.image,
        summary: data.summary,
        description: mdxContent.trim(),
        bookingUrl: data.bookingUrl,
        featured: data.featured || false,
      })
      .run();
  }

  console.log(`${files.length} events migrated`);
}

async function main() {
  console.log("Starting migration...");
  console.log(`Database path: ${dbPath}`);

  await migrateSettings();
  await migrateAboutPage();
  await migrateEvents();

  console.log("Migration complete!");
}

main().catch(console.error);
