-- ═══════════════════════════════════════════════════════════
-- Sneakers Store — Database Schema
-- Run in Supabase SQL Editor on a fresh project
-- ═══════════════════════════════════════════════════════════

-- ─── Extensions ───
create extension if not exists pg_trgm;

-- ═══════════════════════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════════════════════

create table products (
  id serial primary key,
  slug text not null,
  name text not null,
  brand text not null,
  category text not null check (category in ('men', 'women', 'unisex')),
  price numeric not null,
  old_price numeric,
  rating int not null default 0,
  colors jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  images text[],
  created_at timestamptz not null default now()
);

create table orders (
  id serial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  total numeric not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'done')),
  created_at timestamptz not null default now()
);

create table order_items (
  id serial primary key,
  order_id int not null references orders(id) on delete cascade,
  product_id int not null references products(id),
  size text not null,
  color text,
  price numeric not null,
  quantity int not null default 1 check (quantity > 0)
);

-- ═══════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════

-- Unique product slug
create unique index products_slug_idx on products (slug);

-- Filtering
create index products_brand_idx on products (brand);
create index products_category_idx on products (category);
create index products_price_idx on products (price);
create index products_rating_idx on products (rating);
create index products_created_at_idx on products (created_at desc);

-- Trigram search (name / brand)
create index products_name_trgm_idx
  on products using gin (name gin_trgm_ops);

create index products_brand_trgm_idx
  on products using gin (brand gin_trgm_ops);

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Products: anyone can read
create policy "products_select_all"
  on products for select
  using (true);

-- Orders: users can only see and create their own
create policy "orders_select_own"
  on orders for select
  using (auth.uid() = user_id);

create policy "orders_insert_own"
  on orders for insert
  with check (auth.uid() = user_id);

-- Order items: only through own orders
create policy "order_items_select_own"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "order_items_insert_own"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );