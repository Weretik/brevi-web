import { expect, test } from '@playwright/test';

interface MediaFixture {
  id: number;
  originalFileName: string;
  publicUrl: string;
  contentType: string;
  status: 'PendingUpload' | 'Ready';
}

test('media library opens, uploads and handles conflict before deletion', async ({ page }) => {
  let media: MediaFixture[] = [
    {
      id: 1,
      originalFileName: 'Жилет-front.webp',
      publicUrl: '/assets/media-front.webp',
      contentType: 'image/webp',
      status: 'Ready',
    },
    {
      id: 2,
      originalFileName: 'Жилет-back.png',
      publicUrl: '/assets/media-back.png',
      contentType: 'image/png',
      status: 'PendingUpload',
    },
  ];
  let deleteAttempts = 0;

  await page.route('**/api/catalog/media**', async (route) => {
    const request = route.request();
    if (request.method() === 'POST') {
      media = [
        ...media,
        {
          id: 3,
          originalFileName: 'new-photo.webp',
          publicUrl: '/assets/new-photo.webp',
          contentType: 'image/webp',
          status: 'Ready',
        },
      ];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          mediaFileId: 3,
          storageKey: 'catalog/new-photo.webp',
          publicUrl: '/assets/new-photo.webp',
          contentType: 'image/webp',
          originalFileName: 'new-photo.webp',
        }),
      });
    }
    if (request.method() === 'DELETE') {
      deleteAttempts += 1;
      if (deleteAttempts === 1) {
        return route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Media file is used by a product.' }),
        });
      }
      const id = Number(new URL(request.url()).pathname.split('/').at(-1));
      media = media.filter((item) => item.id !== id);
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(media),
    });
  });

  await page.goto('/references/media');
  await expect(page.getByRole('heading', { name: 'Медіа/Фото' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('link', { name: 'Медіа/Фото' })).toHaveAttribute(
    'href',
    '/references/media',
  );
  await expect(page.getByText('Жилет-front.webp', { exact: true })).toBeVisible();
  await expect(page.getByText('Обробляється')).toBeVisible();

  await page.getByLabel('Оберіть фото').setInputFiles({
    name: 'new-photo.webp',
    mimeType: 'image/webp',
    buffer: Buffer.from('valid-image-fixture'),
  });
  await expect(page.getByText('Фото завантажено.')).toBeVisible();
  await expect(page.getByText('new-photo.webp', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Видалити Жилет-front.webp' }).click();
  await page
    .getByRole('dialog', { name: 'Підтвердження видалення' })
    .getByRole('button', { name: 'Видалити' })
    .click();
  await expect(
    page.getByText('Фото використовується товаром і не може бути видалене.'),
  ).toBeVisible();
  await expect(page.getByText('Жилет-front.webp', { exact: true })).toBeVisible();

  await page.getByRole('dialog').getByRole('button', { name: 'Закрити' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Видалити Жилет-front.webp' }).click();
  await page
    .getByRole('dialog', { name: 'Підтвердження видалення' })
    .getByRole('button', { name: 'Видалити' })
    .click();
  await expect(page.getByText('Фото видалено.')).toBeVisible();
  await expect(page.getByText('Жилет-front.webp', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Медіа/Фото' })).toBeFocused();
});

test('media library fits supported widths in both themes', async ({ page }) => {
  await page.route('**/api/catalog/media', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );

  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await page.goto('/references/media');
      await expect(page.getByRole('heading', { name: 'Медіа/Фото' })).toBeVisible({
        timeout: 15000,
      });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  }
});
