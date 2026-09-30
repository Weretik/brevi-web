import { apiUrl } from '@admin/util/api-url';

import { mapSuppliers } from './suppliers.mapper';

import type { Supplier, SupplierDraft } from './suppliers.model';
import type { operations } from '@admin/api-contract';

type CreateBody = operations['createSupplier']['requestBody']['content']['application/json'];
type UpdateBody = operations['updateSupplier']['requestBody']['content']['application/json'];

const endpoint = '/api/reference/suppliers';

export class SupplierApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly fieldErrors: Record<string, string>,
  ) {
    super(
      status === 401 || status === 403
        ? 'Немає доступу до постачальників.'
        : status === 404
          ? 'Постачальника не знайдено. Оновіть список.'
          : status === 409
            ? 'Запис конфліктує з поточними даними. Оновіть список.'
            : status === 400
              ? 'Перевірте введені дані.'
              : 'Не вдалося виконати запит. Спробуйте ще раз.',
    );
  }
}

async function readError(response: Response): Promise<SupplierApiError> {
  const fieldErrors: Record<string, string> = {};
  if (response.status === 400) {
    const payload: unknown = await response.json().catch(() => null);
    if (Array.isArray(payload)) {
      for (const item of payload) {
        if (item && typeof item === 'object') {
          const error = item as Record<string, unknown>;
          if (
            typeof error['identifier'] === 'string' &&
            typeof error['errorMessage'] === 'string'
          ) {
            const field = error['identifier'].replace(/^Request\./, '');
            fieldErrors[field.charAt(0).toLowerCase() + field.slice(1)] = error['errorMessage'];
          }
        }
      }
    }
  }
  return new SupplierApiError(response.status, fieldErrors);
}

async function send(
  path: string,
  init: RequestInit = {},
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  let response: Response;
  try {
    response = await fetcher(apiUrl(path), { credentials: 'same-origin', ...init });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new SupplierApiError(0, {});
  }
  if (!response.ok) throw await readError(response);
  return response;
}

function optional(value: string): string | null {
  return value.trim() || null;
}

function updateBody(draft: SupplierDraft): UpdateBody {
  return {
    name: draft.name.trim(),
    link: optional(draft.link),
    contactPerson: optional(draft.contactPerson),
    phoneNumber: optional(draft.phoneNumber),
    notes: optional(draft.notes),
  };
}

export async function listSuppliers(
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<Supplier[]> {
  const response = await send(endpoint, { signal }, fetcher);
  const payload: unknown = await response.json().catch(() => {
    throw new Error('Некоректна відповідь списку постачальників.');
  });
  return mapSuppliers(payload);
}

export async function createSupplier(
  draft: SupplierDraft,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  const body: CreateBody = { id: draft.id, ...updateBody(draft) };
  await send(
    endpoint,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    fetcher,
  );
}

export async function updateSupplier(
  draft: SupplierDraft,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  await send(
    `${endpoint}/${draft.id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateBody(draft)),
    },
    fetcher,
  );
}

export async function deleteSupplier(id: number, fetcher: typeof fetch = fetch): Promise<void> {
  await send(`${endpoint}/${id}`, { method: 'DELETE' }, fetcher);
}
