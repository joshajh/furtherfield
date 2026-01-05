import { db } from "@/lib/db";
import { events, venues, eventDates, people, eventPeople } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ImageUploader } from "@/components/ImageUploader";
import { RichTextEditor } from "@/components/RichTextEditor";
import { DateListEditor } from "@/components/DateListEditor";
import { PeopleSelector } from "@/components/PeopleSelector";
import { SaveButton } from "@/components/SaveButton";

async function saveEvent(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const datesJson = formData.get("dates") as string;
  const dates: { date: string; time?: string }[] = datesJson ? JSON.parse(datesJson) : [];
  const peopleJson = formData.get("people") as string;
  const selectedPeople: { personId: number; role?: string }[] = peopleJson ? JSON.parse(peopleJson) : [];

  // Use first date from dates array if available
  const firstDate = dates.length > 0 ? dates[0].date : null;
  const firstTime = dates.length > 0 ? dates[0].time || null : null;

  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    date: firstDate,
    time: firstTime,
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

  let eventId: number;

  if (id === "new") {
    const result = db.insert(events).values(data).returning({ id: events.id }).get();
    eventId = result.id;
  } else {
    eventId = parseInt(id);
    db.update(events)
      .set(data)
      .where(eq(events.id, eventId))
      .run();
    // Clear existing dates
    db.delete(eventDates).where(eq(eventDates.eventId, eventId)).run();
  }

  // Insert new dates
  if (dates.length > 0) {
    for (const dateEntry of dates) {
      db.insert(eventDates).values({
        eventId,
        date: dateEntry.date,
        time: dateEntry.time || null,
      }).run();
    }
  }

  // Clear existing people
  db.delete(eventPeople).where(eq(eventPeople.eventId, eventId)).run();

  // Insert new people
  if (selectedPeople.length > 0) {
    for (const entry of selectedPeople) {
      db.insert(eventPeople).values({
        eventId,
        personId: entry.personId,
        role: entry.role || null,
      }).run();
    }
  }

  revalidatePath("/admin/events");
  revalidatePath("/admin/people");
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
  let existingDates: { date: string; time?: string }[] = [];
  let existingPeople: { personId: number; role?: string }[] = [];

  if (!isNew) {
    event = db
      .select()
      .from(events)
      .where(eq(events.id, parseInt(id)))
      .get();
    if (!event) redirect("/admin/events");

    // Fetch existing dates
    const dateRows = db
      .select()
      .from(eventDates)
      .where(eq(eventDates.eventId, parseInt(id)))
      .all();
    existingDates = dateRows.map((d) => ({
      date: d.date,
      time: d.time || undefined,
    }));

    // If no dates in new table but legacy date exists, use that
    if (existingDates.length === 0 && event.date) {
      existingDates = [{ date: event.date, time: event.time || undefined }];
    }

    // Fetch existing people
    const peopleRows = db
      .select()
      .from(eventPeople)
      .where(eq(eventPeople.eventId, parseInt(id)))
      .all();
    existingPeople = peopleRows.map((p) => ({
      personId: p.personId,
      role: p.role || undefined,
    }));
  }

  const allVenues = db.select().from(venues).all();
  const allPeople = db.select().from(people).orderBy(asc(people.sortOrder), asc(people.name)).all();

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

        <div>
          <label className="admin-label">Event Dates</label>
          <DateListEditor
            name="dates"
            defaultValue={JSON.stringify(existingDates)}
          />
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
          <label className="admin-label">People</label>
          <PeopleSelector
            name="people"
            people={allPeople}
            defaultValue={JSON.stringify(existingPeople)}
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
          <SaveButton>Save</SaveButton>
          <a href="/admin/events" className="admin-btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
