import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=(path)=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('CMS defaults define editable home skills profile and navigation content',()=>{
  const source=read('src/lib/cms/defaults.ts');
  for(const token of ['DEFAULT_HOME','DEFAULT_SKILLS','DEFAULT_PROFILE','DEFAULT_NAVIGATION']) assert.match(source,new RegExp(token));
  assert.match(source,/skills\.analysis/);
  assert.match(source,/heroMedia/);
});

test('CMS merge layer preserves defaults and maps visible ordered navigation',()=>{
  const source=read('src/lib/cms/merge.ts');
  assert.match(source,/mergePageContent/);
  assert.match(source,/mergeNavigation/);
  assert.match(source,/is_visible/);
  assert.match(source,/sort_order/);
});

test('CMS admin route requires Supabase authentication and exposes main editors',()=>{
  const source=read('src/app/cms/page.tsx');
  assert.match(source,/signInWithPassword/);
  assert.match(source,/cms_admins/);
  for(const label of ['Home','Skills','Menu','Perfil','Mídia']) assert.match(source,new RegExp(label));
  assert.match(source,/cms-media/);
});

test('public pages consume CMS content with local fallback',()=>{
  const home=read('src/app/page.tsx');
  const skills=read('src/app/skills/page.tsx');
  const sidebar=read('src/components/Sidebar.tsx');
  for(const source of [home,skills,sidebar]) assert.match(source,/fetchPublicCmsBundle/);
});
