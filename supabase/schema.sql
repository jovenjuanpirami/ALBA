-- ALBA · esquema del test de validación
-- Correr COMPLETO en el SQL editor de Supabase. Es idempotente: se puede
-- volver a correr sobre una base que ya existe y solo agrega lo que falta.

create extension if not exists "pgcrypto";

-- Registros de waitlist
create table if not exists waitlist (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  created_at    timestamptz not null default now(),
  session_id    text not null,
  sku_clicked   text,              -- sabor: 'chocolate' | 'vainilla'
  tier_clicked  text,              -- 'bolsa'
  price_variant text not null,     -- 'A' | 'B'
  price_shown   integer,           -- precio exacto que vio, en MXN
  wtp_response  integer,           -- respuesta opcional a "¿cuánto pagarías?"
  city_guess    text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  referrer      text,
  device        text,              -- 'mobile' | 'desktop' | 'tablet'
  unique(email)
);

-- Columnas de medición añadidas después del esquema inicial.
alter table waitlist add column if not exists utm_term     text;
alter table waitlist add column if not exists click_id     text;  -- fbclid / gclid / ttclid
alter table waitlist add column if not exists click_source text;  -- 'meta' | 'google' | ...
alter table waitlist add column if not exists is_returning boolean;

-- Todos los eventos de comportamiento
create table if not exists events (
  id            bigserial primary key,
  session_id    text not null,
  event_name    text not null,
  properties    jsonb default '{}'::jsonb,
  price_variant text,
  created_at    timestamptz not null default now(),
  utm_source    text,
  utm_campaign  text,
  device        text,
  user_agent    text
);

create index if not exists events_name_created_at_idx on events (event_name, created_at);
create index if not exists events_session_id_idx       on events (session_id);
create index if not exists waitlist_created_at_idx     on waitlist (created_at);
create index if not exists waitlist_session_id_idx     on waitlist (session_id);
create index if not exists waitlist_click_source_idx   on waitlist (click_source);

-- RLS activo y SIN políticas: nadie con la anon key puede leer ni escribir.
-- Todos los inserts entran por el service role desde las rutas de API.
alter table waitlist enable row level security;
alter table events   enable row level security;

revoke all on table waitlist from anon, authenticated;
revoke all on table events   from anon, authenticated;
