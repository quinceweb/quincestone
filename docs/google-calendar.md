# Google Calendar integration

Quincestone uses Supabase Edge Functions as the only Google Calendar boundary. The browser calls Supabase Functions with the public anon key; Google OAuth credentials and the Supabase service role remain server-side.

## Authentication strategy

The initial implementation uses Google OAuth 2.0 with an offline refresh token. Create a Google Cloud project, enable the Google Calendar API, configure the OAuth consent screen, and create a Web application OAuth client. Generate a refresh token for the Quincestone-owned calendar account with calendar event and free/busy access.

Required Supabase project secrets:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_CALENDAR_TIMEZONE`
- `ALLOWED_ORIGIN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Never expose these as `VITE_` variables or commit their values.

## Database and deployment

```bash
supabase login
supabase link --project-ref <project-ref>
supabase db push
supabase secrets set --env-file supabase/functions/.env.local
supabase functions deploy calendar-availability
supabase functions deploy create-calendar-booking
supabase functions deploy cancel-calendar-booking
supabase functions deploy calendar-health
```

Do not commit `supabase/functions/.env.local`.

## Health check

Invoke `calendar-health` with an authenticated Supabase Functions request. A successful safe response contains only provider, reachability, and timezone. It must never return calendar identifiers, emails, tokens, or OAuth details.

## Booking flow

1. Persist the assessment, implementation application, or eligible contact request.
2. Request free/busy-derived slots from `calendar-availability`.
3. Ask the visitor to select a slot explicitly.
4. Call `create-calendar-booking` with the persisted source record and a unique idempotency key.
5. The function verifies the source record, creates a pending appointment, creates the Google event, and confirms the database record.
6. Google Meet is returned only when Google creates it successfully.

Public demo routes must continue using deterministic fictional availability and must never invoke production calendar functions.

## Cancellation

`cancel-calendar-booking` accepts only a high-entropy cancellation token whose SHA-256 hash is stored in `appointment_requests`. A separate trusted notification workflow must generate the token, store its hash and expiry, and send the raw token to the requester. Appointment IDs or Google event IDs are not valid cancellation credentials.

## Privacy and security

- Use free/busy data only for availability; never return event names or attendees.
- Keep descriptions limited to operational contact information.
- Avoid placing sensitive qualification answers in Calendar.
- Rotate OAuth credentials after suspected exposure.
- Revoke the refresh token in Google Account security when retiring the integration.
- Add rate limiting and bot controls before public launch.
- Verify `ALLOWED_ORIGIN` for production and previews.

## Production verification

The integration is not live until all of the following pass:

- migrations deployed;
- secrets configured;
- four functions deployed;
- `calendar-health` succeeds;
- free/busy availability returns expected slots;
- one real test booking creates exactly one event;
- retrying the same idempotency key does not create another event;
- cancellation works with a valid token;
- public demo routes create no real events.
