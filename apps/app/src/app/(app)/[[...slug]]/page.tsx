import { EmptySection } from "@/components/empty-section";

export default async function SectionPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const title = slug.map(part => part.replace(/-/g, " ")).join(" / ") || "Command Center";
  return <EmptySection title={title.replace(/\b\w/g, c => c.toUpperCase())} description="This operating surface is established as part of the Quincestone control plane. Real workspace data and governed actions will appear only when configured." />;
}
