import { EmptyState } from "@/components/empty-state";
import { SectionPage } from "@/components/section-page";

export default function SupportPage() { return <SectionPage eyebrow="RELATIONSHIP" title="Support" intro="Authenticated support will support Order, Return, Product, Account, Payment, and Other categories without exposing business or Admin records."><EmptyState title="No open requests." body="Support request storage is not connected yet. When enabled, requests will be scoped to your authenticated user and optional order or product reference." /></SectionPage>; }
