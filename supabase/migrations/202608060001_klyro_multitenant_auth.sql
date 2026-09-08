-- Klyro business tenancy. Supabase Auth owns password hashing, verification, MFA and recovery.
create type public.klyro_role as enum ('OWNER', 'ACCOUNTANT', 'VIEWER');
create table public.klyro_businesses (id uuid primary key default gen_random_uuid(), name text not null, industry text, accounting_method text not null check (accounting_method in ('ACCRUAL','CASH')), fiscal_year text not null default 'CALENDAR', is_demo boolean not null default false, created_at timestamptz not null default now());
create table public.klyro_business_memberships (business_id uuid not null references public.klyro_businesses(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, role public.klyro_role not null, created_at timestamptz not null default now(), primary key (business_id,user_id));
create table public.klyro_audit_log (id bigint generated always as identity primary key, business_id uuid references public.klyro_businesses(id), actor_user_id uuid references auth.users(id), action text not null, entity_type text, entity_id text, metadata jsonb not null default '{}', created_at timestamptz not null default now());
create table public.klyro_financial_records (id uuid primary key default gen_random_uuid(), business_id uuid not null references public.klyro_businesses(id) on delete cascade, record_type text not null, occurred_on date not null, amount_cents bigint not null, description text not null, category text, metadata jsonb not null default '{}', created_at timestamptz not null default now());
create index on public.klyro_business_memberships(user_id, business_id);
create index on public.klyro_financial_records(business_id, occurred_on);
alter table public.klyro_businesses enable row level security;
alter table public.klyro_business_memberships enable row level security;
alter table public.klyro_audit_log enable row level security;
alter table public.klyro_financial_records enable row level security;
create policy "members read businesses" on public.klyro_businesses for select using (exists (select 1 from public.klyro_business_memberships m where m.business_id=klyro_businesses.id and m.user_id=auth.uid()));
create policy "members read memberships" on public.klyro_business_memberships for select using (user_id=auth.uid() or exists (select 1 from public.klyro_business_memberships owner where owner.business_id=klyro_business_memberships.business_id and owner.user_id=auth.uid() and owner.role='OWNER'));
create policy "members read financial records" on public.klyro_financial_records for select using (exists (select 1 from public.klyro_business_memberships m where m.business_id=klyro_financial_records.business_id and m.user_id=auth.uid()));
create policy "owners and accountants write financial records" on public.klyro_financial_records for all using (exists (select 1 from public.klyro_business_memberships m where m.business_id=klyro_financial_records.business_id and m.user_id=auth.uid() and m.role in ('OWNER','ACCOUNTANT'))) with check (exists (select 1 from public.klyro_business_memberships m where m.business_id=klyro_financial_records.business_id and m.user_id=auth.uid() and m.role in ('OWNER','ACCOUNTANT')));
-- Audit writes and demo resets are performed only by reviewed server-side RPCs/service code.
