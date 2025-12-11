import { db } from "@/lib/db";
import { venues } from "@/lib/db/schema";
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
  db.delete(venues).where(eq(venues.id, parseInt(id))).run();

  revalidatePath("/admin/venues");
  revalidatePath("/about");

  return new Response(null, { status: 204 });
}
