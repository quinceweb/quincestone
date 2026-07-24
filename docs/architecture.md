# Architecture

Quincestone is a React/Vite single-page application. `src/App.tsx` owns the public route map; `Layout` provides global navigation; feature pages live under `src/pages`; Supabase and typed submission boundaries live under `src/lib`.

The public demo has two lazy-loaded routes. `/demo/experience` is deterministic and state-local. `/demo/operations` uses static fictional fixtures and never queries submission tables. Vercel rewrites direct requests to `index.html`.
