import { Component, type ErrorInfo, type ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Application error", error, info); }
  render() {
    return this.state.failed
      ? <main className="page-hero"><p className="eyebrow">SYSTEM NOTICE</p><h1>This view could not be loaded.</h1><p className="lede">Refresh the page or contact hello@quincestone.com if the problem continues.</p></main>
      : this.props.children;
  }
}
