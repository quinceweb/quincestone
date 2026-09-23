import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const sql = readFileSync(resolve(process.cwd(), "../../supabase/migrations/20260923011806_grant_authenticated_private_schema_usage.sql"), "utf8").toLowerCase();
describe("workspace private schema boundary", () => {
  it("allows authenticated RLS helpers without granting anonymous access", () => { expect(sql).toContain("grant usage on schema private to authenticated"); expect(sql).toContain("revoke all on schema private from anon"); expect(sql).toContain("revoke execute on all functions in schema private from anon"); });
  it("does not disable RLS or grant blanket helper execution", () => { expect(sql).not.toContain("disable row level security"); expect(sql).not.toContain("grant execute on all functions in schema private to authenticated"); });
});
