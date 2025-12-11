import { db } from "@/lib/db";
import { partners } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkAuth, getUnauthorizedResponse } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthed = await checkAuth();
  if (!isAuthed) return getUnauthorizedResponse();

  const { id } = await params;

  db.delete(partners).where(eq(partners.id, parseInt(id))).run();

  revalidatePath("/admin/partners");
  revalidatePath("/about");

  return new Response(null, { status: 204 });
}
