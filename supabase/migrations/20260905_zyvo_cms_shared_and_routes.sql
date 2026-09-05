insert into public.cms_pages(slug,name,title,settings,is_published) values
('shared','Shared UI','ZYVO','{}'::jsonb,true),
('configuracoes','Configurações','Configurações','{"body":"Este módulo já possui uma rota funcional dentro da estrutura do ZYVO APP. A experiência específica pode ser desenvolvida sobre esta base sem quebrar a Home.","backLabel":"Voltar ao início"}'::jsonb,true),
('agenda','Agenda','Agenda','{"body":"Este módulo já possui uma rota funcional dentro da estrutura do ZYVO APP. A experiência específica pode ser desenvolvida sobre esta base sem quebrar a Home.","backLabel":"Voltar ao início"}'::jsonb,true),
('planos','Planos e Preços','Planos e Preços','{"body":"Este módulo já possui uma rota funcional dentro da estrutura do ZYVO APP. A experiência específica pode ser desenvolvida sobre esta base sem quebrar a Home.","backLabel":"Voltar ao início"}'::jsonb,true),
('login','Acessar','Acessar','{"body":"Este módulo já possui uma rota funcional dentro da estrutura do ZYVO APP. A experiência específica pode ser desenvolvida sobre esta base sem quebrar a Home.","backLabel":"Voltar ao início"}'::jsonb,true),
('reuniao-instantanea','Criar reunião','Criar reunião','{"body":"Este módulo já possui uma rota funcional dentro da estrutura do ZYVO APP. A experiência específica pode ser desenvolvida sobre esta base sem quebrar a Home.","backLabel":"Voltar ao início"}'::jsonb,true),
('reunioes','Reuniões','Reuniões','{"body":"Este módulo já possui uma rota funcional dentro da estrutura do ZYVO APP. A experiência específica pode ser desenvolvida sobre esta base sem quebrar a Home.","backLabel":"Voltar ao início"}'::jsonb,true),
('minhas-anotacoes','Minhas anotações','Minhas anotações','{"body":"Este módulo já possui uma rota funcional dentro da estrutura do ZYVO APP. A experiência específica pode ser desenvolvida sobre esta base sem quebrar a Home.","backLabel":"Voltar ao início"}'::jsonb,true),
('criar-slides','Criar slides','Criar slides','{"body":"Este módulo já possui uma rota funcional dentro da estrutura do ZYVO APP. A experiência específica pode ser desenvolvida sobre esta base sem quebrar a Home.","backLabel":"Voltar ao início"}'::jsonb,true),
('gravacoes','Gravações recentes','Gravações recentes','{"body":"Este módulo já possui uma rota funcional dentro da estrutura do ZYVO APP. A experiência específica pode ser desenvolvida sobre esta base sem quebrar a Home.","backLabel":"Voltar ao início"}'::jsonb,true),
('contatos','Contatos','Contatos','{"body":"Este módulo já possui uma rota funcional dentro da estrutura do ZYVO APP. A experiência específica pode ser desenvolvida sobre esta base sem quebrar a Home.","backLabel":"Voltar ao início"}'::jsonb,true),
('notificacoes','Notificações','Notificações','{"body":"Este módulo já possui uma rota funcional dentro da estrutura do ZYVO APP. A experiência específica pode ser desenvolvida sobre esta base sem quebrar a Home.","backLabel":"Voltar ao início"}'::jsonb,true)
on conflict(slug) do update set name=excluded.name,title=excluded.title,settings=public.cms_pages.settings || excluded.settings,is_published=true;

insert into public.cms_sections(page_id,section_key,section_type,title,body,content,media,sort_order,is_visible)
select id,'shared.topbar','navigation','ZYVO',null,
'{"searchPlaceholder":"Buscar reuniões ou pessoas","homeLabel":"Início","skillsLabel":"Skills","agendaLabel":"Agenda","plansLabel":"Planos e preços","accessLabel":"Acessar"}'::jsonb,
'{}'::jsonb,0,true from public.cms_pages where slug='shared'
on conflict(page_id,section_key) do nothing;
