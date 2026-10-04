export type GlobalMarketGroupId = "equities" | "fx" | "commodities" | "rates";

export type GlobalMarketInstrument = {
  symbol: string;
  label: string;
  context: string;
  group: GlobalMarketGroupId;
  decimals?: number;
  proxy?: boolean;
};

export const globalMarketGroups: ReadonlyArray<{
  id: GlobalMarketGroupId;
  label: string;
  description: string;
}> = [
  { id: "equities", label: "Regional equities", description: "Liquid listed funds used as transparent regional market proxies." },
  { id: "fx", label: "Major currencies", description: "Latest available foreign-exchange reference rates." },
  { id: "commodities", label: "Real assets", description: "Energy, metals, and inflation-sensitive market references." },
  { id: "rates", label: "Rates & credit", description: "Tradable duration and international bond-market proxies." },
];

export const globalMarketInstruments: readonly GlobalMarketInstrument[] = [
  { symbol: "ACWI", label: "Global equities", context: "MSCI ACWI ETF", group: "equities", proxy: true },
  { symbol: "SPY", label: "United States", context: "S&P 500 ETF", group: "equities", proxy: true },
  { symbol: "FEZ", label: "Eurozone", context: "EURO STOXX 50 ETF", group: "equities", proxy: true },
  { symbol: "EWJ", label: "Japan", context: "MSCI Japan ETF", group: "equities", proxy: true },
  { symbol: "EEM", label: "Emerging markets", context: "MSCI Emerging Markets ETF", group: "equities", proxy: true },
  { symbol: "EURUSD", label: "Euro / U.S. dollar", context: "EUR per USD pair", group: "fx", decimals: 4 },
  { symbol: "GBPUSD", label: "Sterling / U.S. dollar", context: "GBP per USD pair", group: "fx", decimals: 4 },
  { symbol: "USDJPY", label: "U.S. dollar / yen", context: "JPY per USD pair", group: "fx", decimals: 3 },
  { symbol: "USDCAD", label: "U.S. dollar / Canadian dollar", context: "CAD per USD pair", group: "fx", decimals: 4 },
  { symbol: "GCUSD", label: "Gold", context: "Gold reference price", group: "commodities" },
  { symbol: "CLUSD", label: "WTI crude", context: "Crude-oil reference price", group: "commodities" },
  { symbol: "CPER", label: "Copper", context: "Copper index fund", group: "commodities", proxy: true },
  { symbol: "IEF", label: "U.S. intermediate rates", context: "7–10 year Treasury ETF", group: "rates", proxy: true },
  { symbol: "TLT", label: "U.S. long duration", context: "20+ year Treasury ETF", group: "rates", proxy: true },
  { symbol: "BNDX", label: "International bonds", context: "Currency-hedged global bond ETF", group: "rates", proxy: true },
] as const;

export const globalMarketSymbols = globalMarketInstruments.map(({ symbol }) => symbol);
