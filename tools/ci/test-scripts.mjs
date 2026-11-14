// Which projects the package.json test scripts select, so CI cannot silently skip a project's tests.

/** True when a project name matches an Nx `--projects` entry (an exact name or a `*` pattern). */
export function matchesProjectPattern(project, pattern) {
  const regex = new RegExp(`^${pattern.split('*').map(escape).join('.*')}$`);
  return regex.test(project);
}

const escape = (text) => text.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

/** The `--projects` entries of every command in the given scripts. */
export function projectPatterns(scripts, names) {
  return names.flatMap((name) => {
    const match = /--projects=(\S+)/.exec(scripts[name] ?? '');
    return match ? match[1].split(',') : [];
  });
}

/** Projects with a test target that no CI test script selects. */
export function uncoveredProjects(testProjects, patterns) {
  return testProjects
    .filter((project) => !patterns.some((pattern) => matchesProjectPattern(project, pattern)))
    .sort();
}
