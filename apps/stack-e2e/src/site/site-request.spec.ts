import { expect, test } from '@playwright/test';

const adminUrl = 'http://localhost:4300';

test('a request sent from the site reaches «Заявки з сайту» in the Admin', async ({ page }) => {
  const workwear = `Костюми E2E ${Date.now()}`;

  await page.goto('/uk/request');
  await page.getByLabel(/Ваш телефон/).fill('0501112233');
  await page.getByLabel(/Що потрібно пошити/).fill(workwear);
  await page.getByRole('button', { name: /Отримати попередній/ }).click();
  await expect(page.getByText('Дякуємо! Запит надіслано')).toBeVisible();

  await page.goto(`${adminUrl}/crm/site-requests`);
  await expect(page.getByRole('row').filter({ hasText: workwear })).toContainText('050 111 22 33');
});
