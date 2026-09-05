import { cmsRequest, SUPABASE_URL } from './client';
import type { CmsBundle, CmsMedia, CmsNavigationItem, CmsPage, CmsProfile, CmsSection } from './types';

export async function isCmsAdmin(accessToken:string){
  const rows=await cmsRequest<{user_id:string}[]>('/rest/v1/cms_admins?select=user_id&limit=1',{},accessToken);
  return rows.length>0;
}

export async function fetchAdminCmsBundle(accessToken:string):Promise<CmsBundle>{
  const [pagesRaw,sections,navigation,profiles,media]=await Promise.all([
    cmsRequest<Omit<CmsPage,'sections'>[]>('/rest/v1/cms_pages?select=id,slug,name,title,settings,is_published&order=name.asc',{},accessToken),
    cmsRequest<CmsSection[]>('/rest/v1/cms_sections?select=id,page_id,section_key,section_type,title,subtitle,body,content,media,sort_order,is_visible&order=sort_order.asc',{},accessToken),
    cmsRequest<CmsNavigationItem[]>('/rest/v1/cms_navigation?select=id,nav_key,label,href,icon_key,sort_order,is_visible,metadata&order=sort_order.asc',{},accessToken),
    cmsRequest<CmsProfile[]>('/rest/v1/cms_profile?select=id,display_name,role_label,plan_label,avatar_media_id,metadata&limit=1',{},accessToken),
    cmsRequest<CmsMedia[]>('/rest/v1/cms_media?select=id,bucket,path,public_url,alt_text,mime_type,width,height,file_size&order=created_at.desc',{},accessToken),
  ]);
  const pages:Record<string,CmsPage>={};
  for(const page of pagesRaw) pages[page.slug]={...page,sections:sections.filter(section=>section.page_id===page.id)};
  const profile=profiles[0]||{display_name:'Sandro Bello',role_label:'Marketing Digital',plan_label:'Plano Pro'};
  if(profile.avatar_media_id){const asset=media.find(item=>item.id===profile.avatar_media_id);if(asset?.public_url)profile.avatar_url=asset.public_url||'';}
  return {pages,navigation,profile,media};
}

export async function updateSection(accessToken:string,section:CmsSection){
  if(!section.id) throw new Error('Seção sem ID.');
  const payload={title:section.title,subtitle:section.subtitle,body:section.body,content:section.content||{},media:section.media||{},sort_order:section.sort_order||0,is_visible:section.is_visible!==false,updated_at:new Date().toISOString()};
  return cmsRequest<CmsSection[]>(`/rest/v1/cms_sections?id=eq.${encodeURIComponent(section.id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)},accessToken);
}

export async function updatePage(accessToken:string,page:CmsPage){
  if(!page.id) throw new Error('Página sem ID.');
  const payload={name:page.name,title:page.title,settings:page.settings||{},is_published:page.is_published!==false,updated_at:new Date().toISOString()};
  return cmsRequest(`/rest/v1/cms_pages?id=eq.${encodeURIComponent(page.id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)},accessToken);
}

export async function updateNavigation(accessToken:string,item:CmsNavigationItem){
  if(!item.id) throw new Error('Item de menu sem ID.');
  return cmsRequest(`/rest/v1/cms_navigation?id=eq.${encodeURIComponent(item.id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({label:item.label,href:item.href,icon_key:item.icon_key,sort_order:item.sort_order,is_visible:item.is_visible,metadata:item.metadata||{},updated_at:new Date().toISOString()})},accessToken);
}

export async function updateProfile(accessToken:string,profile:CmsProfile){
  if(!profile.id) throw new Error('Perfil sem ID.');
  return cmsRequest(`/rest/v1/cms_profile?id=eq.${encodeURIComponent(profile.id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({display_name:profile.display_name,role_label:profile.role_label,plan_label:profile.plan_label,avatar_media_id:profile.avatar_media_id||null,metadata:profile.metadata||{},updated_at:new Date().toISOString()})},accessToken);
}

const allowedTypes=new Set(['image/jpeg','image/png','image/webp','image/avif']);
export async function uploadCmsMedia(accessToken:string,file:File,folder='shared'):Promise<CmsMedia>{
  if(!allowedTypes.has(file.type)) throw new Error('Use JPEG, PNG, WebP ou AVIF.');
  if(file.size>15*1024*1024) throw new Error('A imagem deve ter no máximo 15 MB.');
  const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,'-').toLowerCase();
  const path=`${folder}/${Date.now()}-${safeName}`;
  const response=await fetch(`${SUPABASE_URL}/storage/v1/object/cms-media/${encodeURI(path)}`,{method:'POST',headers:{Authorization:`Bearer ${accessToken}`,'Content-Type':file.type,'x-upsert':'false'},body:file});
  if(!response.ok) throw new Error(`Falha no upload (${response.status}).`);
  const publicUrl=`${SUPABASE_URL}/storage/v1/object/public/cms-media/${path}`;
  const rows=await cmsRequest<CmsMedia[]>('/rest/v1/cms_media',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({bucket:'cms-media',path,public_url:publicUrl,alt_text:file.name,mime_type:file.type,file_size:file.size})},accessToken);
  return rows[0];
}
