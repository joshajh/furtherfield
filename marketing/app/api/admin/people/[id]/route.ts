import { db } from "@/lib/db";
import { people } from "@/lib/db/schema";
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
  db.delete(people).where(eq(people.id, parseInt(id))).run();

  revalidatePath("/admin/people");
  revalidatePath("/events");

  return new Response(null, { status: 204 });
}
