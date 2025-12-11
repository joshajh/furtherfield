import Link from "next/link";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { DeleteEventButton } from "./DeleteEventButton";

export default async function EventsAdmin() {
  const allEvents = db.select().from(events).orderBy(desc(events.date)).all();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="admin-section-header !border-b-0 !pb-0 !mb-0 text-text-light text-2xl">Events</h1>
        <Link href="/admin/events/new" className="admin-btn">
          + Add Event
        </Link>
      </div>
      <div className="admin-card !p-0 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Type</th>
              <th>Featured</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allEvents.map((event) => (
              <tr key={event.id}>
                <td className="font-medium">{event.title}</td>
                <td className="opacity-70">{event.date || "-"}</td>
                <td className="opacity-70 capitalize">{event.type}</td>
                <td>
                  {event.featured ? (
                    <span className="tag tag-sm bg-treatment-acid/50">Yes</span>
                  ) : (
                    <span className="opacity-40">No</span>
                  )}
                </td>
                <td className="text-right space-x-4">
                  <Link href={`/admin/events/${event.id}`} className="admin-link">
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
