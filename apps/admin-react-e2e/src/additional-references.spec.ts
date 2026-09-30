import { expect, test } from '@playwright/test';

test('additional references opens directly and updates a row without extra actions', async ({
  page,
}) => {
  let name = 'Знижка';
  await page.route('**/api/reference/additional-references', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 3, name, key: 'discount', value: 5, unit: '%', description: null },
      ]),
    }),
  );
  await page.route('**/api/reference/additional-references/3', (route) => {
    name = 'Нова знижка';
    return route.fulfill({ status: 200 });
  });
  await page.goto('/references/additional-reference');
  await expect(page.getByRole('heading', { name: 'Додаткові довідники' })).toBeVisible();
  const navigation = page.getByRole('navigation', { name: 'Основна навігація' });
  await navigation.getByRole('button', { name: 'Загальні довідники' }).click();
  await expect(navigation.getByRole('link', { name: 'Додаткові довідники' })).toHaveAttribute(
    'href',
    '/references/additional-reference',
  );
  await expect(page.getByText('Знижка', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /створити|видалити/i })).toHaveCount(0);
  await page.getByRole('button', { name: 'Редагувати' }).click();
  const dialog = page.getByRole('dialog', { name: 'Редагування додаткового довідника' });
  await dialog.getByRole('textbox', { name: 'Назва' }).fill('Нова знижка');
  await dialog.getByRole('button', { name: 'Зберегти' }).click();
  await expect(page.getByText('Нова знижка')).toBeVisible();
  await page.goto('/');
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Додаткові довідники' })).toBeVisible();
});

test('additional references fits three widths in both themes', async ({ page }) => {
  await page.route('**/api/reference/additional-references', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/references/additional-reference');
    await expect(page.getByText('Додаткових довідників поки немає')).toBeVisible();
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  }
});
