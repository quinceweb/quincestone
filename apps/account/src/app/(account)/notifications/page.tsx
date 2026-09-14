import { SectionPage } from "@/components/section-page";
import { getNotificationPreferences } from "@/lib/account/notifications";
import { saveNotificationsAction } from "../actions";
const labels = { order_updates: "Order updates", account_security: "Account and security", product_updates: "Saved product updates", field_notes: "Field Notes", recommendations: "Quincestone recommendations", marketing: "Marketing" } as const;
export default async function NotificationsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [result, query] = await Promise.all([getNotificationPreferences(), searchParams]);
  return <SectionPage eyebrow="PREFERENCES" title="Notifications" intro="Consent preferences only; they do not imply a delivery channel is active.">{result.error || !result.data ? <section className="panel"><h2>Preferences unavailable</h2><p className="form-error" role="alert">{result.error}</p></section> : <form action={saveNotificationsAction} className="panel account-form">{query.saved ? <p className="form-message">Preferences saved.</p> : null}{query.error ? <p className="form-error">{query.error}</p> : null}{Object.entries(labels).map(([key, label]) => <label className="check-row" key={key}><input type="checkbox" name={key} defaultChecked={result.data?.[key as keyof typeof labels]} /> <span><strong>{label}</strong>{key === "marketing" ? <small>Marketing consent is never assumed.</small> : null}</span></label>)}<button className="primary-button">Save preferences</button></form>}</SectionPage>;
}
