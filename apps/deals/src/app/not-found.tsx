import Link from "next/link";

export default function NotFound() {
  return <main className="shell not-found"><span>404</span><h1>This deal surface does not exist.</h1><p>The address may be incomplete, expired or not yet connected to a persistent deal record.</p><Link className="button button-primary" href="/">Return to Deals</Link></main>;
}
