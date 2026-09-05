'use client';

import { useEffect } from 'react';

const CMS_HOST='curious-profiterole-edfa59.netlify.app';
const CMS_ORIGIN=`https://${CMS_HOST}`;

export default function CmsCanonicalHost(){
  useEffect(()=>{
    const host=window.location.host;
    if(host===CMS_HOST || host.startsWith('localhost') || host.startsWith('127.0.0.1')) return;
    window.location.replace(`${CMS_ORIGIN}${window.location.pathname}${window.location.search}${window.location.hash}`);
  },[]);
  return null;
}
