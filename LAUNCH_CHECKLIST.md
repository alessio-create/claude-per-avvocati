# Claude per Avvocati Launch Checklist

Run through this before going live. Each item must pass.

## Prerequisites

- [ ] Domain `claudeperavvocati.it` purchased and DNS pointing to Vercel
- [ ] Vercel project linked to this monorepo's root, with build/install set to filter `claude-per-avvocati`
- [ ] Upstash Redis provisioned via Vercel Marketplace and linked to the project (env vars auto-injected)
- [ ] Resend account created, sending domain verified, API key generated
- [ ] Gumroad seller account active with 3 products created (Avvocato / Studio / Studio+)
- [ ] Webhook URL configured in Gumroad: `https://claudeperavvocati.it/api/webhook/gumroad`
- [ ] Gumroad webhook secret copied to Vercel env

## Env vars (Vercel project settings)

- [ ] `JWT_SECRET` (32+ char base64 `openssl rand -base64 32`)
- [ ] `GUMROAD_WEBHOOK_SECRET`
- [ ] `GUMROAD_PRODUCT_AVVOCATO`, `GUMROAD_PRODUCT_STUDIO`, `GUMROAD_PRODUCT_STUDIO_PLUS` (permalink strings)
- [ ] `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- [ ] `KV_REST_API_URL`, `KV_REST_API_TOKEN` (auto from Upstash integration)
- [ ] `SITE_URL=https://claudeperavvocati.it`
- [ ] Replace href="#" in components/marketing/Pricing.tsx with real Gumroad checkout URLs for each tier (Avvocato / Studio / Studio+)

## End-to-end purchase flow

- [ ] Buy via Gumroad sandbox using a real email you control
- [ ] Webhook fires (check Gumroad webhook log + Vercel function log)
- [ ] Magic-link email arrives within 30s
- [ ] Click magic link → land on `/corso` with sidebar + content
- [ ] Refresh `/corso` directly → still authenticated (cookie persists)
- [ ] Open in incognito → redirects to `/sblocca`
- [ ] On `/sblocca`, request resend with same email → email arrives
- [ ] Rate-limit: request 4 times in a minute → 4th returns 429

## Refund flow

- [ ] Refund the sandbox purchase in Gumroad
- [ ] Webhook fires `refunded` → KV entry deleted (verify in Upstash dashboard)
- [ ] Existing cookie session still works (accepted per spec)

## Page checks

- [ ] Sales page (`/`) renders without console errors at 1920×1080, 1366×768, 375×812
- [ ] All anchor links jump correctly (#stack, #ecosistema, #programma, #prezzi)
- [ ] Animations visible (CTA glow, mascot float, marquee scroll, gradient sweep)
- [ ] Mobile nav works
- [ ] Course reader (`/corso/[modulo]/[lezione]`) renders MDX with proper typography
- [ ] Copy buttons in `<Prompt>` components work
- [ ] Prev/next navigation works at module boundaries

## SEO

- [ ] `/sitemap.xml` returns expected URLs
- [ ] `/robots.txt` disallows `/corso/`, `/api/`, `/sblocca`
- [ ] Page title, og:title, og:description set on `/`
- [ ] Test rendering in Google Rich Results test

## Legal

- [ ] `/privacy` real content written by lawyer
- [ ] `/termini` real content written by lawyer
- [ ] P.IVA replaced in footer
- [ ] GDPR cookie banner if needed (currently no third-party cookies)

## Deferred items (track separately)

- [ ] Real pixel-art mascot frames from illustrator (sprite sheet)
- [ ] Real screenshots for Ecosistema cards
- [ ] Real numbers in StackHub (currently illustrative)
- [ ] CFP accreditation application to CNF
- [ ] Cross-device progress sync (Phase 2 spec)
- [ ] Playwright E2E (skipped during implementation, can be added later)
