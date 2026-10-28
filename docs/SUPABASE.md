# Supabase foundation

Project: `dtrgame` (`qtjcjmpapjsgrrgtfica`) in `us-east-1`.

## Schema

The first migration creates 13 RLS-protected tables:

- identity and assets: `profiles`, `player_wallets`, `game_items`, `player_inventory`
- matches: `matches`, `match_players`
- commerce: `commerce_products`, `orders`, `entitlements`, `stripe_webhook_events`
- affiliates: `affiliate_codes`, `affiliate_referrals`, `affiliate_reward_ledger`

Balances, inventory mutations, orders, entitlements, webhook events and affiliate rewards are server-managed. Authenticated users receive read-only access to their own records. Public catalog access is limited to active items and products.

## Auth provisioning

An `auth.users` insert trigger creates the matching profile and wallet. Its security-definer function is not executable through the public Data API roles.

## Verification

- all 13 public tables have RLS enabled
- the security advisor reports no findings after the hardening migration
- all foreign keys have covering indexes
- unused-index notices are expected until test traffic exercises the new empty database

## Cloudflare binding

The Worker contains `SUPABASE_URL` and the modern publishable key as non-secret bindings. A Supabase secret key must be added as an encrypted Worker secret before trusted server-side mutations are enabled. Never place that secret in browser code or GitHub.
