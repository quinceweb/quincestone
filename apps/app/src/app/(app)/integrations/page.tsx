import { EdgeInstallationsPanel } from "@/components/EdgeInstallationsPanel";

export default function IntegrationsPage() {
  return <section className="page-section">
    <div className="eyebrow">Platform</div>
    <h1>Integrations</h1>
    <p className="lede">Connect approved business systems to the Quincestone operating layer without exposing provider credentials to the browser.</p>
    <EdgeInstallationsPanel assetUrl={process.env.NEXT_PUBLIC_EDGE_ASSET_URL ?? ""} gatewayUrl={process.env.NEXT_PUBLIC_EDGE_GATEWAY_URL ?? ""} />
  </section>;
}
