# Database security

Anonymous visitors may insert valid rows into the three lead tables. They cannot select, update, or delete rows. Demo tables grant no anonymous privileges.

Client validation is a usability layer, not a security boundary. Production should add server-side rate limiting, bot verification, abuse monitoring, retention policy, and controlled staff-only read access.

Calendar tables deliberately have no public policies: anonymous SELECT, INSERT, UPDATE, and DELETE are denied. Public scheduling passes through origin-aware, validated Edge Functions. Submission tables use a protected security-definer submission boundary and do not grant public reads. Cancellation uses a hashed, expiring, one-time token; raw Google event identifiers remain in the protected appointment record.
