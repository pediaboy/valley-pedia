-- VALLEY.PEDIA Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price integer not null default 0,
  description text,
  category text default 'buy-sell',
  hero text,
  skin_count integer default 0,
  rank text,
  server text,
  status text default 'ready' check (status in ('ready', 'sold')),
  images text[] default '{}',
  benefits text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories
create table if not exists categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  price integer default 0,
  features text[] default '{}',
  created_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  product_id text,
  customer_name text not null,
  customer_whatsapp text not null,
  notes text,
  payment_method text,
  payment_gateway text,
  status text default 'pending' check (status in ('pending','paid','completed','cancelled','expired','failed')),
  total_amount integer default 0,
  payment_url text,
  order_id text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Testimonials
create table if not exists testimonials (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  rating integer default 5 check (rating between 1 and 5),
  comment text,
  image_url text,
  created_at timestamptz default now()
);

-- FAQs
create table if not exists faqs (
  id uuid default uuid_generate_v4() primary key,
  question text not null,
  answer text not null,
  "order" integer default 0,
  created_at timestamptz default now()
);

-- Banners
create table if not exists banners (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  image_url text,
  link text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Settings
create table if not exists settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value text,
  updated_at timestamptz default now()
);

-- Social Links
create table if not exists social_links (
  id uuid default uuid_generate_v4() primary key,
  platform text not null,
  url text,
  username text
);

-- Telegram Logs
create table if not exists telegram_logs (
  id uuid default uuid_generate_v4() primary key,
  command text,
  user_id text,
  message text,
  response text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table products enable row level security;
alter table orders enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table banners enable row level security;
alter table settings enable row level security;

-- Public read policies
create policy "Public read products" on products for select using (true);
create policy "Public read testimonials" on testimonials for select using (true);
create policy "Public read faqs" on faqs for select using (true);
create policy "Public read banners" on banners for select using (true);
create policy "Public read settings" on settings for select using (true);

-- Allow anyone to insert orders (customers)
create policy "Anyone can insert orders" on orders for insert with check (true);
create policy "Public read orders" on orders for select using (true);
create policy "Anyone can update orders" on orders for update using (true);

-- Allow all for authenticated (admin)
create policy "Admin all products" on products for all using (auth.role() = 'authenticated');
create policy "Admin all testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "Admin all faqs" on faqs for all using (auth.role() = 'authenticated');
create policy "Admin all banners" on banners for all using (auth.role() = 'authenticated');
create policy "Admin all settings" on settings for all using (auth.role() = 'authenticated');

-- Seed default FAQs
insert into faqs (question, answer, "order") values
  ('Apa itu Room Wangi?', 'Room Wangi adalah layanan bot yang membantu kamu bermain di room khusus dengan musuh yang mudah dikalahkan, sehingga MMR kamu naik dengan cepat dan konsisten.', 1),
  ('Apakah aman?', 'Ya, layanan kami 100% aman dan tidak melanggar ToS game. Kami menggunakan metode yang sudah teruji dan anti banned.', 2),
  ('Support iOS?', 'Ya! Semua layanan kami support untuk pengguna iOS maupun Android.', 3),
  ('Berapa lama proses pengerjaan?', 'Proses aktivasi biasanya memakan waktu 5-15 menit setelah pembayaran dikonfirmasi. Tim kami aktif 24 jam.', 4),
  ('Apakah bisa refund?', 'Refund dapat dilakukan dalam kondisi tertentu sesuai Syarat & Ketentuan yang berlaku. Hubungi tim kami via WhatsApp.', 5)
on conflict do nothing;

-- Seed default settings
insert into settings (key, value) values
  ('wa_number', '628000000000'),
  ('telegram_username', '@valleypedia'),
  ('terms_content', '# Syarat & Ketentuan VALLEY.PEDIA')
on conflict (key) do nothing;
