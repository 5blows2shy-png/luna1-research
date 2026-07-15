"use client";

export function RecruiterActions() {
  return <div className="recruiter-actions" aria-label="Resume downloads">
    <a className="button primary" href="/downloads/shy-lee-resume.pdf" download>Download resume <span>↓</span></a>
    <a className="button" href="/downloads/shy-lee-one-page-profile.pdf" download>One-page profile <span>↓</span></a>
    <button className="button recruiter-print" type="button" onClick={() => window.print()}>Print profile <span>↗</span></button>
  </div>;
}
