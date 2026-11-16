import { expect, test as setup } from '@playwright/test';

import { adminCredentials, adminSessionFile, expectDesk, signIn } from './admin-session';
import { e2eData } from './e2e-data';

setup('signs in and adds the reference rows the tests need', async ({ page }) => {
  const { email, password } = adminCredentials();
  await signIn(page, email, password);
  await expectDesk(page);
  await page.context().storageState({ path: adminSessionFile });

  // Host.Seed adds suppliers and fabrics, but no PPE section, markup rule or client.
  const csrf = (await page.context().cookies()).find(
    (cookie) => cookie.name === 'brevi.csrf',
  )?.value;
  const post = async (url: string, data: unknown) => {
    const response = await page.request.post(url, {
      data,
      headers: { 'X-CSRF-Token': csrf ?? '' },
    });
    expect(response.ok(), `${url}: ${response.status()} ${await response.text()}`).toBe(true);
  };
  await post('/api/reference/product-sections', {
    type: 'Ppe',
    name: e2eData.section,
    isActive: true,
  });
  await post('/api/reference/ppe-markup-rules', {
    name: e2eData.markupRule,
    retailMarkup: 0.5,
    wholesaleMarkup: 0.3,
    largeWholesaleMarkup: 0.2,
  });
  await post('/api/crm/customers', {
    requestId: crypto.randomUUID(),
    input: {
      kind: 'organization',
      displayName: e2eData.customer,
      legalName: null,
      taxIdentity: null,
      externalIdentities: [],
    },
  });
});
