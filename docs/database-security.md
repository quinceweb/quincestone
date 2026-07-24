# Database security

Anonymous visitors may insert valid rows into the three lead tables. They cannot select, update, or delete rows. Demo tables grant no anonymous privileges.

Client validation is a usability layer, not a security boundary. Production should add server-side rate limiting, bot verification, abuse monitoring, retention policy, and controlled staff-only read access.
