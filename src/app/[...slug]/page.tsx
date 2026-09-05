import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

const labels: Record<string,string> = {
  'configuracoes':'Configurações','skills':'Skills','agenda':'Agenda','planos':'Planos e Preços','login':'Acessar','reuniao-instantanea':'Criar reunião','reunioes':'Reuniões','minhas-anotacoes':'Minhas anotações','criar-slides':'Criar slides','gravacoes':'Gravações recentes','contatos':'Contatos','notificacoes':'Notificações'
};

export default async function FeaturePage({ params }:{ params:Promise<{slug:string[]}> }){
  const {slug}=await params;
  const key=slug.join('/');
  const title=labels[key] ?? slug.map(s=>s.replaceAll('-',' ')).join(' / ');
  return <main style={{minHeight:'100dvh',background:'radial-gradient(circle at 60% 20%,#15293c 0,#07111d 38%,#02070d 75%)',color:'#fff',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
    <Sidebar />
    <Topbar />
    <div style={{minHeight:'100dvh',display:'grid',placeItems:'center',padding:'112px 32px 32px 104px'}}>
      <section style={{width:'min(720px,92vw)',padding:'42px 44px',border:'1px solid rgba(255,255,255,.1)',borderRadius:28,background:'rgba(7,17,29,.78)',boxShadow:'0 30px 90px rgba(0,0,0,.4)',backdropFilter:'blur(22px)'}}>
        <div style={{fontSize:13,letterSpacing:'.28em',opacity:.58,marginBottom:22}}>ZYVO</div>
        <h1 style={{fontSize:'clamp(34px,5vw,62px)',fontWeight:420,letterSpacing:'-.04em',margin:'0 0 16px',textTransform:'capitalize'}}>{title}</h1>
        <p style={{fontSize:17,lineHeight:1.6,opacity:.68,margin:'0 0 30px'}}>Este módulo já possui uma rota funcional dentro da estrutura do ZYVO APP. A experiência específica pode ser desenvolvida sobre esta base sem quebrar a Home.</p>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',padding:'13px 22px',borderRadius:999,background:'#fff',color:'#07111d',fontWeight:650}}>Voltar ao início</Link>
      </section>
    </div>
  </main>;
}
