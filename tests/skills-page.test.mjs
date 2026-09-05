import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.existsSync(p)?fs.readFileSync(p,'utf8'):'';

test('skills page keeps the reference dashboard content and animation',()=>{const page=read('src/app/skills/page.tsx'),css=read('src/app/skills/skills.module.css');for(const text of ['Seu desempenho','Comunicação','Clareza','Escuta','Objetividade','Perguntas','Condução','PERFORMANCE HUMANA','INSIGHTS REAIS','Insights e Conteúdo','Analisar Reuniões','Analise suas reuniões','CAPTURE','ANALISE','EVOLUA'])assert.match(page,new RegExp(text));assert.match(page,/requestAnimationFrame/);assert.match(css,/conic-gradient/)});

test('skills uses the shared fixed topbar and the fixed global sidebar',()=>{const page=read('src/app/skills/page.tsx'),topbar=read('src/components/Topbar.tsx'),css=read('src/app/globals.css');assert.match(page,/<Topbar\s*\/>/);assert.match(page,/<Sidebar\s*\/>/);assert.match(topbar,/className="topbar"/);assert.match(topbar,/Buscar reuniões ou pessoas/);assert.match(css,/\.topbar\s*\{/);assert.match(css,/position:\s*fixed/)});

test('all four reference images stay assigned to their correct cards',()=>{const page=read('src/app/skills/page.tsx');for(const asset of ['skills-ref-hero','skills-ref-insights','skills-ref-meeting','skills-ref-analysis'])assert.match(page,new RegExp(asset));assert.match(page,/heroMedia/);assert.match(page,/insightMedia/);assert.match(page,/meetingMedia/);assert.match(page,/analysisRef/)});

test('desktop board is fully visible without bottom clipping',()=>{const css=read('src/app/skills/skills.module.css');assert.match(css,/height:100dvh/);assert.match(css,/overflow:hidden/);assert.match(css,/grid-template-rows:minmax\(0,1\.4fr\) minmax\(0,1fr\)/);assert.match(css,/height:calc\(100dvh - var\(--header-height\) - 28px\)/);assert.match(css,/min-height:0/);assert.match(css,/@media\(max-height:900px\)/)});

test('card imagery renders cleanly at full cover',()=>{const css=read('src/app/skills/skills.module.css');assert.match(css,/\.heroMedia[^}]*background-size:cover/);assert.match(css,/\.cardMedia[^}]*background-size:cover/);assert.match(css,/filter:none/)});
