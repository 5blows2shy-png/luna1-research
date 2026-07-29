-- Run in the Supabase SQL editor. The service-role client is server-only.
create table if not exists public.research_view_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  approval_status text not null default 'pending'
    check (approval_status in ('pending', 'approved', 'rejected')),
  "professionalRole" text not null,
  company text not null,
  "thesisStance" text not null,
  "importantAssumption" text not null,
  "mainDisagreement" text not null,
  "researchQuestion" text not null,
  "sourceUrl" text not null,
  name text,
  organization text,
  email text
);

alter table public.research_view_submissions enable row level security;

-- No public policies are created. Inserts and review changes use the
-- server-side service-role client. Approved summaries should be exposed only
-- through a server route that selects anonymized aggregate fields.
