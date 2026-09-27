import type { Currency, FxRate } from "./models";
/** Adapter boundary: no synthetic quote is substituted for unavailable recorded data. */
export type FxResult =
  | { status: "unavailable"; quote: null; message: string }
  | {
      status: "end-of-day" | "delayed" | "real-time";
      quote: FxRate;
      updatedAt: string;
    };
export interface FxProvider {
  getRate(base: Currency, quote: Currency, date: string): Promise<FxResult>;
}
export const unavailableFxProvider: FxProvider = {
  async getRate() {
    return {
      status: "unavailable",
      quote: null,
      message:
        "Recorded FX data is not connected. Scenario rates are assumptions.",
    };
  },
};
export interface GlobalDatasetProvider {
  getSeries(
    dataset: "treasury" | "macro" | "trade",
    series: string,
  ): Promise<{
    status: "unavailable" | "available";
    source: string | null;
    observations: Array<{
      date: string;
      value: number;
      unit: string;
      currency: Currency | null;
    }>;
  }>;
}
