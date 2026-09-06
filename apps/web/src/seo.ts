const SITE_URL = "https://www.quincestone.com";

export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
};

export function applySeo({ title, description, path, image = "/og/quincestone.png", noindex = false }: SeoConfig) {
  const canonicalUrl = `${SITE_URL}${path === "/" ? "/" : path}`;
  document.title = title;

  const ensureMeta = (selector: string, attrs: Record<string, string>) => {
    let node = document.head.querySelector<HTMLMetaElement>(selector);
    if (!node) {
      node = document.createElement("meta");
      Object.entries(attrs).forEach(([key, value]) => node!.setAttribute(key, value));
      document.head.appendChild(node);
    }
    return node;
  };

  const ensureLink = (rel: string) => {
    let node = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!node) {
      node = document.createElement("link");
      node.rel = rel;
      document.head.appendChild(node);
    }
    return node;
  };

  ensureLink("canonical").href = canonicalUrl;
  ensureMeta('meta[name="description"]', { name: "description" }).content = description;
  ensureMeta('meta[name="robots"]', { name: "robots" }).content = noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large";
  ensureMeta('meta[property="og:title"]', { property: "og:title" }).content = title;
  ensureMeta('meta[property="og:description"]', { property: "og:description" }).content = description;
  ensureMeta('meta[property="og:url"]', { property: "og:url" }).content = canonicalUrl;
  ensureMeta('meta[property="og:image"]', { property: "og:image" }).content = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  ensureMeta('meta[name="twitter:title"]', { name: "twitter:title" }).content = title;
  ensureMeta('meta[name="twitter:description"]', { name: "twitter:description" }).content = description;
  ensureMeta('meta[name="twitter:image"]', { name: "twitter:image" }).content = image.startsWith("http") ? image : `${SITE_URL}${image}`;
}
