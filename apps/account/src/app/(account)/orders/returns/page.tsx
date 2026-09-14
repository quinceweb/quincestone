import { EmptyState } from "@/components/empty-state";
import { SectionPage } from "@/components/section-page";

export default function ReturnsPage() { return <SectionPage eyebrow="PURCHASES" title="Returns" intro="Return states will reflect only the canonical backend: Eligible, Requested, Approved, In Transit, Received, Refunded, or Closed."><EmptyState title="Return history unavailable." body="Order and return integration is not connected yet, so Account will not claim that you have no returns." actionHref="/orders" actionLabel="View orders" /></SectionPage>; }
