import Link from "next/link";
import { db } from "@/lib/db";
import { partners } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { DeletePartnerButton } from "./DeletePartnerButton";

export default async function PartnersAdmin() {
  const allPartners = db.select().from(partners).orderBy(asc(partners.sortOrder)).all();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="admin-section-header !border-b-0 !pb-0 !mb-0 text-text-light text-2xl">Partners</h1>
        <Link href="/admin/partners/new" className="admin-btn">
          + Add Partner
        </Link>
      </div>
      <div className="admin-card !p-0 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Sort Order</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allPartners.map((partner) => (
              <tr key={partner.id}>
                <td>
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    <span className="opacity-40">No logo</span>
                  )}
                </td>
                <td className="font-medium">{partner.name}</td>
                <td className="opacity-70">{partner.sortOrder}</td>
                <td className="text-right space-x-4">
                  <Link href={`/admin/partners/${partner.id}`} className="admin-link">
                    Edit
                  </Link>
                  <DeletePartnerButton id={partner.id} />
                </td>
              </tr>
            ))}
            {allPartners.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center opacity-50 py-8">
                  No partners yet. Add your first partner above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
