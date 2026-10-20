/** Approved QID 1.7 Corporate-only brand assets. Other product shells remain unchanged. */
type Composition = "horizontal" | "stacked" | "symbol";
type Palette = "obsidian" | "porcelain" | "teal";
type CorporateBrandProps = {
  composition?: Composition;
  palette?: Palette;
  className?: string;
  decorative?: boolean;
};
export function CorporateBrand({
  composition = "horizontal",
  palette = "obsidian",
  className,
  decorative = false,
}: CorporateBrandProps) {
  const dimensions = composition === "horizontal" ? [780, 140] : composition === "stacked" ? [850, 340] : [128, 128];
  return <img
    className={className}
    src={`/brand/qid-1-7/${composition}-${palette}.svg`}
    width={dimensions[0]}
    height={dimensions[1]}
    alt={decorative ? "" : "Quincestone"}
    aria-hidden={decorative ? true : undefined}
    decoding="async"
  />;
}
