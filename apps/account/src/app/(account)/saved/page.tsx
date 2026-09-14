import { EmptyState } from "@/components/empty-state";
import { SectionPage } from "@/components/section-page";

export default function SavedPage() { return <SectionPage eyebrow="COLLECTION" title="Saved" intro="Products you intentionally save from Quincestone Shop belong here, including truthful availability changes."><EmptyState title="Nothing saved yet." body="Save products while exploring the Shop and return to them here." actionHref="https://shop.quincestone.com" actionLabel="Explore the Shop ↗" /></SectionPage>; }
