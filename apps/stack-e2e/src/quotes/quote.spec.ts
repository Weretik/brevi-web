import { expect, test } from '@playwright/test';

import { e2eData } from '../admin/e2e-data';

test('a КП for a client takes the PPE product with its catalog prices and is saved', async ({
  page,
}) => {
  await page.goto('/crm/quotes');
  await page.getByRole('button', { name: 'Нове КП' }).click();

  const start = page.getByRole('dialog', { name: 'Нове КП' });
  await start.getByRole('combobox', { name: 'Клієнт або запит' }).fill('Клієнт E2E');
  await page.getByRole('option', { name: e2eData.customer }).first().click();
  await start.getByRole('button', { name: 'Перейти до КП' }).click();

  await page.getByRole('button', { name: 'З каталогу' }).click();
  const picker = page.getByRole('dialog', { name: 'Додати товар' });
  await picker.getByRole('tab', { name: 'ЗІЗ' }).click();
  await picker.getByRole('checkbox', { name: `Додати: ${e2eData.product}` }).check();
  await picker.getByRole('button', { name: 'Додати (1)' }).click();

  // The catalog price stays as the field hint until a manager overrides it: 100 ₴ from the supplier + 50 %.
  await expect(
    page.getByRole('textbox', { name: `Ціна: ${e2eData.product}, Ціна, до 9 шт.` }),
  ).toHaveAttribute('placeholder', '150');

  await page.getByRole('button', { name: 'Зберегти і закрити' }).click();
  await expect(page).toHaveURL(/\/crm\/quotes$/);
  await expect(page.getByRole('row').filter({ hasText: e2eData.customer })).toContainText('1');
});
