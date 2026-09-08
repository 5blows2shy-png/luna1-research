-- REVIEW DRAFT ONLY: Klyro focus-to-close accounting workflow.
-- Do not apply until customer authentication, document storage, and deployment
-- configuration have been independently reviewed.

begin;

alter table public.luna_businesses
  add column if not exists industry text,
  add column if not exists entity_type text,
  add column if not exists primary_financial_focus text,
  add column if not exists secondary_financial_focuses text[] not null default '{}';

create table if not exists public.luna_accounting_entries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  source_transaction_id uuid not null,
  source_document_reference text,
  proposed_account_id uuid,
  final_account_id uuid,
  status text not null check (status in ('needs_input', 'ready_to_post', 'approved', 'posted', 'rejected', 'duplicate_review', 'transfer_review')),
  confidence_state text not null check (confidence_state in ('high', 'medium', 'low', 'needs_input')),
  confidence_basis_points integer check (confidence_basis_points between 0 and 10000),
  reason text not null,
  rule_used text,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, business_id),
  unique (business_id, source_transaction_id),
  foreign key (source_transaction_id, business_id) references public.luna_transactions(id, business_id) on delete cascade,
  foreign key (proposed_account_id, business_id) references public.luna_financial_accounts(id, business_id),
  foreign key (final_account_id, business_id) references public.luna_financial_accounts(id, business_id)
);

create table if not exists public.luna_accounting_entry_lines (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  accounting_entry_id uuid not null,
  account_id uuid not null,
  entry_side public.luna_entry_side not null,
  amount_minor bigint not null check (amount_minor > 0),
  memo text,
  created_at timestamptz not null default now(),
  unique (id, business_id),
  foreign key (accounting_entry_id, business_id) references public.luna_accounting_entries(id, business_id) on delete cascade,
  foreign key (account_id, business_id) references public.luna_financial_accounts(id, business_id)
);

create table if not exists public.luna_vendor_accounting_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  normalized_vendor text not null,
  account_id uuid not null,
  is_auto_post_authorized boolean not null default false,
  approved_by uuid not null references auth.users(id),
  approved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (id, business_id),
  unique (business_id, normalized_vendor),
  foreign key (account_id, business_id) references public.luna_financial_accounts(id, business_id)
);

create index if not exists luna_accounting_entries_close_queue
  on public.luna_accounting_entries(business_id, status, created_at desc);

alter table public.luna_accounting_entries enable row level security;
alter table public.luna_accounting_entry_lines enable row level security;
alter table public.luna_vendor_accounting_rules enable row level security;

do $$
declare table_name text;
begin
  foreach table_name in array array['luna_accounting_entries','luna_accounting_entry_lines','luna_vendor_accounting_rules']
  loop
    execute format('create policy %I on public.%I for select using (public.luna_has_business_access(business_id))', table_name || '_read', table_name);
    execute format('create policy %I on public.%I for insert with check (public.luna_has_bookkeeping_access(business_id))', table_name || '_insert', table_name);
    execute format('create trigger %I after insert or update or delete on public.%I for each row execute function public.luna_record_audit_event()', table_name || '_audit', table_name);
  end loop;
end $$;

create policy accounting_entries_update on public.luna_accounting_entries
  for update using (public.luna_has_bookkeeping_access(business_id))
  with check (public.luna_has_bookkeeping_access(business_id));
create policy vendor_rules_update on public.luna_vendor_accounting_rules
  for update using (public.luna_has_bookkeeping_access(business_id))
  with check (public.luna_has_bookkeeping_access(business_id));

revoke all on public.luna_accounting_entries, public.luna_accounting_entry_lines, public.luna_vendor_accounting_rules from anon;
grant select, insert on public.luna_accounting_entries, public.luna_accounting_entry_lines, public.luna_vendor_accounting_rules to authenticated;
grant update on public.luna_accounting_entries, public.luna_vendor_accounting_rules to authenticated;

commit;
