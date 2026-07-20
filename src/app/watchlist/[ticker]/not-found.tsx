import Link from "next/link";

export default function WatchlistResearchNotFound() {
  return (
    <section className="research-loading-state">
      <span className="eyebrow">Watchlist research</span>
      <h1>Research record not found.</h1>
      <p>This ticker does not have an active Luna1 coverage record.</p>
      <Link className="button" href="/portfolio">
        Return to Portfolio
      </Link>
    </section>
  );
}
