-- RLS policies call explicitly granted private authorization helpers.
-- Schema usage is required to resolve those functions; it does not grant function execution.
revoke all on schema private from anon;
grant usage on schema private to authenticated;
revoke execute on all functions in schema private from anon;
comment on schema private is 'Internal authorization and trigger helpers. Object execution remains explicitly granted.';

-- Recovery: revoke schema usage from authenticated only after every RLS policy has
-- been moved away from private helpers, otherwise authenticated policies fail closed.
