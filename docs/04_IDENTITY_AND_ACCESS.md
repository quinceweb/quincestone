# Quincestone — Identity and Access

Supabase Auth is the currently inspected identity provider. No alternative identity provider is a canonical migration target without a separate architecture decision and verified cutover plan.

All Quincestone surfaces use this single identity authority in the canonical `quincestone` project. Products may own distinct relationship experiences and authorization rules, but must not create competing person identities. One authenticated identity can be related to Shop, Deals, and one or more workspaces through canonical identifiers and separately authorized relationships.

## Identity is not authority

1. Authentication establishes the person.
2. Quincestone Account exposes that person's profile and relationship.
3. Business OS access requires a server-authoritative workspace-membership lookup.
4. Role and policy constrain actions within that workspace.
5. Quincestone Admin requires separate platform-operator authorization.

Safe return destinations may reconnect Account to Shop, Deals or Business OS. A return URL cannot elevate authority and must be allowlisted.

Browser-supplied workspace IDs, user IDs, roles and admin claims are selectors or untrusted input. Server authorization and RLS decide access.
