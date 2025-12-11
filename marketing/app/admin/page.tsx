import Link from "next/link";
import { db } from "@/lib/db";
import { events, venues, partners } from "@/lib/db/schema";
import { count } from "drizzle-orm";

export default async function AdminDashboard() {
  const [eventCount] = db.select({ count: count() }).from(events).all();
  const [venueCount] = db.select({ count: count() }).from(venues).all();
  const [partnerCount] = db.select({ count: count() }).from(partners).all();

  return (
    <div>
      <h1 className="admin-section-header !border-b-0 !pb-0 !mb-8 text-text-light text-2xl">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/events"
          className="admin-card group hover:bg-treatment-lemon transition-all"
        >
          <h2 className="admin-label !mb-2">Events</h2>
          <p className="text-4xl font-bold text-text-dark font-mono">{eventCount.count}</p>
          <p className="admin-link !text-divider group-hover:!text-text-dark mt-2">Manage →</p>
        </Link>
        <Link
          href="/admin/venues"
          className="admin-card group hover:bg-treatment-lemon transition-all"
        >
          <h2 className="admin-label !mb-2">Venues</h2>
          <p className="text-4xl font-bold text-text-dark font-mono">{venueCount.count}</p>
          <p className="admin-link !text-divider group-hover:!text-text-dark mt-2">Manage →</p>
        </Link>
        <Link
          href="/admin/partners"
          className="admin-card group hover:bg-treatment-lemon transition-all"
        >
          <h2 className="admin-label !mb-2">Partners</h2>
          <p className="text-4xl font-bold text-text-dark font-mono">{partnerCount.count}</p>
          <p className="admin-link !text-divider group-hover:!text-text-dark mt-2">Manage →</p>
        </Link>
      </div>
    </div>
  );
}
