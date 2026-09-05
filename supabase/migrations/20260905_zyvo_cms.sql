create extension if not exists pgcrypto;

alter table public.cms_admins add column if not exists role text not null default 'admin';
alter table public.cms_admins add column if not exists updated_at timestamptz not null default now();

create table if not exists public.cms_pages (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null,
  title text, settings jsonb not null default '{}'::jsonb, is_published boolean not null default true,
  updated_at timestamptz not null default now(), updated_by uuid references auth.users(id)
);
create table if not exists public.cms_sections (
  id uuid primary key default gen_random_uuid(), page_id uuid not null references public.cms_pages(id) on delete cascade,
  section_key text not null, section_type text not null, title text, subtitle text, body text,
  content jsonb not null default '{}'::jsonb, media jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0, is_visible boolean not null default true,
  updated_at timestamptz not null default now(), unique(page_id,section_key)
);
create table if not exists public.cms_navigation (
  id uuid primary key default gen_random_uuid(), nav_key text unique not null, label text not null, href text not null,
  icon_key text, sort_order integer not null default 0, is_visible boolean not null default true,
  metadata jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);
create table if not exists public.cms_media (
  id uuid primary key default gen_random_uuid(), bucket text not null default 'cms-media', path text not null,
  public_url text, alt_text text, mime_type text, width integer, height integer, file_size bigint,
  created_at timestamptz not null default now(), created_by uuid references auth.users(id), unique(bucket,path)
);
create table if not exists public.cms_profile (
  id uuid primary key default gen_random_uuid(), display_name text, role_label text,
  avatar_media_id uuid references public.cms_media(id) on delete set null, plan_label text,
  metadata jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);

create or replace function public.is_cms_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.cms_admins where user_id=auth.uid());
$$;
revoke all on function public.is_cms_admin() from public;
grant execute on function public.is_cms_admin() to anon,authenticated;

alter table public.cms_admins enable row level security;
alter table public.cms_pages enable row level security;
alter table public.cms_sections enable row level security;
alter table public.cms_navigation enable row level security;
alter table public.cms_profile enable row level security;
alter table public.cms_media enable row level security;

drop policy if exists cms_admins_self_read on public.cms_admins;
create policy cms_admins_self_read on public.cms_admins for select to authenticated using(user_id=auth.uid());
drop policy if exists cms_pages_public_read on public.cms_pages;
create policy cms_pages_public_read on public.cms_pages for select to anon,authenticated using(is_published or public.is_cms_admin());
drop policy if exists cms_pages_admin_write on public.cms_pages;
create policy cms_pages_admin_write on public.cms_pages for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
drop policy if exists cms_sections_public_read on public.cms_sections;
create policy cms_sections_public_read on public.cms_sections for select to anon,authenticated using(exists(select 1 from public.cms_pages p where p.id=page_id and p.is_published) or public.is_cms_admin());
drop policy if exists cms_sections_admin_write on public.cms_sections;
create policy cms_sections_admin_write on public.cms_sections for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
drop policy if exists cms_navigation_public_read on public.cms_navigation;
create policy cms_navigation_public_read on public.cms_navigation for select to anon,authenticated using(true);
drop policy if exists cms_navigation_admin_write on public.cms_navigation;
create policy cms_navigation_admin_write on public.cms_navigation for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
drop policy if exists cms_profile_public_read on public.cms_profile;
create policy cms_profile_public_read on public.cms_profile for select to anon,authenticated using(true);
drop policy if exists cms_profile_admin_write on public.cms_profile;
create policy cms_profile_admin_write on public.cms_profile for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());
drop policy if exists cms_media_public_read on public.cms_media;
create policy cms_media_public_read on public.cms_media for select to anon,authenticated using(true);
drop policy if exists cms_media_admin_write on public.cms_media;
create policy cms_media_admin_write on public.cms_media for all to authenticated using(public.is_cms_admin()) with check(public.is_cms_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('cms-media','cms-media',true,15728640,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists cms_media_storage_public_read on storage.objects;
create policy cms_media_storage_public_read on storage.objects for select to anon,authenticated using(bucket_id='cms-media');
drop policy if exists cms_media_storage_admin_insert on storage.objects;
create policy cms_media_storage_admin_insert on storage.objects for insert to authenticated with check(bucket_id='cms-media' and public.is_cms_admin());
drop policy if exists cms_media_storage_admin_update on storage.objects;
create policy cms_media_storage_admin_update on storage.objects for update to authenticated using(bucket_id='cms-media' and public.is_cms_admin()) with check(bucket_id='cms-media' and public.is_cms_admin());
drop policy if exists cms_media_storage_admin_delete on storage.objects;
create policy cms_media_storage_admin_delete on storage.objects for delete to authenticated using(bucket_id='cms-media' and public.is_cms_admin());

insert into public.cms_pages(slug,name,title,is_published) values
('home','Home','Reuniões com Performance Pro',true),('skills','Skills','Skills',true)
on conflict(slug) do update set name=excluded.name,title=excluded.title,is_published=true;

insert into public.cms_sections(page_id,section_key,section_type,title,subtitle,body,content,media,sort_order,is_visible)
select id,'home.hero','hero','Reuniões com Performance Pro','TECNOLOGIA QUE TRANSFORMA','Ferramentas inteligentes para reuniões mais produtivas, análises precisas e resultados que fazem a diferença.',
'{"greetingPrefix":"Olá,","primaryLabel":"Criar reunião","primaryHref":"/reuniao-instantanea","secondaryLabel":"Entrar","secondaryHref":"/reunioes","motto":"CONECTE · EVOLUA · REALIZE MAIS"}'::jsonb,'{"heroMedia":null}'::jsonb,0,true from public.cms_pages where slug='home'
on conflict(page_id,section_key) do nothing;
insert into public.cms_sections(page_id,section_key,section_type,title,content,media,sort_order,is_visible)
select id,'home.quick_actions','actions','Ações rápidas','{"items":[{"label":"Minhas anotações","href":"/minhas-anotacoes"},{"label":"Criar slides","href":"/criar-slides"},{"label":"Gravações recentes","href":"/gravacoes"},{"label":"Criar reunião","href":"/reuniao-instantanea"}]}'::jsonb,'{}'::jsonb,10,true from public.cms_pages where slug='home'
on conflict(page_id,section_key) do nothing;
insert into public.cms_sections(page_id,section_key,section_type,title,subtitle,body,content,media,sort_order,is_visible)
select id,'skills.hero','hero','Skills','PERFORMANCE HUMANA','Inteligência que transforma suas reuniões em resultados.','{"insightsLabel":"INSIGHTS REAIS","insightsTitle":"Mais que reuniões. Evolução.","ctaLabel":"Explorar agora"}'::jsonb,'{"heroMedia":null}'::jsonb,0,true from public.cms_pages where slug='skills'
on conflict(page_id,section_key) do nothing;
insert into public.cms_sections(page_id,section_key,section_type,title,content,media,sort_order,is_visible)
select id,'skills.performance','metrics','Seu desempenho','{"score":82,"delta":"+6,4%","periodLabel":"em relação ao período anterior","actionLabel":"Analisar performance","metrics":[{"label":"Comunicação","value":88},{"label":"Clareza","value":91},{"label":"Escuta","value":84},{"label":"Objetividade","value":76},{"label":"Perguntas","value":89},{"label":"Condução","value":85}]}'::jsonb,'{}'::jsonb,10,true from public.cms_pages where slug='skills'
on conflict(page_id,section_key) do nothing;
insert into public.cms_sections(page_id,section_key,section_type,title,body,content,media,sort_order,is_visible)
select id,'skills.insights','card','Insights e Conteúdo','Artigos e guias sobre IA, comunicação e produtividade.','{"buttonLabel":"→"}'::jsonb,'{"backgroundMedia":null}'::jsonb,20,true from public.cms_pages where slug='skills'
on conflict(page_id,section_key) do nothing;
insert into public.cms_sections(page_id,section_key,section_type,title,body,content,media,sort_order,is_visible)
select id,'skills.meeting','card','Analisar Reuniões','Reviva conversas, identifique pontos-chave e gere insights.','{"buttonLabel":"→"}'::jsonb,'{"backgroundMedia":null}'::jsonb,30,true from public.cms_pages where slug='skills'
on conflict(page_id,section_key) do nothing;
insert into public.cms_sections(page_id,section_key,section_type,title,body,content,media,sort_order,is_visible)
select id,'skills.analysis','upload','Analise suas reuniões','Envie sua gravação e receba uma análise completa com insights de performance.','{"buttonLabel":"Selecionar arquivo","fileHint":"MP4, MOV ou WEBM","captureTitle":"CAPTURE. ANALISE. EVOLUA.","captureBody":"Do seu smartphone para insights reais."}'::jsonb,'{"backgroundMedia":"/skills-analysis-phone.webp"}'::jsonb,40,true from public.cms_pages where slug='skills'
on conflict(page_id,section_key) do nothing;

insert into public.cms_navigation(nav_key,label,href,icon_key,sort_order,is_visible) values
('home','Início','/','home',0,true),('new-meeting','Criar reunião','/reuniao-instantanea','video',10,true),('agenda','Agenda','/agenda','calendar',20,true),('contacts','Contatos','/contatos','contacts',30,true),('notes','Minhas anotações','/minhas-anotacoes','notes',40,true),('settings','Configurações','/configuracoes','settings',50,true),('notifications','Notificações','/notificacoes','notifications',60,true),('skills','Skills','/skills','skills',70,true)
on conflict(nav_key) do update set label=excluded.label,href=excluded.href,icon_key=excluded.icon_key,sort_order=excluded.sort_order,is_visible=excluded.is_visible;
insert into public.cms_profile(display_name,role_label,plan_label,metadata)
select 'Sandro Bello','Marketing Digital','Plano Pro','{}'::jsonb where not exists(select 1 from public.cms_profile);
