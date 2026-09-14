import { EmptyState } from "@/components/empty-state";
import { SectionPage } from "@/components/section-page";

export default function ReturnsPage() { return <SectionPage eyebrow="PURCHASES" title="Returns" intro="Return states will reflect only the canonical backend: Eligible, Requested, Approved, In Transit, Received, Refunded, or Closed."><EmptyState title="No returns." body="Eligible returns and active requests will appear here when order integration is connected." actionHref="/orders" actionLabel="View orders" /></SectionPage>; }
