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
  await expect(page).toHaveURL(/\?tab=parts$/);
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

test('garment parts opens the row menu and confirms deletion', async ({ page }) => {
  let deleted = false;
  let deleteRequests = 0;
  await page.route('**/api/reference/garment-parts', (route) => {
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
  await page.goto('/references/garment-part-operation?tab=parts');
  await expect(page.getByText('Рукав')).toBeVisible();
  const row = page.getByRole('row', { name: /1.*Рукав/ });
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Перегляд' }).click();
  const drawer = page.getByRole('dialog', { name: 'Перегляд елемента виробу' });
  await expect(drawer).toContainText('Рукав');
  await expect(page).toHaveURL(/\?tab=parts$/);
  await drawer.getByRole('button', { name: 'Редагувати' }).click();
  await expect(page.getByRole('dialog', { name: 'Редагування елемента виробу' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Назва' })).toHaveValue('Рукав');
  await page.getByRole('button', { name: 'Скасувати' }).click();
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Видалити' }).click();
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
  await page.route('**/api/reference/garment-part-operations', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/references/garment-part-operation');
    await expect(page.getByRole('tab', { name: 'Елементи' })).toBeVisible();
    await page.getByRole('tab', { name: 'Елементи' }).click();
    await page.getByRole('button', { name: 'Створити' }).click();
    const drawer = page.getByRole('dialog', { name: 'Новий елемент виробу' });
    const drawerBounds = await drawer.boundingBox();
    expect(drawerBounds).not.toBeNull();
    expect(drawerBounds?.x).toBeGreaterThanOrEqual(0);
    expect((drawerBounds?.x ?? 0) + (drawerBounds?.width ?? 0)).toBeLessThanOrEqual(width);
    await drawer.getByRole('button', { name: 'Скасувати' }).click();
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  }
});
