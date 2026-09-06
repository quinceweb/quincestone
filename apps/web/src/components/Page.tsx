import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { applySeo } from "../seo";

export type PageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  sections?: { title: string; text: string }[];
};

export function ContentPage({ eyebrow, title, intro, sections = [] }: PageContent) {
  const location = useLocation();

  useEffect(() => {
    applySeo({
      title: `${title} — Quincestone`,
      description: intro,
      path: location.pathname,
    });
  }, [title, intro, location.pathname]);

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lede">{intro}</p>
        <div className="actions"><Link className="button" to="/assessment">Request an Edge Assessment</Link><Link className="text-link" to="/demo">Experience the Live Demo →</Link></div>
      </section>
      {sections.length > 0 && <section className="section grid">{sections.map((item) => <article className="panel" key={item.title}><span className="signal" /><h2>{item.title}</h2><p>{item.text}</p></article>)}</section>}
    </>
  );
}
