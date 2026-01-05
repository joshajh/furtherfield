import { db } from "@/lib/db";
import { partners } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ImageUploader } from "@/components/ImageUploader";
import { SaveButton } from "@/components/SaveButton";

async function savePartner(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const data = {
    name: formData.get("name") as string,
    logo: (formData.get("logo") as string) || null,
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  if (id === "new") {
    db.insert(partners).values(data).run();
  } else {
    db.update(partners)
      .set(data)
      .where(eq(partners.id, parseInt(id)))
      .run();
  }

  revalidatePath("/admin/partners");
  revalidatePath("/about");
  redirect("/admin/partners");
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PartnerEditPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";
  let partner = null;

  if (!isNew) {
    partner = db
      .select()
      .from(partners)
      .where(eq(partners.id, parseInt(id)))
      .get();
    if (!partner) redirect("/admin/partners");
  }

  return (
    <div>
      <h1 className="admin-section-header !border-b-0 !pb-0 !mb-6 text-text-light text-2xl">
        {isNew ? "New Partner" : "Edit Partner"}
      </h1>
      <form action={savePartner} className="admin-card space-y-5">
        <input type="hidden" name="id" value={id} />

        <div>
          <label className="admin-label">Name</label>
          <input
            name="name"
            defaultValue={partner?.name || ""}
            required
            className="admin-input"
          />
        </div>

        <div>
          <label className="admin-label">Logo</label>
          <ImageUploader name="logo" currentImage={partner?.logo} />
        </div>

        <div>
          <label className="admin-label">Sort Order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={partner?.sortOrder || 0}
            className="admin-input"
          />
          <p className="text-xs opacity-50 mt-1">Lower numbers appear first</p>
        </div>

        <div className="flex gap-4 pt-2">
          <SaveButton>Save</SaveButton>
          <a href="/admin/partners" className="admin-btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
