import { expect, test } from '@playwright/test';

import type { Route } from '@playwright/test';

interface FolderFixture {
  id: number;
  name: string;
  parentId: number | null;
  fileCount: number;
}

const photo = (id: number, fileName: string, folderId: number | null) => ({
  id,
  fileName,
  alt: null,
  folderId,
  publicUrl: `/assets/${id}.webp`,
  contentType: 'image/webp',
  sizeInBytes: 120_000,
  width: null,
  height: null,
  createdAt: '2026-11-03T10:00:00Z',
});

const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

test('photo library shows folders, searches, uploads and refuses a used photo', async ({
  page,
}) => {
  const folders: FolderFixture[] = [
    { id: 1, name: 'Товари', parentId: null, fileCount: 1 },
    { id: 2, name: 'Сумки', parentId: 1, fileCount: 1 },
  ];
  let files = [photo(1, 'Жилет.webp', 1), photo(2, 'Сумка.webp', 2)];

  await page.route('**/api/media/folders**', (route) => json(route, folders));
  await page.route('**/api/media/files**', (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (request.method() === 'POST' && url.pathname.endsWith('/api/media/files')) {
      const uploaded = photo(3, 'new-photo.webp', 2);
      files = [...files, uploaded];
      return json(route, uploaded);
    }
    if (request.method() === 'DELETE')
      return json(route, ['Фото використовується, його не можна видалити: Товари «Жилет».'], 409);
    const id = Number(url.pathname.split('/').at(-1));
    if (Number.isInteger(id) && id > 0)
      return json(route, { file: files.find((file) => file.id === id), usages: [] });
    const search = url.searchParams.get('search') ?? '';
    const items = files.filter((file) => file.fileName.includes(search));
    return json(route, { items, total: items.length, page: 1, pageSize: 48 });
  });

  await page.goto('/references/media');
  await expect(page).toHaveURL(/\/media$/);
  await expect(page.getByRole('heading', { name: 'Фото' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Жилет.webp', { exact: true })).toBeVisible();

  await page
    .getByRole('navigation', { name: 'Папки фото' })
    .getByRole('button', { name: /^Сумки/ })
    .click();
  await page.getByLabel('Завантажити фото').setInputFiles({
    name: 'new-photo.webp',
    mimeType: 'image/webp',
    buffer: Buffer.from('valid-image-fixture'),
  });
  await expect(page.getByText('Завантажено фото: 1.')).toBeVisible();

  await page.getByRole('textbox', { name: 'Пошук фото' }).fill('Сумка');
  await expect(page.getByText('Сумка.webp', { exact: true })).toBeVisible();

  await page
    .getByRole('navigation', { name: 'Папки фото' })
    .getByRole('button', { name: /^Усі фото/ })
    .click();
  await page.getByRole('checkbox', { name: 'Вибрати «Жилет.webp»' }).check();
  await page.getByRole('button', { name: 'Видалити вибрані (1)' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Видалити' }).click();
  await expect(page.getByText(/Товари «Жилет»/)).toBeVisible();
});

test('photo library fits supported widths in both themes', async ({ page }) => {
  await page.route('**/api/media/folders**', (route) => json(route, []));
  await page.route('**/api/media/files**', (route) =>
    json(route, { items: [], total: 0, page: 1, pageSize: 48 }),
  );

  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await page.goto('/media');
      await expect(page.getByRole('heading', { name: 'Фото' })).toBeVisible({ timeout: 15000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  }
});
