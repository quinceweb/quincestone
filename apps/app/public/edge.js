(function () {
  "use strict";
  const script = document.currentScript;
  if (!script || !script.dataset.installation || !script.dataset.endpoint) return;
  const installation = script.dataset.installation;
  const endpoint = script.dataset.endpoint.replace(/\/$/, "");
  const businessName = script.dataset.businessName || "this business";
  const storageKey = `qs-edge:${installation}:pending`;
  const host = document.createElement("div");
  script.insertAdjacentElement("afterend", host);
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>
    :host{color:#171916;font:400 16px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,sans-serif}
    *{box-sizing:border-box}.frame{max-width:680px;border:1px solid #d7d9d3;background:#fff;padding:clamp(18px,4vw,32px)}
    h2{font-size:clamp(1.35rem,4vw,1.75rem);font-weight:600;letter-spacing:-.02em;margin:0 0 8px}p{color:#555b53;margin:0 0 20px}
    label{display:block;font-size:.875rem;font-weight:600;margin-bottom:7px}textarea{display:block;width:100%;min-height:132px;resize:vertical;border:1px solid #aeb3aa;border-radius:4px;padding:12px;font:inherit;color:inherit;background:#fff}
    textarea:focus,button:focus{outline:3px solid #8aa48a;outline-offset:2px}button{margin-top:14px;min-height:44px;border:1px solid #1d3a2c;border-radius:4px;background:#1d3a2c;color:#fff;padding:10px 18px;font:600 .9rem/1.2 inherit;cursor:pointer}button:disabled{cursor:wait;opacity:.62}
    .status{margin:14px 0 0;min-height:24px;color:#555b53}.error{color:#8a2525}.reference{font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
    @media(max-width:360px){.frame{padding:16px}button{width:100%}}@media(prefers-reduced-motion:no-preference){button,textarea{transition:border-color 180ms,background 180ms,opacity 180ms}}
  </style><section class="frame" aria-labelledby="qs-edge-title"><h2 id="qs-edge-title">Contact ${escapeHtml(businessName)}</h2><p>Your request will be submitted to ${escapeHtml(businessName)} for review. Quincestone Edge helps route it; the business decides what happens next.</p><form novalidate><label for="qs-edge-message">How can we help?</label><textarea id="qs-edge-message" name="message" required minlength="3" maxlength="2000"></textarea><button type="submit">Submit request</button><div class="status" role="status" aria-live="polite"></div></form></section>`;
  const form = root.querySelector("form");
  const textarea = root.querySelector("textarea");
  const button = root.querySelector("button");
  const status = root.querySelector(".status");
  let pending = readPending();
  if (pending && pending.message) textarea.value = pending.message;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = textarea.value.trim();
    if (message.length < 3) { status.className = "status error"; status.textContent = "Enter at least 3 characters."; textarea.focus(); return; }
    pending = pending && pending.message === message ? pending : { message, idempotencyKey: crypto.randomUUID(), sessionId: crypto.randomUUID() };
    localStorage.setItem(storageKey, JSON.stringify(pending));
    button.disabled = true; status.className = "status"; status.textContent = "Submitting…";
    try {
      const url = `${endpoint}?installation=${encodeURIComponent(installation)}`;
      const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json", "x-idempotency-key": pending.idempotencyKey }, body: JSON.stringify({ message: pending.message, session_id: pending.sessionId }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.received || !payload.reference) throw new Error(payload?.error?.message || "The request could not be confirmed. Please retry.");
      localStorage.removeItem(storageKey); pending = null;
      status.className = "status reference"; status.textContent = `Received. Reference ${payload.reference}.`;
      textarea.value = "";
    } catch (error) {
      status.className = "status error"; status.textContent = error instanceof Error ? error.message : "The request could not be confirmed. Please retry.";
    } finally { button.disabled = false; }
  });

  function readPending() { try { return JSON.parse(localStorage.getItem(storageKey) || "null"); } catch { return null; } }
  function escapeHtml(value) { const node = document.createElement("span"); node.textContent = value; return node.innerHTML; }
})();
