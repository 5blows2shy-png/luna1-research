export default function WatchlistResearchLoading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="research-loading-state"
    >
      <span className="eyebrow">Klyro</span>
      <p className="research-loading-title">Loading research record…</p>
    </section>
  );
}
