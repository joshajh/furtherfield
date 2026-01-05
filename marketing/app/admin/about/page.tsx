import { db } from "@/lib/db";
import { aboutPage } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { RichTextEditor } from "@/components/RichTextEditor";
import { SaveButton } from "@/components/SaveButton";

async function saveAboutPage(formData: FormData) {
  "use server";

  const data = {
    heroTitle: (formData.get("heroTitle") as string) || null,
    heroSubtitle: (formData.get("heroSubtitle") as string) || null,
    storyTitle: (formData.get("storyTitle") as string) || null,
    storyContent: (formData.get("storyContent") as string) || null,
    missionTitle: (formData.get("missionTitle") as string) || null,
    missionContent: (formData.get("missionContent") as string) || null,
    visionTitle: (formData.get("visionTitle") as string) || null,
    visionContent: (formData.get("visionContent") as string) || null,
    accessibilityIntro: (formData.get("accessibilityIntro") as string) || null,
    physicalAccessTitle: (formData.get("physicalAccessTitle") as string) || null,
    physicalAccessContent: (formData.get("physicalAccessContent") as string) || null,
    sensoryCommTitle: (formData.get("sensoryCommTitle") as string) || null,
    sensoryCommContent: (formData.get("sensoryCommContent") as string) || null,
    needAssistanceTitle: (formData.get("needAssistanceTitle") as string) || null,
    needAssistanceContent: (formData.get("needAssistanceContent") as string) || null,
    contactEmail: (formData.get("contactEmail") as string) || null,
    partnersIntro: (formData.get("partnersIntro") as string) || null,
  };

  // Check if record exists
  const existing = db.select().from(aboutPage).get();

  if (existing) {
    db.update(aboutPage).set(data).run();
  } else {
    db.insert(aboutPage).values(data).run();
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
}

export default async function AboutAdmin() {
  const about = db.select().from(aboutPage).get();

  return (
    <div>
      <h1 className="admin-section-header !border-b-0 !pb-0 !mb-6 text-text-light text-2xl">About Page</h1>
      <form action={saveAboutPage} className="admin-card space-y-6">

        <section>
          <h2 className="admin-section-header">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Hero Title</label>
              <input
                name="heroTitle"
                defaultValue={about?.heroTitle || ""}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Hero Subtitle</label>
              <textarea
                name="heroSubtitle"
                defaultValue={about?.heroSubtitle || ""}
                rows={2}
                className="admin-input"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="admin-section-header">Our Story</h2>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Main Title</label>
              <input
                name="storyTitle"
                defaultValue={about?.storyTitle || ""}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Main Content</label>
              <RichTextEditor
                name="storyContent"
                defaultValue={about?.storyContent || ""}
                rows={5}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="admin-section-header">Mission & Vision</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="admin-label">Block 1 - Title</label>
                <input
                  name="missionTitle"
                  defaultValue={about?.missionTitle || ""}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Block 1 - Content</label>
                <RichTextEditor
                  name="missionContent"
                  defaultValue={about?.missionContent || ""}
                  rows={4}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Block 2 - Title</label>
                <input
                  name="visionTitle"
                  defaultValue={about?.visionTitle || ""}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Block 2 - Content</label>
                <RichTextEditor
                  name="visionContent"
                  defaultValue={about?.visionContent || ""}
                  rows={4}
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="admin-section-header">Accessibility</h2>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Accessibility Intro</label>
              <RichTextEditor
                name="accessibilityIntro"
                defaultValue={about?.accessibilityIntro || ""}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-4">
              <div>
                <label className="admin-label">Block 1 - Title</label>
                <input
                  name="physicalAccessTitle"
                  defaultValue={about?.physicalAccessTitle || "Physical Access"}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Block 1 - Content</label>
                <RichTextEditor
                  name="physicalAccessContent"
                  defaultValue={about?.physicalAccessContent || ""}
                  rows={4}
                  placeholder="Use bullet lists to list accessibility features..."
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Block 2 - Title</label>
                <input
                  name="sensoryCommTitle"
                  defaultValue={about?.sensoryCommTitle || "Sensory & Communication"}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Block 2 - Content</label>
                <RichTextEditor
                  name="sensoryCommContent"
                  defaultValue={about?.sensoryCommContent || ""}
                  rows={4}
                  placeholder="Use bullet lists to list accessibility features..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div>
              <label className="admin-label">Block 3 - Title</label>
              <input
                name="needAssistanceTitle"
                defaultValue={about?.needAssistanceTitle || "Need Assistance?"}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Block 3 - Content</label>
              <RichTextEditor
                name="needAssistanceContent"
                defaultValue={about?.needAssistanceContent || ""}
                rows={3}
                placeholder="Information about how to get help with accessibility needs..."
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="admin-section-header">Partners & Contact</h2>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Partners Intro</label>
              <RichTextEditor
                name="partnersIntro"
                defaultValue={about?.partnersIntro || ""}
                rows={3}
              />
            </div>
            <div>
              <label className="admin-label">Contact Email</label>
              <input
                name="contactEmail"
                type="email"
                defaultValue={about?.contactEmail || ""}
                className="admin-input"
              />
            </div>
          </div>
        </section>

        <div className="pt-2">
          <SaveButton>Save About Page</SaveButton>
        </div>
      </form>
    </div>
  );
}
