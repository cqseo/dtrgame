create extension if not exists citext with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username extensions.citext unique,
  display_name text,
  avatar_url text,
  legacy_user_id bigint unique,
  status text not null default 'active' check (status in ('active', 'suspended', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (username is null or (char_length(username::text) between 3 and 24 and username::text ~ '^[A-Za-z0-9_]+$'))
);

create table public.player_wallets (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  soft_currency bigint not null default 0 check (soft_currency >= 0),
  premium_currency bigint not null default 0 check (premium_currency >= 0),
  version integer not null default 1 check (version > 0),
  updated_at timestamptz not null default now()
);

create table public.game_items (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique check (sku ~ '^[a-z0-9][a-z0-9._-]{1,63}$'),
  name text not null,
  item_type text not null check (item_type in ('cosmetic', 'consumable', 'currency', 'entitlement')),
  config jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.player_inventory (
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id uuid not null references public.game_items(id) on delete restrict,
  quantity bigint not null default 1 check (quantity >= 0),
  metadata jsonb not null default '{}'::jsonb,
  acquired_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  room_key text not null check (room_key ~ '^[A-Za-z0-9_-]{1,48}$'),
  ruleset_version text not null,
  status text not null default 'waiting' check (status in ('waiting', 'running', 'completed', 'cancelled')),
  seed bigint not null,
  state_checksum text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  check (ended_at is null or started_at is null or ended_at >= started_at)
);

create table public.match_players (
  match_id uuid not null references public.matches(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'player' check (role in ('player', 'spectator')),
  placement integer check (placement is null or placement > 0),
  score bigint not null default 0,
  outcome jsonb not null default '{}'::jsonb,
  joined_at timestamptz not null default now(),
  primary key (match_id, user_id)
);

create table public.commerce_products (
  product_key text primary key check (product_key ~ '^[a-z0-9][a-z0-9._-]{1,63}$'),
  stripe_price_id text unique,
  name text not null,
  entitlement_key text not null,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  provider text not null default 'stripe' check (provider = 'stripe'),
  provider_session_id text unique,
  provider_payment_intent_id text unique,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded', 'disputed', 'cancelled')),
  currency text not null check (currency ~ '^[a-z]{3}$'),
  amount_total bigint not null check (amount_total >= 0),
  metadata jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_order_id uuid references public.orders(id) on delete set null,
  entitlement_key text not null,
  status text not null default 'active' check (status in ('active', 'revoked', 'expired')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_order_id, entitlement_key),
  check (ends_at is null or ends_at > starts_at)
);

create table public.affiliate_codes (
  code extensions.citext primary key,
  owner_user_id uuid not null unique references public.profiles(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (char_length(code::text) between 4 and 32 and code::text ~ '^[A-Za-z0-9_-]+$')
);

create table public.affiliate_referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references public.profiles(id) on delete restrict,
  referred_user_id uuid not null unique references public.profiles(id) on delete restrict,
  code extensions.citext not null references public.affiliate_codes(code) on delete restrict,
  status text not null default 'pending' check (status in ('pending', 'qualified', 'blocked')),
  attributed_at timestamptz not null default now(),
  qualified_at timestamptz,
  check (referrer_user_id <> referred_user_id)
);

create table public.affiliate_reward_ledger (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references public.affiliate_referrals(id) on delete restrict,
  beneficiary_user_id uuid not null references public.profiles(id) on delete restrict,
  order_id uuid references public.orders(id) on delete restrict,
  kind text not null check (kind in ('credit', 'reversal', 'payout')),
  amount bigint not null check (amount > 0),
  currency text not null check (currency ~ '^[a-z]{3}$'),
  status text not null default 'pending' check (status in ('pending', 'available', 'paid', 'void')),
  idempotency_key text not null unique,
  available_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  status text not null default 'received' check (status in ('received', 'processed', 'failed')),
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  last_error text
);

create index match_players_user_id_idx on public.match_players(user_id, joined_at desc);
create index matches_room_key_created_at_idx on public.matches(room_key, created_at desc);
create index orders_user_id_created_at_idx on public.orders(user_id, created_at desc);
create index entitlements_user_id_status_idx on public.entitlements(user_id, status);
create index affiliate_referrals_referrer_idx on public.affiliate_referrals(referrer_user_id, attributed_at desc);
create index affiliate_rewards_beneficiary_status_idx on public.affiliate_reward_ledger(beneficiary_user_id, status, created_at desc);

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger wallets_set_updated_at before update on public.player_wallets
for each row execute function public.set_updated_at();
create trigger game_items_set_updated_at before update on public.game_items
for each row execute function public.set_updated_at();
create trigger inventory_set_updated_at before update on public.player_inventory
for each row execute function public.set_updated_at();
create trigger products_set_updated_at before update on public.commerce_products
for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();
create trigger entitlements_set_updated_at before update on public.entitlements
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, new.phone, new.id::text), '@', 1)))
  on conflict (id) do nothing;
  insert into public.player_wallets (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.player_wallets enable row level security;
alter table public.game_items enable row level security;
alter table public.player_inventory enable row level security;
alter table public.matches enable row level security;
alter table public.match_players enable row level security;
alter table public.commerce_products enable row level security;
alter table public.orders enable row level security;
alter table public.entitlements enable row level security;
alter table public.affiliate_codes enable row level security;
alter table public.affiliate_referrals enable row level security;
alter table public.affiliate_reward_ledger enable row level security;
alter table public.stripe_webhook_events enable row level security;

create policy profiles_read_authenticated on public.profiles
for select to authenticated using (true);
create policy profiles_update_own on public.profiles
for update to authenticated using ((select auth.uid()) = id)
with check ((select auth.uid()) = id and status = 'active');

create policy wallets_read_own on public.player_wallets
for select to authenticated using ((select auth.uid()) = user_id);

create policy game_items_read_active on public.game_items
for select to anon, authenticated using (active);

create policy inventory_read_own on public.player_inventory
for select to authenticated using ((select auth.uid()) = user_id);

create policy match_players_read_own on public.match_players
for select to authenticated using ((select auth.uid()) = user_id);

create policy matches_read_participant on public.matches
for select to authenticated using (
  exists (
    select 1 from public.match_players mp
    where mp.match_id = matches.id and mp.user_id = (select auth.uid())
  )
);

create policy products_read_active on public.commerce_products
for select to anon, authenticated using (active);

create policy orders_read_own on public.orders
for select to authenticated using ((select auth.uid()) = user_id);

create policy entitlements_read_own on public.entitlements
for select to authenticated using ((select auth.uid()) = user_id);

create policy affiliate_codes_read_own on public.affiliate_codes
for select to authenticated using ((select auth.uid()) = owner_user_id);

create policy referrals_read_related on public.affiliate_referrals
for select to authenticated using (
  (select auth.uid()) = referrer_user_id or (select auth.uid()) = referred_user_id
);

create policy rewards_read_own on public.affiliate_reward_ledger
for select to authenticated using ((select auth.uid()) = beneficiary_user_id);

revoke all on table public.stripe_webhook_events from anon, authenticated;
revoke insert, update, delete on all tables in schema public from anon, authenticated;
grant select on public.game_items, public.commerce_products to anon, authenticated;
grant select on public.profiles, public.player_wallets, public.player_inventory, public.matches,
  public.match_players, public.orders, public.entitlements, public.affiliate_codes,
  public.affiliate_referrals, public.affiliate_reward_ledger to authenticated;
grant update (username, display_name, avatar_url) on public.profiles to authenticated;
