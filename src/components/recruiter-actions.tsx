export function RecruiterActions() {
  return (
    <div className="recruiter-actions" aria-label="Recruiter downloads">
      <a
        className="button primary"
        href="/downloads/shy-lee-resume.pdf"
        download
      >
        Download Profile <span aria-hidden="true">↓</span>
      </a>
      <a
        className="button"
        href="/downloads/shy-lee-one-page-profile.pdf"
        download
      >
        One-page brief <span aria-hidden="true">↓</span>
      </a>
      <a
        className="button"
        href="/downloads/shyheim-lee-data-center-finance-evidence-sheet.pdf"
        download
      >
        Data center evidence <span aria-hidden="true">↓</span>
      </a>
    </div>
  );
}
