# Quincestone — Security

## Authority boundaries

Authentication identifies the principal. Server-side authorization determines what that principal may access or mutate.

Workspace IDs supplied by browsers are selectors only. Never trust browser-supplied roles or workspace ownership claims.

## Secrets

Private provider credentials remain server-side. Browser applications receive only public configuration.

Never expose service-role keys, payment secrets, signing secrets, provider tokens or other privileged credentials in frontend code or public environment variables.

## Database

Workspace-scoped tables require intentional RLS. Cross-workspace leakage is a release blocker.

For new mutations, test authorized and unauthorized access separately for each relevant operation.

## External actions

Charging money, issuing refunds, creating bookings, sending consequential communications, modifying external systems, deleting data or committing inventory requires an explicit authorization boundary and idempotent execution model.

## Truthful operations

A source record, provider configuration, deployment, runtime behavior and verified production outcome are different facts. Operational reporting must preserve those distinctions.
