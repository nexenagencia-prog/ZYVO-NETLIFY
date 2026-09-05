import type { CmsBundle, CmsNavigationItem, CmsPage, CmsProfile, CmsSection, JsonMap } from './types';
import { DEFAULT_BUNDLE } from './defaults';

const obj=(value:unknown):JsonMap=>value && typeof value==='object' && !Array.isArray(value) ? value as JsonMap : {};

export function mergeSection(base:CmsSection, incoming?:CmsSection):CmsSection {
  if(!incoming) return {...base,content:{...obj(base.content)},media:{...obj(base.media)}};
  return {
    ...base,
    ...incoming,
    title: incoming.title ?? base.title,
    subtitle: incoming.subtitle ?? base.subtitle,
    body: incoming.body ?? base.body,
    content:{...obj(base.content),...obj(incoming.content)},
    media:{...obj(base.media),...obj(incoming.media)},
    is_visible: incoming.is_visible ?? base.is_visible ?? true,
    sort_order: incoming.sort_order ?? base.sort_order ?? 0,
  };
}

export function mergePageContent(base:CmsPage,incoming?:CmsPage):CmsPage {
  if(!incoming) return {...base,settings:{...obj(base.settings)},sections:base.sections.map(section=>mergeSection(section))};
  const incomingMap=new Map((incoming.sections||[]).map(section=>[section.section_key,section]));
  const merged=base.sections.map(section=>mergeSection(section,incomingMap.get(section.section_key)));
  for(const section of incoming.sections||[]) if(!merged.some(item=>item.section_key===section.section_key)) merged.push(section);
  return {
    ...base,
    ...incoming,
    title:incoming.title ?? base.title,
    settings:{...obj(base.settings),...obj(incoming.settings)},
    sections:merged.sort((a,b)=>(a.sort_order??0)-(b.sort_order??0)),
  };
}

export function mergeNavigation(base:CmsNavigationItem[], incoming?:CmsNavigationItem[]):CmsNavigationItem[] {
  if(!incoming?.length) return base.filter(item=>item.is_visible).sort((a,b)=>a.sort_order-b.sort_order);
  const byKey=new Map(base.map(item=>[item.nav_key,item]));
  for(const item of incoming) byKey.set(item.nav_key,{...(byKey.get(item.nav_key)||item),...item});
  return [...byKey.values()].filter(item=>item.is_visible!==false).sort((a,b)=>(a.sort_order??0)-(b.sort_order??0));
}

export function mergeProfile(base:CmsProfile,incoming?:Partial<CmsProfile>|null):CmsProfile {
  if(!incoming) return {...base};
  return {
    ...base,
    ...incoming,
    display_name:incoming.display_name?.trim() || base.display_name,
    role_label:incoming.role_label?.trim() || base.role_label,
    plan_label:incoming.plan_label?.trim() || base.plan_label,
    avatar_url:incoming.avatar_url || base.avatar_url,
  } as CmsProfile;
}

export function mergeCmsBundle(incoming?:Partial<CmsBundle>|null):CmsBundle {
  const pages={...DEFAULT_BUNDLE.pages};
  for(const [slug,page] of Object.entries(incoming?.pages||{})) pages[slug]=mergePageContent(DEFAULT_BUNDLE.pages[slug]||page,page);
  pages.home=mergePageContent(DEFAULT_BUNDLE.pages.home,incoming?.pages?.home);
  pages.skills=mergePageContent(DEFAULT_BUNDLE.pages.skills,incoming?.pages?.skills);
  return {
    pages,
    navigation:mergeNavigation(DEFAULT_BUNDLE.navigation,incoming?.navigation),
    profile:mergeProfile(DEFAULT_BUNDLE.profile,incoming?.profile),
    media:incoming?.media||[],
  };
}

export function sectionByKey(page:CmsPage,key:string):CmsSection {
  return page.sections.find(section=>section.section_key===key) || {section_key:key,content:{},media:{},is_visible:true,sort_order:0};
}
