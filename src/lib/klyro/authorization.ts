import "server-only";
import type { Membership, Permission, Role } from "./types";

const rolePermissions: Record<Role, ReadonlySet<Permission>> = {
  OWNER: new Set(["business:read", "business:update", "business:delete", "ownership:transfer", "owner-security:update", "financial:read", "financial:write", "reconciliation:write", "report:export", "members:manage", "integration:write", "demo:reset"]),
  ACCOUNTANT: new Set(["business:read", "financial:read", "financial:write", "reconciliation:write", "report:export"]),
  VIEWER: new Set(["business:read", "financial:read", "report:export"]),
};

export function roleCan(role: Role, permission: Permission) { return rolePermissions[role].has(permission); }

export function authorizeBusiness(memberships: readonly Membership[], userId: string, businessId: string, permission: Permission) {
  const membership = memberships.find((item) => item.userId === userId && item.businessId === businessId);
  if (!membership || !roleCan(membership.role, permission)) throw new Error("FORBIDDEN");
  return membership;
}
