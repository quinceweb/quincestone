import "../hero-background.css";

type HeroBackgroundProps = {
  tone?: "dark" | "light";
};

export function HeroBackground({ tone = "dark" }: HeroBackgroundProps) {
  return (
    <div className={`qs-modern-hero-bg qs-modern-hero-bg--${tone}`} aria-hidden="true">
      <div className="qs-modern-hero-bg__glow" />
      <div className="qs-modern-hero-bg__grid" />
      <div className="qs-modern-hero-bg__field" />
      <div className="qs-modern-hero-bg__trace" />
      <i className="qs-modern-hero-bg__node" />
      <i className="qs-modern-hero-bg__node qs-modern-hero-bg__node--two" />
    </div>
  );
}
