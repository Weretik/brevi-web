// Structure rules from docs/standards/shared/code-organization.md, as pure functions over a file list.

const forbiddenNames = new Set([
  'utils',
  'util',
  'helpers',
  'common',
  'misc',
  'types',
  'constants',
]);

const roleFolders = {
  'data-access': [
    'api',
    'contracts',
    'validators',
    'mappers',
    'models',
    'cache',
    'errors',
    'testing',
  ],
  model: ['entities', 'queries', 'mappers', 'validators', 'forms'],
  ui: [
    'components',
    'tables',
    'forms',
    'dialogs',
    'panels',
    'details',
    'feedback',
    'hooks',
    'testing',
  ],
  feature: [
    'pages',
    'screens',
    'components',
    'dialogs',
    'hooks',
    'state',
    'model',
    'errors',
    'testing',
  ],
};
const mobileDataAccessRoles = ['local', 'store', 'sync'];

const appFolderEntries = new Set([
  'app.tsx',
  'bootstrap.tsx',
  'store.ts',
  'providers',
  'router',
  'theme',
  'services',
  'notifications',
  'slots',
]);

/** The Admin application folder of this repository. */
const adminAppFolder = 'apps/admin-react/src/app/';

const componentLineLimit = 150;
const moduleLineLimit = 200;
const crowdedFolderSize = 8;
/** Static copy, generated code, and test helpers: long by nature, not by responsibility. */
const isExemptFromLength = (path) => /\/(i18n|data|generated|testing)\//.test(path);
const styleSheetStart = /^(export )?const \w+ = (createStyles|StyleSheet\.create)\(/m;

const isCode = (path) => /\.(ts|tsx)$/.test(path) && !path.endsWith('.d.ts');
const isSpec = (path) => /\.(spec|test)\.(ts|tsx|mjs)$/.test(path);
const isProduction = (path) =>
  isCode(path) && !isSpec(path) && !/(^|\/)(index\.ts|test-setup\.ts)$/.test(path);
const dirOf = (path) => path.slice(0, path.lastIndexOf('/'));
const baseOf = (path) => path.slice(path.lastIndexOf('/') + 1);

/** Applications and libraries the rules cover; the frozen Angular storefront is left out. */
const inScope = (path) =>
  /^(apps\/(admin-react|mobile|site)\/src\/|libs\/(admin|mobile|site)\/)/.test(path);

/** `libs/<scope>/<domain>/<layer>` for a domain library, or null. */
const domainLibraryOf = (path) => {
  const match = /^libs\/(admin|mobile|site)\/([^/]+)\/([^/]+)\//.exec(path);
  if (!match || ['shared', 'core'].includes(match[2])) return null;
  return { scope: match[1], layer: match[3], root: match[0].slice(0, -1) };
};

const isForbiddenName = (name, isFolder) => {
  if (isFolder) return forbiddenNames.has(name);
  const parts = name.replace(/\.(ts|tsx)$/, '').split('.');
  return parts.some((part) => forbiddenNames.has(part));
};

const effectiveLength = (text) => {
  const style = styleSheetStart.exec(text);
  const body = style ? text.slice(0, style.index) : text;
  return body.replace(/\n$/, '').split('\n').length;
};

const count = (text, pattern) => (text.match(pattern) ?? []).length;

/**
 * Returns sorted violations as `<rule>: <path>` for the given repository files.
 * `read(path)` returns the text of a production file.
 */
export function findStructureViolations({ files, read }) {
  const scoped = files.filter(inScope);
  const violations = new Set();
  const add = (rule, path) => violations.add(`${rule}: ${path}`);

  const folders = new Set();
  for (const path of scoped) {
    for (let dir = dirOf(path); dir.includes('/src'); dir = dirOf(dir)) folders.add(dir);
  }

  // Forbidden names: catch-all folders and files, and `shared` inside a domain library.
  for (const folder of folders) {
    const name = baseOf(folder);
    if (isForbiddenName(name, true) || (name === 'shared' && domainLibraryOf(folder))) {
      add('forbidden-name', folder);
    }
  }
  for (const path of scoped.filter(isCode)) {
    if (isForbiddenName(baseOf(path).replace(/\.(spec|test)(?=\.)/, ''), false)) {
      add('forbidden-name', path.replace(/\.(spec|test)(?=\.)/, ''));
    }
  }

  // Crowded folders.
  const productionByFolder = new Map();
  for (const path of scoped.filter(isProduction)) {
    const dir = dirOf(path);
    productionByFolder.set(dir, (productionByFolder.get(dir) ?? 0) + 1);
  }
  for (const [dir, size] of productionByFolder) {
    if (size >= crowdedFolderSize) add('crowded-folder', dir);
  }

  // Role folders in Admin and Mobile domain libraries.
  for (const folder of folders) {
    const library = domainLibraryOf(folder);
    if (!library || library.scope === 'site') continue;
    const rest = folder.slice(library.root.length + 1).split('/');
    if (rest.length !== 2 || rest[0] !== 'src') continue;
    const allowed = [
      ...(roleFolders[library.layer] ?? []),
      ...(library.scope === 'mobile' && library.layer === 'data-access'
        ? mobileDataAccessRoles
        : []),
    ];
    if (!allowed.includes(rest[1])) add('role-folder', folder);
  }

  // Loose files in src/lib of a multi-capability site library.
  const siteFiles = new Map();
  for (const path of scoped.filter(isProduction)) {
    const match = /^(libs\/site\/[^/]+\/[^/]+)\/src\/lib\//.exec(path);
    if (!match) continue;
    siteFiles.set(match[1], [...(siteFiles.get(match[1]) ?? []), path]);
  }
  for (const [root, paths] of siteFiles) {
    if (paths.length <= crowdedFolderSize) continue;
    for (const path of paths) {
      if (dirOf(path) === `${root}/src/lib` && baseOf(path) !== 'cache-tags.ts')
        add('loose-file', path);
    }
  }

  // Long files and components with too much state.
  for (const path of scoped.filter(isProduction)) {
    const text = read(path) ?? '';
    const limit = path.endsWith('.tsx') ? componentLineLimit : moduleLineLimit;
    if (!isExemptFromLength(path) && effectiveLength(text) > limit) add('long-file', path);
    if (
      path.endsWith('.tsx') &&
      (count(text, /\buseState\b\s*[(<]/g) > 3 || count(text, /\buse(Layout)?Effect\(/g) > 1)
    ) {
      add('component-state', path);
    }
  }

  // Libraries with production code and no test.
  for (const project of scoped.filter(
    (path) => path.startsWith('libs/') && baseOf(path) === 'project.json',
  )) {
    const root = dirOf(project);
    const inside = scoped.filter((path) => path.startsWith(`${root}/src/`));
    if (inside.some(isProduction) && !inside.some(isSpec)) add('missing-tests', root);
  }

  // Admin application folder holds composition only.
  for (const path of scoped.filter((file) => file.startsWith(adminAppFolder))) {
    const entry = path.slice(adminAppFolder.length).split('/')[0];
    if (isSpec(entry)) continue;
    if (!appFolderEntries.has(entry)) add('app-folder', `${adminAppFolder}${entry}`);
  }

  return [...violations].sort();
}

/** Splits the difference with the baseline into new violations and fixed baseline lines. */
export function compareWithBaseline(violations, baseline) {
  const current = new Set(violations);
  const known = new Set(baseline);
  return {
    added: violations.filter((line) => !known.has(line)),
    fixed: baseline.filter((line) => !current.has(line)),
  };
}
