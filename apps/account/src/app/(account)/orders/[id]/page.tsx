import Link from "next/link";
import { SectionPage } from "@/components/section-page";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <SectionPage eyebrow="ORDER" title={`Order ${id}`} intro="Order details are shown only when supplied by the verified commerce backend."><section className="panel"><h2>Order data unavailable</h2><p className="muted">No canonical order source is connected to Account yet, so status, items, totals, fulfillment, and return eligibility are not fabricated.</p><div className="link-stack"><Link href="/orders">Back to orders</Link><Link href="/support">Get support</Link></div></section></SectionPage>; }
