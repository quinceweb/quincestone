# Forms and leads

Assessment, application, and contact forms use React Hook Form and Zod with length bounds, normalized email and URL values, a honeypot, minimum completion time, duplicate-submit prevention, loading state, retry-safe errors, and accessible status announcements.

Without Supabase configuration, the adapter returns an explicit non-success message and provides the public email.

A successful assessment is persisted before live availability is requested. Applications are explicitly described as submitted for review; optional scheduling does not imply acceptance. Contact scheduling appears only for assessment, implementation, and platform-integration reasons. Calendar failure never rolls back or misrepresents a saved submission. Demo routes use deterministic fixtures and never invoke the calendar service.
