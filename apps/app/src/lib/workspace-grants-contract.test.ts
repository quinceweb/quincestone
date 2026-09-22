import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migration = readFileSync(
  resolve(
    process.cwd(),
    "../../supabase/migrations/20260922231348_restore_business_workspace_data_api_grants.sql",
  ),
  "utf8",
);

describe("Business workspace Data API grants", () => {
  it("allows authenticated onboarding operations while denying anonymous table access", () => {
    expect(migration).toContain("revoke all on table public.workspaces from anon");
    expect(migration).toContain("revoke all on table public.workspace_members from anon");
    expect(migration).toContain(
      "grant select, insert, update on table public.workspaces to authenticated",
    );
    expect(migration).toContain(
      "grant select, insert, update, delete on table public.workspace_members to authenticated",
    );
  });

  it("does not grant anonymous or browser service-role authority", () => {
    expect(migration).not.toMatch(/grant\s+.+\s+to\s+anon/i);
    expect(migration).not.toMatch(/grant\s+.+\s+to\s+service_role/i);
    expect(migration).not.toMatch(/disable\s+row\s+level\s+security/i);
  });
});
