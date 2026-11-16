import { expect, test } from '@playwright/test';

import { adminCredentials, expectDesk, signIn } from './admin-session';

// A fresh browser: this test checks the sign-in form itself, not the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test('a wrong password is refused and the right one opens the desk', async ({ page }) => {
  const { email, password } = adminCredentials();

  await signIn(page, email, `${password}-wrong`);
  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByRole('alert').filter({ hasText: 'Невірний email або пароль' }),
  ).toBeVisible();

  await signIn(page, email, password);
  await expectDesk(page);
});
