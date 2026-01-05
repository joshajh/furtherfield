import { db } from "@/lib/db";
import { venues } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ListEditor } from "@/components/ListEditor";
import { SaveButton } from "@/components/SaveButton";

async function saveVenue(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const data = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    address: (formData.get("address") as string) || null,
    type: (formData.get("type") as string) || null,
    description: (formData.get("description") as string) || null,
    accessibility: (formData.get("accessibility") as string) || null,
  };

  if (id === "new") {
    db.insert(venues).values(data).run();
  } else {
    db.update(venues)
      .set(data)
      .where(eq(venues.id, parseInt(id)))
      .run();
  }

  revalidatePath("/admin/venues");
  revalidatePath("/about");
  redirect("/admin/venues");
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function VenueEditPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";
  let venue = null;

  if (!isNew) {
    venue = db
      .select()
      .from(venues)
      .where(eq(venues.id, parseInt(id)))
      .get();
    if (!venue) redirect("/admin/venues");
  }

  return (
    <div>
      <h1 className="admin-section-header !border-b-0 !pb-0 !mb-6 text-text-light text-2xl">
        {isNew ? "New Venue" : "Edit Venue"}
      </h1>
      <form action={saveVenue} className="admin-card space-y-5">
        <input type="hidden" name="id" value={id} />

        <div>
          <label className="admin-label">Name</label>
          <input
            name="name"
            defaultValue={venue?.name || ""}
            required
            className="admin-input"
          />
        </div>

        <div>
          <label className="admin-label">Slug</label>
          <input
            name="slug"
            defaultValue={venue?.slug || ""}
            required
            className="admin-input"
          />
        </div>

        <div>
          <label className="admin-label">Type</label>
          <select
            name="type"
            defaultValue={venue?.type || ""}
            className="admin-select"
          >
            <option value="">Select type...</option>
            <option value="gallery">Gallery</option>
            <option value="theater">Theater</option>
            <option value="outdoor">Outdoor</option>
            <option value="community">Community Space</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="admin-label">Address</label>
          <input
            name="address"
            defaultValue={venue?.address || ""}
            className="admin-input"
          />
        </div>

        <div>
          <label className="admin-label">Description</label>
          <RichTextEditor
            name="description"
            defaultValue={venue?.description || ""}
            rows={4}
          />
        </div>

        <div>
          <label className="admin-label">Accessibility Features</label>
          <ListEditor
            name="accessibility"
            defaultValue={venue?.accessibility || "[]"}
            placeholder="Add accessibility feature..."
          />
        </div>

        <div className="flex gap-4 pt-2">
          <SaveButton>Save</SaveButton>
          <a href="/admin/venues" className="admin-btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
