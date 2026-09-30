import { useId, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type LabelHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

type HeadingVariant = "display-xl" | "display" | "h1" | "h2" | "h3" | "h4";
type TextVariant = "lead" | "body-lg" | "body" | "small";
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "p" | "div";
type TextTag = "p" | "span" | "div";

function cx(...values: Array<string | undefined | false>) { return values.filter(Boolean).join(" "); }

export function Heading({ as = "h2", variant = "h2", className, children, ...props }: HTMLAttributes<HTMLElement> & { as?: HeadingTag; variant?: HeadingVariant; children: ReactNode }) {
  const Tag = as;
  return <Tag className={cx("qs-heading", `qs-heading--${variant}`, className)} {...props}>{children}</Tag>;
}
export function Text({ as = "p", variant = "body", className, children, ...props }: HTMLAttributes<HTMLElement> & { as?: TextTag; variant?: TextVariant; children: ReactNode }) {
  const Tag = as;
  return <Tag className={cx("qs-text", `qs-text--${variant}`, className)} {...props}>{children}</Tag>;
}
export function Label({ className, children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cx("qs-label", className)} {...props}>{children}</label>;
}

type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost" | "destructive";
type ButtonSize = "compact" | "standard" | "large" | "hero";
export function Button({ variant = "primary", size = "standard", className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={cx("qs-button", `qs-button--${variant}`, `qs-button--${size}`, className)} {...props}>{children}</button>;
}

type FieldMeta = { label?: ReactNode; helpText?: ReactNode; error?: ReactNode };
function Field({ id, label, helpText, error, children }: FieldMeta & { id: string; children: ReactNode }) {
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return <span className="qs-field">
    {label ? <Label htmlFor={id}>{label}</Label> : null}
    {children}
    {helpText ? <span className="qs-field__help" id={helpId}>{helpText}</span> : null}
    {error ? <span className="qs-field__error" id={errorId} role="alert">{error}</span> : null}
  </span>;
}
function describedBy(id: string, helpText?: ReactNode, error?: ReactNode, existing?: string) {
  return [existing, helpText ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
}

export function Input({ className, label, helpText, error, id: providedId, "aria-describedby": ariaDescribedBy, ...props }: InputHTMLAttributes<HTMLInputElement> & FieldMeta) {
  const generatedId = useId(); const id = providedId ?? generatedId;
  const input = <input id={id} className={cx("qs-input", error && "qs-control--error", className)} aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={describedBy(id, helpText, error, ariaDescribedBy)} {...props} />;
  return label || helpText || error ? <Field id={id} label={label} helpText={helpText} error={error}>{input}</Field> : input;
}
export function Textarea({ className, label, helpText, error, id: providedId, "aria-describedby": ariaDescribedBy, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldMeta) {
  const generatedId = useId(); const id = providedId ?? generatedId;
  const textarea = <textarea id={id} className={cx("qs-textarea", error && "qs-control--error", className)} aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={describedBy(id, helpText, error, ariaDescribedBy)} {...props} />;
  return label || helpText || error ? <Field id={id} label={label} helpText={helpText} error={error}>{textarea}</Field> : textarea;
}

type SurfaceLevel = 0 | 1 | 2 | 3;
export function Surface({ level = 1, className, children, ...props }: HTMLAttributes<HTMLDivElement> & { level?: SurfaceLevel }) {
  return <div className={cx("qs-surface", `qs-surface--${level}`, className)} {...props}>{children}</div>;
}

type StatusTone = "neutral" | "success" | "warning" | "error" | "info" | "accent";
export function Status({ tone = "neutral", className, children, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: StatusTone }) {
  return <span className={cx("qs-status", `qs-status--${tone}`, className)} {...props}><span className="qs-status__marker" aria-hidden="true" />{children}</span>;
}
export function Divider({ className, ...props }: HTMLAttributes<HTMLHRElement>) { return <hr className={cx("qs-divider", className)} {...props} />; }
