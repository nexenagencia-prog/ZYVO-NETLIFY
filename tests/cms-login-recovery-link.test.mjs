import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=(path)=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('CMS login exposes a visible forgot-password shortcut to the recovery route',()=>{
  const layout=read('src/app/cms/layout.tsx');
  const shortcut=read('src/app/cms/CmsRecoveryShortcut.tsx');
  assert.match(layout,/CmsRecoveryShortcut/);
  assert.match(shortcut,/Esqueci minha senha/);
  assert.match(shortcut,/\/cms\/recuperar-senha/);
  assert.match(shortcut,/zyvo-cms-session/);
});
