import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Klyro Portal Login",
  description:
    "Preview the planned secure login experience for the Klyro business portal.",
};

export default async function KlyroLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const { demo } = await searchParams;
  return (
    <section className="luna-login-shell">
      <div className="luna-login-trust">
        <span className="eyebrow">Klyro · Private business portal</span>
        <h1>Your business. Your books. Your control.</h1>
        <p>
          Klyro is being designed to protect each business workspace with
          encrypted storage, multifactor authentication, permission-based access
          and a complete financial audit trail.
        </p>
        <ul aria-label="Planned Klyro security controls">
          <li>Encrypted financial-data storage</li>
          <li>Multifactor authentication</li>
          <li>Role- and permission-based access</li>
          <li>Detailed financial activity logs</li>
        </ul>
      </div>

      <div className="luna-login-card">
        <span className="status-chip status-planned">Demo available</span>
        <h2>Explore Klyro</h2>
        <p>
          Launch a private browser session with fictional sample data. Your demo
          expires after 24 hours and is not connected to a live accounting system.
        </p>
        {demo === "ended" && <p className="luna-login-notice">Your demo session has ended.</p>}
        {demo === "unavailable" && <p className="luna-login-notice luna-login-notice--warning">Demo sessions are temporarily unavailable.</p>}
        <form action="/api/klyro/demo/start" method="post">
          <button className="button primary" type="submit">
            Launch demo workspace
          </button>
        </form>
        <div className="luna-login-divider"><span>Private trial</span></div>
        <p>Customer authentication is not active yet. This page does not collect credentials; invite-only access is requested and provisioned separately during development.</p>
        <div className="luna-login-placeholder" aria-label="Invite-only trial">
          <label>
            Business email
            <input disabled placeholder="Available by invitation" type="email" />
          </label>
          <Link className="button secondary" href="/contact?subject=Klyro%20private%20trial">
            Request a private trial
          </Link>
        </div>
        <Link className="text-link" href="/klyro">
          Return to Klyro →
        </Link>
        <small>
          Demo data stays in this browser session. Do not upload confidential,
          personal, or production financial records during the preview.
        </small>
      </div>
    </section>
  );
}
