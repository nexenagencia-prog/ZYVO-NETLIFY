import { SUPABASE_KEY, SUPABASE_URL, cmsConfigured } from './client';

export type CmsSession={access_token:string;refresh_token:string;expires_in:number;token_type:string;user:{id:string;email?:string}};
const SESSION_KEY='zyvo-cms-session';

export function getStoredSession():CmsSession|null{
  if(typeof window==='undefined') return null;
  try{const raw=localStorage.getItem(SESSION_KEY);return raw?JSON.parse(raw) as CmsSession:null}catch{return null}
}
export function storeSession(session:CmsSession|null){
  if(typeof window==='undefined') return;
  try{if(session)localStorage.setItem(SESSION_KEY,JSON.stringify(session));else localStorage.removeItem(SESSION_KEY)}catch{}
}

export async function signInWithPassword(email:string,password:string):Promise<CmsSession>{
  if(!cmsConfigured()) throw new Error('Supabase não configurado no ambiente.');
  const response=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(payload?.msg||payload?.error_description||'Não foi possível entrar.');
  const session=payload as CmsSession;storeSession(session);return session;
}

export async function requestPasswordReset(email:string,redirectTo:string):Promise<void>{
  if(!cmsConfigured()) throw new Error('Supabase não configurado no ambiente.');
  const url=`${SUPABASE_URL}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`;
  const response=await fetch(url,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({email})});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(payload?.msg||payload?.error_description||'Não foi possível enviar o e-mail de recuperação.');
}

export async function updatePassword(accessToken:string,password:string):Promise<void>{
  if(!cmsConfigured()) throw new Error('Supabase não configurado no ambiente.');
  const response=await fetch(`${SUPABASE_URL}/auth/v1/user`,{method:'PUT',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json'},body:JSON.stringify({password})});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(payload?.msg||payload?.error_description||'Não foi possível atualizar a senha.');
  storeSession(null);
}

export function recoveryTokenFromLocation(location:Pick<Location,'hash'|'search'>):{accessToken:string;error:string}{
  const hash=new URLSearchParams(location.hash.replace(/^#/,''));
  const query=new URLSearchParams(location.search);
  const accessToken=hash.get('access_token')||query.get('access_token')||'';
  const error=hash.get('error_description')||query.get('error_description')||'';
  return {accessToken,error};
}

export async function signOutCms(session?:CmsSession|null){
  const current=session||getStoredSession();
  try{if(current?.access_token) await fetch(`${SUPABASE_URL}/auth/v1/logout`,{method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${current.access_token}`}})}catch{}
  storeSession(null);
}

export async function getCurrentUser(accessToken:string){
  const response=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${accessToken}`}});
  if(!response.ok) return null;
  return response.json() as Promise<{id:string;email?:string}>;
}
