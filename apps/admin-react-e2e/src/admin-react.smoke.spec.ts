import { expect, test } from '@playwright/test';

test('serves the Ukrainian Admin application shell', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Brevi Admin');
  await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
  await expect(page.locator('#root')).toBeAttached();
  await expect(page.getByRole('main')).toContainText('Робочий простір адміністратора');
});
