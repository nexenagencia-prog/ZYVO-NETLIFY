'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function CmsRecoveryShortcut(){
  const pathname=usePathname();
  const[visible,setVisible]=useState(false);

  useEffect(()=>{
    if(pathname!=='/cms'){setVisible(false);return;}
    try{setVisible(!localStorage.getItem('zyvo-cms-session'));}catch{setVisible(true)}
  },[pathname]);

  if(!visible) return null;

  return <a href="/cms/recuperar-senha" aria-label="Esqueci minha senha" style={{position:'fixed',left:'50%',top:'calc(50% + 252px)',transform:'translateX(-50%)',zIndex:50,color:'#9fb0bd',fontSize:'12px',fontFamily:'Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',textDecoration:'none',padding:'8px 12px',borderRadius:'999px'}}>Esqueci minha senha</a>;
}
