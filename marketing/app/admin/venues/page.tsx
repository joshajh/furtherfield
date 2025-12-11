import Link from "next/link";
import { db } from "@/lib/db";
import { venues } from "@/lib/db/schema";
import { DeleteVenueButton } from "./DeleteVenueButton";

export default async function VenuesAdmin() {
  const allVenues = db.select().from(venues).all();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="admin-section-header !border-b-0 !pb-0 !mb-0 text-text-light text-2xl">Venues</h1>
        <Link href="/admin/venues/new" className="admin-btn">
          + Add Venue
        </Link>
      </div>
      <div className="admin-card !p-0 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Address</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allVenues.map((venue) => (
              <tr key={venue.id}>
                <td className="font-medium">{venue.name}</td>
                <td className="opacity-70 capitalize">{venue.type || "-"}</td>
                <td className="opacity-70">{venue.address || "-"}</td>
                <td className="text-right space-x-4">
                  <Link href={`/admin/venues/${venue.id}`} className="admin-link">
                    Edit
                  </Link>
                  <DeleteVenueButton id={venue.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
