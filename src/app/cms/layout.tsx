import type { ReactNode } from 'react';
import CmsRecoveryShortcut from './CmsRecoveryShortcut';

export default function CmsLayout({children}:{children:ReactNode}){
  return <>{children}<CmsRecoveryShortcut/></>;
}
