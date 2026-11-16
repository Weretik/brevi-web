import { join } from 'node:path';

import { expect, type Page } from '@playwright/test';

/** Saved Admin cookies; the setup project writes it, the Admin tests start signed in from it. */
export const adminSessionFile = join(
  import.meta.dirname,
  '../../../../test-results/stack-e2e-session/admin-session.json',
);

/** The administrator Host.Seed creates in the empty test database (Identity:AdminUser:Email). */
export function adminCredentials(): { email: string; password: string } {
  const password = process.env['E2E_ADMIN_PASSWORD'];
  if (!password)
    throw new Error('Set E2E_ADMIN_PASSWORD to the ADMIN_DEFAULT_PASSWORD of the test database.');
  return { email: process.env['E2E_ADMIN_EMAIL'] ?? 'admin@e2e.test', password };
}

export async function signIn(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Пароль' }).fill(password);
  await page.getByRole('button', { name: 'Увійти' }).click();
}

export async function expectDesk(page: Page): Promise<void> {
  await expect(page).not.toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: 'Робочий стіл' })).toBeVisible();
}
