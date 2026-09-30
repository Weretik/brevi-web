import { expect, test } from '@playwright/test';

test('operations open directly with the Brevi shell and shared tabs', async ({ page }) => {
  await page.route('**/api/reference/garment-parts', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.route('**/api/reference/garment-part-operations', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.goto('/references/garment-part-operation');
  await expect(page.getByRole('tab', { name: 'Роботи' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('Робіт поки немає')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Brevi' })).toBeVisible();
  await page.getByRole('tab', { name: 'Елементи' }).click();
  await expect(page.getByText('Елементів виробу поки немає')).toBeVisible();
});

test('operations keep form values after error and confirm deletion', async ({ page }) => {
  let deleteRequests = 0;
  await page.route('**/api/reference/garment-parts', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 1, name: 'Рукав' }]),
    }),
  );
  await page.route('**/api/reference/garment-part-operations', (route) => {
    if (route.request().method() === 'POST')
      return route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify([{ identifier: 'Request.Name', errorMessage: 'Назва вже існує.' }]),
      });
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 2, garmentPartName: 'Рукав', name: 'Шов', min: 1 }]),
    });
  });
  await page.route('**/api/reference/garment-part-operations/2', (route) => {
    deleteRequests += 1;
    return route.fulfill({ status: 200 });
  });
  await page.goto('/references/garment-part-operation');
  await expect(page.getByText('Шов')).toBeVisible();
  await page.getByRole('button', { name: 'Створити' }).click();
  const dialog = page.getByRole('dialog', { name: 'Нова робота' });
  await dialog.getByRole('combobox', { name: 'Елемент' }).click();
  await page.getByRole('option', { name: 'Рукав' }).click();
  await dialog.getByRole('textbox', { name: 'Назва' }).fill('Шов');
  await dialog.getByRole('button', { name: 'Зберегти' }).click();
  await expect(dialog.getByText('Назва вже існує.')).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Назва' })).toHaveValue('Шов');
  await dialog.getByRole('button', { name: 'Закрити' }).click();
  await expect(page.getByRole('button', { name: 'Створити' })).toBeFocused();
  await page.getByRole('button', { name: 'Видалити', exact: true }).click();
  expect(deleteRequests).toBe(0);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Підтвердження видалення' })).toBeHidden();
  expect(deleteRequests).toBe(0);
  await page.getByRole('button', { name: 'Видалити', exact: true }).click();
  await page
    .getByRole('dialog', { name: 'Підтвердження видалення' })
    .getByRole('button', { name: 'Видалити' })
    .click();
  await expect(page.getByText('Вибрані записи видалено.')).toBeVisible();
  expect(deleteRequests).toBe(1);
});

test('operations fit three widths in both themes', async ({ page }) => {
  await page.route('**/api/reference/garment-parts', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.route('**/api/reference/garment-part-operations', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/references/garment-part-operation');
    await expect(page.getByRole('tab', { name: 'Роботи' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  }
});
