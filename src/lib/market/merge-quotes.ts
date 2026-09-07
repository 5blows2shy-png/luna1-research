import type { MarketQuote } from "@/lib/market-data";

export function mergeVerifiedQuotes(symbols: readonly string[], current: readonly MarketQuote[], incoming: readonly MarketQuote[]) {
  const currentBySymbol = new Map(current.filter(({ price }) => price !== null).map((quote) => [quote.symbol, quote]));
  const incomingBySymbol = new Map(incoming.filter(({ price }) => price !== null).map((quote) => [quote.symbol, quote]));
  return symbols.map((symbol) => incomingBySymbol.get(symbol) ?? currentBySymbol.get(symbol) ?? { symbol, name: symbol, price: null, change: null, changePercent: null, currency: "USD", marketStatus: "unknown" as const, timestamp: null, dataType: "unavailable" as const });
}
