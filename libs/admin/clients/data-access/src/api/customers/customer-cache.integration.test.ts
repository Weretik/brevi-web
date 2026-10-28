import { createServer } from 'node:http';

import { createAdminApiStore } from '@admin/shared/api-client';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { customersApi } from './customers.api';

import type { CustomerDraft } from '@admin/clients/model';

const runtime = vi.hoisted(() => ({ port: 0 }));
vi.mock('@admin/shared/config', () => ({
  appConfig: {
    get apiBaseUrl() {
      return `http://127.0.0.1:${runtime.port}`;
    },
  },
}));
const idA = '11111111-1111-4111-8111-111111111111';
const idB = '22222222-2222-4222-8222-222222222222';
const hits = new Map<string, number>();
let lastBody: Record<string, unknown> = {};
const detail = (id: string, revision = 1) => ({
  publicId: id,
  kind: 'person',
  displayName: id === idA ? 'Synthetic A' : 'Synthetic B',
  legalName: null,
  taxIdentity: null,
  ownerId: 17,
  active: true,
  revision,
  updatedAt: '2026-10-26T12:00:00Z',
  canEdit: true,
  canMerge: false,
  contacts: [],
  externalIdentities: [],
});
let revisionA = 1;
const server = createServer(async (request, response) => {
  const path = (request.url ?? '').split('?')[0] ?? '';
  hits.set(`${request.method}:${path}`, (hits.get(`${request.method}:${path}`) ?? 0) + 1);
  response.setHeader('content-type', 'application/json');
  if (request.method === 'PUT') {
    let body = '';
    for await (const chunk of request) body += String(chunk);
    lastBody = JSON.parse(body) as Record<string, unknown>;
    revisionA++;
  }
  response.end(
    JSON.stringify(
      path === '/api/crm/customers'
        ? {
            value: [detail(idA, revisionA), detail(idB)],
            pagedInfo: { pageNumber: 1, pageSize: 25, totalPages: 1, totalRecords: 2 },
          }
        : detail(path.endsWith(idA) ? idA : idB, path.endsWith(idA) ? revisionA : 1),
    ),
  );
});

describe('customer HTTP/cache boundary', () => {
  beforeAll(async () => {
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (address && typeof address !== 'string') runtime.port = address.port;
  });
  afterAll(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  });
  it('maps the canonical wire body and refreshes changed customer/list without touching another detail', async () => {
    const store = createAdminApiStore();
    const first = store.dispatch(customersApi.endpoints.getCustomer.initiate(idA));
    const second = store.dispatch(customersApi.endpoints.getCustomer.initiate(idB));
    const list = store.dispatch(
      customersApi.endpoints.listCustomers.initiate({ page: 1, pageSize: 25 }),
    );
    try {
      const [a, b, page] = await Promise.all([first.unwrap(), second.unwrap(), list.unwrap()]);
      expect(a.publicId).toBe(idA);
      expect(b.publicId).toBe(idB);
      expect(page.total).toBe(2);
      const draft: CustomerDraft = {
        kind: 'person',
        displayName: ' Updated A ',
        legalName: '',
        taxIdentity: '',
        active: true,
        externalIdentities: [],
      };
      const requestId = '33333333-3333-4333-8333-333333333333';
      await store
        .dispatch(
          customersApi.endpoints.reviseCustomer.initiate({
            customerId: idA,
            revision: 1,
            requestId,
            draft,
          }),
        )
        .unwrap();
      expect(lastBody['requestId']).toBe(requestId);
      expect(lastBody['expectedRevision']).toBe(1);
      expect(lastBody['input']).toEqual({
        kind: 'person',
        displayName: 'Updated A',
        legalName: null,
        taxIdentity: null,
        externalIdentities: [],
      });
      await vi.waitFor(() => expect(hits.get(`GET:/api/crm/customers/${idA}`)).toBe(2));
      expect(hits.get(`GET:/api/crm/customers/${idB}`)).toBe(1);
      expect(store.getState().adminApi.queries).toBeTruthy();
    } finally {
      first.unsubscribe();
      second.unsubscribe();
      list.unsubscribe();
      store.dispatch(customersApi.util.resetApiState());
    }
  });
});
