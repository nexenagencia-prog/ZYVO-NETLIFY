'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import heroRef from '@/lib/skills-ref-hero';
import insightsRef from '@/lib/skills-ref-insights';
import meetingRef from '@/lib/skills-ref-meeting';
import analysisRef from '@/lib/skills-ref-analysis';
import { fetchPublicCmsBundle, publicMediaUrl } from '@/lib/cms/client';
import { DEFAULT_BUNDLE } from '@/lib/cms/defaults';
import { sectionByKey } from '@/lib/cms/merge';
import type { CmsBundle } from '@/lib/cms/types';
import styles from './skills.module.css';

const FALLBACK_METRICS=[['Comunicação',88],['Clareza',91],['Escuta',84],['Objetividade',76],['Perguntas',89],['Condução',85]] as const;
const FALLBACK_COPY={performance:'Seu desempenho',eyebrow:'PERFORMANCE HUMANA',insights:'INSIGHTS REAIS',insightTitle:'Insights e Conteúdo',meetingTitle:'Analisar Reuniões',analysisTitle:'Analise suas reuniões',capture:'CAPTURE. ANALISE. EVOLUA.'};
function MetricRing({label,target,index}:{label:string;target:number;index:number}){const[value,setValue]=useState(0);useEffect(()=>{let raf=0;const started=performance.now()+index*55,duration=1200;const tick=(now:number)=>{const p=Math.max(0,Math.min(1,(now-started)/duration));setValue(Math.round(target*(1-Math.pow(1-p,3))));if(p<1)raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[target,index]);return <div className={styles.metric}><div className={styles.metricRing} style={{'--value':`${value*3.6}deg`} as React.CSSProperties}><strong>{value}</strong></div><span>{label}</span></div>}

export default function SkillsPage(){
  const[score,setScore]=useState(0);
  const[cms,setCms]=useState<CmsBundle>(DEFAULT_BUNDLE);
  useEffect(()=>{let raf=0;const start=performance.now();const tick=(now:number)=>{const p=Math.min(1,(now-start)/1300);setScore(Math.round(82*(1-Math.pow(1-p,3))));if(p<1)raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);fetchPublicCmsBundle().then(bundle=>setCms(bundle)).catch(()=>{});return()=>cancelAnimationFrame(raf)},[]);

  const page=cms.pages.skills;
  const hero=sectionByKey(page,'skills.hero');
  const performanceSection=sectionByKey(page,'skills.performance');
  const insight=sectionByKey(page,'skills.insights');
  const meeting=sectionByKey(page,'skills.meeting');
  const analysis=sectionByKey(page,'skills.analysis');
  const heroContent=(hero.content||{}) as Record<string,unknown>;
  const performanceContent=(performanceSection.content||{}) as Record<string,unknown>;
  const analysisContent=(analysis.content||{}) as Record<string,unknown>;
  const metricRows=Array.isArray(performanceContent.metrics)?performanceContent.metrics as {label?:string;value?:number}[]:FALLBACK_METRICS.map(([label,value])=>({label,value}));
  const targetScore=typeof performanceContent.score==='number'?performanceContent.score:82;
  const delta=typeof performanceContent.delta==='string'?performanceContent.delta:'+6,4%';
  const periodLabel=typeof performanceContent.periodLabel==='string'?performanceContent.periodLabel:'em relação ao período anterior';
  const actionLabel=typeof performanceContent.actionLabel==='string'?performanceContent.actionLabel:'Analisar performance';
  const heroMedia=publicMediaUrl((hero.media as Record<string,unknown>|undefined)?.heroMedia,heroRef);
  const insightMedia=publicMediaUrl((insight.media as Record<string,unknown>|undefined)?.backgroundMedia,insightsRef);
  const meetingMedia=publicMediaUrl((meeting.media as Record<string,unknown>|undefined)?.backgroundMedia,meetingRef);
  const analysisMedia=publicMediaUrl((analysis.media as Record<string,unknown>|undefined)?.backgroundMedia,analysisRef);
  const displayedScore=Math.round(score*(targetScore/82));
  const captureTitle=(typeof analysisContent.captureTitle==='string'?analysisContent.captureTitle:FALLBACK_COPY.capture).replaceAll(' ','\n');

  return <main className={styles.page} style={{paddingLeft:'94px'}}>
  <Sidebar />
  <header className={styles.skillsHeader}>
    <h1>Skills</h1>
    <div className={styles.search}><span>⌕</span><p>Buscar reunião, pessoa ou gravação</p><kbd>⌘ K</kbd></div>
    <div className={styles.account}><button><span>♛</span> {cms.profile.plan_label || 'Plano Pro'} <b>⌄</b></button><div className={styles.avatar}>{cms.profile.avatar_url?<img src={cms.profile.avatar_url} alt="Perfil" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>:<i/>}<em/></div></div>
  </header>
  <section className={styles.board}>
    <article className={`${styles.card} ${styles.heroCard}`}><div className={styles.heroMedia} style={{backgroundImage:`url(${heroMedia})`}}/><div className={styles.heroShade}/><div className={styles.heroTop}><p>{hero.subtitle || FALLBACK_COPY.eyebrow}</p><h2>{hero.title || 'Skills'}</h2><h3>{hero.body || 'Inteligência que transforma suas reuniões em resultados.'}</h3></div><div className={styles.heroBottom}><i/><p>{typeof heroContent.insightsLabel==='string'?heroContent.insightsLabel:FALLBACK_COPY.insights}</p><strong>{typeof heroContent.insightsTitle==='string'?heroContent.insightsTitle:'Mais que reuniões. Evolução.'}</strong><button><span>▷</span>{typeof heroContent.ctaLabel==='string'?heroContent.ctaLabel:'Explorar agora'}</button></div></article>

    <article className={`${styles.card} ${styles.performanceCard}`}><header><h3>{performanceSection.title || FALLBACK_COPY.performance}</h3><button>{actionLabel} <b>›</b></button></header><div className={styles.performanceMain}><div className={styles.scoreRing} style={{'--score':`${displayedScore*3.6}deg`} as React.CSSProperties}><div><strong>{displayedScore}</strong><span>/100</span></div></div><div className={styles.trend}><div className={styles.delta}>↑ <strong>{delta}</strong><small>{periodLabel}</small></div><svg viewBox="0 0 320 100" preserveAspectRatio="none"><defs><linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9dd5ff" stopOpacity=".3"/><stop offset="1" stopColor="#9dd5ff" stopOpacity="0"/></linearGradient></defs><path className={styles.area} d="M0 78 C34 76 46 46 80 47 S121 82 160 70 S196 30 232 33 S270 48 320 42 L320 100 L0 100Z"/><path className={styles.line} d="M0 78 C34 76 46 46 80 47 S121 82 160 70 S196 30 232 33 S270 48 320 42"/><circle cx="320" cy="42" r="4"/></svg></div></div><div className={styles.metrics}>{metricRows.slice(0,6).map((item,i)=><MetricRing key={`${item.label}-${i}`} label={item.label||FALLBACK_METRICS[i]?.[0]||'Métrica'} target={typeof item.value==='number'?item.value:FALLBACK_METRICS[i]?.[1]||0} index={i}/>)}</div></article>

    <div className={styles.sideCards}><article className={`${styles.card} ${styles.insightCard}`}><div className={`${styles.cardMedia} ${styles.insightMedia}`} style={{backgroundImage:`url(${insightMedia})`}}/><div className={styles.cardShade}/><div className={styles.sideContent}><span className={styles.bookIcon}>▢</span><h3>{insight.title || FALLBACK_COPY.insightTitle}</h3><p>{insight.body || 'Artigos e guias sobre IA, comunicação e produtividade.'}</p><button>→</button></div></article><article className={`${styles.card} ${styles.meetingCard}`}><div className={`${styles.cardMedia} ${styles.meetingMedia}`} style={{backgroundImage:`url(${meetingMedia})`}}/><div className={styles.cardShade}/><div className={styles.sideContent}><span className={styles.bookIcon}>▣</span><h3>{meeting.title || FALLBACK_COPY.meetingTitle}</h3><p>{meeting.body || 'Reviva conversas, identifique pontos-chave e gere insights.'}</p><button>→</button></div></article></div>

    <article className={`${styles.card} ${styles.analysisCard}`}><img src={analysisMedia} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain',objectPosition:'center center',zIndex:0,pointerEvents:'none'}}/><div aria-hidden="true" style={{position:'absolute',inset:0,zIndex:1,pointerEvents:'none',background:'linear-gradient(90deg,rgba(7,26,42,.94) 0%,rgba(7,26,42,.72) 31%,rgba(7,26,42,.10) 58%,rgba(7,26,42,.54) 78%,rgba(7,26,42,.88) 100%)'}}/><div className={styles.analysisCopy} style={{position:'relative',zIndex:2}}><div className={styles.cameraIcon}>▣</div><div><h3>{analysis.title || FALLBACK_COPY.analysisTitle}</h3><p>{analysis.body || 'Envie sua gravação e receba uma análise completa com insights de performance.'}</p><button><b>↥</b>{typeof analysisContent.buttonLabel==='string'?analysisContent.buttonLabel:'Selecionar arquivo'}</button><small>{typeof analysisContent.fileHint==='string'?analysisContent.fileHint:'MP4, MOV ou WEBM'}</small></div></div><div/><div className={styles.capture}><p>{captureTitle.split('\n').map((line,index)=><span key={`${line}-${index}`}>{line}{index<captureTitle.split('\n').length-1?<br/>:null}</span>)}</p><i/><span>{typeof analysisContent.captureBody==='string'?analysisContent.captureBody:'Do seu smartphone para insights reais.'}</span></div></article>
  </section>
</main>}
