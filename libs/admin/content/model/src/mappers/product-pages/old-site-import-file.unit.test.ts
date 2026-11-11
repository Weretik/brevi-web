import { describe, expect, it } from 'vitest';

import { readOldSiteImportFile } from './old-site-import-file';

describe('readOldSiteImportFile', () => {
  it('takes the pages from the file body or from a bare list', () => {
    const pages = [{ url: 'https://brevi.com.ua/kostyum-lider/' }];

    expect(readOldSiteImportFile(JSON.stringify({ dryRun: true, items: pages }))).toEqual({
      ok: true,
      items: pages,
    });
    expect(readOldSiteImportFile(JSON.stringify(pages))).toEqual({ ok: true, items: pages });
  });

  it('refuses a file that is not a transfer file', () => {
    expect(readOldSiteImportFile('<html>')).toMatchObject({ ok: false });
    expect(readOldSiteImportFile('{"items":[]}')).toMatchObject({ ok: false });
    expect(readOldSiteImportFile('[{"name":"без посилання"}]')).toMatchObject({ ok: false });
    expect(
      readOldSiteImportFile(JSON.stringify(Array.from({ length: 501 }, () => ({ url: 'a' })))),
    ).toMatchObject({ ok: false, message: expect.stringContaining('501') });
  });
});
