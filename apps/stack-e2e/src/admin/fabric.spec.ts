import { expect, test } from '@playwright/test';

test('a fabric is added in the reference side panel and appears in the list', async ({ page }) => {
  await page.goto('/references/materials');
  await page.getByRole('button', { name: 'Додати тканину' }).click();

  const panel = page.getByRole('dialog');
  await panel.getByRole('textbox', { name: 'Назва (UA)' }).fill('Тканина E2E саржа');
  await panel.getByRole('combobox', { name: 'Постачальник' }).click();
  await page.getByRole('option').first().click();
  await panel.getByRole('spinbutton', { name: 'Ціна за 1 м, грн' }).fill('155');
  await panel.getByRole('button', { name: 'Зберегти' }).click();

  await expect(page.getByRole('alert')).toContainText('Тканину збережено.');
  await page.getByRole('textbox', { name: 'Пошук тканин' }).fill('Тканина E2E');
  await expect(page.getByRole('row').filter({ hasText: 'Тканина E2E саржа' })).toContainText(
    '155,00',
  );
});
