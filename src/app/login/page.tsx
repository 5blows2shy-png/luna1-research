import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Luna Books Portal Login",
  description:
    "Preview the planned secure login experience for the Luna Books business portal.",
};

export default function LunaBooksLoginPage() {
  return (
    <section className="luna-login-shell">
      <div className="luna-login-trust">
        <span className="eyebrow">Luna Books · Private business portal</span>
        <h1>Your business. Your books. Your control.</h1>
        <p>
          Luna Books is being designed to protect each business workspace with
          encrypted storage, multifactor authentication, permission-based access
          and a complete financial audit trail.
        </p>
        <ul aria-label="Planned Luna Books security controls">
          <li>Encrypted financial-data storage</li>
          <li>Multifactor authentication</li>
          <li>Role- and permission-based access</li>
          <li>Detailed financial activity logs</li>
        </ul>
      </div>

      <div className="luna-login-card">
        <span className="status-chip status-planned">In development</span>
        <h2>Sign in to Luna Books</h2>
        <p>
          Customer authentication is not active yet. This preview does not
          collect credentials or provide access to private financial records.
        </p>
        <div className="luna-login-placeholder" aria-label="Login preview unavailable">
          <label>
            Business email
            <input disabled placeholder="name@business.com" type="email" />
          </label>
          <button className="button primary" disabled type="button">
            Continue securely
          </button>
        </div>
        <Link className="text-link" href="/transaction-intelligence">
          Return to Luna Books →
        </Link>
        <small>
          No security certification or compliance status is claimed. These
          controls require implementation and independent verification before
          production launch.
        </small>
      </div>
    </section>
  );
}
