import { beforeEach, describe, expect, it, vi } from "vitest";

type TestUser = { id: string; email: string };
type Membership = { workspace_id: string; user_id: string; role: string };
type MembershipField = keyof Membership;
type MembershipQuery = {
  eq(field: MembershipField, value: string): MembershipQuery;
  order(): Promise<{ data: Membership[]; error: null }>;
  maybeSingle(): Promise<{ data: { role: string } | null; error: null }>;
};

let user: TestUser | null = { id: "user-a", email: "a@example.test" };
const workspaces = [{ id: "ws-a", name: "A", slug: "alpha" }, { id: "ws-b", name: "B", slug: "beta" }];
let memberships: Membership[] = [{ workspace_id: "ws-a", user_id: "user-a", role: "owner" }];

function table(name: string) {
  if (name === "workspaces") return {
    select: () => ({
      eq: (_field: string, slug: string) => ({ maybeSingle: async () => ({ data: workspaces.find(w => w.slug === slug) ?? null, error: null }) }),
      in: async (_field: string, ids: string[]) => ({ data: workspaces.filter(w => ids.includes(w.id)), error: null }),
    }),
  };
  if (name === "workspace_members") return {
    select: () => {
      let rows = memberships.slice();
      const chain: MembershipQuery = {
        eq: (field, value) => { rows = rows.filter(row => row[field] === value); return chain; },
        order: async () => ({ data: rows, error: null }),
        maybeSingle: async () => ({ data: rows[0] ? { role: rows[0].role } : null, error: null }),
      };
      return chain;
    },
  };
  throw new Error(`Unexpected table: ${name}`);
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user }, error: null }) },
    from: table,
  }),
}));

import { getAuthorizedBusinessBySlug, listAccountBusinesses } from "./account-businesses";

describe("individual/business authority separation", () => {
  beforeEach(() => {
    user = { id: "user-a", email: "a@example.test" };
    memberships = [{ workspace_id: "ws-a", user_id: "user-a", role: "owner" }];
  });

  it("lists zero businesses without requiring a workspace", async () => {
    memberships = [];
    await expect(listAccountBusinesses()).resolves.toEqual([]);
  });

  it("authorizes the matching membership and preserves its role", async () => {
    await expect(getAuthorizedBusinessBySlug("alpha")).resolves.toMatchObject({
      workspace: { id: "ws-a" },
      role: "owner",
      user: { id: "user-a" },
    });
  });

  it("does not authorize a valid slug without matching membership", async () => {
    await expect(getAuthorizedBusinessBySlug("beta")).resolves.toBeNull();
  });

  it("does not let Workspace A membership authorize Workspace B", async () => {
    expect(await getAuthorizedBusinessBySlug("alpha")).not.toBeNull();
    expect(await getAuthorizedBusinessBySlug("beta")).toBeNull();
  });

  it("requires authenticated identity before business authority", async () => {
    user = null;
    await expect(getAuthorizedBusinessBySlug("alpha")).resolves.toBeNull();
  });
});