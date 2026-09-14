import { EmptyState } from "@/components/empty-state";
import { SectionPage } from "@/components/section-page";

export default function SavedPage() { return <SectionPage eyebrow="COLLECTION" title="Saved" intro="Products you intentionally save from Quincestone Shop belong here, including truthful availability changes."><EmptyState title="Saved products unavailable." body="Saved-product persistence is not connected yet, so Account will not claim that nothing is saved." actionHref="https://shop.quincestone.com" actionLabel="Explore the Shop ↗" /></SectionPage>; }
