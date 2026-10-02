import { expect, test } from '@playwright/test';

test('keeps the Brevi shell on a direct unknown URL and returns home', async ({ page }) => {
  await page.goto('/unknown');

  await expect(page.getByRole('heading', { name: 'Сторінку не знайдено' })).toBeVisible();
  await page.getByRole('link', { name: 'На початок' }).click();
  await expect(page.getByRole('heading', { name: 'Робочий простір адміністратора' })).toBeVisible();
});

test('mobile menu opens by keyboard and closes with visible focus', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/');

  await expect(page.getByText('Brevi Admin')).toBeVisible();
  const menuButton = page.getByRole('button', { name: 'Відкрити меню навігації' });
  await menuButton.focus();
  await page.keyboard.press('Enter');
  const mobileNavigation = page.getByRole('navigation', { name: 'Мобільна навігація' });
  await mobileNavigation.getByRole('button', { name: 'Загальні довідники' }).focus();
  await page.keyboard.press('Enter');
  await expect(mobileNavigation.getByText('Тканина та фурнітура')).toBeVisible();
  await expect(mobileNavigation.getByText('Ще не доступно').first()).toBeVisible();
  await expect(
    mobileNavigation.getByRole('link', { name: 'Тканина та фурнітура' }),
  ).toHaveAttribute('href', '/references/garment-accessory');
  await expect(mobileNavigation.getByRole('link', { name: 'Постачальники' })).toHaveCount(1);
  await page.keyboard.press('Escape');

  await expect(page.getByRole('navigation', { name: 'Мобільна навігація' })).toBeHidden();
  await expect(menuButton).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);

  await page.locator('main').evaluate((main) => {
    main.style.minHeight = '1200px';
  });
  await page.evaluate(() => window.scrollTo(0, 1000));
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test('suppliers URL opens directly and stays in the Brevi shell', async ({ page }) => {
  await page.route('**/api/reference/suppliers', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
  );
  await page.goto('/references/supplier');
  await expect(page.getByRole('heading', { name: 'Постачальники' })).toBeVisible();
  await expect(page.getByText('Постачальників поки немає')).toBeVisible();
  const navigation = page.getByRole('navigation', { name: 'Основна навігація' });
  await navigation.getByRole('button', { name: 'Загальні довідники' }).click();
  await expect(navigation.getByRole('link', { name: 'Постачальники' })).toHaveAttribute(
    'href',
    '/references/supplier',
  );
  await page.goto('/');
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Постачальники' })).toBeVisible();
});

test('supplier actions keep form errors and require delete confirmation', async ({ page }) => {
  let rows = [
    { id: 1, name: 'Атлас', link: null, contactPerson: null, phoneNumber: null, notes: null },
  ];
  let deletes = 0;
  await page.route('**/api/reference/suppliers', (route) => {
    if (route.request().method() === 'POST')
      return route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify([{ identifier: 'Request.Name', errorMessage: 'Назва вже існує.' }]),
      });
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(rows),
    });
  });
  await page.route('**/api/reference/suppliers/1', (route) => {
    deletes += 1;
    rows = [];
    return route.fulfill({ status: 200 });
  });
  await page.goto('/references/supplier');
  await expect(page.getByText('Атлас')).toBeVisible();
  await page.getByRole('button', { name: 'Створити' }).click();
  const dialog = page.getByRole('dialog', { name: 'Новий постачальник' });
  await dialog.getByRole('textbox', { name: 'Назва' }).fill('Атлас');
  await dialog.getByRole('button', { name: 'Зберегти' }).click();
  await expect(dialog.getByText('Назва вже існує.')).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Назва' })).toHaveValue('Атлас');
  await dialog.getByRole('button', { name: 'Закрити' }).click();
  await page.getByRole('row', { name: /1.*Атлас/ }).click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Видалити' }).click();
  expect(deletes).toBe(0);
  await page
    .getByRole('dialog', { name: 'Підтвердження видалення' })
    .getByRole('button', { name: 'Видалити' })
    .click();
  await expect(page.getByText('Вибрані записи видалено.')).toBeVisible();
  expect(deletes).toBe(1);
});

test('suppliers page fits the viewport at three widths in both themes', async ({ page }) => {
  await page.route('**/api/reference/suppliers', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/references/supplier');
    await expect(page.getByRole('heading', { name: 'Постачальники' })).toBeVisible();
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  }
});

test('fabrics tab keeps the shared URL and Brevi shell at three widths in both themes', async ({
  page,
}) => {
  await page.route('**/api/reference/garment-accessories', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.route('**/api/reference/fabrics', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 4, name: 'Льон', providerName: 'Атлас', price: 25 }]),
    }),
  );
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/references/garment-accessory');
    await page.getByRole('tab', { name: 'Тканини' }).click();
    await expect(page.getByRole('grid', { name: 'Тканини' }).getByText('Льон')).toBeVisible();
    await expect(page).toHaveURL(/\/references\/garment-accessory\?tab=fabrics$/);
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  }
});

test('keeps the selected Brevi theme and follows the system scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  const themeButton = page.getByRole('button', { name: 'Вибрати тему оформлення' });
  await themeButton.click();
  await page.getByRole('menuitem', { name: 'Темна', exact: true }).click();
  await page.reload();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(9, 9, 11)');

  await themeButton.click();
  await page.getByRole('menuitem', { name: 'Системна', exact: true }).click();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(230, 230, 230)');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(9, 9, 11)');
});
