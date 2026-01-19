// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"acknowledgements.mdx": () => import("../content/docs/acknowledgements.mdx?collection=docs"), "checklist.mdx": () => import("../content/docs/checklist.mdx?collection=docs"), "how-to-use.mdx": () => import("../content/docs/how-to-use.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "inspiration.mdx": () => import("../content/docs/inspiration.mdx?collection=docs"), "mechanisms.mdx": () => import("../content/docs/mechanisms.mdx?collection=docs"), "team.mdx": () => import("../content/docs/team.mdx?collection=docs"), "workshop-stages/overview.mdx": () => import("../content/docs/workshop-stages/overview.mdx?collection=docs"), }),
};
export default browserCollections;