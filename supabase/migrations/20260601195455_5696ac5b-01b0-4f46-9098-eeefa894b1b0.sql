
-- ============ ENUMS ============
create type public.app_role as enum ('admin', 'usuario');
create type public.cliente_status as enum ('ativo', 'inativo');

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null,
  status text not null default 'ativo',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- ============ USER ROLES ============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- ============ CATEGORIAS ============
create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  descricao text,
  created_at timestamptz not null default now()
);
grant select on public.categorias to authenticated;
grant insert, update, delete on public.categorias to authenticated;
grant all on public.categorias to service_role;
alter table public.categorias enable row level security;

-- ============ CLIENTES ============
create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  razao_social text not null,
  nome_fantasia text,
  cnpj text unique,
  email text,
  telefone text,
  responsavel text,
  observacoes text,
  status cliente_status not null default 'ativo',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.clientes to authenticated;
grant insert, update, delete on public.clientes to authenticated;
grant all on public.clientes to service_role;
alter table public.clientes enable row level security;
create index on public.clientes (razao_social);
create index on public.clientes (cnpj);

-- ============ DOCUMENTOS ============
create table public.documentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  categoria_id uuid references public.categorias(id) on delete set null,
  nome_arquivo text not null,
  nome_original text not null,
  tipo_arquivo text not null,
  tamanho bigint not null,
  caminho_storage text not null,
  versao int not null default 1,
  documento_pai_id uuid references public.documentos(id) on delete set null,
  observacao text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.documentos to authenticated;
grant insert, update, delete on public.documentos to authenticated;
grant all on public.documentos to service_role;
alter table public.documentos enable row level security;
create index on public.documentos (cliente_id);
create index on public.documentos (categoria_id);
create index on public.documentos (nome_original);
create index on public.documentos (created_at desc);

-- ============ LOGS ============
create table public.logs (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references auth.users(id) on delete set null,
  usuario_nome text,
  acao text not null,
  entidade text not null,
  registro_id uuid,
  detalhes jsonb,
  data_hora timestamptz not null default now()
);
grant select, insert on public.logs to authenticated;
grant all on public.logs to service_role;
alter table public.logs enable row level security;
create index on public.logs (data_hora desc);

-- ============ RLS POLICIES ============

-- profiles: own row read/update, admins all
create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "profiles_insert_own" on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy "profiles_update_own_or_admin" on public.profiles for update to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- user_roles: any authenticated reads (needed for own role check); admins manage
create policy "user_roles_select_self_or_admin" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "user_roles_admin_all" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- categorias: all auth read; admin manage
create policy "cat_select" on public.categorias for select to authenticated using (true);
create policy "cat_admin_ins" on public.categorias for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "cat_admin_upd" on public.categorias for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "cat_admin_del" on public.categorias for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- clientes: all auth read; admin manage
create policy "cli_select" on public.clientes for select to authenticated using (true);
create policy "cli_admin_ins" on public.clientes for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "cli_admin_upd" on public.clientes for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "cli_admin_del" on public.clientes for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- documentos: all auth read; admin manage
create policy "doc_select" on public.documentos for select to authenticated using (true);
create policy "doc_admin_ins" on public.documentos for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "doc_admin_upd" on public.documentos for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "doc_admin_del" on public.documentos for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- logs: any authenticated can insert their own actions; admins read all, users read own
create policy "logs_insert_self" on public.logs for insert to authenticated
  with check (usuario_id = auth.uid());
create policy "logs_select_self_or_admin" on public.logs for select to authenticated
  using (usuario_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- ============ TRIGGERS ============

-- updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger clientes_updated_at before update on public.clientes
  for each row execute function public.set_updated_at();
create trigger documentos_updated_at before update on public.documentos
  for each row execute function public.set_updated_at();

-- profile + first-user-becomes-admin
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_is_first boolean;
begin
  insert into public.profiles (id, nome, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email,'@',1)),
    new.email
  );

  select not exists(select 1 from public.user_roles where role = 'admin') into v_is_first;

  insert into public.user_roles (user_id, role)
  values (new.id, case when v_is_first then 'admin'::app_role else 'usuario'::app_role end);

  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ STORAGE BUCKET ============
insert into storage.buckets (id, name, public) values ('documentos', 'documentos', false)
on conflict (id) do nothing;

create policy "doc_storage_read_auth" on storage.objects for select to authenticated
  using (bucket_id = 'documentos');
create policy "doc_storage_admin_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'documentos' and public.has_role(auth.uid(), 'admin'));
create policy "doc_storage_admin_update" on storage.objects for update to authenticated
  using (bucket_id = 'documentos' and public.has_role(auth.uid(), 'admin'));
create policy "doc_storage_admin_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'documentos' and public.has_role(auth.uid(), 'admin'));

-- ============ SEED CATEGORIAS ============
insert into public.categorias (nome, descricao) values
  ('Contratos','Contratos e aditivos'),
  ('Documentos Fiscais','Notas fiscais, impostos'),
  ('Certificados','Certificados e certidões'),
  ('Financeiro','Documentos financeiros'),
  ('Comercial','Propostas e documentos comerciais'),
  ('Jurídico','Documentos jurídicos'),
  ('Outros','Outros documentos')
on conflict (nome) do nothing;
