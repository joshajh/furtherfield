import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "cms.db");
const sqlite = new Database(dbPath);

// Create people table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    bio TEXT,
    image TEXT,
    link TEXT,
    type TEXT NOT NULL DEFAULT 'team',
    sort_order INTEGER DEFAULT 0
  )
`);

// Create event_people junction table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS event_people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    person_id INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    role TEXT
  )
`);

console.log("People tables created successfully!");

sqlite.close();
