"use client";

export default function PortfolioDashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="empty-portfolio" role="alert"><span className="eyebrow">Portfolio Dashboard</span><h1>Decision data could not be displayed.</h1><p>The public portfolio remains read-only. Try loading the dashboard again.</p><button className="button" type="button" onClick={reset}>Try again</button></section>;
}
