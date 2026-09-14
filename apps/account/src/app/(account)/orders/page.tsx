import { EmptyState } from "@/components/empty-state";
import { SectionPage } from "@/components/section-page";

export default function OrdersPage() { return <SectionPage eyebrow="PURCHASES" title="Orders" intro="Your verified Quincestone Shop purchase history will appear here."><EmptyState title="No orders yet." body="Purchases from Quincestone Shop will appear here." actionHref="https://shop.quincestone.com" actionLabel="Continue shopping ↗" /></SectionPage>; }
