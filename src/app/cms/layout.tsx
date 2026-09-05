import type { ReactNode } from 'react';
import CmsCanonicalHost from './CmsCanonicalHost';
import CmsRecoveryShortcut from './CmsRecoveryShortcut';

export default function CmsLayout({children}:{children:ReactNode}){
  return <><CmsCanonicalHost/>{children}<CmsRecoveryShortcut/></>;
}
