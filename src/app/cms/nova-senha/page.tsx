'use client';

import { FormEvent, useEffect, useState } from 'react';
import { recoveryTokenFromLocation, updatePassword } from '@/lib/cms/auth';
import styles from '../cms.module.css';

export default function NewPasswordPage(){
  const[token,setToken]=useState('');
  const[password,setPassword]=useState('');
  const[confirmPassword,setConfirmPassword]=useState('');
  const[busy,setBusy]=useState(false);
  const[done,setDone]=useState(false);
  const[error,setError]=useState('');

  useEffect(()=>{
    const recovery=recoveryTokenFromLocation(window.location);
    if(recovery.error){setError(decodeURIComponent(recovery.error.replace(/\+/g,' ')));return;}
    if(!recovery.accessToken){setError('Link inválido ou expirado. Solicite um novo link de recuperação.');return;}
    setToken(recovery.accessToken);
  },[]);

  const submit=async(event:FormEvent)=>{
    event.preventDefault();
    setError('');
    if(password.length<6){setError('A nova senha precisa ter pelo menos 6 caracteres.');return;}
    if(password!==confirmPassword){setError('As senhas não coincidem.');return;}
    if(!token){setError('Link de recuperação inválido ou expirado.');return;}
    setBusy(true);
    try{await updatePassword(token,password);setDone(true);setPassword('');setConfirmPassword('');}
    catch(e){setError(e instanceof Error?e.message:'Não foi possível cadastrar a nova senha.');}
    finally{setBusy(false)}
  };

  return <main className={styles.loginShell}><section className={styles.loginCard}>
    <div className={styles.brand}>ZYVO <span>CMS</span></div>
    {done?<>
      <h1>Senha atualizada.</h1>
      <p>Sua nova senha foi cadastrada. Agora você já pode entrar no CMS.</p>
      <a className={styles.primaryLink} href="/cms">Entrar no CMS</a>
    </>:<>
      <h1>Nova senha.</h1>
      <p>Cadastre uma nova senha para sua conta de administrador.</p>
      <form onSubmit={submit}>
        <label>Nova senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} autoComplete="new-password"/></label>
        <label>Confirmar nova senha<input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required minLength={6} autoComplete="new-password"/></label>
        {error&&<div className={styles.error}>{error}</div>}
        <button disabled={busy||!token}>{busy?'Salvando…':'Cadastrar nova senha'}</button>
        <a className={styles.textLink} href="/cms/recuperar-senha">Solicitar outro link</a>
      </form>
    </>}
  </section></main>;
}
