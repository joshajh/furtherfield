import Link from "next/link";
import { cookies } from "next/headers";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin_auth");
  if (!authCookie) return false;

  const expectedValue = Buffer.from(
    `${process.env.ADMIN_USERNAME || "admin"}:${process.env.ADMIN_PASSWORD || "changeme"}`
  ).toString("base64");

  return authCookie.value === expectedValue;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if authenticated
  const authenticated = await isAuthenticated();

  // If not authenticated, show login form inline
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
        <div className="admin-card w-full max-w-md">
          <h1 className="admin-section-header text-center !border-b-0 !pb-0 !mb-6 text-lg">Admin Login</h1>
          <form action="/api/admin/login" method="POST" className="space-y-4">
            <div>
              <label htmlFor="username" className="admin-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="admin-input"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label htmlFor="password" className="admin-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="admin-input"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="admin-btn w-full"
            >
              Sign In
            </button>
          </form>
          <p className="mt-4 text-center">
            <Link href="/" className="admin-link">
              ← Back to site
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark font-mono">
      <nav className="admin-card !rounded-none !border-x-0 !border-t-0 !p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3 flex-wrap">
          <Link href="/admin" className="tag tag-lg !border-2">
            CMS
          </Link>
          <Link href="/admin/events" className="tag">
            Events
          </Link>
          <Link href="/admin/venues" className="tag">
            Venues
          </Link>
          <Link href="/admin/partners" className="tag">
            Partners
          </Link>
          <Link href="/admin/settings" className="tag">
            Settings
          </Link>
          <Link href="/admin/about" className="tag">
            About
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/" className="tag">
              View Site
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="admin-link admin-link-danger"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
