import Link from "next/link";
import { db } from "@/lib/db";
import { people } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { DeletePersonButton } from "./DeletePersonButton";

const PERSON_TYPES: Record<string, string> = {
  team: "Team",
  collaborator: "Creative Collaborator",
  advisor: "Advisor",
  partner: "Partner",
};

export default async function PeopleAdmin() {
  const allPeople = db.select().from(people).orderBy(asc(people.sortOrder), asc(people.name)).all();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="admin-section-header !border-b-0 !pb-0 !mb-0 text-text-light text-2xl">People</h1>
        <Link href="/admin/people/new" className="admin-btn">
          + Add Person
        </Link>
      </div>
      <div className="admin-card !p-0 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Bio</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allPeople.map((person) => (
              <tr key={person.id}>
                <td className="font-medium">{person.name}</td>
                <td>
                  <span className="tag tag-sm">{PERSON_TYPES[person.type] || person.type}</span>
                </td>
                <td className="opacity-70 max-w-xs truncate">
                  {person.bio ? person.bio.slice(0, 60) + (person.bio.length > 60 ? "..." : "") : "-"}
                </td>
                <td className="text-right space-x-4">
                  <Link href={`/admin/people/${person.id}`} className="admin-link">
                    Edit
                  </Link>
                  <DeletePersonButton id={person.id} />
                </td>
              </tr>
            ))}
            {allPeople.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center opacity-50 py-8">
                  No people added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
