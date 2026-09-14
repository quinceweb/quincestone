import { SectionPage } from "@/components/section-page";
import { resolveCommerceCustomer } from "@/lib/account/customer";
import { updateProfileAction } from "../actions";
export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [customer, query] = await Promise.all([resolveCommerceCustomer(), searchParams]);
  return <SectionPage eyebrow="ACCOUNT" title="Profile" intro="Your core individual customer details.">{customer.error || !customer.data ? <section className="panel"><h2>Profile unavailable</h2><p className="form-error" role="alert">{customer.error}</p></section> : <form action={updateProfileAction} className="panel account-form">{query.saved ? <p className="form-message" role="status">Profile saved.</p> : null}{query.error ? <p className="form-error" role="alert">{query.error}</p> : null}<label>Name<input name="name" required maxLength={200} defaultValue={customer.data.name} autoComplete="name" /></label><label>Email<input value={customer.data.email ?? ""} readOnly aria-describedby="email-note" /></label><p id="email-note" className="muted">Email is managed by Quincestone identity.</p><label>Phone<input name="phone" maxLength={50} defaultValue={customer.data.phone ?? ""} autoComplete="tel" /></label><button className="primary-button">Save profile</button></form>}</SectionPage>;
}
