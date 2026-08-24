"use client";

import { useState } from "react";

export function HumanReviewActions({ reviewId }: { reviewId: string }) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function decide(decision: "approved" | "rejected" | "resolved") {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/human-reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ decision, reason }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message ?? "The decision could not be recorded.");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The decision could not be recorded.");
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
      <label>
        Decision context
        <textarea value={reason} onChange={(event) => setReason(event.target.value)} minLength={3} maxLength={2000} rows={3} placeholder="Explain the human judgment and intended next step." style={{ width: "100%", marginTop: 8, padding: 10, border: "1px solid #d9d7cf", borderRadius: 8, background: "#fff", font: "inherit" }} />
      </label>
      {error ? <p role="alert" className="empty">{error}</p> : null}
      <div className="actions">
        <button className="button" type="button" disabled={busy || reason.trim().length < 3} onClick={() => decide("approved")}>{busy ? "Recording…" : "Approve proposal"}</button>
        <button className="button secondary" type="button" disabled={busy || reason.trim().length < 3} onClick={() => decide("rejected")}>Reject proposal</button>
        <button className="button secondary" type="button" disabled={busy || reason.trim().length < 3} onClick={() => decide("resolved")}>Resolve</button>
      </div>
    </div>
  );
}
