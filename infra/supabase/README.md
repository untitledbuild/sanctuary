# Contact form → Supabase (free tier)

The landing page is a **static** site (GitHub Pages). The contact form writes
submissions **directly to Supabase from the browser** using the project's
**public anon key**. That's safe because the table has an **INSERT-only**
Row-Level-Security policy — the anon key can drop a message in the box but can't
read, edit, or delete anyone's submissions. No server, no secret in the bundle;
the existing `deploy.yml` (Astro build → Pages) is untouched.

## One-time setup (~5 min)

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL editor → New query** → paste [`schema.sql`](./schema.sql) → **Run**.
   Creates `public.contact_submissions`, enables RLS, and adds the insert-only
   policy.
3. **Project Settings → API** → copy:
   - **Project URL** → `PUBLIC_SUPABASE_URL`
   - **anon public** key → `PUBLIC_SUPABASE_ANON_KEY`
4. Put them where the build can see them:
   - **Local:** copy `.env.example` → `.env` and fill both values.
   - **CI (GitHub Pages):** repo **Settings → Secrets and variables → Actions →
     Variables** (not Secrets — the anon key is public by design). The deploy
     workflow passes them into the Astro build (see `.github/workflows/deploy.yml`).

## Reading submissions

- **Supabase Dashboard → Table editor → `contact_submissions`** (you're
  authenticated, so RLS lets you read), or
- query with the **service-role** key from a trusted place (never the browser).

## Want email notifications?

Add a Supabase **Database Webhook** (or an Edge Function trigger) on
`contact_submissions` insert → forward to Resend / Slack / your inbox. The site
stays static; Supabase handles the fan-out.

## Why not "trigger a GitHub Action with a token from the browser"?

A public static site ships its JS to everyone, so any token in it is readable
and abusable. Supabase's anon key is *designed* to be public and is locked down
by RLS, which is exactly the guarantee we want here.
