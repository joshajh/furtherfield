import { getAllPeople, getSettings } from "@/lib/cms";
import PeoplePageClient from "./PeoplePageClient";

export default async function PeoplePage() {
  const [people, settings] = await Promise.all([
    getAllPeople(),
    getSettings(),
  ]);

  return (
    <PeoplePageClient
      people={people}
      marqueeText={settings?.marqueeText}
      aboutSnippet={settings?.aboutSnippet}
    />
  );
}
