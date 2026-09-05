import type { CmsBundle } from './types';

export const DEFAULT_NAVIGATION = [
  { nav_key:'home', label:'Início', href:'/', icon_key:'home', sort_order:0, is_visible:true },
  { nav_key:'new-meeting', label:'Criar reunião', href:'/reuniao-instantanea', icon_key:'video', sort_order:10, is_visible:true },
  { nav_key:'agenda', label:'Agenda', href:'/agenda', icon_key:'calendar', sort_order:20, is_visible:true },
  { nav_key:'contacts', label:'Contatos', href:'/contatos', icon_key:'contacts', sort_order:30, is_visible:true },
  { nav_key:'notes', label:'Minhas anotações', href:'/minhas-anotacoes', icon_key:'notes', sort_order:40, is_visible:true },
  { nav_key:'settings', label:'Configurações', href:'/configuracoes', icon_key:'settings', sort_order:50, is_visible:true },
  { nav_key:'notifications', label:'Notificações', href:'/notificacoes', icon_key:'notifications', sort_order:60, is_visible:true },
  { nav_key:'skills', label:'Skills', href:'/skills', icon_key:'skills', sort_order:70, is_visible:true },
] as const;

export const DEFAULT_PROFILE = {
  display_name:'Sandro Bello',
  role_label:'Marketing Digital',
  plan_label:'Plano Pro',
  avatar_url:'',
};

export const DEFAULT_HOME = {
  slug:'home',
  name:'Home',
  title:'Reuniões com Performance Pro',
  settings:{},
  is_published:true,
  sections:[
    { section_key:'home.hero', section_type:'hero', title:'Reuniões com Performance Pro', subtitle:'TECNOLOGIA QUE TRANSFORMA', body:'Ferramentas inteligentes para reuniões mais produtivas, análises precisas e resultados que fazem a diferença.', content:{ greetingPrefix:'Olá,', primaryLabel:'Criar reunião', primaryHref:'/reuniao-instantanea', secondaryLabel:'Entrar', secondaryHref:'/reunioes', motto:'CONECTE · EVOLUA · REALIZE MAIS' }, media:{ heroMedia:null }, sort_order:0, is_visible:true },
    { section_key:'home.quick_actions', section_type:'actions', title:'Ações rápidas', content:{ items:[{label:'Minhas anotações',href:'/minhas-anotacoes'},{label:'Criar slides',href:'/criar-slides'},{label:'Gravações recentes',href:'/gravacoes'},{label:'Criar reunião',href:'/reuniao-instantanea'}] }, media:{}, sort_order:10, is_visible:true },
  ],
};

export const SKILLS_ANALYSIS_KEY = 'skills.analysis';
export const DEFAULT_SKILLS = {
  slug:'skills',
  name:'Skills',
  title:'Skills',
  settings:{},
  is_published:true,
  sections:[
    { section_key:'skills.hero', section_type:'hero', title:'Skills', subtitle:'PERFORMANCE HUMANA', body:'Inteligência que transforma suas reuniões em resultados.', content:{ insightsLabel:'INSIGHTS REAIS', insightsTitle:'Mais que reuniões. Evolução.', ctaLabel:'Explorar agora' }, media:{ heroMedia:null }, sort_order:0, is_visible:true },
    { section_key:'skills.performance', section_type:'metrics', title:'Seu desempenho', content:{ score:82, delta:'+6,4%', periodLabel:'em relação ao período anterior', actionLabel:'Analisar performance', metrics:[{label:'Comunicação',value:88},{label:'Clareza',value:91},{label:'Escuta',value:84},{label:'Objetividade',value:76},{label:'Perguntas',value:89},{label:'Condução',value:85}] }, media:{}, sort_order:10, is_visible:true },
    { section_key:'skills.insights', section_type:'card', title:'Insights e Conteúdo', body:'Artigos e guias sobre IA, comunicação e produtividade.', content:{buttonLabel:'→'}, media:{backgroundMedia:null}, sort_order:20, is_visible:true },
    { section_key:'skills.meeting', section_type:'card', title:'Analisar Reuniões', body:'Reviva conversas, identifique pontos-chave e gere insights.', content:{buttonLabel:'→'}, media:{backgroundMedia:null}, sort_order:30, is_visible:true },
    { section_key:SKILLS_ANALYSIS_KEY, section_type:'upload', title:'Analise suas reuniões', body:'Envie sua gravação e receba uma análise completa com insights de performance.', content:{buttonLabel:'Selecionar arquivo',fileHint:'MP4, MOV ou WEBM',captureTitle:'CAPTURE. ANALISE. EVOLUA.',captureBody:'Do seu smartphone para insights reais.'}, media:{backgroundMedia:'/skills-analysis-phone.webp'}, sort_order:40, is_visible:true },
  ],
};

export const DEFAULT_BUNDLE: CmsBundle = {
  pages:{home:DEFAULT_HOME,skills:DEFAULT_SKILLS},
  navigation:DEFAULT_NAVIGATION.map(item=>({...item})),
  profile:{...DEFAULT_PROFILE},
  media:[],
};
