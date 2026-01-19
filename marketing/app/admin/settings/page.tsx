import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { SaveButton } from "@/components/SaveButton";

async function saveSettings(formData: FormData) {
  "use server";

  const entries = Array.from(formData.entries());

  for (const [key, value] of entries) {
    if (key.startsWith("setting_")) {
      const settingKey = key.replace("setting_", "");
      const existing = db.select().from(settings).where(eq(settings.key, settingKey)).get();

      if (existing) {
        db.update(settings)
          .set({ value: value as string })
          .where(eq(settings.key, settingKey))
          .run();
      } else {
        db.insert(settings).values({ key: settingKey, value: value as string }).run();
      }
    }
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
}

export default async function SettingsAdmin() {
  const allSettings = db.select().from(settings).all();

  // Define the expected settings with labels
  const settingsConfig = [
    { key: "site_title", label: "Site Title" },
    { key: "site_description", label: "Site Description" },
    { key: "hero_subtitle", label: "Hero Subtitle" },
    { key: "ff_snippet", label: "FF Snippet (for nav)" },
    { key: "marquee_text", label: "Marquee Text" },
  ];

  // Create a map for easy lookup
  const settingsMap = new Map(allSettings.map(s => [s.key, s.value]));

  return (
    <div>
      <h1 className="admin-section-header !border-b-0 !pb-0 !mb-6 text-text-light text-2xl">Settings</h1>
      <form action={saveSettings} className="admin-card space-y-5">
        {settingsConfig.map(({ key, label }) => (
          <div key={key}>
            <label className="admin-label">{label}</label>
            {key.includes("snippet") || key.includes("text") ? (
              <textarea
                name={`setting_${key}`}
                defaultValue={settingsMap.get(key) || ""}
                rows={3}
                className="admin-input"
              />
            ) : (
              <input
                name={`setting_${key}`}
                defaultValue={settingsMap.get(key) || ""}
                className="admin-input"
              />
            )}
          </div>
        ))}

        <div className="pt-2">
          <SaveButton>Save Settings</SaveButton>
        </div>
      </form>
    </div>
  );
}
