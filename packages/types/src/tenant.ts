export type TenantStatus = "active" | "suspended";
export type MembershipRole = "owner" | "admin" | "member";
export interface Tenant { id: string; name: string; status: TenantStatus; }
export interface TenantMembership { tenant_id: string; user_id: string; role: MembershipRole; status: "active" | "invited"; }
