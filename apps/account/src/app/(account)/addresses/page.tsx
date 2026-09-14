import { EmptyState } from "@/components/empty-state";
import { SectionPage } from "@/components/section-page";

export default function AddressesPage() { return <SectionPage eyebrow="ACCOUNT" title="Addresses" intro="Saved delivery addresses will be private to your individual account."><EmptyState title="Address storage unavailable." body="The canonical Account address store is not connected yet, so this page will not claim that you have no saved addresses." /></SectionPage>; }
