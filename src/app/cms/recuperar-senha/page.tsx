'use client';

import { FormEvent, useState } from 'react';
import { requestPasswordReset } from '@/lib/cms/auth';
import styles from '../cms.module.css';

export default function RecoverPasswordPage(){
  const[email,setEmail]=useState('evosummitspace@gmail.com');
  const[busy,setBusy]=useState(false);
  const[message,setMessage]=useState('');
  const[error,setError]=useState('');

  const submit=async(event:FormEvent)=>{
    event.preventDefault();
    setBusy(true);setError('');setMessage('');
    try{
      await requestPasswordReset(email.trim(),`${window.location.origin}/cms/nova-senha`);
      setMessage('Link enviado. Abra o e-mail e clique no link para cadastrar sua nova senha.');
    }catch(e){setError(e instanceof Error?e.message:'Não foi possível enviar o link.')}finally{setBusy(false)}
  };

  return <main className={styles.loginShell}><section className={styles.loginCard}>
    <div className={styles.brand}>ZYVO <span>CMS</span></div>
    <h1>Recuperar acesso.</h1>
    <p>Enviaremos um link seguro para cadastrar uma nova senha do CMS.</p>
    <form onSubmit={submit}>
      <label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/></label>
      {error&&<div className={styles.error}>{error}</div>}
      {message&&<div className={styles.success}>{message}</div>}
      <button disabled={busy}>{busy?'Enviando…':'Enviar link de recuperação'}</button>
      <a className={styles.textLink} href="/cms">Voltar para o login</a>
    </form>
  </section></main>;
}
