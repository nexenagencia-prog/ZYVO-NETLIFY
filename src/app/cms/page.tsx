'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, getStoredSession, signInWithPassword, signOutCms, type CmsSession } from '@/lib/cms/auth';
import { fetchAdminCmsBundle, isCmsAdmin, updateNavigation, updatePage, updateProfile, updateSection, uploadCmsMedia } from '@/lib/cms/admin';
import type { CmsBundle, CmsNavigationItem, CmsPage, CmsProfile, CmsSection, JsonMap } from '@/lib/cms/types';
import styles from './cms.module.css';

// Authorization is enforced by RLS and the public.cms_admins allow-list. Media uploads use the cms-media bucket.
const tabs=['Dashboard','Home','Skills','Páginas','Menu','Perfil','Mídia'] as const;
type Tab=typeof tabs[number];
const clone=<T,>(value:T):T=>JSON.parse(JSON.stringify(value));
const asMap=(value:unknown):JsonMap=>value && typeof value==='object' && !Array.isArray(value)?value as JsonMap:{};

export default function CmsPage(){
  const[session,setSession]=useState<CmsSession|null>(null);
  const[authorized,setAuthorized]=useState<boolean|null>(null);
  const[data,setData]=useState<CmsBundle|null>(null);
  const[tab,setTab]=useState<Tab>('Dashboard');
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[busy,setBusy]=useState(false);
  const[message,setMessage]=useState('');
  const[error,setError]=useState('');

  const load=async(token:string)=>{const bundle=await fetchAdminCmsBundle(token);setData(clone(bundle));};
  useEffect(()=>{const stored=getStoredSession();if(!stored){setAuthorized(false);return;}setSession(stored);(async()=>{try{const user=await getCurrentUser(stored.access_token);if(!user){await signOutCms(stored);setSession(null);setAuthorized(false);return;}const ok=await isCmsAdmin(stored.access_token);setAuthorized(ok);if(ok)await load(stored.access_token);}catch{setAuthorized(false)}})()},[]);

  const login=async(event:FormEvent)=>{event.preventDefault();setBusy(true);setError('');try{const next=await signInWithPassword(email.trim(),password);const ok=await isCmsAdmin(next.access_token);if(!ok){await signOutCms(next);throw new Error('Este usuário não está autorizado em cms_admins.');}setSession(next);setAuthorized(true);await load(next.access_token);}catch(e){setError(e instanceof Error?e.message:'Falha ao entrar.')}finally{setBusy(false)}};
  const logout=async()=>{await signOutCms(session);setSession(null);setData(null);setAuthorized(false);setPassword('');};
  const notify=(text:string)=>{setMessage(text);setError('');window.setTimeout(()=>setMessage(''),2200)};
  const fail=(e:unknown)=>{setError(e instanceof Error?e.message:'Não foi possível salvar.');setMessage('')};

  if(authorized===null) return <main className={styles.center}><div className={styles.loader}>Carregando CMS…</div></main>;
  if(!session || !authorized) return <main className={styles.loginShell}><section className={styles.loginCard}><div className={styles.brand}>ZYVO <span>CMS</span></div><h1>Gerencie todo o conteúdo.</h1><p>Entre com seu e-mail e senha de administrador Supabase.</p><form onSubmit={login}><label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/></label><label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label>{error&&<div className={styles.error}>{error}</div>}<button disabled={busy}>{busy?'Entrando…':'Entrar no CMS'}</button></form></section></main>;
  if(!data) return <main className={styles.center}><div className={styles.loader}>Carregando conteúdo…</div></main>;

  const saveSection=async(section:CmsSection)=>{setBusy(true);try{await updateSection(session.access_token,section);notify('Alteração salva.');await load(session.access_token)}catch(e){fail(e)}finally{setBusy(false)}};
  const savePage=async(page:CmsPage)=>{setBusy(true);try{await updatePage(session.access_token,page);notify('Página salva.');await load(session.access_token)}catch(e){fail(e)}finally{setBusy(false)}};
  const saveNav=async(item:CmsNavigationItem)=>{setBusy(true);try{await updateNavigation(session.access_token,item);notify('Menu salvo.');await load(session.access_token)}catch(e){fail(e)}finally{setBusy(false)}};
  const saveProfileData=async(profile:CmsProfile)=>{setBusy(true);try{await updateProfile(session.access_token,profile);notify('Perfil salvo.');await load(session.access_token)}catch(e){fail(e)}finally{setBusy(false)}};

  const patchSection=(slug:string,id:string,patch:Partial<CmsSection>)=>setData(prev=>{if(!prev)return prev;const next=clone(prev);const section=next.pages[slug]?.sections.find(s=>s.id===id);if(section)Object.assign(section,patch);return next});
  const patchPage=(slug:string,patch:Partial<CmsPage>)=>setData(prev=>{if(!prev)return prev;const next=clone(prev);if(next.pages[slug])Object.assign(next.pages[slug],patch);return next});
  const patchNav=(id:string,patch:Partial<CmsNavigationItem>)=>setData(prev=>{if(!prev)return prev;const next=clone(prev);const item=next.navigation.find(n=>n.id===id);if(item)Object.assign(item,patch);return next});
  const patchProfile=(patch:Partial<CmsProfile>)=>setData(prev=>{if(!prev)return prev;const next=clone(prev);Object.assign(next.profile,patch);return next});

  const uploadForSection=async(event:ChangeEvent<HTMLInputElement>,slug:string,section:CmsSection,key:string)=>{const file=event.target.files?.[0];event.target.value='';if(!file)return;setBusy(true);try{const asset=await uploadCmsMedia(session.access_token,file,slug);const next={...section,media:{...asMap(section.media),[key]:asset.public_url||''}};patchSection(slug,section.id!,{media:next.media});await updateSection(session.access_token,next);notify('Imagem enviada e aplicada.');await load(session.access_token)}catch(e){fail(e)}finally{setBusy(false)}};
  const uploadProfileImage=async(event:ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];event.target.value='';if(!file)return;setBusy(true);try{const asset=await uploadCmsMedia(session.access_token,file,'profile');const next={...data.profile,avatar_media_id:asset.id,avatar_url:asset.public_url||''};patchProfile(next);await updateProfile(session.access_token,next);notify('Foto de perfil atualizada.');await load(session.access_token)}catch(e){fail(e)}finally{setBusy(false)}};

  return <main className={styles.shell}>
    <aside className={styles.sidebar}><div className={styles.logo}>ZYVO <span>CMS</span></div><nav>{tabs.map(item=><button key={item} onClick={()=>setTab(item)} className={tab===item?styles.active:''}>{item}</button>)}</nav><button className={styles.logout} onClick={logout}>Sair</button></aside>
    <section className={styles.workspace}>
      <header><div><span>CMS / {tab}</span><h1>{tab}</h1></div><div className={styles.headerRight}><span>{session.user.email}</span><a href="/" target="_blank">Ver site ↗</a></div></header>
      {message&&<div className={styles.toast}>{message}</div>}{error&&<div className={`${styles.toast} ${styles.toastError}`}>{error}</div>}
      {tab==='Dashboard'&&<Dashboard data={data}/>} 
      {tab==='Home'&&<PageEditor slug="home" page={data.pages.home} patchSection={patchSection} saveSection={saveSection} upload={uploadForSection}/>} 
      {tab==='Skills'&&<PageEditor slug="skills" page={data.pages.skills} patchSection={patchSection} saveSection={saveSection} upload={uploadForSection}/>} 
      {tab==='Páginas'&&<PagesEditor pages={data.pages} patchPage={patchPage} savePage={savePage}/>} 
      {tab==='Menu'&&<MenuEditor items={data.navigation} patch={patchNav} save={saveNav}/>} 
      {tab==='Perfil'&&<ProfileEditor profile={data.profile} patch={patchProfile} save={saveProfileData} upload={uploadProfileImage}/>} 
      {tab==='Mídia'&&<MediaLibrary data={data}/>} 
      {busy&&<div className={styles.busy}>Salvando…</div>}
    </section>
  </main>;
}

function Dashboard({data}:{data:CmsBundle}){const stats=[['Páginas',Object.keys(data.pages).length],['Blocos',Object.values(data.pages).reduce((n,p)=>n+p.sections.length,0)],['Menu',data.navigation.length],['Mídia',data.media.length]];return <div className={styles.dashboard}><div className={styles.hero}><span>CONTROLE EDITORIAL</span><h2>Todo o ZYVO editável<br/>em um só lugar.</h2><p>Textos, títulos, menu, perfil e imagens são publicados diretamente pelo Supabase, sem alterar o layout do produto.</p></div><div className={styles.stats}>{stats.map(([label,value])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></div>}

function PageEditor({slug,page,patchSection,saveSection,upload}:{slug:string;page?:CmsPage;patchSection:(slug:string,id:string,patch:Partial<CmsSection>)=>void;saveSection:(section:CmsSection)=>Promise<void>;upload:(e:ChangeEvent<HTMLInputElement>,slug:string,section:CmsSection,key:string)=>Promise<void>}){if(!page)return <div className={styles.empty}>Página ainda não cadastrada.</div>;return <div className={styles.stack}>{page.sections.map(section=><SectionEditor key={section.id||section.section_key} slug={slug} section={section} patch={patchSection} save={saveSection} upload={upload}/>)}</div>}

function SectionEditor({slug,section,patch,save,upload}:{slug:string;section:CmsSection;patch:(slug:string,id:string,patch:Partial<CmsSection>)=>void;save:(section:CmsSection)=>Promise<void>;upload:(e:ChangeEvent<HTMLInputElement>,slug:string,section:CmsSection,key:string)=>Promise<void>}){
  const id=section.id||'';const content=asMap(section.content);const media=asMap(section.media);const mediaKeys=Object.keys(media).length?Object.keys(media):section.section_type==='hero'?['heroMedia']:['backgroundMedia'];
  const updateContent=(key:string,value:unknown)=>patch(slug,id,{content:{...content,[key]:value}});
  return <article className={styles.editorCard}><div className={styles.cardHead}><div><small>{section.section_key}</small><h2>{section.title||section.section_type}</h2></div><label className={styles.toggle}><input type="checkbox" checked={section.is_visible!==false} onChange={e=>patch(slug,id,{is_visible:e.target.checked})}/><span>Visível</span></label></div><div className={styles.formGrid}><Field label="Título" value={section.title||''} onChange={value=>patch(slug,id,{title:value})}/><Field label="Subtítulo" value={section.subtitle||''} onChange={value=>patch(slug,id,{subtitle:value})}/><label className={styles.wide}>Texto<textarea value={section.body||''} onChange={e=>patch(slug,id,{body:e.target.value})}/></label>{Object.entries(content).map(([key,value])=><ContentField key={key} label={humanize(key)} value={value} onChange={next=>updateContent(key,next)}/>)}</div><div className={styles.mediaRow}>{mediaKeys.map(key=><label className={styles.uploader} key={key}>{typeof media[key]==='string'&&media[key]?<img src={String(media[key])} alt=""/>:<div className={styles.mediaPlaceholder}>Imagem</div>}<span>Trocar {humanize(key)}</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>upload(e,slug,section,key)}/></label>)}</div><div className={styles.actions}><button onClick={()=>save(section)}>Salvar bloco</button></div></article>
}

function ContentField({label,value,onChange}:{label:string;value:unknown;onChange:(value:unknown)=>void}){
  if(Array.isArray(value)) return <div className={styles.wide}><span className={styles.fieldTitle}>{label}</span><div className={styles.arrayEditor}>{value.map((item,index)=>{const row=asMap(item);return <div className={styles.arrayRow} key={index}>{Object.entries(row).map(([key,val])=><label key={key}>{humanize(key)}<input type={typeof val==='number'?'number':'text'} value={String(val??'')} onChange={e=>{const next=clone(value);(next[index] as JsonMap)[key]=typeof val==='number'?Number(e.target.value):e.target.value;onChange(next)}}/></label>)}</div>})}</div></div>;
  if(typeof value==='boolean') return <label className={styles.toggleField}><input type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)}/>{label}</label>;
  return <Field label={label} value={value==null?'':String(value)} type={typeof value==='number'?'number':'text'} onChange={next=>onChange(typeof value==='number'?Number(next):next)}/>;
}

function PagesEditor({pages,patchPage,savePage}:{pages:Record<string,CmsPage>;patchPage:(slug:string,patch:Partial<CmsPage>)=>void;savePage:(page:CmsPage)=>Promise<void>}){const list=useMemo(()=>Object.values(pages).filter(p=>!['home','skills'].includes(p.slug)).sort((a,b)=>(a.name||a.slug).localeCompare(b.name||b.slug)),[pages]);return <div className={styles.stack}>{list.map(page=>{const settings=asMap(page.settings);return <article className={styles.editorCard} key={page.slug}><div className={styles.cardHead}><div><small>/{page.slug}</small><h2>{page.name}</h2></div><label className={styles.toggle}><input type="checkbox" checked={page.is_published!==false} onChange={e=>patchPage(page.slug,{is_published:e.target.checked})}/><span>Publicada</span></label></div><div className={styles.formGrid}><Field label="Nome no CMS" value={page.name||''} onChange={value=>patchPage(page.slug,{name:value})}/><Field label="Título da página" value={page.title||''} onChange={value=>patchPage(page.slug,{title:value})}/>{Object.entries(settings).map(([key,value])=><Field key={key} label={humanize(key)} value={String(value??'')} onChange={next=>patchPage(page.slug,{settings:{...settings,[key]:next}})}/>)}</div><div className={styles.actions}><button onClick={()=>savePage(page)}>Salvar página</button></div></article>})}</div>}

function MenuEditor({items,patch,save}:{items:CmsNavigationItem[];patch:(id:string,patch:Partial<CmsNavigationItem>)=>void;save:(item:CmsNavigationItem)=>Promise<void>}){return <div className={styles.stack}>{items.map(item=><article className={`${styles.editorCard} ${styles.menuRow}`} key={item.id||item.nav_key}><Field label="Nome" value={item.label} onChange={value=>patch(item.id!,{label:value})}/><Field label="Link" value={item.href} onChange={value=>patch(item.id!,{href:value})}/><Field label="Ordem" type="number" value={String(item.sort_order)} onChange={value=>patch(item.id!,{sort_order:Number(value)})}/><label className={styles.toggle}><input type="checkbox" checked={item.is_visible} onChange={e=>patch(item.id!,{is_visible:e.target.checked})}/><span>Visível</span></label><button onClick={()=>save(item)}>Salvar</button></article>)}</div>}

function ProfileEditor({profile,patch,save,upload}:{profile:CmsProfile;patch:(patch:Partial<CmsProfile>)=>void;save:(profile:CmsProfile)=>Promise<void>;upload:(e:ChangeEvent<HTMLInputElement>)=>Promise<void>}){return <article className={styles.editorCard}><div className={styles.profileEditor}><label className={styles.avatarUpload}>{profile.avatar_url?<img src={profile.avatar_url} alt="Perfil"/>:<span>{profile.display_name?.slice(0,2).toUpperCase()}</span>}<b>Trocar foto</b><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={upload}/></label><div className={styles.formGrid}><Field label="Nome" value={profile.display_name||''} onChange={value=>patch({display_name:value})}/><Field label="Cargo / descrição" value={profile.role_label||''} onChange={value=>patch({role_label:value})}/><Field label="Plano" value={profile.plan_label||''} onChange={value=>patch({plan_label:value})}/></div></div><div className={styles.actions}><button onClick={()=>save(profile)}>Salvar perfil</button></div></article>}

function MediaLibrary({data}:{data:CmsBundle}){return <div className={styles.mediaGrid}>{data.media.map(asset=><article key={asset.id||asset.path}>{asset.public_url?<img src={asset.public_url} alt={asset.alt_text||''}/>:<div/>}<strong>{asset.alt_text||asset.path.split('/').pop()}</strong><span>{asset.mime_type||'imagem'}</span></article>)}{!data.media.length&&<div className={styles.empty}>As imagens enviadas pelo CMS aparecerão aqui.</div>}</div>}

function Field({label,value,onChange,type='text'}:{label:string;value:string;onChange:(value:string)=>void;type?:string}){return <label>{label}<input type={type} value={value} onChange={e=>onChange(e.target.value)}/></label>}
function humanize(value:string){return value.replace(/([A-Z])/g,' $1').replaceAll('_',' ').replace(/^./,c=>c.toUpperCase())}
