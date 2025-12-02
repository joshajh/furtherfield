import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    events: collection({
      label: "Events",
      slugField: "title",
      path: "content/events/*",
      format: { contentField: "description" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.date({ label: "Date" }),
        time: fields.text({ label: "Time", description: "e.g. 7:00 PM - 10:00 PM" }),
        type: fields.select({
          label: "Event Type",
          options: [
            { label: "Workshop", value: "workshop" },
            { label: "Performance", value: "performance" },
            { label: "Exhibition", value: "exhibition" },
            { label: "Screening", value: "screening" },
            { label: "Talk", value: "talk" },
            { label: "Other", value: "other" },
          ],
          defaultValue: "other",
        }),
        location: fields.text({ label: "Location" }),
        image: fields.image({
          label: "Featured Image",
          directory: "public/images/events",
          publicPath: "/images/events",
        }),
        summary: fields.text({
          label: "Summary",
          description: "Short description for cards/listings",
          multiline: true,
        }),
        description: fields.mdx({
          label: "Full Description",
        }),
        bookingUrl: fields.url({ label: "Booking URL", validation: { isRequired: false } }),
        featured: fields.checkbox({ label: "Featured Event", defaultValue: false }),
      },
    }),
    pages: collection({
      label: "Pages",
      slugField: "title",
      path: "content/pages/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        content: fields.mdx({
          label: "Content",
        }),
      },
    }),
  },
  singletons: {
    settings: {
      label: "Site Settings",
      path: "content/settings",
      schema: {
        siteTitle: fields.text({ label: "Site Title" }),
        tagline: fields.text({ label: "Tagline" }),
        heroTitle: fields.text({ label: "Hero Title" }),
        heroSubtitle: fields.text({ label: "Hero Subtitle", multiline: true }),
        ctaText: fields.text({ label: "CTA Button Text" }),
        ctaUrl: fields.url({ label: "CTA Button URL" }),
      },
    },
  },
});
