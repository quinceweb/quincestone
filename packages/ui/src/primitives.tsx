import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type HeadingVariant = "display-xl" | "display" | "h1" | "h2" | "h3" | "h4";
type TextVariant = "lead" | "body-lg" | "body" | "small";
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "p" | "div";
type TextTag = "p" | "span" | "div";

function cx(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

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

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx("qs-input", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx("qs-textarea", className)} {...props} />;
}

export function Surface({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("qs-surface", className)} {...props}>{children}</div>;
}

type StatusTone = "neutral" | "success" | "warning" | "error" | "info" | "accent";

export function Status({ tone = "neutral", className, children, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: StatusTone }) {
  return <span className={cx("qs-status", `qs-status--${tone}`, className)} {...props}>{children}</span>;
}

export function Divider({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cx("qs-divider", className)} {...props} />;
}
