import { EmptyState } from "@/components/empty-state";
import { SectionPage } from "@/components/section-page";

export default function PaymentsPage() { return <SectionPage eyebrow="ACCOUNT" title="Payments" intro="Quincestone Account will store provider references only — never raw card data."><EmptyState title="No payment methods to show." body="A payment-provider reference layer is not connected yet. No cards or payment details are fabricated." /></SectionPage>; }
