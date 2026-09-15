import { Link, Outlet } from "react-router-dom";

export function AssessmentLayout() {
  return (
    <div className="assessment-shell" data-qs-theme="dark">
      <a className="skip-link" href="#assessment-content">
        Skip to assessment
      </a>
      <header className="assessment-chrome">
        <Link
          className="assessment-chrome__brand"
          to="/"
          aria-label="Quincestone home"
        >
          <strong>QUINCESTONE</strong>
          <span>EDGE / ASSESSMENT</span>
        </Link>
        <div
          className="assessment-chrome__state"
          aria-label="Assessment system state"
        >
          <span>ASSESSMENT ENVIRONMENT</span>
          <strong>HUMAN REVIEW REQUIRED</strong>
        </div>
        <Link className="assessment-chrome__exit" to="/">
          Exit assessment
        </Link>
      </header>
      <main id="assessment-content">
        <Outlet />
      </main>
    </div>
  );
}
