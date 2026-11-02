import { expect, test } from '@playwright/test';

const parameter = {
  id: 3,
  code: 'ASSEMBLY_RATE',
  group: 'Виробництво',
  name: 'Доплата на збирання виробу',
  value: 0.25,
  unit: '%',
  isCalculated: false,
  updatedOn: '2026-08-30',
  comment: null,
  sortOrder: 7,
};

test('pricing parameters opens from the old URL and saves a percent as a fraction', async ({
  page,
}) => {
  let body: Record<string, unknown> | null = null;
  await page.route('**/api/reference/pricing-parameters', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([parameter]),
    }),
  );
  await page.route('**/api/reference/pricing-parameters/3', (route) => {
    body = route.request().postDataJSON() as Record<string, unknown>;
    return route.fulfill({ status: 200 });
  });
  await page.goto('/references/additional-reference');
  await expect(page.getByRole('heading', { name: 'Параметри ціноутворення' })).toBeVisible();
  await expect(page).toHaveURL(/\/references\/pricing-parameters$/);
  await expect(page.getByText('25 %')).toBeVisible();
  await page.getByRole('button', { name: `Дії: ${parameter.name}` }).click();
  await page.getByRole('menuitem', { name: 'Редагувати' }).click();
  await page.getByRole('textbox', { name: 'Значення' }).fill('30');
  await page.getByRole('button', { name: 'Зберегти' }).click();
  await expect.poll(() => body?.['value']).toBe(0.3);
});

test('pricing parameters fits three widths in both themes', async ({ page }) => {
  await page.route('**/api/reference/pricing-parameters', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/references/pricing-parameters');
    await expect(page.getByText('Параметрів поки немає')).toBeVisible();
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  }
});
