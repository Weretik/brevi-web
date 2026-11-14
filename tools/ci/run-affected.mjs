import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

import { matchesProjectPattern } from './test-scripts.mjs';

// Pull-request CI runs package.json test scripts only for projects affected since the base commit.
// NX_BASE/NX_HEAD come from nrwl/nx-set-shas. With CI_SCOPE=all (pushes to master) scripts run as is.
//   node tools/ci/run-affected.mjs <npm-script>       run the script for affected projects only
//   node tools/ci/run-affected.mjs --check <project>  print true when the project is affected
const all = process.env.CI_SCOPE === 'all';
const scripts = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
).scripts;

let affected;
function affectedProjects() {
  affected ??= new Set(
    JSON.parse(
      execFileSync('npx', ['nx', 'show', 'projects', '--affected', '--json'], {
        encoding: 'utf8',
      }),
    ),
  );
  return affected;
}

function run(command) {
  console.log(`> ${command}`);
  const result = spawnSync(command, { shell: true, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function runScript(name) {
  const command = scripts[name];
  if (!command) throw new Error(`Unknown npm script: ${name}`);
  for (const part of command.split('&&').map((item) => item.trim())) {
    const nested = /^npm run (\S+)$/.exec(part);
    if (nested) {
      runScript(nested[1]);
      continue;
    }
    const projects = /--projects=(\S+)/.exec(part);
    if (all || !projects) {
      run(part.replace(/^nx /, 'npx nx '));
      continue;
    }
    // Entries may be patterns such as `admin-*`; keep the affected projects they match.
    const patterns = projects[1].split(',');
    const selected = [...affectedProjects()].filter((project) =>
      patterns.some((pattern) => matchesProjectPattern(project, pattern)),
    );
    if (selected.length === 0) {
      console.log(`Skipped, no affected projects: ${part}`);
      continue;
    }
    run(part.replace(projects[0], `--projects=${selected.join(',')}`).replace(/^nx /, 'npx nx '));
  }
}

const [first, second] = process.argv.slice(2);
if (first === '--check') console.log(all || affectedProjects().has(second) ? 'true' : 'false');
else if (first) runScript(first);
else {
  console.error('Usage: node tools/ci/run-affected.mjs <npm-script> | --check <project>');
  process.exit(2);
}
