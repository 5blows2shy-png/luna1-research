const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function formatResearchDate(value: string) {
  if (!ISO_DATE.test(value)) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
