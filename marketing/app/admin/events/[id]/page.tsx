import { db } from "@/lib/db";
import { events, venues } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ImageUploader } from "@/components/ImageUploader";
import { RichTextEditor } from "@/components/RichTextEditor";

async function saveEvent(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    date: (formData.get("date") as string) || null,
    time: (formData.get("time") as string) || null,
    type: formData.get("type") as string,
    image: (formData.get("image") as string) || null,
    summary: (formData.get("summary") as string) || null,
    description: (formData.get("description") as string) || null,
    bookingUrl: (formData.get("bookingUrl") as string) || null,
    featured: formData.get("featured") === "on",
    venueId: formData.get("venueId")
      ? parseInt(formData.get("venueId") as string)
      : null,
  };

  if (id === "new") {
    db.insert(events).values(data).run();
  } else {
    db.update(events)
      .set(data)
      .where(eq(events.id, parseInt(id)))
      .run();
  }

  revalidatePath("/admin/events");
  revalidatePath("/");
  revalidatePath("/events");
  // Revalidate the specific event detail page
  revalidatePath(`/events/${data.slug}`);
  redirect("/admin/events");
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventEditPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";
  let event = null;

  if (!isNew) {
    event = db
      .select()
      .from(events)
      .where(eq(events.id, parseInt(id)))
      .get();
    if (!event) redirect("/admin/events");
  }

  const allVenues = db.select().from(venues).all();

  return (
    <div>
      <h1 className="admin-section-header !border-b-0 !pb-0 !mb-6 text-text-light text-2xl">
        {isNew ? "New Event" : "Edit Event"}
      </h1>
      <form action={saveEvent} className="admin-card space-y-5">
        <input type="hidden" name="id" value={id} />

        <div>
          <label className="admin-label">Title</label>
          <input
            name="title"
            defaultValue={event?.title || ""}
            required
            className="admin-input"
          />
        </div>

        <div>
          <label className="admin-label">Slug</label>
          <input
            name="slug"
            defaultValue={event?.slug || ""}
            required
            className="admin-input"
          />
        </div>

        <div>
          <label className="admin-label">Event Image</label>
          <ImageUploader name="image" currentImage={event?.image} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Date</label>
            <input
              type="date"
              name="date"
              defaultValue={event?.date || ""}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Time</label>
            <input
              name="time"
              defaultValue={event?.time || ""}
              placeholder="e.g. 7:00 PM - 10:00 PM"
              className="admin-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Type</label>
            <select
              name="type"
              defaultValue={event?.type || "other"}
              className="admin-select"
            >
              <option value="workshop">Workshop</option>
              <option value="performance">Performance</option>
              <option value="exhibition">Exhibition</option>
              <option value="screening">Screening</option>
              <option value="talk">Talk</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Venue</label>
            <select
              name="venueId"
              defaultValue={event?.venueId || ""}
              className="admin-select"
            >
              <option value="">No venue</option>
              {allVenues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="admin-label">Summary</label>
          <textarea
            name="summary"
            defaultValue={event?.summary || ""}
            rows={2}
            className="admin-input"
          />
        </div>

        <div>
          <label className="admin-label">Description</label>
          <RichTextEditor
            name="description"
            defaultValue={event?.description || ""}
            rows={10}
          />
        </div>

        <div>
          <label className="admin-label">Booking URL</label>
          <input
            name="bookingUrl"
            type="url"
            defaultValue={event?.bookingUrl || ""}
            className="admin-input"
          />
        </div>

        <div>
          <label className="flex items-center gap-3 admin-label !mb-0">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={event?.featured || false}
              className="admin-checkbox"
            />
            <span>Featured Event</span>
          </label>
        </div>

        <div className="flex gap-4 pt-2">
          <button type="submit" className="admin-btn">
            Save
          </button>
          <a href="/admin/events" className="admin-btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
