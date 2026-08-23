export const LUNA_BOOKS_AD_DURATION = 60;

export const lunaBooksAdScenes = [
  { id: "hook", label: "The hook", start: 0, duration: 5 },
  { id: "import", label: "Bring in the books", start: 5, duration: 8 },
  { id: "decision", label: "Decision Board", start: 13, duration: 8 },
  { id: "accounting", label: "Clean and prepare", start: 21, duration: 9 },
  { id: "cash", label: "Cash and financials", start: 30, duration: 10 },
  { id: "close", label: "Close and report", start: 40, duration: 10 },
  { id: "brand", label: "Brand and CTA", start: 50, duration: 10 },
] as const;

export const harborSupplyDemo = {
  businessName: "Harbor Supply Co.",
  dataLabel: "Fictional demonstration data",
  bankBalance: 42_850,
  upcomingObligations: 18_300,
  safeToSpend: 24_550,
  cashRunwayWeeks: 6.4,
  overdueReceivables: 14_600,
  overdueInvoice: 6_800,
  supplierPayment: 12_400,
  inventoryCost: 82_500,
  cashTiedUpInInventory: 22_200,
  slowMovingInventory: 13_400,
  deadStock: 5_800,
  excessInventory: 3_000,
  potentialRecoverableCash: 12_100,
  plannedPurchase: 12_000,
  runwayAfterPurchaseWeeks: 4.2,
  slowMovingProduct: "Coastal Work Light · 18 units",
  importedFiles: ["Bank activity.csv", "July statements.pdf", "General ledger.xlsx"],
  importedRows: 248,
  duplicateReviewCount: 4,
  journalEntriesReady: 17,
  journalEntriesNeedReview: 3,
  closeReadiness: 84,
  closeReviewItems: 7,
  forecast: [24_550, 26_800, 23_900, 21_300, 18_700, 16_200, 17_900, 20_400, 22_800, 19_600, 15_100, 17_400, 21_200],
} as const;

export const formatAdCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
