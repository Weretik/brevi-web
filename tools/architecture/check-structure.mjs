// Structure check: docs/standards/shared/code-organization.md#structure-check
// Usage: node tools/architecture/check-structure.mjs [--write-baseline]
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

import { compareWithBaseline, findStructureViolations } from './structure-rules.mjs';

const baselinePath = new URL('./structure-baseline.json', import.meta.url);
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean);
const violations = findStructureViolations({
  files,
  read: (path) => {
    try {
      return readFileSync(path, 'utf8');
    } catch {
      return '';
    }
  },
});

if (process.argv.includes('--write-baseline')) {
  writeFileSync(baselinePath, `${JSON.stringify(violations, null, 2)}\n`);
  console.log(`Structure baseline written: ${violations.length} known deviations.`);
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
const { added, fixed } = compareWithBaseline(violations, baseline);

if (added.length > 0) {
  console.error('New structure violations (see docs/standards/shared/code-organization.md):');
  for (const line of added) console.error(`- ${line}`);
}
if (fixed.length > 0) {
  console.error(
    'Fixed deviations still listed in tools/architecture/structure-baseline.json; remove them:',
  );
  for (const line of fixed) console.error(`- ${line}`);
}
if (added.length > 0 || fixed.length > 0) process.exit(1);

console.log(`Structure check passed: ${baseline.length} known deviations, no new ones.`);
