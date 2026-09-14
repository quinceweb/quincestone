import type { Metadata } from "next";
import DealComposer from "./deal-composer";

export const metadata: Metadata = {
  title: "Create a deal",
  description: "Compose a commercial deal draft in Quincestone Deals.",
};

export default function NewDealPage() {
  return (
    <main className="composer-page shell">
      <div className="composer-heading">
        <div>
          <div className="section-kicker">Deal composer</div>
          <h1>Create the commercial record.</h1>
        </div>
        <p>This foundation version stores the draft only in this browser. Nothing is submitted to Quincestone yet.</p>
      </div>
      <DealComposer />
    </main>
  );
}
