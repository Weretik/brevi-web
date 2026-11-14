import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

import { projectPatterns, uncoveredProjects } from './test-scripts.mjs';

// Fails when a project has a test target that the CI test scripts do not run.
export const ciTestScripts = ['test:web', 'check:admin-libs', 'test:site'];
// The workspace root project only mirrors package.json scripts.
const workspaceProjects = ['brevi-web'];

const scripts = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
).scripts;
const withTarget = (target) =>
  JSON.parse(
    execFileSync('npx', ['nx', 'show', 'projects', '--withTarget', target, '--json'], {
      encoding: 'utf8',
    }),
  );
const testProjects = [...new Set([...withTarget('vite:test'), ...withTarget('test')])].filter(
  (project) => !workspaceProjects.includes(project),
);
const missing = uncoveredProjects(testProjects, projectPatterns(scripts, ciTestScripts));

if (missing.length > 0) {
  console.error(
    `Projects with tests that CI does not run (add them to ${ciTestScripts.join(', ')}):`,
  );
  for (const project of missing) console.error(`- ${project}`);
  process.exit(1);
}
console.log(`All ${testProjects.length} projects with tests are run by CI.`);
