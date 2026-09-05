import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const sidebar = readFileSync(new URL('../src/components/Sidebar.tsx', import.meta.url), 'utf8');
const sidebarCss = readFileSync(new URL('../src/components/Sidebar.module.css', import.meta.url), 'utf8');
const page = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');
const scanCss = readFileSync(new URL('../src/app/faceScan.module.css', import.meta.url), 'utf8');

test('sidebar exposes editable profile name and image with persistence', () => {
  assert.match(sidebar, /zyvo-profile/);
  assert.match(sidebar, /type="file"/);
  assert.match(sidebar, /localStorage\.setItem/);
  assert.match(sidebar, /profileName/);
});

test('sidebar is one rail that expands in place instead of opening a second panel', () => {
  assert.match(sidebar, /styles\.unifiedRail/);
  assert.match(sidebar, /styles\.expanded/);
  assert.doesNotMatch(sidebar, /sidebar-panel/);
  assert.doesNotMatch(sidebar, /sidebar-backdrop/);
  assert.match(sidebarCss, /transition:\s*width/);
  assert.match(sidebarCss, /\.expanded\{[\s\S]*?width:\s*222px/);
});

test('sidebar keeps icons anchored while labels reveal smoothly', () => {
  assert.match(sidebarCss, /\.itemIcon/);
  assert.match(sidebarCss, /\.itemLabel/);
  assert.match(sidebarCss, /opacity:\s*0/);
  assert.match(sidebarCss, /transform:\s*translateX/);
  assert.match(sidebarCss, /\.expanded\s+\.itemLabel/);
});

test('sidebar keeps the profile clear of the logo and centers collapsed icons', () => {
  assert.match(sidebarCss, /\.profileRow\{[\s\S]*?margin-top:\s*72px/);
  assert.match(sidebarCss, /\.navItem\{[\s\S]*?margin:\s*0 auto/);
  assert.match(sidebarCss, /\.expanded\s+\.navItem\{[\s\S]*?margin:\s*0 12px/);
  assert.match(sidebarCss, /\.bottomControl\{[\s\S]*?justify-content:\s*center/);
});

test('sidebar uses a clean collapse control instead of an X button', () => {
  assert.match(sidebar, /aria-label=\{open \? 'Recolher menu' : 'Expandir menu'\}/);
  assert.doesNotMatch(sidebar, />×</);
});

test('rail icons are visually lighter and aligned', () => {
  assert.match(sidebar, /strokeWidth="1\.45"/);
  assert.match(css, /\.rail-nav a\{[^}]*display:grid[^}]*place-items:center/);
});

test('home greeting follows the editable profile name with concise copy', () => {
  assert.match(sidebar, /zyvo-profile-updated/);
  assert.match(page, /zyvo-profile-updated/);
  assert.match(page, /Olá, <strong>\{profileName\}<\/strong>/);
  assert.doesNotMatch(page, /bem-vindo/);
});

test('quick actions keep four equal columns with subtle vertical separators', () => {
  assert.match(css, /\.quick-actions\{[^}]*grid-template-columns:repeat\(4,1fr\)/);
  assert.match(css, /\.quick-action\{[^}]*align-items:center[^}]*text-align:center/);
  assert.match(css, /\.quick-action\{[^}]*border-right:1px solid rgba\(255,255,255,\.08\)/);
  assert.match(css, /\.quick-action svg\{[^}]*stroke-width:1\.35/);
});

test('facial reader keeps the photo mesh and only animates scanner and light', () => {
  assert.match(page, /nativeFaceScan/);
  assert.match(page, /nativeScanLine/);
  assert.match(page, /nativeLineGlow/);
  assert.doesNotMatch(page, /scan-mesh/);
  assert.doesNotMatch(page, /scan-node/);
  assert.doesNotMatch(page, /<svg viewBox="0 0 420 520"/);
  assert.match(scanCss, /@keyframes scannerTravel/);
  assert.match(scanCss, /animation-direction:alternate/);
  assert.match(scanCss, /@keyframes nativeLineBreath/);
  assert.match(scanCss, /prefers-reduced-motion:reduce/);
});
