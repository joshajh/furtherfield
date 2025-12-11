import { config, fields, collection, singleton } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: {
      name: "This Coastal Town",
    },
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
        venue: fields.relationship({
          label: "Venue",
          collection: "venues",
          validation: { isRequired: false },
        }),
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
    venues: collection({
      label: "Venues",
      slugField: "name",
      path: "content/venues/*",
      schema: {
        name: fields.slug({ name: { label: "Venue Name" } }),
        address: fields.text({ label: "Address" }),
        type: fields.text({ label: "Venue Type", description: "e.g. Gallery, Theatre, Outdoor" }),
        description: fields.text({ label: "Description", multiline: true }),
        accessibility: fields.array(
          fields.text({ label: "Accessibility Feature" }),
          {
            label: "Accessibility Features",
            itemLabel: (props) => props.value || "New Feature",
          }
        ),
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
        marqueeText: fields.text({
          label: "Marquee Text",
          description: "Scrolling text in the navigation bar",
          multiline: false,
        }),
        aboutSnippet: fields.text({
          label: "About Snippet",
          description: "Short about text shown when clicking the logo",
          multiline: true,
        }),
      },
    },
    aboutPage: {
      label: "About Page",
      path: "content/about-page",
      schema: {
        heroTitle: fields.text({ label: "Hero Title" }),
        heroSubtitle: fields.text({ label: "Hero Subtitle" }),
        storyTitle: fields.text({ label: "Story Section Title" }),
        storyContent: fields.text({ label: "Story Content", multiline: true }),
        missionTitle: fields.text({ label: "Mission Title" }),
        missionContent: fields.text({ label: "Mission Content", multiline: true }),
        visionTitle: fields.text({ label: "Vision Title" }),
        visionContent: fields.text({ label: "Vision Content", multiline: true }),
        accessibilityIntro: fields.text({ label: "Accessibility Introduction", multiline: true }),
        contactEmail: fields.text({ label: "Contact Email" }),
        partnersIntro: fields.text({ label: "Partners Introduction", multiline: true }),
        partners: fields.array(
          fields.object({
            name: fields.text({ label: "Partner Name" }),
            logo: fields.image({
              label: "Partner Logo",
              directory: "public/images/partners",
              publicPath: "/images/partners",
            }),
          }),
          {
            label: "Partners",
            itemLabel: (props) => props.fields.name.value || "New Partner",
          }
        ),
      },
    },
  },
});
