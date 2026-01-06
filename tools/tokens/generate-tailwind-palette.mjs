import fs from 'node:fs';
import path from 'node:path';

import chroma from 'chroma-js';

const tokensPath = path.resolve('libs/shared/theme/src/lib/design-tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

const STEPS = {
  50: 0.92,
  100: 0.84,
  200: 0.72,
  300: 0.60,
  400: 0.48,
  500: 0.0,  // base
  600: -0.12,
  700: -0.24,
  800: -0.36,
  900: -0.48,
  950: -0.60,
};

function shade(hex, t) {
  if (t === 0) return chroma(hex).hex();
  const mixWith = t > 0 ? '#ffffff' : '#000000';
  return chroma.mix(hex, mixWith, Math.abs(t), 'rgb').hex();
}

function block(name, baseHex) {
  const lines = [];
  for (const [step, t] of Object.entries(STEPS)) {
    lines.push(`  --color-${name}-${step}: ${shade(baseHex, Number(t))};`);
  }
  return lines.join('\n');
}

const css =
  `@theme {\n` +
  block('primary', tokens.colors.primary) + '\n\n' +
  block('neutral', tokens.colors.neutral) + '\n\n' +
  block('info', tokens.colors.info) + '\n\n' +
  block('success', tokens.colors.success) + '\n\n' +
  block('warning', tokens.colors.warning) + '\n\n' +
  block('danger', tokens.colors.danger) + '\n' +
  `}\n`;

const outFile = path.resolve('apps/storefront/src/styles/generated.tailwind-palette.css');
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, css, 'utf8');

console.log(`✅ Generated: ${outFile}`);
