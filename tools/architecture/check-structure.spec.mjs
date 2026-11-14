import assert from 'node:assert/strict';
import test from 'node:test';

import { compareWithBaseline, findStructureViolations } from './structure-rules.mjs';

const lines = (count) => Array.from({ length: count }, (_, index) => `// ${index}`).join('\n');

/** Runs the rules over an in-memory tree: path -> file text. */
const check = (tree) =>
  findStructureViolations({ files: Object.keys(tree), read: (path) => tree[path] });

const lib = 'libs/admin/orders';

test('accepts a library laid out by role folders with tests', () => {
  assert.deepEqual(
    check({
      [`${lib}/model/project.json`]: '{}',
      [`${lib}/model/src/index.ts`]: '',
      [`${lib}/model/src/entities/order.ts`]: '',
      [`${lib}/model/src/mappers/order-total.ts`]: '',
      [`${lib}/model/src/mappers/order-total.spec.ts`]: '',
    }),
    [],
  );
});

test('rejects catch-all folder and file names', () => {
  assert.deepEqual(
    check({
      [`${lib}/ui/project.json`]: '{}',
      [`${lib}/ui/src/common/thumb.tsx`]: '',
      [`${lib}/ui/src/components/order.types.ts`]: '',
      [`${lib}/ui/src/components/order.spec.tsx`]: '',
    }),
    [
      `forbidden-name: ${lib}/ui/src/common`,
      `forbidden-name: ${lib}/ui/src/components/order.types.ts`,
      `role-folder: ${lib}/ui/src/common`,
    ],
  );
});

test('rejects a shared folder inside a domain library but not the shared scope', () => {
  assert.deepEqual(
    check({
      'libs/site/cart/ui/project.json': '{}',
      'libs/site/cart/ui/src/lib/shared/cart-format.ts': '',
      'libs/site/cart/ui/src/lib/shared/cart-format.spec.ts': '',
      'libs/site/cart/ui/src/lib/summary/cart-summary.tsx': '',
      'libs/admin/shared/ui/project.json': '{}',
      'libs/admin/shared/ui/src/lib/inputs/slug-field.tsx': '',
      'libs/admin/shared/ui/src/lib/inputs/slug-field.spec.tsx': '',
      'libs/admin/shared/ui/src/lib/dialogs/confirm-dialog.tsx': '',
    }),
    ['forbidden-name: libs/site/cart/ui/src/lib/shared'],
  );
});

test('flags a folder with more than six production files', () => {
  const tree = { [`${lib}/feature/project.json`]: '{}' };
  for (let index = 0; index < 7; index += 1) tree[`${lib}/feature/src/hooks/use-${index}.ts`] = '';
  tree[`${lib}/feature/src/hooks/use-0.spec.ts`] = '';
  tree[`${lib}/feature/src/hooks/index.ts`] = '';
  assert.deepEqual(check(tree), [`crowded-folder: ${lib}/feature/src/hooks`]);
});

test('requires role folders in admin and mobile domain libraries only', () => {
  assert.deepEqual(
    check({
      'libs/mobile/catalog/model/project.json': '{}',
      'libs/mobile/catalog/model/src/search/search.ts': '',
      'libs/mobile/catalog/model/src/search/search.spec.ts': '',
      'libs/mobile/core/shell/project.json': '{}',
      'libs/mobile/core/shell/src/providers/app-providers.tsx': '',
      'libs/mobile/core/shell/src/providers/app-providers.spec.tsx': '',
    }),
    ['role-folder: libs/mobile/catalog/model/src/search'],
  );
});

test('allows mobile data-access local, store, and sync roles', () => {
  assert.deepEqual(
    check({
      'libs/mobile/sync/data-access/project.json': '{}',
      'libs/mobile/sync/data-access/src/local/rows.ts': '',
      'libs/mobile/sync/data-access/src/store/sync-store.ts': '',
      'libs/mobile/sync/data-access/src/sync/runner.ts': '',
      'libs/mobile/sync/data-access/src/sync/runner.spec.ts': '',
    }),
    [],
  );
});

test('accepts six production files in a folder, with their tests and index', () => {
  const tree = { [`${lib}/feature/project.json`]: '{}' };
  for (let index = 0; index < 6; index += 1) {
    tree[`${lib}/feature/src/hooks/use-${index}.ts`] = '';
    tree[`${lib}/feature/src/hooks/use-${index}.spec.ts`] = '';
  }
  tree[`${lib}/feature/src/hooks/index.ts`] = '';
  assert.deepEqual(check(tree), []);
});

test('does not count generated code in a folder', () => {
  const tree = { 'libs/admin/shared/contracts/project.json': '{}' };
  for (let index = 0; index < 9; index += 1) {
    tree[`libs/admin/shared/contracts/src/generated/part-${index}.ts`] = '';
  }
  tree['libs/admin/shared/contracts/src/generated/part-0.spec.ts'] = '';
  assert.deepEqual(check(tree), []);
});

test('rejects a folder that mixes files and subfolders', () => {
  const tree = { 'libs/site/content/seo/project.json': '{}' };
  tree['libs/site/content/seo/src/lib/metadata/page-metadata.ts'] = '';
  tree['libs/site/content/seo/src/lib/contacts-json-ld.ts'] = '';
  tree['libs/site/content/seo/src/lib/contacts-json-ld.spec.ts'] = '';
  assert.deepEqual(check(tree), ['mixed-folder: libs/site/content/seo/src/lib']);
});

test('allows files beside folders only at a library root, the app entry and Next.js routes', () => {
  assert.deepEqual(
    check({
      [`${lib}/feature/project.json`]: '{}',
      [`${lib}/feature/src/index.ts`]: '',
      [`${lib}/feature/src/orders.routes.tsx`]: '',
      [`${lib}/feature/src/pages/orders-page.tsx`]: '',
      [`${lib}/feature/src/pages/orders-page.spec.tsx`]: '',
      'apps/admin-react/src/main.tsx': '',
      'apps/admin-react/src/app/app.tsx': '',
      'apps/admin-react/src/app/router/app-router.tsx': '',
      'apps/site/src/app/[locale]/page.tsx': '',
      'apps/site/src/app/[locale]/catalog/page.tsx': '',
    }),
    [],
  );
});

test('rejects a folder that only wraps one folder', () => {
  assert.deepEqual(
    check({
      'libs/admin/clients/ui/project.json': '{}',
      'libs/admin/clients/ui/src/tables/customers/customers-table.tsx': '',
      'libs/admin/clients/ui/src/tables/customers/customers-table.spec.tsx': '',
    }),
    ['wrapper-folder: libs/admin/clients/ui/src/tables'],
  );
});

test('keeps a small one-page site library flat', () => {
  assert.deepEqual(
    check({
      'libs/site/home/seo/project.json': '{}',
      'libs/site/home/seo/src/lib/home-metadata.ts': '',
      'libs/site/home/seo/src/lib/home-metadata.spec.ts': '',
    }),
    [],
  );
});

test('flags long components and hooks, without counting a style sheet', () => {
  const styled = `${lines(140)}\nconst stylesSheet = createStyles(() => ({\n${lines(80)}\n}));`;
  assert.deepEqual(
    check({
      [`${lib}/ui/project.json`]: '{}',
      [`${lib}/ui/src/components/long.tsx`]: lines(151),
      [`${lib}/ui/src/components/styled.tsx`]: styled,
      [`${lib}/ui/src/components/long.spec.tsx`]: lines(400),
      [`${lib}/ui/src/hooks/use-long.ts`]: lines(201),
      [`${lib}/ui/src/hooks/use-short.ts`]: lines(200),
    }),
    [`long-file: ${lib}/ui/src/components/long.tsx`, `long-file: ${lib}/ui/src/hooks/use-long.ts`],
  );
});

test('does not count static copy, generated code, or test helpers as long files', () => {
  assert.deepEqual(
    check({
      'libs/site/home/ui/project.json': '{}',
      'libs/site/home/ui/src/lib/home-ui.spec.tsx': '',
      'libs/site/home/ui/src/lib/i18n/home-dictionary.ts': lines(400),
      'libs/site/home/ui/src/lib/data/agreement-uk.ts': lines(600),
      'libs/admin/shared/contracts/project.json': '{}',
      'libs/admin/shared/contracts/src/generated/openapi.ts': lines(900),
      'libs/admin/shared/contracts/src/generated/openapi.spec.ts': '',
      [`${lib}/feature/project.json`]: '{}',
      [`${lib}/feature/src/testing/api-stub.ts`]: lines(400),
      [`${lib}/feature/src/testing/api-stub.spec.ts`]: '',
    }),
    [],
  );
});

test('flags a component with more than three useState or more than one useEffect', () => {
  const state = 'const [a, setA] = useState(0);\n'.repeat(4);
  const effects = 'useEffect(() => {}, []);\n'.repeat(2);
  assert.deepEqual(
    check({
      [`${lib}/feature/project.json`]: '{}',
      [`${lib}/feature/src/pages/state-page.tsx`]: state,
      [`${lib}/feature/src/pages/effect-page.tsx`]: effects,
      [`${lib}/feature/src/pages/effect-page.spec.tsx`]: effects + effects,
    }),
    [
      `component-state: ${lib}/feature/src/pages/effect-page.tsx`,
      `component-state: ${lib}/feature/src/pages/state-page.tsx`,
    ],
  );
});

test('flags a library with production code and no test', () => {
  assert.deepEqual(
    check({
      'libs/admin/users/data-access/project.json': '{}',
      'libs/admin/users/data-access/src/index.ts': '',
      'libs/admin/users/data-access/src/api/users.api.ts': '',
    }),
    ['missing-tests: libs/admin/users/data-access'],
  );
});

test('allows only composition folders in the Admin application folder', () => {
  assert.deepEqual(
    check({
      'apps/admin-react/src/app/app.tsx': '',
      'apps/admin-react/src/app/store.ts': '',
      'apps/admin-react/src/app/router/app-router.tsx': '',
      'apps/admin-react/src/app/slots/customer-picker.tsx': '',
      'apps/admin-react/src/app/customer-picker.tsx': '',
      'apps/admin-react/src/app/pickers/picker.tsx': '',
    }),
    [
      'app-folder: apps/admin-react/src/app/customer-picker.tsx',
      'app-folder: apps/admin-react/src/app/pickers',
    ],
  );
});

test('ignores the frozen Angular storefront', () => {
  assert.deepEqual(
    check({
      'libs/storefront/util/project.json': '{}',
      'libs/storefront/util/src/lib/utils/format.ts': lines(500),
      'libs/shared/util/project.json': '{}',
      'libs/shared/util/src/lib/helpers.ts': '',
      'apps/storefront/src/app/types.ts': '',
    }),
    [],
  );
});

test('compares violations with the baseline both ways', () => {
  assert.deepEqual(compareWithBaseline(['a', 'b'], ['b', 'c']), { added: ['a'], fixed: ['c'] });
});
