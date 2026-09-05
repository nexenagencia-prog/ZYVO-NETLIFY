import { DEFAULT_BUNDLE } from './defaults';
import { mergeCmsBundle } from './merge';
import type { CmsBundle, CmsMedia, CmsNavigationItem, CmsPage, CmsProfile, CmsSection } from './types';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export function cmsConfigured(){ return Boolean(SUPABASE_URL && SUPABASE_KEY); }

export async function cmsRequest<T>(path:string, init:RequestInit={}, accessToken?:string):Promise<T>{
  if(!cmsConfigured()) throw new Error('CMS Supabase environment is not configured');
  const headers=new Headers(init.headers||{});
  headers.set('apikey',SUPABASE_KEY);
  headers.set('Authorization',`Bearer ${accessToken || SUPABASE_KEY}`);
  if(init.body && !headers.has('Content-Type')) headers.set('Content-Type','application/json');
  const response=await fetch(`${SUPABASE_URL}${path}`,{...init,headers,cache:'no-store'});
  if(!response.ok){
    let detail='';
    try{ detail=await response.text(); }catch{}
    throw new Error(`CMS request failed (${response.status})${detail?`: ${detail}`:''}`);
  }
  if(response.status===204) return undefined as T;
  const text=await response.text();
  return (text?JSON.parse(text):undefined) as T;
}

export async function fetchPublicCmsBundle():Promise<CmsBundle>{
  if(!cmsConfigured()) return mergeCmsBundle(DEFAULT_BUNDLE);
  try{
    const [pagesRaw,sections,navigation,profiles,media]=await Promise.all([
      cmsRequest<Omit<CmsPage,'sections'>[]>('/rest/v1/cms_pages?select=id,slug,name,title,settings,is_published&is_published=eq.true'),
      cmsRequest<CmsSection[]>('/rest/v1/cms_sections?select=id,page_id,section_key,section_type,title,subtitle,body,content,media,sort_order,is_visible&order=sort_order.asc'),
      cmsRequest<CmsNavigationItem[]>('/rest/v1/cms_navigation?select=id,nav_key,label,href,icon_key,sort_order,is_visible,metadata&order=sort_order.asc'),
      cmsRequest<(CmsProfile & {avatar_media_id?:string|null})[]>('/rest/v1/cms_profile?select=id,display_name,role_label,plan_label,avatar_media_id,metadata&limit=1'),
      cmsRequest<CmsMedia[]>('/rest/v1/cms_media?select=id,bucket,path,public_url,alt_text,mime_type,width,height,file_size&order=created_at.desc'),
    ]);
    const pages:Record<string,CmsPage>={};
    for(const page of pagesRaw){ pages[page.slug]={...page,sections:sections.filter(section=>section.page_id===page.id)}; }
    const profile=profiles[0];
    if(profile?.avatar_media_id){
      const asset=media.find(item=>item.id===profile.avatar_media_id);
      if(asset?.public_url) profile.avatar_url=asset.public_url;
    }
    return mergeCmsBundle({pages,navigation,profile,media});
  }catch(error){
    console.warn('ZYVO CMS fallback active',error);
    return mergeCmsBundle(DEFAULT_BUNDLE);
  }
}

export function publicMediaUrl(value:unknown,fallback:string){
  return typeof value==='string' && value.trim() ? value : fallback;
}
