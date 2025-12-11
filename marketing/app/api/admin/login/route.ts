import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    const authValue = Buffer.from(`${username}:${password}`).toString("base64");

    cookieStore.set("admin_auth", authValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    redirect("/admin");
  }

  // Invalid credentials - redirect back to admin with error
  redirect("/admin?error=invalid");
}
