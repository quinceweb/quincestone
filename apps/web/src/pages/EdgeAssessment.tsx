import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentRef } from "react";
import { submitAssessment } from "../lib/submissions";

type Answers = Record<string, string>;
type Step = {
  id: string;
  domain: string;
  intent: string;
  title: string;
  prompt: string;
  optional?: boolean;
  options?: string[];
  type?: "text" | "email" | "url" | "textarea";
  autoComplete?: string;
};
type Draft = {
  version: 2;
  started: boolean;
  index: number;
  answers: Answers;
  idempotencyKey: string;
};
const DRAFT_KEY = "qs.edge-assessment.v2";
const domains = [
  "Demand",
  "Interaction",
  "Qualification",
  "Knowledge",
  "Policy",
  "Authority",
  "Outcome",
];
const operatingPath = [
  "Demand",
  "Interaction",
  "Qualification",
  "Knowledge",
  "Policy",
  "Routing",
  "Authority",
  "Action",
  "Outcome",
];
const steps: Step[] = [
  {
    id: "name",
    domain: "Identity",
    intent: "Establishing who owns this operating context.",
    title: "Who are we understanding?",
    prompt: "Your name",
    type: "text",
    autoComplete: "name",
  },
  {
    id: "email",
    domain: "Identity",
    intent: "Establishing a controlled return path for the review.",
    title: "Where should the reviewed assessment reach you?",
    prompt: "Work email",
    type: "email",
    autoComplete: "email",
  },
  {
    id: "company",
    domain: "Context",
    intent: "Locating the assessment inside a real organization.",
    title: "What is the business?",
    prompt: "Business or organization name",
    type: "text",
    autoComplete: "organization",
  },
  {
    id: "website",
    domain: "Context",
    intent: "Understanding the current public front door.",
    title: "What does the customer see today?",
    prompt: "Website URL",
    optional: true,
    type: "url",
    autoComplete: "url",
  },
  {
    id: "digital_state",
    domain: "Interaction",
    intent: "Locating the current break between attention and useful action.",
    title: "Which operating state is closest?",
    prompt: "Choose the state that feels most accurate.",
    options: [
      "We do not have a website yet.",
      "We have a website, but it does not generate enough enquiries.",
      "We get enquiries, but they are poorly qualified.",
      "We get good enquiries, but follow-up or routing is weak.",
      "The journey works, but we cannot see where it breaks.",
    ],
  },
  {
    id: "demand",
    domain: "Demand",
    intent: "Identifying where customer intent enters the system.",
    title: "Where do opportunities usually begin?",
    prompt: "Choose the strongest source of customer intent.",
    options: [
      "Search / organic traffic",
      "Advertising / paid traffic",
      "Referrals / word of mouth",
      "Social / content",
      "Existing customers / repeat business",
      "Several of these are important",
    ],
  },
  {
    id: "leak",
    domain: "Revenue leakage",
    intent: "Finding the point where useful intent stops becoming value.",
    title: "Where is value most likely being lost?",
    prompt: "Choose the closest problem.",
    options: [
      "People leave before contacting us.",
      "We receive enquiries without enough context.",
      "Good enquiries reach the wrong person or team.",
      "Response time is too slow.",
      "Staff repeatedly answer the same questions.",
      "We cannot tell why opportunities are lost.",
    ],
  },
  {
    id: "qualification",
    domain: "Qualification",
    intent: "Defining what separates a useful opportunity from a weak one.",
    title: "What must your team know before acting?",
    prompt: "Describe the context your team needs.",
    type: "textarea",
  },
  {
    id: "knowledge",
    domain: "Knowledge",
    intent: "Mapping approved knowledge that can support a decision.",
    title: "What does the business already know?",
    prompt:
      "Services, pricing rules, service areas, FAQs, eligibility, product information, or operating knowledge.",
    type: "textarea",
  },
  {
    id: "policy",
    domain: "Authority",
    intent: "Making the boundary of human judgment explicit.",
    title: "Where must a human remain in control?",
    prompt: "What should never happen without a person deciding first?",
    type: "textarea",
  },
  {
    id: "outcome",
    domain: "Outcome",
    intent: "Connecting the model to a business result that matters.",
    title: "If this worked, what would change first?",
    prompt: "Describe the business outcome you want most.",
    type: "textarea",
  },
];
function newKey() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `qs-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}
function readDraft(): Draft {
  try {
    const value = JSON.parse(
      sessionStorage.getItem(DRAFT_KEY) ?? "null",
    ) as Partial<Draft> | null;
    if (value?.version === 2 && value.answers && value.idempotencyKey)
      return {
        version: 2,
        started: Boolean(value.started),
        index: Math.min(Number(value.index) || 0, steps.length - 1),
        answers: value.answers,
        idempotencyKey: value.idempotencyKey,
      };
  } catch {
    /* storage is an enhancement */
  }
  return {
    version: 2,
    started: false,
    index: 0,
    answers: {},
    idempotencyKey: newKey(),
  };
}
function getAttribution() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ].flatMap((key) => (params.get(key) ? [[key, params.get(key)!]] : [])),
  );
}
function scoreAnswers(answers: Answers) {
  let score = 0;
  const flags: string[] = [];
  if (answers.digital_state === "We do not have a website yet.") {
    score += 12;
    flags.push("No structured digital front door");
  }
  if (answers.digital_state?.includes("does not generate")) {
    score += 18;
    flags.push("Weak conversion path");
  }
  if (answers.digital_state?.includes("poorly qualified")) {
    score += 22;
    flags.push("Qualification gap");
  }
  if (answers.digital_state?.includes("follow-up")) {
    score += 20;
    flags.push("Routing / response gap");
  }
  if (answers.digital_state?.includes("cannot see")) {
    score += 16;
    flags.push("Observability gap");
  }
  if (answers.leak) score += 12;
  if (answers.qualification?.trim()) score += 8;
  if (answers.knowledge?.trim()) score += 6;
  if (answers.policy?.trim()) score += 6;
  return {
    score: Math.min(100, score),
    flags,
    priority: score >= 55 ? "high" : score >= 30 ? "medium" : "standard",
  };
}
function validate(step: Step, value: string) {
  if (!step.optional && !value.trim()) return `${step.prompt} is required.`;
  if (step.id === "name" && value.trim().length < 2)
    return "Enter at least two characters.";
  if (step.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Enter a valid email address.";
  if (step.id === "website" && value.trim()) {
    try {
      new URL(value);
    } catch {
      return "Enter a complete URL, including https://";
    }
  }
  return "";
}

export function EdgeAssessment() {
  const initial = useRef<Draft | null>(null);
  if (!initial.current) initial.current = readDraft();
  const [started, setStarted] = useState(initial.current.started);
  const [index, setIndex] = useState(initial.current.index);
  const [answers, setAnswers] = useState<Answers>(initial.current.answers);
  const [idempotencyKey] = useState(initial.current.idempotencyKey);
  const [phase, setPhase] = useState<"editing" | "submitting" | "received">(
    "editing",
  );
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const headingRef = useRef<ComponentRef<"h1"> | null>(null);
  const step = steps[index];
  const value = answers[step.id] ?? "";
  const result = useMemo(() => scoreAnswers(answers), [answers]);
  const progress = Math.round(((index + 1) / steps.length) * 100);
  useEffect(() => {
    try {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          version: 2,
          started,
          index,
          answers,
          idempotencyKey,
        } satisfies Draft),
      );
    } catch {
      /* continue without draft persistence */
    }
  }, [answers, idempotencyKey, index, started]);
  useEffect(() => {
    if (started && phase === "editing") headingRef.current?.focus();
  }, [index, phase, started]);
  const setValue = (next: string) => {
    setAnswers((current) => ({ ...current, [step.id]: next }));
    setError("");
  };
  const moveNext = () => {
    const message = validate(step, value);
    if (message) {
      setError(message);
      return;
    }
    setIndex((current) => Math.min(current + 1, steps.length - 1));
    setError("");
  };
  async function finish() {
    const message = validate(step, value);
    if (message) {
      setError(message);
      return;
    }
    if (phase === "submitting") return;
    setPhase("submitting");
    setError("");
    const response = await submitAssessment(
      {
        version: 2,
        name: answers.name.trim(),
        email: answers.email.trim().toLowerCase(),
        company: answers.company.trim(),
        website: answers.website?.trim() ?? "",
        answers,
        preliminary: result,
        source: "web_edge_assessment",
        attribution: getAttribution(),
      },
      idempotencyKey,
    );
    if (!response.ok) {
      setPhase("editing");
      setError(response.message);
      return;
    }
    setReference(response.reference);
    setPhase("received");
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      /* storage is an enhancement */
    }
  }

  if (!started) return <Intro onBegin={() => setStarted(true)} />;
  if (phase === "received")
    return <Completion reference={reference} result={result} />;
  return (
    <section
      className="edge-assessment edge-assessment--workspace"
      aria-labelledby="question-title"
    >
      <div className="edge-assessment__workspace">
        <aside className="edge-assessment__context">
          <span>CURRENT DOMAIN</span>
          <strong>{step.domain}</strong>
          <p>{step.intent}</p>
        </aside>
        <form
          className="edge-assessment__question"
          onSubmit={(event) => {
            event.preventDefault();
            if (index < steps.length - 1) moveNext();
            else void finish();
          }}
          noValidate
        >
          <p className="eyebrow">
            {String(index + 1).padStart(2, "0")} / {step.domain.toUpperCase()}
          </p>
          <h1 id="question-title" ref={headingRef} tabIndex={-1}>
            {step.title}
          </h1>
          <p id="question-description">
            {step.prompt}
            {step.optional ? " (optional)" : ""}
          </p>
          {step.options ? (
            <fieldset
              className="edge-assessment__options"
              aria-describedby="question-description"
            >
              <legend className="sr-only">{step.title}</legend>
              {step.options.map((option) => (
                <button
                  key={option}
                  className={value === option ? "is-selected" : ""}
                  type="button"
                  aria-pressed={value === option}
                  onClick={() => setValue(option)}
                >
                  <span>{option}</span>
                  <em>{value === option ? "SELECTED" : "SELECT"}</em>
                </button>
              ))}
            </fieldset>
          ) : (
            <label className="edge-assessment__field">
              <span>
                {step.prompt}
                {step.optional ? " (optional)" : ""}
              </span>
              {step.type === "textarea" ? (
                <textarea
                  autoFocus
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  aria-describedby="question-description"
                  maxLength={1200}
                  rows={5}
                />
              ) : (
                <input
                  autoFocus
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  type={step.type ?? "text"}
                  autoComplete={step.autoComplete}
                  aria-describedby="question-description"
                  maxLength={step.id === "email" ? 254 : 300}
                />
              )}
            </label>
          )}
          <div className="edge-assessment__message" aria-live="assertive">
            {error && <p>{error}</p>}
          </div>
          <div className="edge-assessment__actions">
            {index > 0 ? (
              <button
                className="edge-control edge-control--quiet"
                type="button"
                onClick={() => {
                  setIndex((current) => current - 1);
                  setError("");
                }}
              >
                ← Back
              </button>
            ) : (
              <span />
            )}
            <button
              className="edge-control edge-control--primary"
              type="submit"
              disabled={phase === "submitting"}
            >
              {index < steps.length - 1
                ? "Resolve and continue →"
                : phase === "submitting"
                  ? "Submitting…"
                  : "Submit for human review →"}
            </button>
          </div>
        </form>
        <Model index={index} progress={progress} />
      </div>
      <footer className="edge-assessment__status">
        <span>
          {phase === "submitting"
            ? "SUBMITTING — DO NOT CLOSE"
            : "LOCAL DRAFT ACTIVE"}
        </span>
        <span>Edge structures. Humans decide.</span>
        <span>
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(steps.length).padStart(2, "0")}
        </span>
      </footer>
    </section>
  );
}

function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <section
      className="edge-assessment edge-assessment--intro"
      aria-labelledby="assessment-intro-title"
    >
      <div className="edge-assessment__intro">
        <p className="eyebrow">QUINCESTONE EDGE</p>
        <h1 id="assessment-intro-title">Find where value is being lost.</h1>
        <p className="edge-assessment__intro-lede">Operational Assessment</p>
        <div className="edge-assessment__brief">
          <article>
            <span>01 / SYSTEM PURPOSE</span>
            <p>
              Construct a structured view of the path between demand and
              outcome.
            </p>
          </article>
          <article>
            <span>02 / INFORMATION USE</span>
            <p>
              Your responses are submitted directly to Quincestone for
              assessment review.
            </p>
          </article>
          <article>
            <span>03 / HUMAN AUTHORITY</span>
            <p>
              No automated verdict. Preliminary signals organize the evidence;
              a person decides any consequential recommendation.
            </p>
          </article>
        </div>
        <ol
          className="edge-assessment__intro-map"
          aria-label="Assessment operating path"
        >
          {operatingPath.map((item, itemIndex) => (
            <li key={item}>
              <span>{String(itemIndex + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </li>
          ))}
        </ol>
        <div className="edge-assessment__intro-action">
          <button
            className="edge-control edge-control--primary"
            type="button"
            onClick={onBegin}
          >
            Enter assessment <span aria-hidden="true">→</span>
          </button>
          <small>
            11 inputs · approximately 6 minutes · human review required
          </small>
        </div>
      </div>
    </section>
  );
}
function Model({ index, progress }: { index: number; progress: number }) {
  return (
    <aside
      className="edge-assessment__model"
      aria-label="Assessment model progress"
    >
      <div>
        <span>ASSESSMENT MODEL</span>
        <strong>{progress}% CONSTRUCTED</strong>
      </div>
      <ol>
        {domains.map((domain) => {
          const matches = steps
            .map((item, itemIndex) => ({ ...item, itemIndex }))
            .filter(
              (item) =>
                item.domain === domain ||
                (domain === "Policy" && item.domain === "Authority"),
            );
          const first = matches[0]?.itemIndex ?? steps.length;
          const last = matches.at(-1)?.itemIndex ?? first;
          const state =
            index > last
              ? "RESOLVED"
              : index >= first
                ? "IN PROGRESS"
                : "PENDING";
          return (
            <li key={domain} data-state={state}>
              <span>{domain}</span>
              <em>{state}</em>
            </li>
          );
        })}
      </ol>
      <div
        className="edge-assessment__meter"
        role="progressbar"
        aria-label="Assessment completion"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <i style={{ width: `${progress}%` }} />
      </div>
    </aside>
  );
}
function Completion({
  reference,
  result,
}: {
  reference: string;
  result: ReturnType<typeof scoreAnswers>;
}) {
  return (
    <section
      className="edge-assessment edge-assessment--complete"
      aria-labelledby="received-title"
    >
      <div className="edge-assessment__complete">
        <p className="eyebrow">EDGE / REVIEW STATE</p>
        <span className="edge-assessment__receipt-state">RECEIVED</span>
        <h1 id="received-title">Assessment received.</h1>
        <div className="edge-assessment__reference">
          <span>REFERENCE</span>
          <strong>{reference}</strong>
        </div>
        <p>
          The server confirmed persistence. Edge has organized preliminary
          signals for an authorized person to review; it has not issued a final
          assessment.
        </p>
        <div className="edge-assessment__report">
          <span>PRELIMINARY SIGNAL</span>
          <strong>Signal density: {result.priority}</strong>
          <p>
            {result.flags.length
              ? result.flags.join(" · ")
              : "More context is required during human review."}
          </p>
        </div>
        <ol className="edge-assessment__lifecycle">
          <li data-state="complete">
            <span>01</span>
            <strong>Submission received</strong>
            <em>RECEIVED</em>
          </li>
          <li data-state="pending">
            <span>02</span>
            <strong>Signals normalized</strong>
            <em>PENDING REVIEW</em>
          </li>
          <li data-state="pending">
            <span>03</span>
            <strong>Human review</strong>
            <em>QUEUED</em>
          </li>
          <li data-state="idle">
            <span>04</span>
            <strong>Recommendation prepared</strong>
            <em>NOT STARTED</em>
          </li>
          <li data-state="idle">
            <span>05</span>
            <strong>Next action communicated</strong>
            <em>NOT STARTED</em>
          </li>
        </ol>
        <a className="edge-control edge-control--secondary" href="/">
          Return to Quincestone
        </a>
      </div>
    </section>
  );
}
