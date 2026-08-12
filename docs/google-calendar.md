# Google Calendar production connection

Quincestone uses **Google OAuth 2.0 with a refresh token stored in Supabase project secrets**. Browser code receives only normalized availability and confirmation responses. This repository contains no credentials, and the integration is not considered verified until the production health check and a controlled booking/cancellation test pass.

## Google setup
1. Create or select the Quinceweb-managed Google Cloud project and enable Google Calendar API.
2. Configure the OAuth consent screen for the intended organization. Request only the Calendar scope needed to read free/busy and manage events.
3. Create a Web OAuth client. Add the exact temporary redirect URI used by the administrator generating the refresh token; remove unused redirect URIs afterward.
4. Complete authorization as the calendar-owning account, exchange the authorization code server-side, and capture the refresh token. Never generate it in the public application.
5. Select the business calendar and its IANA timezone. Grant that user access to the calendar.

## Supabase secrets and deployment
```sh
supabase login
supabase link --project-ref <project-ref>
supabase secrets set GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... GOOGLE_REFRESH_TOKEN=... GOOGLE_CALENDAR_ID=... GOOGLE_CALENDAR_TIMEZONE=America/New_York ALLOWED_ORIGINS=https://quincestone.com
supabase functions deploy calendar-availability
supabase functions deploy create-calendar-booking
supabase functions deploy cancel-calendar-booking
supabase functions deploy calendar-health
```
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are supplied to hosted functions by Supabase. For local serving, copy `supabase/functions/.env.example` to an ignored local file and provide development credentials.

## Verification
Invoke `calendar-health` with `POST` through the project function endpoint and an anon authorization header. It returns only reachability and timezone. Then use a dedicated test submission to verify free/busy, event creation, optional Meet creation, idempotent replay, and token cancellation. Unit tests must use fixtures and never call Google.

## Rotation, revocation, and troubleshooting
Rotate the OAuth client secret and refresh token through Google and `supabase secrets set`; redeploy only if code changed. Revoke the old grant in the Google account security page. `CALENDAR_AUTH_FAILED` indicates revoked/expired authorization; `CALENDAR_RATE_LIMITED` calls for bounded retry; `CALENDAR_NOT_CONFIGURED` means a required secret is absent. Inspect sanitized `integration_events`, never raw provider payloads. Restrict operational logs and add gateway rate limits before launch.

## Privacy
Free/busy requests do not return event titles or attendees. Created descriptions contain only contact and operational booking details. Retention, access, cancellation, and deletion procedures must match the privacy notice and applicable law.
