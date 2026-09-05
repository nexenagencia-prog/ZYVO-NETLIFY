'use client';

import Link from 'next/link';
import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { fetchPublicCmsBundle } from '@/lib/cms/client';
import { sectionByKey } from '@/lib/cms/merge';
import type { CmsBundle } from '@/lib/cms/types';

function Icon({ children, size = 18 }: { children: ReactNode; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cms,setCms]=useState<CmsBundle|null>(null);
  useEffect(()=>{fetchPublicCmsBundle().then(setCms).catch(()=>{})},[]);
  const shared=cms?.pages?.shared;
  const topbar=shared?sectionByKey(shared,'shared.topbar'):null;
  const content=(topbar?.content||{}) as Record<string,unknown>;
  const label=(key:string,fallback:string)=>typeof content[key]==='string'?String(content[key]):fallback;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (value) router.push(`/reunioes?q=${encodeURIComponent(value)}`);
  };
  const active = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return <header className="topbar">
    <Link href="/" className="wordmark" aria-label="ZYVO início">{topbar?.title || 'ZYVO'}</Link>
    <form className="search-box" onSubmit={submit}>
      <Icon><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></Icon>
      <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={label('searchPlaceholder','Buscar reuniões ou pessoas')} aria-label="Buscar reuniões ou pessoas" />
      <span className="shortcut">⌘ K</span>
    </form>
    <nav className="topnav" aria-label="Navegação principal">
      <Link className={active('/') ? 'active' : ''} href="/">{label('homeLabel','Início')}</Link>
      <Link className={active('/skills') ? 'active' : ''} href="/skills">{label('skillsLabel','Skills')}</Link>
      <Link className={active('/agenda') ? 'active' : ''} href="/agenda">{label('agendaLabel','Agenda')}</Link>
      <Link className={active('/planos') ? 'active' : ''} href="/planos">{label('plansLabel','Planos e preços')}</Link>
    </nav>
    <Link href="/login" className="access-button"><span>{label('accessLabel','Acessar')}</span><Icon><path d="M5 12h13M14 7l5 5-5 5"/></Icon></Link>
  </header>;
}
