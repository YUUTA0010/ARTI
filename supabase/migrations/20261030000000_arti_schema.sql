create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'ARTI member' check (char_length(display_name) between 2 and 80),
  slug text not null unique,
  role text not null default 'collector' check (role in ('artist', 'collector')),
  bio text not null default '' check (char_length(bio) <= 800),
  location text not null default '' check (char_length(location) <= 120),
  website text,
  avatar_url text,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 120),
  slug text not null,
  description text not null default '' check (char_length(description) <= 3000),
  category text not null check (char_length(category) between 2 and 80),
  medium text not null check (char_length(medium) between 2 and 120),
  year integer not null check (year between 1500 and 2200),
  dimensions text not null default '' check (char_length(dimensions) <= 100),
  image_url text,
  price numeric(12, 2) check (price is null or price >= 0),
  is_for_sale boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (artist_id, slug)
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 120),
  slug text not null,
  description text not null default '' check (char_length(description) <= 1000),
  cover_url text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (artist_id, slug)
);

create table if not exists public.collection_artworks (
  collection_id uuid not null references public.collections(id) on delete cascade,
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (collection_id, artwork_id)
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, artwork_id)
);

create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  artist_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, artist_id),
  check (follower_id <> artist_id)
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references public.profiles(id) on delete set null,
  sender_id uuid references public.profiles(id) on delete set null,
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  subject text not null default '' check (char_length(subject) <= 120),
  message text not null check (char_length(message) between 10 and 3000),
  artwork_slug text,
  created_at timestamptz not null default now()
);

create index if not exists artworks_artist_status_idx on public.artworks (artist_id, status);
create index if not exists artworks_category_idx on public.artworks (category);
create index if not exists artworks_created_at_idx on public.artworks (created_at desc);
create index if not exists collections_artist_public_idx on public.collections (artist_id, is_public);
create index if not exists collection_artworks_position_idx on public.collection_artworks (collection_id, position);
create index if not exists favorites_artwork_idx on public.favorites (artwork_id);
create index if not exists follows_artist_idx on public.follows (artist_id);
create index if not exists inquiries_artist_created_idx on public.inquiries (artist_id, created_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role <> old.role then
    raise exception 'Profile role cannot be changed after signup';
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_prevent_role_change on public.profiles;
create trigger profiles_prevent_role_change before update on public.profiles
for each row execute function public.prevent_profile_role_change();
drop trigger if exists artworks_set_updated_at on public.artworks;
create trigger artworks_set_updated_at before update on public.artworks
for each row execute function public.set_updated_at();
drop trigger if exists collections_set_updated_at on public.collections;
create trigger collections_set_updated_at before update on public.collections
for each row execute function public.set_updated_at();

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_name text;
  safe_slug text;
  requested_role text;
begin
  requested_name := coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 'ARTI member');
  requested_role := case when new.raw_user_meta_data ->> 'role' = 'artist' then 'artist' else 'collector' end;
  safe_slug := trim(both '-' from regexp_replace(lower(requested_name), '[^a-z0-9]+', '-', 'g'));
  if safe_slug = '' then
    safe_slug := 'member';
  end if;

  insert into public.profiles (id, display_name, slug, role)
  values (new.id, left(requested_name, 80), safe_slug || '-' || substr(new.id::text, 1, 8), requested_role);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.create_profile_for_new_user();

alter table public.profiles enable row level security;
alter table public.artworks enable row level security;
alter table public.collections enable row level security;
alter table public.collection_artworks enable row level security;
alter table public.favorites enable row level security;
alter table public.follows enable row level security;
alter table public.inquiries enable row level security;

create policy "Profiles are publicly readable" on public.profiles
for select using (true);
create policy "Users create their own profile" on public.profiles
for insert to authenticated with check (id = (select auth.uid()));
create policy "Users update their own profile" on public.profiles
for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "Published artworks are public" on public.artworks
for select using (status = 'published' or artist_id = (select auth.uid()));
create policy "Artists create their own artworks" on public.artworks
for insert to authenticated with check (
  artist_id = (select auth.uid())
  and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'artist')
);
create policy "Artists update their own artworks" on public.artworks
for update to authenticated
using (
  artist_id = (select auth.uid())
  and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'artist')
)
with check (
  artist_id = (select auth.uid())
  and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'artist')
);
create policy "Artists delete their own artworks" on public.artworks
for delete to authenticated using (
  artist_id = (select auth.uid())
  and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'artist')
);

create policy "Public collections and own collections are readable" on public.collections
for select using (is_public or artist_id = (select auth.uid()));
create policy "Artists create their own collections" on public.collections
for insert to authenticated with check (
  artist_id = (select auth.uid())
  and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'artist')
);
create policy "Artists update their own collections" on public.collections
for update to authenticated
using (
  artist_id = (select auth.uid())
  and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'artist')
)
with check (
  artist_id = (select auth.uid())
  and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'artist')
);
create policy "Artists delete their own collections" on public.collections
for delete to authenticated using (
  artist_id = (select auth.uid())
  and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'artist')
);

create policy "Collection artworks follow collection visibility" on public.collection_artworks
for select using (
  exists (
    select 1 from public.collections c
    where c.id = collection_id and (c.is_public or c.artist_id = (select auth.uid()))
  )
);
create policy "Collection owners manage collection artworks" on public.collection_artworks
for all to authenticated
using (exists (select 1 from public.collections c where c.id = collection_id and c.artist_id = (select auth.uid())))
with check (exists (select 1 from public.collections c where c.id = collection_id and c.artist_id = (select auth.uid())));

create policy "Users read their own favorites" on public.favorites
for select to authenticated using (user_id = (select auth.uid()));
create policy "Users add their own favorites" on public.favorites
for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Users remove their own favorites" on public.favorites
for delete to authenticated using (user_id = (select auth.uid()));

create policy "Follows are publicly readable" on public.follows
for select using (true);
create policy "Users follow from their own account" on public.follows
for insert to authenticated with check (follower_id = (select auth.uid()));
create policy "Users unfollow from their own account" on public.follows
for delete to authenticated using (follower_id = (select auth.uid()));

create policy "Anyone can submit a valid inquiry" on public.inquiries
for insert to anon, authenticated
with check (
  char_length(trim(name)) between 2 and 100
  and char_length(trim(email)) between 3 and 254
  and char_length(trim(message)) between 10 and 3000
  and (sender_id is null or sender_id = (select auth.uid()))
);
create policy "Inquiry recipients can read their own inquiries" on public.inquiries
for select to authenticated using (artist_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('artwork-images', 'artwork-images', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = false, file_size_limit = 10485760,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Artists preview their own images and published images are readable" on storage.objects
for select using (
  bucket_id = 'artwork-images'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or exists (
      select 1 from public.artworks a
      where a.image_url = name and a.status = 'published'
    )
  )
);
create policy "Artists upload into their own folder" on storage.objects
for insert to authenticated with check (
  bucket_id = 'artwork-images' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "Artists update their own images" on storage.objects
for update to authenticated using (
  bucket_id = 'artwork-images' and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'artwork-images' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "Artists delete their own images" on storage.objects
for delete to authenticated using (
  bucket_id = 'artwork-images' and (storage.foldername(name))[1] = (select auth.uid())::text
);
