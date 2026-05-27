# Claude per Avvocati Launch Checklist

Run through this before going live. Each item must pass.

## Prerequisites

- [ ] Domain `claudeperavvocati.it` purchased and DNS pointing to Vercel
- [ ] Vercel project linked to this standalone repo
- [ ] Upstash Redis provisioned via Vercel Marketplace and linked to the project (env vars auto-injected)
- [ ] Resend account created, sending domain verified, API key generated
- [ ] Stripe account active with 2 Products + Prices created (Avvocato €79, Studio €149) and optionally a bump Product (FutureLaw audit €29)
- [ ] Stripe webhook endpoint configured: `https://claudeperavvocati.it/api/webhook/stripe`, listening for `checkout.session.completed` + `charge.refunded`
- [ ] Stripe webhook secret copied to Vercel env

## Env vars (Vercel project settings)

- [ ] `JWT_SECRET` (32+ char base64 `openssl rand -base64 32`)
- [ ] `STRIPE_SECRET_KEY` (sk_live_… for prod, sk_test_… for dev)
- [ ] `STRIPE_WEBHOOK_SECRET` (whsec_… from the webhook endpoint settings)
- [ ] `STRIPE_PRICE_AVVOCATO`, `STRIPE_PRICE_STUDIO`, optionally `STRIPE_PRICE_STUDIO_PLUS`
- [ ] `STRIPE_PRICE_BUMP` (optional, only if you want the order-bump enabled)
- [ ] `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- [ ] `KV_REST_API_URL`, `KV_REST_API_TOKEN` (auto from Upstash integration)
- [ ] `SITE_URL=https://claudeperavvocati.it`
- [ ] `ANTHROPIC_API_KEY` (Anthropic key sk-ant-… OR OpenRouter key sk-or-…, auto-detected)

## End-to-end purchase flow

- [ ] Buy via Stripe test mode using a test card (4242 4242 4242 4242) and a real email you control
- [ ] Webhook fires (check Stripe dashboard → Webhooks → recent events + Vercel function log)
- [ ] Magic-link email arrives within 30s
- [ ] Click magic link → land on `/corso` with sidebar + content
- [ ] Refresh `/corso` directly → still authenticated (cookie persists)
- [ ] Open in incognito → redirects to `/sblocca`
- [ ] On `/sblocca`, request resend with same email → email arrives
- [ ] Rate-limit: request 4 times in a minute → 4th returns 429

## Refund flow

- [ ] Refund the test purchase in Stripe dashboard
- [ ] `charge.refunded` webhook fires → KV entry deleted (verify in Upstash dashboard)
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
