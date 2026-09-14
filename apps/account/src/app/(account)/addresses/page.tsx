import { EmptyState } from "@/components/empty-state";
import { SectionPage } from "@/components/section-page";

export default function AddressesPage() { return <SectionPage eyebrow="ACCOUNT" title="Addresses" intro="Saved delivery addresses will be private to your individual account."><EmptyState title="No saved addresses." body="Add an address when you need one. Address editing will be enabled when the canonical account data store is connected." /></SectionPage>; }
