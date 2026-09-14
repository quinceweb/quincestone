"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Draft = {
  title: string;
  seller: string;
  buyer: string;
  currency: string;
  value: string;
  scope: string;
  terms: string;
  expires: string;
};

const blankDraft: Draft = {
  title: "",
  seller: "",
  buyer: "",
  currency: "USD",
  value: "",
  scope: "",
  terms: "",
  expires: "",
};

const storageKey = "quincestone-deals-local-draft-v1";

export default function DealComposer() {
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(storageKey);
      if (existing) setDraft({ ...blankDraft, ...JSON.parse(existing) });
    } catch {
      // Local storage is optional. The composer remains usable without it.
    }
  }, []);

  const money = useMemo(() => {
    const amount = Number(draft.value.replace(/,/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) return "Amount not set";
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: draft.currency || "USD",
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${draft.currency || "USD"} ${amount.toLocaleString()}`;
    }
  }, [draft.currency, draft.value]);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function save(event: FormEvent) {
    event.preventDefault();
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }

  function clear() {
    setDraft(blankDraft);
    setSaved(false);
    try { window.localStorage.removeItem(storageKey); } catch {}
  }

  return (
    <div className="composer-grid">
      <form className="deal-form" onSubmit={save}>
        <div className="form-section">
          <span className="form-step">01 · Identity</span>
          <label>Deal title<input value={draft.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Q4 supply agreement" /></label>
          <div className="field-grid">
            <label>Seller<input value={draft.seller} onChange={(e) => update("seller", e.target.value)} placeholder="Your company" /></label>
            <label>Buyer<input value={draft.buyer} onChange={(e) => update("buyer", e.target.value)} placeholder="Customer or company" /></label>
          </div>
        </div>
        <div className="form-section">
          <span className="form-step">02 · Economics</span>
          <div className="field-grid amount-grid">
            <label>Currency<select value={draft.currency} onChange={(e) => update("currency", e.target.value)}><option>USD</option><option>NGN</option><option>GBP</option><option>EUR</option></select></label>
            <label>Deal value<input inputMode="decimal" value={draft.value} onChange={(e) => update("value", e.target.value)} placeholder="0.00" /></label>
          </div>
        </div>
        <div className="form-section">
          <span className="form-step">03 · Agreement</span>
          <label>Scope<textarea rows={5} value={draft.scope} onChange={(e) => update("scope", e.target.value)} placeholder="What is being supplied, delivered or performed?" /></label>
          <label>Commercial terms<textarea rows={4} value={draft.terms} onChange={(e) => update("terms", e.target.value)} placeholder="Payment schedule, delivery terms, dependencies or conditions." /></label>
          <label>Offer expiry<input type="date" value={draft.expires} onChange={(e) => update("expires", e.target.value)} /></label>
        </div>
        <div className="form-actions">
          <button className="button button-primary" type="submit">Save local draft</button>
          <button className="button button-quiet" type="button" onClick={clear}>Clear</button>
          <span className="save-state" aria-live="polite">{saved ? "Saved in this browser" : "Not persisted to Quincestone"}</span>
        </div>
      </form>

      <aside className="deal-preview" aria-label="Deal preview">
        <div className="preview-topline"><span>Draft</span><span>Local preview</span></div>
        <h2>{draft.title || "Untitled commercial deal"}</h2>
        <div className="preview-parties"><span>{draft.seller || "Seller"}</span><i>↔</i><span>{draft.buyer || "Buyer"}</span></div>
        <div className="preview-value"><small>Proposed value</small><strong>{money}</strong></div>
        <div className="preview-section"><small>Scope</small><p>{draft.scope || "Add the commercial scope to establish what the deal covers."}</p></div>
        <div className="preview-section"><small>Terms</small><p>{draft.terms || "Add payment, delivery and commercial terms."}</p></div>
        <div className="preview-meta"><div><small>Status</small><strong>Draft</strong></div><div><small>Expires</small><strong>{draft.expires || "Not set"}</strong></div></div>
        <div className="preview-notice">This is not yet a shared or accepted deal. Persistent records, counterpart access and approvals will activate with the production data layer.</div>
      </aside>
    </div>
  );
}
