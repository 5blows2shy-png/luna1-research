export const cinematicEase = [0.22, 1, 0.36, 1] as const;

export const commercialCuts = {
  trailer: { duration: 15, label: "Trailer / LinkedIn" },
  feature: { duration: 29, label: "Feature film" },
  extended: { duration: 60, label: "Extended cut" },
  ambient: { duration: 20, label: "Background loop" },
} as const;

export type CommercialCut = keyof typeof commercialCuts;
