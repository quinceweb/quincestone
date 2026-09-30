import { redirect } from "next/navigation";
import { getAuthorizedBusinessBySlug } from "@/lib/account-businesses";
import { getBusinessContext, saveBusinessContext } from "@/lib/business-context";

async function save(slug: string, formData: FormData) {
  "use server";
  const offerings = String(formData.get("offerings") ?? "").split("\n");
  try {
    await saveBusinessContext(slug, {
      description: String(formData.get("description") ?? ""),
      offerings,
      primaryCustomers: String(formData.get("primary_customers") ?? ""),
      operatingRegion: String(formData.get("operating_region") ?? "") || null,
      website: String(formData.get("website") ?? "") || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Business context could not be saved.";
    redirect(`/business/${slug}/setup?error=${encodeURIComponent(message)}`);
  }
  redirect(`/business/${slug}?setup=complete`);
}

export default async function BusinessSetup({ params, searchParams }: { params: Promise<{ workspace: string }>; searchParams: Promise<{ error?: string }> }) {
  const { workspace: slug } = await params;
  const authority = await getAuthorizedBusinessBySlug(slug);
  if (!authority) return null;
  const context = await getBusinessContext(authority.workspace.id);
  const canManage = ["owner", "admin"].includes(authority.role);
  const { error } = await searchParams;
  return <section className="page-section">
    <span className="eyebrow">Business setup · {authority.workspace.name}</span>
    <h1>Set up {authority.workspace.name}</h1>
    <p className="lede">Give Quincestone enough context to understand incoming customer demand. Keep it concise; you can refine it later when a real capability needs more.</p>
    {!canManage ? <div className="panel panel-empty"><h2>View only</h2><p className="empty">Only workspace owners and admins can change Business context.</p></div> :
    <form action={save.bind(null, slug)} className="panel" style={{display:"grid",gap:16,marginTop:28}}>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <label><strong>What does {authority.workspace.name} do?</strong><textarea name="description" required minLength={10} maxLength={1000} rows={5} defaultValue={context?.description ?? ""} placeholder="A concise description of the business and the work it performs." /></label>
      <label><strong>What do customers come to you for?</strong><span className="empty">One offering per line, up to 12.</span><textarea name="offerings" required rows={6} defaultValue={(context?.offerings ?? []).join("\n")} placeholder={"Emergency plumbing\nWater heater repair\nDrain service"} /></label>
      <label><strong>Who does {authority.workspace.name} primarily serve?</strong><textarea name="primary_customers" required minLength={2} maxLength={500} rows={4} defaultValue={context?.primary_customers ?? ""} placeholder="For example: homeowners and small property managers." /></label>
      <label><strong>Operating region</strong><input name="operating_region" maxLength={120} defaultValue={context?.operating_region ?? ""} placeholder="Optional — e.g. Charlotte, North Carolina" /></label>
      <label><strong>Website</strong><input name="website" type="url" maxLength={300} defaultValue={context?.website ?? ""} placeholder="Optional — https://example.com" /></label>
      <button className="button" type="submit">Save and continue</button>
    </form>}
  </section>;
}
