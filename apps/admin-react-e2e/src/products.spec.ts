import { expect, test } from '@playwright/test';

test('products create, edit, delete and direct detail use the Brevi shell', async ({ page }) => {
  let productName = 'Рукавиці';
  let productExists = false;
  let createAttempts = 0;
  let detailReads = 0;
  let createBody: Record<string, unknown> | null = null;
  const detail = () => ({
    id: 19,
    name: productName,
    ruName: 'Перчатки',
    slug: 'gloves',
    type: 'Ppe',
    categoryIds: [],
    categories: [],
    descriptionUk: 'Захисні рукавиці',
    descriptionRu: 'Защитные перчатки',
    photos: [],
    informationBlocks: [],
    characteristicTables: [],
    mainPhoto: null,
    createdAtUtc: '2026-09-01T00:00:00Z',
    updatedAtUtc: null,
    minimumWholesalePrice: 20,
    sewing: null,
    ppe: {
      supplier: { id: 1, name: 'Постачальник' },
      basePrice: 10,
      retailPercent: { source: 'Custom', customPercent: 5 },
      wholesalePercent: { source: 'Custom', customPercent: 3 },
      retailPrice: 15,
      wholesalePrice: 13,
    },
  });
  await page.route('**/api/v1/products**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (request.method() === 'POST') {
      createAttempts += 1;
      if (createAttempts === 1)
        return route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify([{ identifier: 'Request.Name', errorMessage: 'Перевірте назву.' }]),
        });
      const body = request.postDataJSON() as { name: string };
      createBody = body;
      productName = body.name;
      productExists = true;
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(detail()),
      });
    }
    if (request.method() === 'PUT') {
      const body = request.postDataJSON() as { name: string };
      productName = body.name;
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(detail()),
      });
    }
    if (request.method() === 'DELETE') {
      productExists = false;
      return route.fulfill({ status: 204 });
    }
    if (url.pathname.endsWith('/19')) {
      detailReads += 1;
      return route.fulfill({
        status: productExists ? 200 : 404,
        contentType: 'application/json',
        body: productExists ? JSON.stringify(detail()) : '',
      });
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        value: productExists ? [detail()] : [],
        pagedInfo: {
          pageNumber: 1,
          pageSize: 20,
          totalPages: productExists ? 1 : 0,
          totalRecords: productExists ? 1 : 0,
        },
      }),
    });
  });
  await page.route('**/api/reference/product-categories/admin', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.route('**/api/catalog/media', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.route('**/api/reference/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: route.request().url().endsWith('/suppliers')
        ? JSON.stringify([
            {
              id: 1,
              name: 'Постачальник',
              link: null,
              contactPerson: null,
              phoneNumber: null,
              notes: null,
            },
          ])
        : '[]',
    }),
  );

  await page.goto('/references/products');
  await expect(page.getByRole('heading', { name: 'Товари' })).toBeVisible({ timeout: 15000 });
  await page.getByRole('link', { name: 'Створити товар' }).click();
  await page.getByRole('spinbutton', { name: 'ID товару' }).fill('19');
  await page.getByRole('textbox', { name: 'Назва українською' }).fill('Рукавиці');
  await page.getByRole('textbox', { name: 'Назва російською' }).fill('Перчатки');
  await page.getByRole('combobox', { name: 'Тип товару' }).click();
  await page.getByRole('option', { name: 'ЗІЗ' }).click();
  await page
    .getByRole('dialog', { name: 'Змінити тип товару?' })
    .getByRole('button', { name: 'Змінити тип' })
    .click();
  await page.getByRole('textbox', { name: 'Опис українською (Markdown)' }).fill('Захисні рукавиці');
  await page.getByRole('textbox', { name: 'Опис російською (Markdown)' }).fill('Защитные перчатки');
  await expect(page.getByText('Попередній перегляд опису')).toBeVisible();
  await page.getByRole('combobox', { name: 'Постачальник' }).click();
  await page.getByRole('option', { name: 'Постачальник' }).click();
  await page.getByRole('spinbutton', { name: 'Базова ціна' }).fill('10');
  await page.getByRole('button', { name: 'Зберегти' }).click();
  await expect(page.getByText('Перевірте назву.')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Назва українською' })).toHaveValue('Рукавиці');
  await page.getByRole('button', { name: 'Зберегти' }).evaluate((button) => {
    (button as HTMLButtonElement).click();
    (button as HTMLButtonElement).click();
  });
  await expect(page.getByRole('heading', { name: 'Рукавиці' })).toBeVisible();
  expect(createAttempts).toBe(2);
  await expect(page.getByText('Slug: gloves')).toBeVisible();
  await expect(page.getByText('Роздрібний відсоток: власний 5%')).toBeVisible();
  expect(createBody).toMatchObject({ name: 'Рукавиці', ruName: 'Перчатки', type: 'Ppe' });
  expect(createBody).not.toHaveProperty('metersPerProduct');
  expect(detailReads).toBe(0);

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Рукавиці' })).toBeVisible();
  expect(detailReads).toBeGreaterThan(0);
  await page.getByRole('link', { name: 'Редагувати' }).click();
  await page.getByRole('textbox', { name: 'Назва українською' }).fill('Нові рукавиці');
  const readsBeforeReplace = detailReads;
  await page.getByRole('button', { name: 'Зберегти' }).click();
  await expect(page.getByRole('heading', { name: 'Нові рукавиці' })).toBeVisible();
  expect(detailReads).toBe(readsBeforeReplace);
  await page.getByRole('button', { name: 'Видалити' }).click();
  await page
    .getByRole('dialog', { name: 'Видалити товар?' })
    .getByRole('button', { name: 'Видалити' })
    .click();
  await expect(page.getByRole('heading', { name: 'Товари' })).toBeVisible();
});

test('product list fits supported widths and a missing detail has a clear state', async ({
  page,
}) => {
  await page.route('**/api/v1/products**', (route) =>
    route.fulfill({
      status: route.request().url().includes('/404') ? 404 : 200,
      contentType: 'application/json',
      body: JSON.stringify({
        value: [],
        pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 0, totalRecords: 0 },
      }),
    }),
  );
  await page.route('**/api/reference/product-categories/admin', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await page.goto('/references/products');
      await expect(page.getByRole('heading', { name: 'Товари' })).toBeVisible({ timeout: 15000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  }
  await page.goto('/references/products/404');
  await expect(page.getByText('Товар не знайдено.')).toBeVisible();
});

test('product paging and search use server parameters and reset to page one', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('**/api/v1/products?*', (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        value: [],
        pagedInfo: {
          pageNumber: Number(url.searchParams.get('page')),
          pageSize: 20,
          totalPages: 3,
          totalRecords: 42,
        },
      }),
    });
  });
  await page.route('**/api/reference/product-categories/admin', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.goto('/references/products');
  await expect(page.getByRole('heading', { name: 'Товари' })).toBeVisible({ timeout: 15000 });
  await expect.poll(() => requests.at(-1)?.searchParams.get('sortBy')).toBe('name');
  expect(requests.at(-1)?.searchParams.get('sortDirection')).toBe('asc');
  await page.getByRole('columnheader', { name: 'ID' }).click();
  await expect.poll(() => requests.at(-1)?.searchParams.get('sortBy')).toBe('id');
  await page.getByRole('button', { name: 'Go to next page' }).click();
  await expect.poll(() => requests.at(-1)?.searchParams.get('page')).toBe('2');
  await page.getByRole('textbox', { name: 'Пошук за ID або назвою' }).fill('Рукавиці');
  await page.getByRole('button', { name: 'Знайти' }).click();
  await expect.poll(() => requests.at(-1)?.searchParams.get('search')).toBe('Рукавиці');
  expect(requests.at(-1)?.searchParams.get('page')).toBe('1');
});

test('a sewing product can be created and fully replaced with its conditional fields', async ({
  page,
}) => {
  let submitted: Record<string, unknown> | null = null;
  let replaced: Record<string, unknown> | null = null;
  let metersPerProduct = 2;
  const detail = () => ({
    id: 20,
    name: 'Куртка',
    ruName: 'Куртка',
    slug: 'jacket',
    type: 'Sewing',
    categoryIds: [],
    categories: [],
    descriptionUk: 'Опис',
    descriptionRu: 'Описание',
    photos: [],
    informationBlocks: [],
    characteristicTables: [],
    mainPhoto: null,
    createdAtUtc: '2026-09-01T00:00:00Z',
    updatedAtUtc: null,
    minimumWholesalePrice: 0,
    sewing: {
      metersPerProduct,
      fabrics: [],
      accessories: [],
      operations: [],
      piecesPerShift: null,
      prices: null,
    },
    ppe: null,
  });
  await page.route('**/api/v1/products', (route) => {
    submitted = route.request().postDataJSON() as Record<string, unknown>;
    return route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(detail()),
    });
  });
  await page.route('**/api/v1/products/20', (route) => {
    if (route.request().method() === 'PUT') {
      replaced = route.request().postDataJSON() as Record<string, unknown>;
      metersPerProduct = Number(replaced['metersPerProduct']);
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(detail()),
    });
  });
  await page.route('**/api/catalog/media', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.route('**/api/reference/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.goto('/references/products/create');
  await page.getByRole('spinbutton', { name: 'ID товару' }).fill('20');
  await page.getByRole('textbox', { name: 'Назва українською' }).fill('Куртка');
  await page.getByRole('textbox', { name: 'Назва російською' }).fill('Куртка');
  await page.getByRole('textbox', { name: 'Опис українською (Markdown)' }).fill('Опис');
  await page.getByRole('textbox', { name: 'Опис російською (Markdown)' }).fill('Описание');
  await page.getByRole('spinbutton', { name: 'Метрів на виріб' }).fill('2');
  await page.getByRole('button', { name: 'Зберегти' }).click();
  await expect(page.getByRole('heading', { name: 'Куртка' })).toBeVisible();
  await expect(page.getByText('Продуктивність: ще не розраховано')).toBeVisible();
  expect(submitted).toMatchObject({
    type: 'Sewing',
    metersPerProduct: 2,
    fabrics: [],
    accessories: [],
    operationIds: [],
  });
  expect(submitted).not.toHaveProperty('supplierId');
  await page.getByRole('link', { name: 'Редагувати' }).click();
  await page.getByRole('spinbutton', { name: 'Метрів на виріб' }).fill('3');
  await page.getByRole('combobox', { name: 'Тип товару' }).click();
  await page.getByRole('option', { name: 'ЗІЗ' }).click();
  await expect(page.getByRole('dialog', { name: 'Змінити тип товару?' })).toBeVisible();
  await page
    .getByRole('dialog', { name: 'Змінити тип товару?' })
    .getByRole('button', { name: 'Скасувати' })
    .click();
  await expect(page.getByRole('spinbutton', { name: 'Метрів на виріб' })).toHaveValue('3');
  await page.getByRole('button', { name: 'Зберегти' }).click();
  await expect(page.getByText('Метри на виріб: 3')).toBeVisible();
  expect(replaced).toMatchObject({
    type: 'Sewing',
    metersPerProduct: 3,
    photos: [],
    informationBlocks: [],
    characteristicTables: [],
  });
  expect(replaced).not.toHaveProperty('supplierId');
});

test('only Ready photos can be attached and reordered', async ({ page }) => {
  let submitted: Record<string, unknown> | null = null;
  let uploadedReady = false;
  await page.route('**/api/catalog/media', (route) => {
    if (route.request().method() === 'POST')
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          mediaFileId: 4,
          storageKey: 'products/fourth.png',
          publicUrl: '/fourth.png',
          contentType: 'image/png',
          originalFileName: 'fourth.png',
        }),
      });
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 1,
          originalFileName: 'first.png',
          publicUrl: '/first.png',
          contentType: 'image/png',
          status: 'Ready',
        },
        {
          id: 2,
          originalFileName: 'pending.png',
          publicUrl: '/pending.png',
          contentType: 'image/png',
          status: 'PendingUpload',
        },
        {
          id: 3,
          originalFileName: 'third.png',
          publicUrl: '/third.png',
          contentType: 'image/png',
          status: 'Ready',
        },
        {
          id: 4,
          originalFileName: 'fourth.png',
          publicUrl: '/fourth.png',
          contentType: 'image/png',
          status: uploadedReady ? 'Ready' : 'PendingUpload',
        },
      ]),
    });
  });
  await page.route('**/api/reference/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.route('**/api/v1/products', (route) => {
    submitted = route.request().postDataJSON() as Record<string, unknown>;
    return route.fulfill({ status: 500 });
  });
  await page.goto('/references/products/create');
  const mediaSelect = page.getByRole('combobox', { name: 'Додати наявне медіа' });
  await mediaSelect.click();
  await expect(page.getByRole('option', { name: 'first.png' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'pending.png' })).toHaveCount(0);
  await page.getByRole('option', { name: 'first.png' }).click();
  await expect(page.getByRole('img', { name: 'first.png' })).toBeVisible();
  await mediaSelect.click();
  await expect(page.getByRole('option', { name: 'first.png' })).toHaveCount(0);
  await page.getByRole('option', { name: 'third.png' }).click();
  await page.getByRole('button', { name: 'Вгору' }).last().click();
  await page
    .locator('input[type="file"]')
    .setInputFiles({ name: 'fourth.png', mimeType: 'image/png', buffer: Buffer.from([1, 2, 3]) });
  await expect(page.getByText('Фото ще не готове.')).toBeVisible();
  await expect(page.getByRole('img', { name: 'fourth.png' })).toHaveCount(0);
  uploadedReady = true;
  await page.getByRole('button', { name: 'Перевірити готовність' }).click();
  await expect(page.getByRole('img', { name: 'fourth.png' })).toBeVisible();
  await page.getByRole('spinbutton', { name: 'ID товару' }).fill('21');
  await page.getByRole('textbox', { name: 'Назва українською' }).fill('Товар');
  await page.getByRole('textbox', { name: 'Назва російською' }).fill('Товар');
  await page.getByRole('textbox', { name: 'Опис українською (Markdown)' }).fill('Опис');
  await page.getByRole('textbox', { name: 'Опис російською (Markdown)' }).fill('Описание');
  await page.getByRole('spinbutton', { name: 'Метрів на виріб' }).fill('1');
  await page.getByRole('button', { name: 'Зберегти' }).click();
  await expect.poll(() => submitted).not.toBeNull();
  expect(submitted?.['photos']).toMatchObject([
    { mediaFileId: 3, sortOrder: 0 },
    { mediaFileId: 1, sortOrder: 1 },
    { mediaFileId: 4, sortOrder: 2 },
  ]);
});

test('PPE reference picker accepts only percent references and sends mixed sources', async ({
  page,
}) => {
  let submitted: Record<string, unknown> | null = null;
  await page.route('**/api/reference/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.route('**/api/catalog/media', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );
  await page.route('**/api/reference/additional-references', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Націнка', key: 'markup', value: 8, unit: '%', description: null },
        { id: 2, name: 'Вага', key: 'weight', value: 4, unit: 'kg', description: null },
      ]),
    }),
  );
  await page.route('**/api/reference/suppliers', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 1,
          name: 'Постачальник',
          link: null,
          contactPerson: null,
          phoneNumber: null,
          notes: null,
        },
      ]),
    }),
  );
  await page.route('**/api/v1/products', (route) => {
    submitted = route.request().postDataJSON() as Record<string, unknown>;
    return route.fulfill({ status: 500 });
  });
  await page.goto('/references/products/create');
  await page.getByRole('combobox', { name: 'Тип товару' }).click();
  await page.getByRole('option', { name: 'ЗІЗ' }).click();
  await page
    .getByRole('dialog', { name: 'Змінити тип товару?' })
    .getByRole('button', { name: 'Змінити тип' })
    .click();
  await page.getByRole('combobox', { name: 'Роздрібний відсоток' }).click();
  await page.getByRole('option', { name: 'З довідника' }).click();
  await page.getByRole('combobox', { name: 'Додатковий довідник' }).click();
  await expect(page.getByRole('option', { name: 'Націнка' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'Вага' })).toHaveCount(0);
  await page.getByRole('option', { name: 'Націнка' }).click();
  await page.getByRole('spinbutton', { name: 'ID товару' }).fill('22');
  await page.getByRole('textbox', { name: 'Назва українською' }).fill('ЗІЗ');
  await page.getByRole('textbox', { name: 'Назва російською' }).fill('СИЗ');
  await page.getByRole('textbox', { name: 'Опис українською (Markdown)' }).fill('Опис');
  await page.getByRole('textbox', { name: 'Опис російською (Markdown)' }).fill('Описание');
  await page.getByRole('combobox', { name: 'Постачальник' }).click();
  await page.getByRole('option', { name: 'Постачальник' }).click();
  await page.getByRole('spinbutton', { name: 'Базова ціна' }).fill('10');
  await page.getByRole('button', { name: 'Зберегти' }).click();
  await expect.poll(() => submitted).not.toBeNull();
  expect(submitted?.['retailPercent']).toEqual({ source: 'Reference', additionalReferenceId: 1 });
  expect(submitted?.['wholesalePercent']).toEqual({ source: 'Custom', customPercent: 0 });
});
