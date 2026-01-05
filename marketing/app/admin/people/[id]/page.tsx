import { db } from "@/lib/db";
import { people } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ImageUploader } from "@/components/ImageUploader";
import { SaveButton } from "@/components/SaveButton";

async function savePerson(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const bio = (formData.get("bio") as string) || null;

  // Enforce 50 word limit on bio
  let truncatedBio = bio;
  if (bio) {
    const words = bio.trim().split(/\s+/);
    if (words.length > 50) {
      truncatedBio = words.slice(0, 50).join(" ");
    }
  }

  const data = {
    name: formData.get("name") as string,
    bio: truncatedBio,
    image: (formData.get("image") as string) || null,
    link: (formData.get("link") as string) || null,
    type: formData.get("type") as string,
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  if (id === "new") {
    db.insert(people).values(data).run();
  } else {
    db.update(people)
      .set(data)
      .where(eq(people.id, parseInt(id)))
      .run();
  }

  revalidatePath("/admin/people");
  revalidatePath("/events");
  redirect("/admin/people");
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PersonEditPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";
  let person = null;

  if (!isNew) {
    person = db
      .select()
      .from(people)
      .where(eq(people.id, parseInt(id)))
      .get();
    if (!person) redirect("/admin/people");
  }

  return (
    <div>
      <h1 className="admin-section-header !border-b-0 !pb-0 !mb-6 text-text-light text-2xl">
        {isNew ? "New Person" : "Edit Person"}
      </h1>
      <form action={savePerson} className="admin-card space-y-5">
        <input type="hidden" name="id" value={id} />

        <div>
          <label className="admin-label">Name</label>
          <input
            name="name"
            defaultValue={person?.name || ""}
            required
            className="admin-input"
          />
        </div>

        <div>
          <label className="admin-label">Photo</label>
          <ImageUploader name="image" currentImage={person?.image} />
        </div>

        <div>
          <label className="admin-label">Type</label>
          <select
            name="type"
            defaultValue={person?.type || "team"}
            className="admin-select"
          >
            <option value="team">Team</option>
            <option value="collaborator">Creative Collaborator</option>
            <option value="advisor">Advisor</option>
            <option value="partner">Partner</option>
          </select>
        </div>

        <div>
          <label className="admin-label">Bio (50 words max)</label>
          <textarea
            name="bio"
            defaultValue={person?.bio || ""}
            rows={3}
            maxLength={500}
            className="admin-input"
            placeholder="A short bio about this person..."
          />
          <p className="text-xs text-text-dark/50 mt-1">
            Bio will be truncated to 50 words if longer.
          </p>
        </div>

        <div>
          <label className="admin-label">Link (optional)</label>
          <input
            name="link"
            type="url"
            defaultValue={person?.link || ""}
            className="admin-input"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="admin-label">Sort Order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={person?.sortOrder || 0}
            className="admin-input w-24"
          />
          <p className="text-xs text-text-dark/50 mt-1">
            Lower numbers appear first.
          </p>
        </div>

        <div className="flex gap-4 pt-2">
          <SaveButton>Save</SaveButton>
          <a href="/admin/people" className="admin-btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
