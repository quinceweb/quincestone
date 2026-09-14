import { EmptyState } from "@/components/empty-state";
import { SectionPage } from "@/components/section-page";

export default function OrdersPage() { return <SectionPage eyebrow="PURCHASES" title="Orders" intro="Your verified Quincestone Shop purchase history will appear here once the canonical order source is connected."><EmptyState title="Order history unavailable." body="Quincestone has not yet connected the canonical order source to Account, so this page will not claim that you have no orders." actionHref="https://shop.quincestone.com" actionLabel="Continue shopping ↗" /></SectionPage>; }
