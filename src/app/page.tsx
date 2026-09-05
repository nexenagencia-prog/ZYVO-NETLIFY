'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import hero0 from '@/lib/hero45-0';
import hero1 from '@/lib/hero45-1';
import hero2 from '@/lib/hero45-2';
import hero3 from '@/lib/hero45-3';
import hero4 from '@/lib/hero45-4';
import hero5 from '@/lib/hero45-5';
import { fetchPublicCmsBundle, publicMediaUrl } from '@/lib/cms/client';
import { DEFAULT_BUNDLE } from '@/lib/cms/defaults';
import { sectionByKey } from '@/lib/cms/merge';
import type { CmsBundle } from '@/lib/cms/types';
import styles from './faceScan.module.css';
import './reference-refinement.css';

const PROFILE_KEY = 'zyvo-profile';
const PROFILE_EVENT = 'zyvo-profile-updated';
const DEFAULT_NAME = 'Sandro Bello';
const hero4K = `data:image/avif;base64,${hero0}${hero1}${hero2}${hero3}${hero4}${hero5}`;

function Icon({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

const quickActionDefaults = [
  { label: 'Minhas anotações', href: '/minhas-anotacoes', icon: <><path d="M5 4h11a2 2 0 0 1 2 2v12H7a2 2 0 0 1-2-2V4Z"/><path d="M9 8h5M9 12h5M18 8l2-2"/></> },
  { label: 'Criar slides', href: '/criar-slides', icon: <><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 21h8M12 18v3"/></> },
  { label: 'Gravações recentes', href: '/gravacoes', icon: <path d="m8 5 11 7-11 7V5Z"/> },
  { label: 'Criar reunião', href: '/reuniao-instantanea', icon: <><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></> },
];

export default function HomePage() {
  const [profileName, setProfileName] = useState(DEFAULT_NAME);
  const [cms,setCms]=useState<CmsBundle>(DEFAULT_BUNDLE);

  useEffect(() => {
    let localProfile=false;
    const loadProfile = () => {
      try {
        const stored = localStorage.getItem(PROFILE_KEY);
        if (!stored) return;
        const profile = JSON.parse(stored) as { name?: string };
        if (profile.name?.trim()) { localProfile=true; setProfileName(profile.name.trim()); }
      } catch {}
    };
    const onProfileUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ name?: string }>).detail;
      if (detail?.name?.trim()) setProfileName(detail.name.trim()); else loadProfile();
    };
    loadProfile();
    fetchPublicCmsBundle().then(bundle=>{setCms(bundle);if(!localProfile && bundle.profile.display_name) setProfileName(bundle.profile.display_name)}).catch(()=>{});
    window.addEventListener(PROFILE_EVENT, onProfileUpdated);
    window.addEventListener('storage', loadProfile);
    return () => { window.removeEventListener(PROFILE_EVENT, onProfileUpdated); window.removeEventListener('storage', loadProfile); };
  }, []);

  const home=cms.pages.home;
  const hero=sectionByKey(home,'home.hero');
  const quick=sectionByKey(home,'home.quick_actions');
  const content=(hero.content||{}) as Record<string,unknown>;
  const media=(hero.media||{}) as Record<string,unknown>;
  const quickItems=Array.isArray((quick.content as Record<string,unknown>|undefined)?.items) ? ((quick.content as Record<string,unknown>).items as {label?:string;href?:string}[]) : [];
  const quickActions=quickActionDefaults.map((item,index)=>({...item,label:quickItems[index]?.label||item.label,href:quickItems[index]?.href||item.href}));
  const heroMedia=publicMediaUrl(media.heroMedia,hero4K);
  const greetingPrefix=typeof content.greetingPrefix==='string'?content.greetingPrefix:'Olá,';
  const primaryLabel=typeof content.primaryLabel==='string'?content.primaryLabel:'Criar reunião';
  const primaryHref=typeof content.primaryHref==='string'?content.primaryHref:'/reuniao-instantanea';
  const secondaryLabel=typeof content.secondaryLabel==='string'?content.secondaryLabel:'Entrar';
  const secondaryHref=typeof content.secondaryHref==='string'?content.secondaryHref:'/reunioes';
  const motto=typeof content.motto==='string'?content.motto:'CONECTE · EVOLUA · REALIZE MAIS';

  return <main className="home-shell">
    <Sidebar />
    <div className="hero-visual" aria-hidden="true"><img src={heroMedia} alt="" draggable={false} width={3840} height={2160} /></div>
    <div className={styles.nativeFaceScan} aria-hidden="true"><span className={styles.nativeLineGlow} /><span className={styles.nativeScanLine} /></div>
    <div className="hero-shade" aria-hidden="true" />
    <Topbar />
    <section className="hero-copy" aria-labelledby="home-title">
      {/* Default contract: Olá, <strong>{profileName}</strong> */}
      <p className="greeting">{greetingPrefix} <strong>{profileName}</strong></p>
      <p className="eyebrow">{hero.subtitle || 'TECNOLOGIA QUE TRANSFORMA'}</p>
      <h1 id="home-title">{(hero.title || 'Reuniões com Performance Pro').split(' ').slice(0,2).join(' ')}<br/><span>{(hero.title || 'Reuniões com Performance Pro').split(' ').slice(2).join(' ')}</span></h1>
      <p className="lead">{hero.body || 'Ferramentas inteligentes para reuniões mais produtivas, análises precisas e resultados que fazem a diferença.'}</p>
      <div className="hero-actions">
        <Link className="primary-action" href={primaryHref}><Icon size={20}><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></Icon><span>{primaryLabel}</span><span className="plus">+</span></Link>
        <Link className="secondary-action" href={secondaryHref}><Icon size={20}><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/></Icon><span>{secondaryLabel}</span></Link>
      </div>
      <div className="quick-actions" aria-label="Ações rápidas">{quickActions.map((item)=><Link key={item.href} href={item.href} className="quick-action"><Icon size={22}>{item.icon}</Icon><span>{item.label}</span></Link>)}</div>
      <p className="motto">{motto}</p>
    </section>
  </main>;
}
