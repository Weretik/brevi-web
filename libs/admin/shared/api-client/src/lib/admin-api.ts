import { apiUrl } from '@admin/shared/config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

export interface AdminApiError {
  status: number | 'FETCH_ERROR' | 'PARSING_ERROR' | 'TIMEOUT_ERROR' | 'CUSTOM_ERROR';
  message: string;
  fieldErrors: Record<string, string>;
}

export interface AdminApiErrorMessages {
  unauthorized?: string;
  notFound?: string;
  conflict?: string;
  badRequest?: string;
  fallback?: string;
}

function validationErrors(data: unknown): Record<string, string> {
  if (!Array.isArray(data)) return {};
  const result: Record<string, string> = {};
  for (const item of data) {
    if (!item || typeof item !== 'object') continue;
    const entry = item as Record<string, unknown>;
    if (typeof entry['identifier'] !== 'string' || typeof entry['errorMessage'] !== 'string')
      continue;
    const identifier = entry['identifier'].replace(/^Request\./, '');
    result[identifier.charAt(0).toLowerCase() + identifier.slice(1)] = entry['errorMessage'];
  }
  return result;
}

function responseMessage(data: unknown): string | undefined {
  const items = Array.isArray(data) ? data : [data];
  const messages = items.flatMap((item) => {
    if (typeof item === 'string') return [item];
    if (!item || typeof item !== 'object') return [];
    const entry = item as Record<string, unknown>;
    if (typeof entry['errorMessage'] === 'string') return [entry['errorMessage']];
    if (typeof entry['message'] === 'string') return [entry['message']];
    return [];
  });
  return messages.join(' ').slice(0, 300) || undefined;
}

export function toAdminApiError(
  error: FetchBaseQueryError,
  messages: AdminApiErrorMessages = {},
): AdminApiError {
  const status = error.status;
  const fallback = messages.fallback ?? 'Не вдалося виконати запит. Спробуйте ще раз.';
  let message = fallback;
  if (status === 401 || status === 403) message = messages.unauthorized ?? fallback;
  else if (status === 404) message = messages.notFound ?? fallback;
  else if (status === 409) message = responseMessage(error.data) ?? messages.conflict ?? fallback;
  else if (status === 400) message = messages.badRequest ?? 'Перевірте введені дані.';
  else if (status === 'FETCH_ERROR') message = fallback;
  else if ('error' in error && error.error) message = error.error;

  return {
    status,
    message,
    fieldErrors: status === 400 ? validationErrors(error.data) : {},
  };
}

export function isAdminApiError(value: unknown): value is AdminApiError {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'status' in value &&
    'message' in value &&
    typeof value.message === 'string',
  );
}

export function adminApiErrorMessage(value: unknown, fallback: string): string {
  return isAdminApiError(value) ? value.message : value instanceof Error ? value.message : fallback;
}

const fetchQuery = fetchBaseQuery({ credentials: 'same-origin' });

export const adminBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = (
  args,
  api,
  extraOptions,
) => {
  const request = typeof args === 'string' ? apiUrl(args) : { ...args, url: apiUrl(args.url) };
  return fetchQuery(request, api, extraOptions);
};

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: adminBaseQuery,
  tagTypes: [
    'AdditionalReference',
    'Fabric',
    'GarmentAccessory',
    'GarmentPart',
    'GarmentPartOperation',
    'Media',
    'Product',
    'ProductCategory',
    'Supplier',
  ],
  endpoints: () => ({}),
});
