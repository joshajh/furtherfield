import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { checkAuth, getUnauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthed = await checkAuth();
  if (!isAuthed) return getUnauthorizedResponse();

  const { id } = await params;
  db.delete(events).where(eq(events.id, parseInt(id))).run();

  revalidatePath("/admin/events");
  revalidatePath("/");
  revalidatePath("/events");

  return new Response(null, { status: 204 });
}
