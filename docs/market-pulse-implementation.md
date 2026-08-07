# Market Pulse implementation note

The visible `DATA UNAVAILABLE` state was caused primarily by an empty `MARKET_DATA_API_KEY`. The server route correctly refused to call Financial Modeling Prep without a credential, but the previous client also omitted failed instruments and applied one batch-level data label. Provider-plan symbol support and rate limits could therefore make the entire strip appear unavailable even when only one instrument failed.

Market Pulse now uses a dedicated `/api/market-pulse` route, eight internal Klyro instrument IDs, a separate Financial Modeling Prep symbol map, per-instrument normalization, `Promise.allSettled`, timeouts, and last-known server/client caches. A failed instrument now reports its own safe error; cached values remain visible and are marked stale. The credential remains server-only as `MARKET_DATA_API_KEY`.

Asset-class adapters use FMP's dedicated Treasury Rates endpoint for the 10-year yield and one shared commodity batch request for WTI, natural gas, and gold. Equity quotes fall back to the stable short-quote endpoint when a full quote is unavailable. This avoids treating unlike instruments as stocks and reduces simultaneous provider requests.
