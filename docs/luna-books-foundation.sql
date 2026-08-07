-- Klyro tenant and accounting foundation.
-- Apply through a reviewed Supabase migration or SQL editor transaction.
-- This schema uses Supabase Auth identities and row-level security. It does not
-- activate customer authentication by itself.

begin;

create extension if not exists pgcrypto;

create type public.luna_books_role as enum ('owner', 'manager', 'bookkeeper', 'accountant', 'employee');
create type public.luna_account_type as enum ('asset', 'liability', 'equity', 'revenue', 'expense');
create type public.luna_entry_side as enum ('debit', 'credit');
create type public.luna_document_status as enum ('draft', 'open', 'partial', 'paid', 'void');

create table public.luna_businesses (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null check (length(trim(legal_name)) between 1 and 160),
  display_name text not null check (length(trim(display_name)) between 1 and 120),
  base_currency text not null default 'USD' check (base_currency ~ '^[A-Z]{3}$'),
  fiscal_year_start_month smallint not null default 1 check (fiscal_year_start_month between 1 and 12),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.luna_business_memberships (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.luna_books_role not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  unique (business_id, user_id)
);

create table public.luna_financial_accounts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  code text not null,
  name text not null,
  account_type public.luna_account_type not null,
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  institution_name text,
  masked_identifier text check (masked_identifier is null or masked_identifier !~ '[0-9]{5,}'),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, business_id),
  unique (business_id, code)
);

create table public.luna_customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  display_name text not null,
  email text,
  payment_terms_days integer not null default 30 check (payment_terms_days between 0 and 365),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, business_id)
);

create table public.luna_vendors (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  display_name text not null,
  email text,
  default_lead_time_days integer check (default_lead_time_days between 0 and 730),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, business_id)
);

create table public.luna_transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  account_id uuid,
  external_source_id text,
  transaction_date date not null,
  posted_date date,
  original_description text not null,
  original_amount_minor bigint not null,
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  entry_side public.luna_entry_side not null,
  original_payload jsonb not null default '{}'::jsonb,
  source_type text not null,
  imported_at timestamptz not null default now(),
  imported_by uuid references auth.users(id),
  unique (id, business_id),
  unique (business_id, source_type, external_source_id),
  foreign key (account_id, business_id) references public.luna_financial_accounts(id, business_id)
);

create table public.luna_transaction_versions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  transaction_id uuid not null,
  category_code text,
  subcategory text,
  merchant text,
  memo text,
  reconciliation_status text not null default 'unreviewed',
  duplicate_status text not null default 'unreviewed',
  anomaly_status text not null default 'unreviewed',
  confidence_basis_points integer check (confidence_basis_points between 0 and 10000),
  reason text not null,
  created_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id),
  foreign key (transaction_id, business_id) references public.luna_transactions(id, business_id) on delete cascade
);

create table public.luna_invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  customer_id uuid not null,
  invoice_number text not null,
  issue_date date not null,
  due_date date not null,
  total_minor bigint not null check (total_minor >= 0),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  status public.luna_document_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, business_id),
  unique (business_id, invoice_number),
  foreign key (customer_id, business_id) references public.luna_customers(id, business_id)
);

create table public.luna_invoice_payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  invoice_id uuid not null,
  amount_minor bigint not null check (amount_minor > 0),
  paid_at timestamptz not null,
  transaction_id uuid,
  created_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id),
  foreign key (invoice_id, business_id) references public.luna_invoices(id, business_id) on delete cascade,
  foreign key (transaction_id, business_id) references public.luna_transactions(id, business_id)
);

create table public.luna_bills (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  vendor_id uuid not null,
  bill_number text,
  issue_date date not null,
  due_date date not null,
  total_minor bigint not null check (total_minor >= 0),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  status public.luna_document_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, business_id),
  foreign key (vendor_id, business_id) references public.luna_vendors(id, business_id)
);

create table public.luna_bill_payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  bill_id uuid not null,
  amount_minor bigint not null check (amount_minor > 0),
  paid_at timestamptz not null,
  transaction_id uuid,
  created_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id),
  foreign key (bill_id, business_id) references public.luna_bills(id, business_id) on delete cascade,
  foreign key (transaction_id, business_id) references public.luna_transactions(id, business_id)
);

create table public.luna_inventory_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  sku text not null,
  name text not null,
  vendor_id uuid,
  unit_cost_minor bigint check (unit_cost_minor is null or unit_cost_minor >= 0),
  unit_price_minor bigint check (unit_price_minor is null or unit_price_minor >= 0),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  quantity_on_hand numeric(20, 6) not null default 0,
  reorder_point numeric(20, 6),
  minimum_order_quantity numeric(20, 6),
  supplier_lead_time_days integer check (supplier_lead_time_days between 0 and 730),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, business_id),
  unique (business_id, sku),
  foreign key (vendor_id, business_id) references public.luna_vendors(id, business_id)
);

create table public.luna_inventory_movements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  inventory_item_id uuid not null,
  movement_type text not null check (movement_type in ('purchase', 'sale', 'return', 'adjustment', 'transfer')),
  quantity_delta numeric(20, 6) not null check (quantity_delta <> 0),
  unit_cost_minor bigint check (unit_cost_minor is null or unit_cost_minor >= 0),
  occurred_at timestamptz not null,
  source_reference text,
  reason text not null,
  created_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id),
  foreign key (inventory_item_id, business_id) references public.luna_inventory_items(id, business_id)
);

create table public.luna_audit_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.luna_businesses(id) on delete cascade,
  actor_user_id uuid references auth.users(id),
  action text not null,
  entity_table text not null,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  reason text,
  request_id text,
  source_ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index on public.luna_business_memberships(user_id, business_id);
create index on public.luna_transactions(business_id, transaction_date desc);
create index on public.luna_transaction_versions(business_id, transaction_id, created_at desc);
create index on public.luna_invoices(business_id, due_date, status);
create index on public.luna_bills(business_id, due_date, status);
create index on public.luna_inventory_movements(business_id, inventory_item_id, occurred_at desc);
create index on public.luna_audit_events(business_id, created_at desc);

create or replace function public.luna_has_business_access(target_business_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp
as $$ select exists (select 1 from public.luna_business_memberships m where m.business_id = target_business_id and m.user_id = auth.uid()) $$;

create or replace function public.luna_has_bookkeeping_access(target_business_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp
as $$ select exists (select 1 from public.luna_business_memberships m where m.business_id = target_business_id and m.user_id = auth.uid() and m.role in ('owner', 'manager', 'bookkeeper')) $$;

create or replace function public.luna_is_business_owner(target_business_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp
as $$ select exists (select 1 from public.luna_business_memberships m where m.business_id = target_business_id and m.user_id = auth.uid() and m.role = 'owner') $$;

create or replace function public.luna_create_business(display_name text, legal_name text, base_currency text default 'USD')
returns uuid language plpgsql security definer set search_path = public, pg_temp
as $$
declare new_business_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if length(trim(display_name)) not between 1 and 120 then raise exception 'Invalid display name'; end if;
  if length(trim(legal_name)) not between 1 and 160 then raise exception 'Invalid legal name'; end if;
  if base_currency !~ '^[A-Z]{3}$' then raise exception 'Invalid currency'; end if;
  insert into public.luna_businesses(display_name, legal_name, base_currency)
    values (trim(display_name), trim(legal_name), base_currency) returning id into new_business_id;
  insert into public.luna_business_memberships(business_id, user_id, role, created_by)
    values (new_business_id, auth.uid(), 'owner', auth.uid());
  return new_business_id;
end;
$$;

create or replace function public.luna_prevent_audit_mutation()
returns trigger language plpgsql set search_path = public, pg_temp
as $$ begin raise exception 'Luna audit events are append-only'; end; $$;

create or replace function public.luna_protect_owner_membership()
returns trigger language plpgsql set search_path = public, pg_temp
as $$
begin
  if old.role = 'owner' then
    if tg_op = 'DELETE' or (tg_op = 'UPDATE' and new.role <> 'owner') then
      if not exists (
        select 1 from public.luna_business_memberships
        where business_id = old.business_id and role = 'owner' and id <> old.id
      ) then raise exception 'A Luna business must retain at least one owner'; end if;
    end if;
  end if;
  return coalesce(new, old);
end;
$$;

create or replace function public.luna_touch_updated_at()
returns trigger language plpgsql set search_path = public, pg_temp
as $$ begin new.updated_at := now(); return new; end; $$;

create or replace function public.luna_record_audit_event()
returns trigger language plpgsql security definer set search_path = public, pg_temp
as $$
declare tenant_id uuid; entity uuid;
begin
  if tg_table_name = 'luna_businesses' then
    tenant_id := coalesce(new.id, old.id);
  else
    tenant_id := coalesce(new.business_id, old.business_id);
  end if;
  entity := coalesce(new.id, old.id);
  insert into public.luna_audit_events(business_id, actor_user_id, action, entity_table, entity_id, before_state, after_state)
  values (tenant_id, auth.uid(), tg_op, tg_table_name, entity, case when tg_op = 'INSERT' then null else to_jsonb(old) end, case when tg_op = 'DELETE' then null else to_jsonb(new) end);
  return coalesce(new, old);
end;
$$;

create trigger luna_audit_events_immutable before update or delete on public.luna_audit_events
for each row execute function public.luna_prevent_audit_mutation();
create trigger luna_memberships_keep_owner before update or delete on public.luna_business_memberships
for each row execute function public.luna_protect_owner_membership();

do $$
declare table_name text;
begin
  foreach table_name in array array['luna_businesses','luna_financial_accounts','luna_customers','luna_vendors','luna_invoices','luna_bills','luna_inventory_items']
  loop
    execute format('create trigger %I before update on public.%I for each row execute function public.luna_touch_updated_at()', table_name || '_touch_updated_at', table_name);
  end loop;
end $$;

do $$
declare table_name text;
begin
  foreach table_name in array array['luna_businesses','luna_business_memberships','luna_financial_accounts','luna_customers','luna_vendors','luna_transactions','luna_transaction_versions','luna_invoices','luna_invoice_payments','luna_bills','luna_bill_payments','luna_inventory_items','luna_inventory_movements']
  loop
    execute format('create trigger %I after insert or update or delete on public.%I for each row execute function public.luna_record_audit_event()', table_name || '_audit', table_name);
  end loop;
end $$;

alter table public.luna_businesses enable row level security;
alter table public.luna_business_memberships enable row level security;
alter table public.luna_financial_accounts enable row level security;
alter table public.luna_customers enable row level security;
alter table public.luna_vendors enable row level security;
alter table public.luna_transactions enable row level security;
alter table public.luna_transaction_versions enable row level security;
alter table public.luna_invoices enable row level security;
alter table public.luna_invoice_payments enable row level security;
alter table public.luna_bills enable row level security;
alter table public.luna_bill_payments enable row level security;
alter table public.luna_inventory_items enable row level security;
alter table public.luna_inventory_movements enable row level security;
alter table public.luna_audit_events enable row level security;

create policy businesses_read on public.luna_businesses for select using (public.luna_has_business_access(id));
create policy businesses_owner_update on public.luna_businesses for update using (public.luna_is_business_owner(id)) with check (public.luna_is_business_owner(id));
create policy memberships_read on public.luna_business_memberships for select using (public.luna_has_business_access(business_id));
create policy memberships_owner_insert on public.luna_business_memberships for insert with check (public.luna_is_business_owner(business_id) and created_by = auth.uid());
create policy memberships_owner_update on public.luna_business_memberships for update using (public.luna_is_business_owner(business_id)) with check (public.luna_is_business_owner(business_id));
create policy memberships_owner_delete on public.luna_business_memberships for delete using (public.luna_is_business_owner(business_id) and user_id <> auth.uid());

do $$
declare table_name text;
begin
  foreach table_name in array array['luna_financial_accounts','luna_customers','luna_vendors','luna_invoices','luna_invoice_payments','luna_bills','luna_bill_payments','luna_inventory_items','luna_inventory_movements','luna_transaction_versions']
  loop
    execute format('create policy %I on public.%I for select using (public.luna_has_business_access(business_id))', table_name || '_read', table_name);
    execute format('create policy %I on public.%I for insert with check (public.luna_has_bookkeeping_access(business_id))', table_name || '_insert', table_name);
  end loop;
  foreach table_name in array array['luna_financial_accounts','luna_customers','luna_vendors','luna_invoices','luna_bills','luna_inventory_items']
  loop
    execute format('create policy %I on public.%I for update using (public.luna_has_bookkeeping_access(business_id)) with check (public.luna_has_bookkeeping_access(business_id))', table_name || '_update', table_name);
  end loop;
end $$;

create policy transactions_read on public.luna_transactions for select using (public.luna_has_business_access(business_id));
create policy transactions_insert on public.luna_transactions for insert with check (public.luna_has_bookkeeping_access(business_id) and imported_by = auth.uid());
create policy audit_read on public.luna_audit_events for select using (public.luna_has_business_access(business_id));

revoke all on public.luna_businesses, public.luna_business_memberships, public.luna_financial_accounts, public.luna_customers, public.luna_vendors, public.luna_transactions, public.luna_transaction_versions, public.luna_invoices, public.luna_invoice_payments, public.luna_bills, public.luna_bill_payments, public.luna_inventory_items, public.luna_inventory_movements, public.luna_audit_events from anon;
grant select on public.luna_businesses, public.luna_business_memberships, public.luna_financial_accounts, public.luna_customers, public.luna_vendors, public.luna_transactions, public.luna_transaction_versions, public.luna_invoices, public.luna_invoice_payments, public.luna_bills, public.luna_bill_payments, public.luna_inventory_items, public.luna_inventory_movements, public.luna_audit_events to authenticated;
grant insert on public.luna_business_memberships, public.luna_financial_accounts, public.luna_customers, public.luna_vendors, public.luna_transactions, public.luna_transaction_versions, public.luna_invoices, public.luna_invoice_payments, public.luna_bills, public.luna_bill_payments, public.luna_inventory_items, public.luna_inventory_movements to authenticated;
grant update on public.luna_businesses, public.luna_business_memberships, public.luna_financial_accounts, public.luna_customers, public.luna_vendors, public.luna_invoices, public.luna_bills, public.luna_inventory_items to authenticated;
grant delete on public.luna_business_memberships to authenticated;

revoke all on function public.luna_has_business_access(uuid) from public;
revoke all on function public.luna_has_bookkeeping_access(uuid) from public;
revoke all on function public.luna_is_business_owner(uuid) from public;
revoke all on function public.luna_create_business(text, text, text) from public;
grant execute on function public.luna_has_business_access(uuid) to authenticated;
grant execute on function public.luna_has_bookkeeping_access(uuid) to authenticated;
grant execute on function public.luna_is_business_owner(uuid) to authenticated;
grant execute on function public.luna_create_business(text, text, text) to authenticated;

commit;
