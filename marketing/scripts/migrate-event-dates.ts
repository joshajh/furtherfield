/**
 * Safe migration script for event_dates table
 *
 * Adds support for:
 * - Date ranges (end_date column)
 * - Qualitative dates (is_qualitative, qualitative_text columns)
 *
 * This migration ONLY adds columns - no data is modified or deleted.
 * Existing data remains intact.
 */

import Database from "better-sqlite3";
import { resolve } from "path";

const dbPath = resolve(process.cwd(), "data/cms.db");

console.log("Opening database:", dbPath);
const db = new Database(dbPath);

// First, backup the current data
console.log("\n=== BACKUP: Current event_dates data ===");
const existingDates = db.prepare("SELECT * FROM event_dates").all();
console.log(JSON.stringify(existingDates, null, 2));

// Check current table structure
console.log("\n=== Current table structure ===");
const tableInfo = db.prepare("PRAGMA table_info(event_dates)").all();
console.log(tableInfo);

const existingColumns = (tableInfo as { name: string }[]).map(col => col.name);
console.log("Existing columns:", existingColumns);

// Add new columns if they don't exist
const columnsToAdd = [
  { name: "end_date", definition: "TEXT" },
  { name: "is_qualitative", definition: "INTEGER DEFAULT 0" },
  { name: "qualitative_text", definition: "TEXT" },
];

console.log("\n=== Adding new columns ===");
for (const col of columnsToAdd) {
  if (existingColumns.includes(col.name)) {
    console.log(`Column '${col.name}' already exists, skipping.`);
  } else {
    const sql = `ALTER TABLE event_dates ADD COLUMN ${col.name} ${col.definition}`;
    console.log(`Executing: ${sql}`);
    db.exec(sql);
    console.log(`Added column '${col.name}'`);
  }
}

// The tricky part: SQLite doesn't support ALTER COLUMN to change NOT NULL to NULL
// But we can work around this - the date column being NOT NULL is fine
// We'll just require either date OR qualitative_text to be set (enforced in app code)

console.log("\n=== Verifying new table structure ===");
const newTableInfo = db.prepare("PRAGMA table_info(event_dates)").all();
console.log(newTableInfo);

console.log("\n=== Verifying data integrity ===");
const verifyDates = db.prepare("SELECT * FROM event_dates").all();
console.log("Total records:", verifyDates.length);
console.log("Data after migration:", JSON.stringify(verifyDates, null, 2));

// Verify counts match
if (verifyDates.length === existingDates.length) {
  console.log("\n✅ Migration successful! No data loss detected.");
} else {
  console.error("\n❌ ERROR: Record count mismatch! Data may have been lost.");
  process.exit(1);
}

db.close();
console.log("\nDatabase closed.");
