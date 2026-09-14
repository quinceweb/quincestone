import { SectionPage } from "@/components/section-page";

const categories = ["Orders", "Account", "Saved product updates", "Product availability", "Field Notes", "Recommendations", "Marketing"];
export default function NotificationsPage() { return <SectionPage eyebrow="PREFERENCES" title="Notifications" intro="Choose what Quincestone may contact you about once preference storage is connected."><section className="panel settings-list">{categories.map((category) => <div key={category}><div><strong>{category}</strong><p>{category === "Marketing" ? "Marketing consent is never assumed." : "Preference storage is not connected yet."}</p></div><span className="status muted">Not configured</span></div>)}</section></SectionPage>; }
