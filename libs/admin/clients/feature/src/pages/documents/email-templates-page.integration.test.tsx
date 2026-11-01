import { adminApi, createAdminApiStore } from '@admin/shared/api-client';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, expect, it, vi } from 'vitest';

import EmailTemplatesPage from './email-templates-page';
import { EmailTemplateSessionProvider } from '../../hooks/documents/email-templates/email-template-session';

vi.mock('@admin/shared/config', () => ({ appConfig: { apiBaseUrl: 'http://brevi.test' } }));
let store: ReturnType<typeof createAdminApiStore> | undefined;
afterEach(() => {
  cleanup();
  store?.dispatch(adminApi.util.resetApiState());
  vi.unstubAllGlobals();
});

it('creates an immutable email version and activates it only after explicit confirmation using the current revision', async () => {
  const id = '11111111-1111-4111-8111-111111111111';
  const at = '2026-11-01T12:00:00Z';
  let detail: Record<string, unknown> | null = null;
  let active: Record<string, unknown> | null = null;
  let revision = 3;
  const creates: Record<string, unknown>[] = [];
  const activations: Record<string, unknown>[] = [];
  const fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init);
    const path = new URL(request.url).pathname;
    if (request.method === 'POST' && path === '/api/crm/email-templates/versions') {
      const body = (await request.json()) as Record<string, unknown>;
      creates.push(body);
      detail = { versionId: id, number: 1, createdAt: at, ...body };
      return Response.json(detail);
    }
    if (path === '/api/crm/email-templates/active') {
      if (request.method === 'PUT') {
        activations.push((await request.json()) as Record<string, unknown>);
        active = detail;
        revision += 1;
      }
      return Response.json({ revision, active });
    }
    if (path === '/api/crm/email-templates' && request.method === 'GET') {
      const rows = detail ? [detail] : [];
      return Response.json({
        value: rows,
        pagedInfo: {
          pageNumber: 1,
          pageSize: 25,
          totalPages: rows.length ? 1 : 0,
          totalRecords: rows.length,
        },
      });
    }
    throw new Error(`Unexpected request: ${request.method} ${path}`);
  });
  vi.stubGlobal('fetch', fetch);
  store = createAdminApiStore();
  render(
    <EmailTemplateSessionProvider value={{ currentData: ['Admin'], refetch: () => undefined }}>
      <Provider store={store}>
        <EmailTemplatesPage />
      </Provider>
    </EmailTemplateSessionProvider>,
  );
  expect(await screen.findByText('Активного шаблону ще немає.')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/Назва шаблону/), { target: { value: 'Лист КП' } });
  fireEvent.change(screen.getByLabelText(/Тема листа/), { target: { value: 'КП {quoteNumber}' } });
  fireEvent.change(screen.getByLabelText(/Текст листа/), {
    target: { value: 'Вітаємо {recipientName}. {managerName}' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Створити нову версію' }));
  expect(
    await screen.findByText('Створено версію 1. Активація виконується окремо.'),
  ).toBeInTheDocument();
  expect(creates).toHaveLength(1);
  expect(creates[0]).toMatchObject({
    name: 'Лист КП',
    subject: 'КП {quoteNumber}',
    body: 'Вітаємо {recipientName}. {managerName}',
    requestId: expect.any(String),
  });
  expect(activations).toHaveLength(0);
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Активувати цю версію' })).toBeEnabled(),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Активувати цю версію' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(activations).toHaveLength(0);
  fireEvent.click(screen.getByRole('button', { name: 'Підтвердити активацію' }));
  await waitFor(() => expect(activations).toHaveLength(1));
  expect(activations[0]).toEqual({
    versionId: id,
    expectedRevision: 3,
    requestId: expect.any(String),
  });
  expect(await screen.findByText('Активна версія 1: Лист КП.')).toBeInTheDocument();
});

it('parks persistent read denial instead of refetching the private registry indefinitely', async () => {
  let requests = 0;
  let blocked = true;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      requests += 1;
      if (!blocked) {
        const path = new URL(
          typeof input === 'string' ? input : input instanceof URL ? input.href : input.url,
        ).pathname;
        return Response.json(
          path.endsWith('/active')
            ? { revision: 1, active: null }
            : {
                value: [],
                pagedInfo: { pageNumber: 1, pageSize: 25, totalPages: 0, totalRecords: 0 },
              },
        );
      }
      if (requests > 6) return new Promise<Response>(() => undefined);
      return Response.json({ title: 'Forbidden' }, { status: 403 });
    }),
  );
  store = createAdminApiStore();
  render(
    <EmailTemplateSessionProvider value={{ currentData: ['Admin'], refetch: () => undefined }}>
      <Provider store={store}>
        <EmailTemplatesPage />
      </Provider>
    </EmailTemplateSessionProvider>,
  );
  await waitFor(() => expect(requests).toBeGreaterThanOrEqual(2));
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
  expect(requests).toBeLessThanOrEqual(2);
  expect(
    screen.getByText('Доступ до шаблонів листів змінено. Попередні дані приховано.'),
  ).toBeInTheDocument();
  blocked = false;
  fireEvent.click(screen.getByRole('button', { name: 'Оновити доступ' }));
  expect(await screen.findByText('Активного шаблону ще немає.')).toBeInTheDocument();
  expect(requests).toBe(4);
});
