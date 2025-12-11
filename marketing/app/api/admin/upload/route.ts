import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { checkAuth, getUnauthorizedResponse } from "@/lib/auth";

export async function POST(request: Request) {
  const isAuthed = await checkAuth();
  if (!isAuthed) return getUnauthorizedResponse();

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return Response.json(
      { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
      { status: 400 }
    );
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return Response.json(
      { error: "File too large. Maximum size is 5MB." },
      { status: 400 }
    );
  }

  // Generate unique filename
  const timestamp = Date.now();
  const ext = file.name.split(".").pop();
  const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;

  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  // Write file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filepath = join(uploadsDir, filename);
  await writeFile(filepath, buffer);

  // Return the API-served URL (works with dynamically uploaded files)
  const url = `/api/uploads/${filename}`;
  return Response.json({ url });
}
