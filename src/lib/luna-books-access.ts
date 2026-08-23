import type { LunaBooksRole } from "@/lib/luna-books-schema";

export type LunaBooksCapability =
  | "view_business"
  | "manage_business"
  | "manage_members"
  | "write_books"
  | "review_books"
  | "submit_expense";

const grants: Record<LunaBooksRole, ReadonlySet<LunaBooksCapability>> = {
  owner: new Set(["view_business", "manage_business", "manage_members", "write_books", "review_books", "submit_expense"]),
  manager: new Set(["view_business", "write_books", "review_books", "submit_expense"]),
  bookkeeper: new Set(["view_business", "write_books", "review_books", "submit_expense"]),
  accountant: new Set(["view_business", "review_books"]),
  employee: new Set(["submit_expense"]),
};

export function hasLunaBooksCapability(role: LunaBooksRole, capability: LunaBooksCapability) {
  return grants[role].has(capability);
}
