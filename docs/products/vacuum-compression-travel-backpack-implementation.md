# Implementation contract

This branch is intentionally staged around the existing commerce architecture. The backpack is not seeded into the public catalog and no supplier or product facts are invented.

The first release contract is:

1. Treat the existing commerce database and launch-gate logic as authoritative.
2. Keep the backpack non-public until the real launch gate passes.
3. Keep product-dependent content data-driven and omit unverified values.
4. Keep media rights/verification as an explicit publication boundary.
5. Keep supplier economics and sourcing data server/admin-only.
6. Ensure public surfaces consume only active catalog data.
7. Add product-specific creative direction without generating or publishing synthetic SKU imagery.

Any schema extension must first map to existing migration names and code paths to avoid duplicating or bypassing current commerce gates.
