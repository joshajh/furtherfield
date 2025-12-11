import { cookies } from "next/headers";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin_auth");

  if (!authCookie) return false;

  const expectedValue = Buffer.from(
    `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`
  ).toString("base64");

  return authCookie.value === expectedValue;
}

export function getUnauthorizedResponse(): Response {
  return new Response("Unauthorized", { status: 401 });
}
