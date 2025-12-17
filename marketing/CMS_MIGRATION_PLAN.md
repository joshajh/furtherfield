# CMS Migration Plan: Keystatic to SQLite + Drizzle

## Overview

Migrate from Keystatic (file-based CMS with GitHub OAuth) to a minimal SQLite-based CMS using Drizzle ORM. This eliminates OAuth complexity while providing a simple, fast admin interface.

**Stack:** SQLite + better-sqlite3 + Drizzle ORM + Server Actions + Basic Auth

---

## Phase 1: Database Setup

### 1.1 Install Dependencies

```bash
cd /home/jh/repos/furtherfield/marketing
pnpm add drizzle-orm better-sqlite3
pnpm add -D drizzle-kit @types/better-sqlite3
```

### 1.2 Create Database Schema

Create file: `lib/db/schema.ts`

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  date: text("date"), // ISO date string
  time: text("time"),
  type: text("type").notNull().default("other"), // workshop, performance, exhibition, screening, talk, other
  venueId: integer("venue_id").references(() => venues.id),
  image: text("image"),
  summary: text("summary"),
  description: text("description"), // MDX/Markdown content
  bookingUrl: text("booking_url"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

export const venues = sqliteTable("venues", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  address: text("address"),
  type: text("type"),
  description: text("description"),
  accessibility: text("accessibility"), // JSON array stored as text
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value"),
});

export const partners = sqliteTable("partners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  logo: text("logo"),
  sortOrder: integer("sort_order").default(0),
});

export const aboutPage = sqliteTable("about_page", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  storyTitle: text("story_title"),
  storyContent: text("story_content"),
  missionTitle: text("mission_title"),
  missionContent: text("mission_content"),
  visionTitle: text("vision_title"),
  visionContent: text("vision_content"),
  accessibilityIntro: text("accessibility_intro"),
  contactEmail: text("contact_email"),
  partnersIntro: text("partners_intro"),
});
```

### 1.3 Create Database Connection

Create file: `lib/db/index.ts`

```typescript
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "cms.db");
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
```

### 1.4 Create Drizzle Config

Create file: `drizzle.config.ts`

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/cms.db",
  },
} satisfies Config;
```

### 1.5 Add Database Scripts to package.json

Add to `package.json` scripts:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

### 1.6 Create Data Directory

```bash
mkdir -p /home/jh/repos/furtherfield/marketing/data
echo "*.db" >> /home/jh/repos/furtherfield/marketing/.gitignore
```

### 1.7 Generate and Apply Migrations

```bash
pnpm db:generate
pnpm db:push
```

---

## Phase 2: Data Migration Script

### 2.1 Create Migration Script

Create file: `scripts/migrate-content.ts`

This script reads existing Keystatic content and inserts it into SQLite.

```typescript
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../lib/db/schema";
import fs from "fs";
import path from "path";
import yaml from "yaml";
import matter from "gray-matter";

const dbPath = path.join(process.cwd(), "data", "cms.db");
const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

async function migrateSettings() {
  const settingsPath = path.join(process.cwd(), "content", "settings.yaml");
  const content = fs.readFileSync(settingsPath, "utf-8");
  const data = yaml.parse(content);

  const settingsMap = [
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
    await db.insert(schema.settings).values({ key, value }).onConflictDoUpdate({
      target: schema.settings.key,
      set: { value },
    });
  }
  console.log("Settings migrated");
}

async function migrateAboutPage() {
  const aboutPath = path.join(process.cwd(), "content", "about-page.yaml");
  const content = fs.readFileSync(aboutPath, "utf-8");
  const data = yaml.parse(content);

  // Migrate about page content
  await db.insert(schema.aboutPage).values({
    heroTitle: data.heroTitle,
    heroSubtitle: data.heroSubtitle,
    storyTitle: data.storyTitle,
    storyContent: data.storyContent,
    missionTitle: data.missionTitle,
    missionContent: data.missionContent,
    visionTitle: data.visionTitle,
    visionContent: data.visionContent,
    accessibilityIntro: data.accessibilityIntro,
    contactEmail: data.contactEmail,
    partnersIntro: data.partnersIntro,
  });

  // Migrate partners
  if (data.partners) {
    for (let i = 0; i < data.partners.length; i++) {
      const partner = data.partners[i];
      await db.insert(schema.partners).values({
        name: partner.name,
        logo: partner.logo,
        sortOrder: i,
      });
    }
  }

  // Migrate venues from about-page.yaml
  if (data.venues) {
    for (const venue of data.venues) {
      const slug = venue.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      await db.insert(schema.venues).values({
        slug,
        name: venue.name,
        address: venue.address,
        type: venue.type,
        description: venue.description,
        accessibility: JSON.stringify(venue.accessibility || []),
      });
    }
  }

  console.log("About page, partners, and venues migrated");
}

async function migrateEvents() {
  const eventsDir = path.join(process.cwd(), "content", "events");
  const files = fs.readdirSync(eventsDir).filter(f => f.endsWith(".mdx"));

  for (const file of files) {
    const slug = file.replace(".mdx", "");
    const filePath = path.join(eventsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data, content: mdxContent } = matter(content);

    await db.insert(schema.events).values({
      slug,
      title: data.title,
      date: data.date,
      time: data.time,
      type: data.type || "other",
      image: data.image,
      summary: data.summary,
      description: mdxContent.trim(),
      bookingUrl: data.bookingUrl,
      featured: data.featured || false,
    });
  }

  console.log(`${files.length} events migrated`);
}

async function main() {
  console.log("Starting migration...");
  await migrateSettings();
  await migrateAboutPage();
  await migrateEvents();
  console.log("Migration complete!");
}

main().catch(console.error);
```

### 2.2 Install Migration Dependencies

```bash
pnpm add yaml gray-matter
pnpm add -D tsx
```

### 2.3 Add Migration Script to package.json

```json
{
  "scripts": {
    "db:seed": "tsx scripts/migrate-content.ts"
  }
}
```

### 2.4 Run Migration

```bash
pnpm db:seed
```

---

## Phase 3: Replace Data Layer

### 3.1 Update lib/keystatic.ts

Replace file: `lib/keystatic.ts` with `lib/cms.ts`

```typescript
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
  description?: string;
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
  const rows = await db.select().from(settings);
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
}

export async function getAboutPage(): Promise<AboutPage | null> {
  const [about] = await db.select().from(aboutPage).limit(1);
  if (!about) return null;

  const partnerRows = await db.select().from(partners).orderBy(partners.sortOrder);

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
    partners: partnerRows.map(p => ({ name: p.name, logo: p.logo })),
  };
}

export async function getVenues(): Promise<Venue[]> {
  const rows = await db.select().from(venues);
  return rows.map(v => ({
    slug: v.slug,
    name: v.name,
    address: v.address,
    type: v.type,
    description: v.description,
    accessibility: v.accessibility ? JSON.parse(v.accessibility) : [],
  }));
}

export async function getVenue(slug: string): Promise<Venue | null> {
  const [venue] = await db.select().from(venues).where(eq(venues.slug, slug));
  if (!venue) return null;
  return {
    slug: venue.slug,
    name: venue.name,
    address: venue.address,
    type: venue.type,
    description: venue.description,
    accessibility: venue.accessibility ? JSON.parse(venue.accessibility) : [],
  };
}

export async function getEvents(): Promise<Event[]> {
  const rows = await db
    .select()
    .from(events)
    .leftJoin(venues, eq(events.venueId, venues.id))
    .orderBy(desc(events.date));

  return rows.map(({ events: e, venues: v }) => ({
    slug: e.slug,
    title: e.title,
    date: e.date,
    time: e.time,
    type: e.type as Event["type"],
    venueSlug: v?.slug ?? null,
    venue: v ? {
      slug: v.slug,
      name: v.name,
      address: v.address,
      type: v.type,
      description: v.description,
      accessibility: v.accessibility ? JSON.parse(v.accessibility) : [],
    } : null,
    image: e.image,
    summary: e.summary,
    bookingUrl: e.bookingUrl,
    featured: e.featured ?? false,
  }));
}

export async function getEvent(slug: string): Promise<(Event & { description: string }) | null> {
  const [row] = await db
    .select()
    .from(events)
    .leftJoin(venues, eq(events.venueId, venues.id))
    .where(eq(events.slug, slug));

  if (!row) return null;
  const { events: e, venues: v } = row;

  return {
    slug: e.slug,
    title: e.title,
    date: e.date,
    time: e.time,
    type: e.type as Event["type"],
    venueSlug: v?.slug ?? null,
    venue: v ? {
      slug: v.slug,
      name: v.name,
      address: v.address,
      type: v.type,
      description: v.description,
      accessibility: v.accessibility ? JSON.parse(v.accessibility) : [],
    } : null,
    image: e.image,
    summary: e.summary,
    bookingUrl: e.bookingUrl,
    featured: e.featured ?? false,
    description: e.description || "",
  };
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const allEvents = await getEvents();
  return allEvents.filter(e => e.featured);
}
```

### 3.2 Update Import Paths

Update all files that import from `@/lib/keystatic` to import from `@/lib/cms`:

Files to update:
- `app/page.tsx` - line 13
- `app/events/page.tsx`
- `app/events/[slug]/page.tsx`
- `app/about/page.tsx`
- `app/events/EventsPageClient.tsx`
- `app/events/[slug]/EventPageClient.tsx`
- `app/about/AboutPageClient.tsx`

For each file, change:
```typescript
// FROM:
import { getEvents, getSettings } from "@/lib/keystatic";
// TO:
import { getEvents, getSettings } from "@/lib/cms";
```

---

## Phase 4: Admin UI

### 4.1 Create Basic Auth Middleware

Create file: `lib/auth.ts`

```typescript
import { headers } from "next/headers";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

export async function checkAuth(): Promise<boolean> {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
  const [username, password] = credentials.split(":");

  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function getUnauthorizedResponse(): Response {
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
  });
}
```

### 4.2 Create Admin Layout

Replace file: `app/keystatic/layout.tsx`

```typescript
import { checkAuth, getUnauthorizedResponse } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthed = await checkAuth();

  if (!isAuthed) {
    return getUnauthorizedResponse();
  }

  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <nav className="bg-gray-900 text-white p-4">
          <div className="max-w-6xl mx-auto flex gap-6">
            <a href="/admin" className="font-bold">CMS Admin</a>
            <a href="/admin/events" className="hover:underline">Events</a>
            <a href="/admin/venues" className="hover:underline">Venues</a>
            <a href="/admin/settings" className="hover:underline">Settings</a>
            <a href="/admin/about" className="hover:underline">About Page</a>
            <a href="/" className="ml-auto hover:underline">View Site</a>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
```

### 4.3 Create Admin Dashboard

Replace file: `app/keystatic/page.tsx` with `app/admin/page.tsx`

```typescript
import Link from "next/link";
import { db } from "@/lib/db";
import { events, venues, partners } from "@/lib/db/schema";
import { count } from "drizzle-orm";

export default async function AdminDashboard() {
  const [eventCount] = await db.select({ count: count() }).from(events);
  const [venueCount] = await db.select({ count: count() }).from(venues);
  const [partnerCount] = await db.select({ count: count() }).from(partners);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <Link href="/admin/events" className="bg-white p-6 rounded-lg shadow hover:shadow-md">
          <h2 className="text-xl font-semibold">Events</h2>
          <p className="text-4xl font-bold text-blue-600">{eventCount.count}</p>
        </Link>
        <Link href="/admin/venues" className="bg-white p-6 rounded-lg shadow hover:shadow-md">
          <h2 className="text-xl font-semibold">Venues</h2>
          <p className="text-4xl font-bold text-green-600">{venueCount.count}</p>
        </Link>
        <Link href="/admin/partners" className="bg-white p-6 rounded-lg shadow hover:shadow-md">
          <h2 className="text-xl font-semibold">Partners</h2>
          <p className="text-4xl font-bold text-purple-600">{partnerCount.count}</p>
        </Link>
      </div>
    </div>
  );
}
```

### 4.4 Create Events Admin Page

Create file: `app/admin/events/page.tsx`

```typescript
import Link from "next/link";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { DeleteEventButton } from "./DeleteEventButton";

export default async function EventsAdmin() {
  const allEvents = await db.select().from(events).orderBy(desc(events.date));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <Link
          href="/admin/events/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Event
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allEvents.map((event) => (
              <tr key={event.id} className="border-t">
                <td className="px-4 py-3">{event.title}</td>
                <td className="px-4 py-3">{event.date || "-"}</td>
                <td className="px-4 py-3 capitalize">{event.type}</td>
                <td className="px-4 py-3">{event.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteEventButton id={event.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### 4.5 Create Event Edit Form

Create file: `app/admin/events/[id]/page.tsx`

```typescript
import { db } from "@/lib/db";
import { events, venues } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function saveEvent(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    date: formData.get("date") as string || null,
    time: formData.get("time") as string || null,
    type: formData.get("type") as string,
    summary: formData.get("summary") as string || null,
    description: formData.get("description") as string || null,
    bookingUrl: formData.get("bookingUrl") as string || null,
    featured: formData.get("featured") === "on",
    venueId: formData.get("venueId") ? parseInt(formData.get("venueId") as string) : null,
  };

  if (id === "new") {
    await db.insert(events).values(data);
  } else {
    await db.update(events).set(data).where(eq(events.id, parseInt(id)));
  }

  revalidatePath("/admin/events");
  revalidatePath("/");
  revalidatePath("/events");
  redirect("/admin/events");
}

export default async function EventEditPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  let event = null;

  if (!isNew) {
    [event] = await db.select().from(events).where(eq(events.id, parseInt(params.id)));
    if (!event) redirect("/admin/events");
  }

  const allVenues = await db.select().from(venues);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{isNew ? "New Event" : "Edit Event"}</h1>
      <form action={saveEvent} className="bg-white p-6 rounded-lg shadow space-y-4">
        <input type="hidden" name="id" value={params.id} />

        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            name="title"
            defaultValue={event?.title || ""}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Slug</label>
          <input
            name="slug"
            defaultValue={event?.slug || ""}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              defaultValue={event?.date || ""}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Time</label>
            <input
              name="time"
              defaultValue={event?.time || ""}
              placeholder="e.g. 7:00 PM - 10:00 PM"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Type</label>
            <select
              name="type"
              defaultValue={event?.type || "other"}
              className="w-full border rounded px-3 py-2"
            >
              <option value="workshop">Workshop</option>
              <option value="performance">Performance</option>
              <option value="exhibition">Exhibition</option>
              <option value="screening">Screening</option>
              <option value="talk">Talk</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Venue</label>
            <select
              name="venueId"
              defaultValue={event?.venueId || ""}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">No venue</option>
              {allVenues.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Summary</label>
          <textarea
            name="summary"
            defaultValue={event?.summary || ""}
            rows={2}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description (Markdown)</label>
          <textarea
            name="description"
            defaultValue={event?.description || ""}
            rows={10}
            className="w-full border rounded px-3 py-2 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Booking URL</label>
          <input
            name="bookingUrl"
            type="url"
            defaultValue={event?.bookingUrl || ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={event?.featured || false}
            />
            <span>Featured Event</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
          <a
            href="/admin/events"
            className="px-6 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
```

### 4.6 Create Delete Button Component

Create file: `app/admin/events/DeleteEventButton.tsx`

```typescript
"use client";

import { useTransition } from "react";

export function DeleteEventButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this event?")) return;

    startTransition(async () => {
      await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      window.location.reload();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
```

### 4.7 Create Delete API Route

Create file: `app/api/admin/events/[id]/route.ts`

```typescript
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { checkAuth, getUnauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const isAuthed = await checkAuth();
  if (!isAuthed) return getUnauthorizedResponse();

  await db.delete(events).where(eq(events.id, parseInt(params.id)));

  revalidatePath("/admin/events");
  revalidatePath("/");
  revalidatePath("/events");

  return new Response(null, { status: 204 });
}
```

---

## Phase 5: Cleanup

### 5.1 Remove Keystatic Dependencies

```bash
pnpm remove @keystatic/core @keystatic/next
```

### 5.2 Delete Keystatic Files

Delete these files/directories:
- `keystatic.config.ts`
- `app/api/keystatic/` (entire directory)
- `app/keystatic/keystatic.tsx`
- `lib/keystatic.ts` (after confirming lib/cms.ts works)

### 5.3 Update Environment Variables

Remove from `.env`:
```
KEYSTATIC_GITHUB_CLIENT_ID
KEYSTATIC_GITHUB_CLIENT_SECRET
KEYSTATIC_SECRET
KEYSTATIC_URL
```

Add to `.env`:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<secure-password>
```

### 5.4 Rename Admin Route

Move `app/keystatic/` to `app/admin/` (or keep old URL and redirect).

### 5.5 Update .gitignore

Add:
```
data/*.db
data/*.db-journal
```

---

## Phase 6: Additional Admin Pages (Optional)

Repeat the pattern from Phase 4 for:
- `app/admin/venues/` - CRUD for venues
- `app/admin/settings/` - Key-value editor for settings
- `app/admin/about/` - About page editor
- `app/admin/partners/` - Partners list management

Each follows the same pattern:
1. List page with table
2. Edit page with form using Server Actions
3. Delete button with API route

---

## Verification Checklist

After each phase, verify:

- [ ] Phase 1: `pnpm db:push` succeeds, database file created
- [ ] Phase 2: `pnpm db:seed` migrates all content, verify with `pnpm db:studio`
- [ ] Phase 3: Homepage loads with events from database
- [ ] Phase 3: Event detail pages work
- [ ] Phase 3: About page loads
- [ ] Phase 4: Admin login works with Basic Auth
- [ ] Phase 4: Can view/create/edit/delete events
- [ ] Phase 5: Build succeeds without Keystatic
- [ ] Phase 5: Production deployment works

---

## Notes for Implementation Agent

1. **Execute phases sequentially** - Each phase depends on the previous one
2. **Test after each phase** - Run `pnpm dev` and verify functionality
3. **Keep old files until verified** - Don't delete `lib/keystatic.ts` until `lib/cms.ts` is working
4. **Database is file-based** - The SQLite database at `data/cms.db` should be backed up in production
5. **Basic Auth credentials** - Ensure strong password is set before deployment
6. **Image handling** - Images remain in `public/images/`, no migration needed
7. **MDX rendering** - The description field stores raw markdown, existing MDX rendering should continue to work
