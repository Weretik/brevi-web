import { describe, expect, it } from 'vitest';

import { readRedirectImportFile } from './redirect-import-file';

describe('readRedirectImportFile', () => {
  it('reads the items with an optional target', () => {
    const file = readRedirectImportFile(
      JSON.stringify({ items: [{ from: '/a' }, { from: '/b', to: '/uk/b' }] }),
    );
    expect(file).toEqual({ ok: true, items: [{ from: '/a' }, { from: '/b', to: '/uk/b' }] });
  });

  it('refuses a file that is not JSON, is empty or has a row without an address', () => {
    expect(readRedirectImportFile('nope').ok).toBe(false);
    expect(readRedirectImportFile('[]').ok).toBe(false);
    expect(readRedirectImportFile('[{"to":"/uk"}]').ok).toBe(false);
  });
});
