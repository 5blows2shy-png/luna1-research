# Data source integration roadmap

## Current platform boundary

Luna1 Research is scoped to Home, Research, Portfolio, About, Recruiter View, and Contact. Portfolio owns the Mistake Journal alongside positions, watchlist, compounders, conviction analysis, and performance. Deal Lab, Python Lab, and Real Estate are retired product areas and are not part of this roadmap unless the user explicitly requests their return.

1. Add a licensed market-data provider for delayed or real-time prices.
2. Add SEC filing ingestion and explicit primary-source citations.
3. Add earnings estimates only through a licensed estimates provider.
4. Record timestamps, source names, and stale-data states for every live figure.
5. Replace demo portfolio calculations with server-side normalized data.
6. Add tests for missing, stale, split-adjusted, and erroneous market data.

Never imply that cached or sample values are current.
