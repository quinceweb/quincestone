import Link from "next/link";

export function EmptyState({ title, body, actionHref, actionLabel }: { title: string; body: string; actionHref?: string; actionLabel?: string }) {
  return <section className="empty-state" aria-live="polite">
    <h2>{title}</h2>
    <p>{body}</p>
    {actionHref && actionLabel ? <Link className="text-link" href={actionHref}>{actionLabel}</Link> : null}
  </section>;
}
