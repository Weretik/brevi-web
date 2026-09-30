import { expect, test } from '@playwright/test';

test('garment parts opens directly and from the legacy menu', async ({ page }) => {
  await page.route('**/api/reference/garment-parts', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.route('**/api/reference/garment-part-operations', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.goto('/references/garment-part-operation');
  await expect(page.getByRole('tab', { name: 'Елементи' })).toBeVisible();
  await page.getByRole('tab', { name: 'Елементи' }).click();
  await expect(page.getByText('Елементів виробу поки немає')).toBeVisible();
  const navigation = page.getByRole('navigation', { name: 'Основна навігація' });
  await navigation.getByRole('button', { name: 'Загальні довідники' }).click();
  await expect(navigation.getByRole('link', { name: 'Операції' })).toHaveAttribute(
    'href',
    '/references/garment-part-operation',
  );
  await page.goto('/');
  await page.goBack();
  await expect(page.getByRole('tab', { name: 'Елементи' })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Робочий простір адміністратора' })).toBeVisible();
  await page.goBack();
  await page.setViewportSize({ width: 320, height: 720 });
  await page.getByRole('button', { name: 'Відкрити меню навігації' }).click();
  const mobileNavigation = page.getByRole('navigation', { name: 'Мобільна навігація' });
  await mobileNavigation.getByRole('button', { name: 'Загальні довідники' }).click();
  await expect(mobileNavigation.getByRole('link', { name: 'Операції' })).toHaveAttribute(
    'href',
    '/references/garment-part-operation',
  );
});

test('garment parts validates writes and confirms deletion', async ({ page }) => {
  let deleted = false;
  let deleteRequests = 0;
  await page.route('**/api/reference/garment-parts', (route) => {
    if (route.request().method() === 'POST')
      return route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify([{ identifier: 'Request.Name', errorMessage: 'Назва вже існує.' }]),
      });
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(deleted ? [] : [{ id: 1, name: 'Рукав' }]),
    });
  });
  await page.route('**/api/reference/garment-parts/1', (route) => {
    deleteRequests += 1;
    deleted = true;
    return route.fulfill({ status: 200 });
  });
  await page.goto('/references/garment-part-operation');
  await page.getByRole('tab', { name: 'Елементи' }).click();
  await expect(page.getByText('Рукав')).toBeVisible();
  await page.getByRole('button', { name: 'Створити' }).click();
  const dialog = page.getByRole('dialog', { name: 'Новий елемент виробу' });
  await dialog.getByRole('textbox', { name: 'Назва' }).fill('Рукав');
  await dialog.getByRole('button', { name: 'Зберегти' }).click();
  await expect(dialog.getByText('Назва вже існує.')).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Назва' })).toHaveValue('Рукав');
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

test('garment parts fits three widths in both themes', async ({ page }) => {
  await page.route('**/api/reference/garment-parts', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/references/garment-part-operation');
    await expect(page.getByRole('tab', { name: 'Елементи' })).toBeVisible();
    await page.getByRole('tab', { name: 'Елементи' }).click();
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  }
});
