import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  date: text("date"), // ISO date string (legacy, kept for backward compat)
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

export const eventDates = sqliteTable("event_dates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // ISO date string
  time: text("time"), // Optional time override for this specific date
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

export const people = sqliteTable("people", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  bio: text("bio"), // 50 word max, enforced in UI
  image: text("image"),
  link: text("link"), // optional URL
  type: text("type").notNull().default("team"), // team, collaborator, advisor, partner
  sortOrder: integer("sort_order").default(0),
});

export const eventPeople = sqliteTable("event_people", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  personId: integer("person_id").notNull().references(() => people.id, { onDelete: "cascade" }),
  role: text("role"), // optional role description for this event
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
  // Physical Access section
  physicalAccessTitle: text("physical_access_title"),
  physicalAccessContent: text("physical_access_content"), // HTML content with list items
  // Sensory & Communication section
  sensoryCommTitle: text("sensory_comm_title"),
  sensoryCommContent: text("sensory_comm_content"), // HTML content with list items
  // Need Assistance section
  needAssistanceTitle: text("need_assistance_title"),
  needAssistanceContent: text("need_assistance_content"), // HTML content
  contactEmail: text("contact_email"),
  partnersIntro: text("partners_intro"),
});
