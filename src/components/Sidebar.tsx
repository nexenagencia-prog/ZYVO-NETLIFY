'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';
import styles from './Sidebar.module.css';

const PROFILE_KEY = 'zyvo-profile';
const PROFILE_EVENT = 'zyvo-profile-updated';
const DEFAULT_NAME = 'Sandro Bello';

function RailIcon({ children }: { children: ReactNode }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

const items = [
  { label: 'Início', href: '/', icon: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></> },
  { label: 'Criar reunião', href: '/reuniao-instantanea', icon: <><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></> },
  { label: 'Agenda', href: '/agenda', icon: <><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M8 14h2M14 14h2"/></> },
  { label: 'Contatos', href: '/contatos', icon: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-4 2.5-6 6-6s6 2 6 6M14 15c3.7 0 6 1.5 6 5"/></> },
  { label: 'Minhas anotações', href: '/minhas-anotacoes', icon: <><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 12h6M9 16h6"/></> },
  { label: 'Configurações', href: '/configuracoes', icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.8 2.8-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1 1.6V21h-4v-.1a1.8 1.8 0 0 0-1-1.6 1.8 1.8 0 0 0-2 .4l-.1.1-2.8-2.8.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.6-1H3v-4h.1a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0-.4-2l-.1-.1L7 4l.1.1a1.8 1.8 0 0 0 2 .4 1.8 1.8 0 0 0 1-1.6V3h4v.1a1.8 1.8 0 0 0 1 1.6 1.8 1.8 0 0 0 2-.4l.1-.1L20 7l-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.6 1h.1v4h-.1a1.8 1.8 0 0 0-1.7.9Z"/></> },
  { label: 'Notificações', href: '/notificacoes', icon: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></> },
  { label: 'Skills', href: '/skills', icon: <><path d="M12 3 4 8v8l8 5 8-5V8z"/><path d="m8 10 4 3 4-3"/></> },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profileName, setProfileName] = useState(DEFAULT_NAME);
  const [profileImage, setProfileImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) {
        const profile = JSON.parse(stored) as { name?: string; image?: string };
        if (profile.name) setProfileName(profile.name);
        if (profile.image) setProfileImage(profile.image);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const persistProfile = (name: string, image: string) => {
    const next = { name, image };
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)); } catch {}
    window.dispatchEvent(new CustomEvent(PROFILE_EVENT, { detail: next }));
  };

  const updateName = (value: string) => { setProfileName(value); persistProfile(value || DEFAULT_NAME, profileImage); };
  const updatePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      setProfileImage(reader.result);
      persistProfile(profileName || DEFAULT_NAME, reader.result);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const initials = (profileName || DEFAULT_NAME).split(' ').filter(Boolean).slice(0,2).map((part)=>part[0]?.toUpperCase()).join('');
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return <aside className={`rail ${styles.unifiedRail} ${open ? styles.expanded : ''}`} aria-label="Navegação lateral">
    <div className={styles.profileRow}>
      <div className={styles.profileVisual}>
        <button className="rail-avatar" type="button" aria-label="Alterar foto do perfil" onClick={() => open ? fileInputRef.current?.click() : setOpen(true)}>
          {profileImage ? <img src={profileImage} alt="Perfil" /> : <span className="avatar-monogram">{initials}</span>}
          <span className="status-dot" aria-hidden="true" />
        </button>
        <div className={styles.performanceMiniTrack} aria-label="Performance 82 de 100"><span style={{width:'82%'}} /></div>
      </div>
      <input ref={fileInputRef} className={styles.fileInput} type="file" accept="image/*" onChange={updatePhoto} tabIndex={-1} />
      <div className={styles.profileMeta} aria-hidden={!open}>
        <input className={styles.profileNameField} value={profileName} onChange={(event)=>updateName(event.target.value)} onBlur={()=>{if(!profileName.trim()) updateName(DEFAULT_NAME)}} aria-label="Nome do perfil" maxLength={42} tabIndex={open?0:-1}/>
        <span className={styles.profileRole}>Marketing Digital</span>
      </div>
    </div>
    <nav className={styles.nav} aria-label="Menu principal">
      {items.map((item)=><Link key={item.href} href={item.href} className={`${styles.navItem} ${isActive(item.href) ? styles.selected : ''}`} aria-current={isActive(item.href)?'page':undefined} aria-label={item.label} title={open?undefined:item.label}><span className={styles.itemIcon}><RailIcon>{item.icon}</RailIcon></span><span className={styles.itemLabel}>{item.label}</span></Link>)}
    </nav>
    <div className={styles.bottomControl}>
      <button className={styles.toggleButton} type="button" onClick={()=>setOpen((value)=>!value)} aria-label={open ? 'Recolher menu' : 'Expandir menu'} aria-expanded={open}>
        <RailIcon><path d="m9 7 5 5-5 5"/></RailIcon>
      </button>
    </div>
  </aside>;
}
