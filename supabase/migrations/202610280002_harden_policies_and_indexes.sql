revoke execute on function public.handle_new_user() from public, anon, authenticated;

create policy stripe_events_deny_client_access on public.stripe_webhook_events
for all to anon, authenticated
using (false)
with check (false);

create index player_inventory_item_id_idx
  on public.player_inventory(item_id);

create index affiliate_referrals_code_idx
  on public.affiliate_referrals(code);

create index affiliate_rewards_referral_id_idx
  on public.affiliate_reward_ledger(referral_id);

create index affiliate_rewards_order_id_idx
  on public.affiliate_reward_ledger(order_id)
  where order_id is not null;
