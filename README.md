# ARTI

ARTI is an editorial-style art discovery platform built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui-style components.

## Run locally

Requirements: Node.js 20.19+ (or a current supported LTS) and npm.

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Included experience

- Responsive homepage, mobile navigation, artwork discovery/search/filters, artist profiles, collections, and artwork detail pages.
- Accessible reusable button/card primitives, Lucide icons, Motion entrance transitions, and Sonner notifications.
- Search by title, artist, category, or medium; filter category, medium, and price; sort and load more results.
- Clearly labeled illustrative artwork and artist profiles. Sample prices do not enable checkout.
- Supabase-backed sign-up/sign-in/password recovery, artist profile editing, private drafts, image uploads, and publish/unpublish/delete controls when configured.
- Safe demo mode when Supabase credentials are not present. Demo mode never creates fake accounts or stores private portfolio data.
- Contact form with server-side validation; submissions are stored only when Supabase is configured. Email delivery and production spam prevention require additional services.
- Supabase PostgreSQL migration with row-level security, storage policies, profile creation, favorites/follows/inquiries schemas, and ownership checks.
- Route metadata, sitemap, robots rules, responsive loading states, and a not-found page.

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and add:
   - `NEXT_PUBLIC_SUPABASE_URL`: project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: project publishable/anon key. Never put a service-role key in a `NEXT_PUBLIC_` variable.
   - `NEXT_PUBLIC_SITE_URL`: local URL for development and the canonical site URL for deployment.
3. Run `supabase/migrations/20261030000000_arti_schema.sql` once in the Supabase SQL editor or through the Supabase CLI.
4. Configure Supabase Auth email confirmation and add the local and production `/auth/callback` URLs to the Auth redirect allowlist.
5. The migration creates a **private** `artwork-images` bucket with a 10 MB limit and image MIME allowlist. It applies policies so users can manage files in their own UUID folder, owners can preview drafts, and anonymous users can read an image only when its artwork is published.
6. Configure a CAPTCHA or rate limiter for the public inquiry endpoint before production, and set up an email provider separately if email notifications are desired.

Without these environment variables, public sample pages remain browsable, while account, private dashboard, upload, and inquiry-storage actions report that backend configuration is required.

## Validation

```powershell
npm run lint
npm run build
```

## Demo and production notes

Sample artworks, artists, category totals, and collection counts are illustrative, not user submissions. The current explore pages use this local sample dataset; connecting live published rows, account favorites/follows, and artist collections to Supabase is a follow-up integration. Payment processing, social accounts, email sending, and production abuse protection are intentionally not simulated.
