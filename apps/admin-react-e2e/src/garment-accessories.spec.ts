import { expect, test } from '@playwright/test';

test('accessories and fabrics open directly and from the menu', async ({ page }) => {
  for (const path of ['garment-accessories', 'fabrics'])
    await page.route(`**/api/reference/${path}`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
    );
  await page.goto('/references/garment-accessory');
  await expect(page.getByRole('heading', { name: 'Фурнітура' })).toBeVisible();
  await expect(page.getByText('Фурнітури поки немає')).toBeVisible();
  const navigation = page.getByRole('navigation', { name: 'Основна навігація' });
  const accessoriesLink = navigation.getByRole('link', { name: 'Фурнітура', exact: true });
  if (!(await accessoriesLink.isVisible())) {
    await navigation.getByRole('button', { name: 'Загальні довідники' }).click();
  }
  await expect(accessoriesLink).toHaveAttribute('href', '/references/garment-accessory');
  await navigation.getByRole('link', { name: 'Тканини', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Тканини' })).toBeVisible();
  await page.goto('/references/garment-accessory?tab=fabrics');
  await expect(page).toHaveURL(/\/references\/fabric$/);
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
        deleted
          ? []
          : [
              {
                id: 1,
                code: 'FUR-001',
                name: 'Блискавка',
                supplierName: 'Атлас',
                price: 12,
                unit: 'шт.',
                priceUpdatedAt: null,
                isActive: true,
                comment: null,
              },
            ],
      ),
    });
  });
  await page.route('**/api/reference/suppliers', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 2,
          name: 'Атлас',
          link: null,
          contactPerson: null,
          phoneNumber: null,
          notes: null,
          email: null,
          purchaseCategories: null,
          tags: null,
          isActive: true,
          keepinCrmId: null,
          keepinSyncedAt: null,
        },
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
  await page.getByRole('button', { name: 'Додати фурнітуру' }).click();
  const drawer = page.getByRole('dialog', { name: 'Нова фурнітура' });
  await drawer.getByRole('textbox', { name: 'Назва' }).fill('Блискавка');
  await drawer.getByRole('combobox', { name: 'Постачальник' }).click();
  await page.getByRole('option', { name: 'Атлас' }).click();
  await drawer.getByRole('spinbutton', { name: 'Ціна, грн' }).fill('12');
  await drawer.getByRole('button', { name: 'Зберегти' }).click();
  await expect(drawer.getByText('Назва вже існує.')).toBeVisible();
  await expect(drawer.getByRole('textbox', { name: 'Назва' })).toHaveValue('Блискавка');
  await drawer.getByRole('button', { name: 'Скасувати' }).click();
  await expect(page.getByRole('button', { name: 'Додати фурнітуру' })).toBeFocused();
  const row = page.getByRole('row', { name: /FUR-001.*Блискавка/ });
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Переглянути' }).click();
  const viewDrawer = page.getByRole('dialog', { name: 'Перегляд фурнітури' });
  await expect(viewDrawer).toContainText('Блискавка');
  await viewDrawer.getByRole('button', { name: 'Редагувати' }).click();
  const editDrawer = page.getByRole('dialog', { name: 'Редагування фурнітури' });
  await expect(editDrawer.getByRole('textbox', { name: 'Назва' })).toHaveValue('Блискавка');
  await editDrawer.getByRole('button', { name: 'Скасувати' }).click();
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

test('garment accessories fits three widths in both themes', async ({ page }) => {
  await page.route('**/api/reference/garment-accessories', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.route('**/api/reference/fabrics', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.route('**/api/reference/suppliers', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/references/garment-accessory');
    await expect(page.getByText('Фурнітури поки немає')).toBeVisible();
    await page.getByRole('button', { name: 'Додати фурнітуру' }).click();
    const accessoryDrawer = page.getByRole('dialog', { name: 'Нова фурнітура' });
    const accessoryBounds = await accessoryDrawer.boundingBox();
    expect(accessoryBounds).not.toBeNull();
    expect((accessoryBounds?.x ?? 0) + (accessoryBounds?.width ?? 0)).toBeLessThanOrEqual(width);
    await accessoryDrawer.getByRole('button', { name: 'Скасувати' }).click();
    await page.goto('/references/fabric');
    await expect(page.getByText('Тканин поки немає')).toBeVisible();
    await page.getByRole('button', { name: 'Додати тканину' }).click();
    const fabricDrawer = page.getByRole('dialog', { name: 'Нова тканина' });
    const fabricBounds = await fabricDrawer.boundingBox();
    expect(fabricBounds).not.toBeNull();
    expect((fabricBounds?.x ?? 0) + (fabricBounds?.width ?? 0)).toBeLessThanOrEqual(width);
    await fabricDrawer.getByRole('button', { name: 'Скасувати' }).click();
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  }
});
