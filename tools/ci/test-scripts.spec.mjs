import assert from 'node:assert/strict';
import test from 'node:test';

import { matchesProjectPattern, projectPatterns, uncoveredProjects } from './test-scripts.mjs';

test('matches exact names and star patterns', () => {
  assert.equal(matchesProjectPattern('admin', 'admin'), true);
  assert.equal(matchesProjectPattern('admin-work-ui', 'admin-*'), true);
  assert.equal(matchesProjectPattern('admin', 'admin-*'), false);
  assert.equal(matchesProjectPattern('site-home-ui', 'admin-*'), false);
});

test('reads --projects of the named scripts', () => {
  const scripts = { a: 'nx run-many -t test --projects=x,y-* -- --run', b: 'echo' };
  assert.deepEqual(projectPatterns(scripts, ['a', 'b', 'missing']), ['x', 'y-*']);
});

test('lists projects with tests that no script selects', () => {
  assert.deepEqual(
    uncoveredProjects(['admin', 'admin-a', 'site-b', 'other'], ['admin', 'admin-*']),
    ['other', 'site-b'],
  );
});
