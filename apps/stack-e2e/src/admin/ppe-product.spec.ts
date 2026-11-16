import { expect, test } from '@playwright/test';

import { e2eData } from './e2e-data';

test('a PPE product is created with a supplier price and gets prices from the markup rule', async ({
  page,
}) => {
  await page.goto('/references/products/new/ppe');

  await page.getByRole('textbox', { name: 'Назва' }).fill(e2eData.product);
  await page.getByRole('textbox', { name: 'Артикул на сайті' }).fill('E2E-001');
  await page.getByRole('combobox', { name: 'Розділ' }).click();
  await page.getByRole('option', { name: e2eData.section }).click();
  await page.getByRole('combobox', { name: 'Одиниця' }).fill('пара');
  await page.getByRole('combobox', { name: 'Постачальник' }).click();
  await page.getByRole('option', { name: 'Демо-постачальник 05' }).click();
  await page
    .getByRole('textbox', { name: 'Посилання постачальника' })
    .fill('https://supplier.e2e.invalid/gloves');
  await page.getByRole('textbox', { name: 'Ціна постачальника, ₴' }).fill('100');
  // Retail price = supplier price 100 ₴ + 50 % markup of the rule.
  await page.getByRole('combobox', { name: 'Правило націнки' }).click();
  await page.getByRole('option', { name: e2eData.markupRule }).click();
  await expect(page.getByRole('region', { name: 'Готовність' })).toContainText('6 з 6');
  await expect(page.getByRole('region', { name: 'Ціни в прайсі' })).toContainText('150,00 грн');

  await page.getByRole('button', { name: 'Створити ЗІЗ' }).click();
  await expect(page).not.toHaveURL(/\/new\//);

  await page.goto('/references/products?tab=ppe');
  await expect(page.getByRole('row').filter({ hasText: e2eData.product })).toContainText('150');
});
