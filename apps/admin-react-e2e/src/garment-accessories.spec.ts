import { expect, test } from '@playwright/test';

test('garment accessories opens directly and from the legacy menu', async ({ page }) => {
  await page.route('**/api/reference/garment-accessories', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.goto('/references/garment-accessory');
  await expect(page.getByRole('tab', { name: 'Фурнітура виробу' })).toBeVisible();
  await expect(page.getByText('Фурнітури поки немає')).toBeVisible();
  const navigation = page.getByRole('navigation', { name: 'Основна навігація' });
  await navigation.getByRole('button', { name: 'Загальні довідники' }).click();
  await expect(navigation.getByRole('link', { name: 'Тканина та фурнітура' })).toHaveAttribute(
    'href',
    '/references/garment-accessory',
  );
  await page.goto('/');
  await page.goBack();
  await expect(page.getByRole('tab', { name: 'Фурнітура виробу' })).toBeVisible();
});

test('garment accessory errors keep form values and deletion needs confirmation', async ({
  page,
}) => {
  let deleted = false;
  let deleteRequests = 0;
  await page.route('**/api/reference/garment-accessories', (route) => {
    if (route.request().method() === 'POST')
      return route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify([{ identifier: 'Request.Name', errorMessage: 'Назва вже існує.' }]),
      });
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        deleted ? [] : [{ id: 1, name: 'Блискавка', supplierName: 'Атлас', price: 12 }],
      ),
    });
  });
  await page.route('**/api/reference/suppliers', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 2, name: 'Атлас', link: null, contactPerson: null, phoneNumber: null, notes: null },
      ]),
    }),
  );
  await page.route('**/api/reference/garment-accessories/1', (route) => {
    deleteRequests += 1;
    deleted = true;
    return route.fulfill({ status: 200 });
  });
  await page.goto('/references/garment-accessory');
  await expect(page.getByText('Блискавка')).toBeVisible();
  await page.getByRole('button', { name: 'Створити' }).click();
  const dialog = page.getByRole('dialog', { name: 'Нова фурнітура' });
  await dialog.getByRole('textbox', { name: 'Назва' }).fill('Блискавка');
  await dialog.getByRole('combobox', { name: 'Постачальник' }).click();
  await page.getByRole('option', { name: 'Атлас' }).click();
  await dialog.getByRole('spinbutton', { name: 'Ціна' }).fill('12');
  await dialog.getByRole('button', { name: 'Зберегти' }).click();
  await expect(dialog.getByText('Назва вже існує.')).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Назва' })).toHaveValue('Блискавка');
  await dialog.getByRole('button', { name: 'Закрити' }).click();
  await expect(page.getByRole('button', { name: 'Створити' })).toBeFocused();
  await page.getByRole('button', { name: 'Видалити', exact: true }).click();
  expect(deleteRequests).toBe(0);
  await page
    .getByRole('dialog', { name: 'Підтвердження видалення' })
    .getByRole('button', { name: 'Видалити' })
    .click();
  await expect(page.getByText('Вибрані записи видалено.')).toBeVisible();
  expect(deleteRequests).toBe(1);
});

test('garment accessories fits three widths in both themes', async ({ page }) => {
  await page.route('**/api/reference/garment-accessories', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/references/garment-accessory');
    await expect(page.getByRole('tab', { name: 'Фурнітура виробу' })).toBeVisible();
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  }
});
