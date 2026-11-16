import { expect, test } from '@playwright/test';

test('the home page and the catalog open with the phone and the request link', async ({ page }) => {
  await page.goto('/uk');
  await expect(page).toHaveTitle(/Brevi/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /050 469 86 75/ }).first()).toBeVisible();

  await page.goto('/uk/catalog');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Каталог');
  await expect(page.getByRole('link', { name: 'Залишити заявку' }).first()).toHaveAttribute(
    'href',
    /\/uk\/request/,
  );
});
