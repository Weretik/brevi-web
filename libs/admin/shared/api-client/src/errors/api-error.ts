import axios from 'axios';

import type { ApiError, ApiErrorCode, ApiErrorMessages } from '../contracts/api-client.types';

type ProblemDetails = {
  detail?: string;
  errors?: Record<string, string[]>;
  title?: string;
  traceId?: string;
};

const fallbackMessage = 'Не вдалося виконати запит. Спробуйте ще раз.';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toStringArray = (value: unknown): string[] | undefined =>
  Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : undefined;

const normalizeFieldName = (value: string): string => {
  const name = value.replace(/^Request\./, '');
  return name.charAt(0).toLowerCase() + name.slice(1);
};

const toProblemDetails = (value: unknown): ProblemDetails | undefined => {
  if (!isRecord(value)) return undefined;

  const errors = isRecord(value['errors'])
    ? Object.entries(value['errors']).reduce<Record<string, string[]>>(
        (mapped, [key, messages]) => {
          const values = toStringArray(messages);
          if (values) mapped[normalizeFieldName(key)] = values;
          return mapped;
        },
        {},
      )
    : undefined;

  return {
    detail: typeof value['detail'] === 'string' ? value['detail'] : undefined,
    errors: errors && Object.keys(errors).length > 0 ? errors : undefined,
    title: typeof value['title'] === 'string' ? value['title'] : undefined,
    traceId: typeof value['traceId'] === 'string' ? value['traceId'] : undefined,
  };
};

const toArdalisFieldErrors = (value: unknown): Record<string, string> => {
  if (!Array.isArray(value)) return {};

  return value.reduce<Record<string, string>>((mapped, item) => {
    if (!isRecord(item)) return mapped;
    const identifier = item['identifier'] ?? item['Identifier'];
    const errorMessage = item['errorMessage'] ?? item['ErrorMessage'];
    if (typeof identifier === 'string' && typeof errorMessage === 'string') {
      mapped[normalizeFieldName(identifier)] ??= errorMessage;
    }
    return mapped;
  }, {});
};

const firstProblemErrors = (problemDetails: ProblemDetails | undefined) =>
  Object.entries(problemDetails?.errors ?? {}).reduce<Record<string, string>>(
    (mapped, [key, messages]) => {
      if (messages[0]) mapped[key] = messages[0];
      return mapped;
    },
    {},
  );

const responseMessage = (value: unknown): string | undefined => {
  const items = Array.isArray(value) ? value : [value];
  const messages = items.flatMap((item) => {
    if (typeof item === 'string') return [item];
    if (!isRecord(item)) return [];
    const message = item['errorMessage'] ?? item['ErrorMessage'] ?? item['message'];
    return typeof message === 'string' ? [message] : [];
  });
  return messages.join(' ').slice(0, 300) || undefined;
};

const errorCode = (status: number, fieldErrors: Record<string, string>): ApiErrorCode => {
  if (status === 0) return 'Network';
  if (status === 401) return 'Unauthorized';
  if (status === 403) return 'Forbidden';
  if (status === 404) return 'NotFound';
  if (status === 409) return 'Conflict';
  if (Object.keys(fieldErrors).length > 0 && status >= 400 && status < 500) return 'Validation';
  if (status >= 500) return 'Server';
  return 'Unknown';
};

export function isApiError(value: unknown): value is ApiError {
  return Boolean(
    isRecord(value) &&
    typeof value['code'] === 'string' &&
    typeof value['status'] === 'number' &&
    typeof value['message'] === 'string' &&
    isRecord(value['fieldErrors']),
  );
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;
  if (!axios.isAxiosError(error)) {
    return { code: 'Unknown', fieldErrors: {}, message: fallbackMessage, status: 0 };
  }
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return {
      code: 'Timeout',
      fieldErrors: {},
      message: 'Час очікування запиту вичерпано.',
      status: 0,
    };
  }
  if (!error.response) {
    return {
      code: 'Network',
      fieldErrors: {},
      message: error.message || fallbackMessage,
      status: 0,
    };
  }

  const { data, status } = error.response;
  const problemDetails = toProblemDetails(data);
  const fieldErrors = {
    ...firstProblemErrors(problemDetails),
    ...toArdalisFieldErrors(data),
  };
  const code = errorCode(status, fieldErrors);
  const message =
    problemDetails?.detail?.trim() ||
    problemDetails?.title?.trim() ||
    responseMessage(data) ||
    error.message ||
    fallbackMessage;

  return { code, fieldErrors, message, status, traceId: problemDetails?.traceId };
}

export function toAdminApiError(error: unknown, messages: ApiErrorMessages = {}): ApiError {
  const normalized = toApiError(error);
  let message = messages.fallback ?? normalized.message ?? fallbackMessage;
  if (normalized.status === 401 || normalized.status === 403) {
    message = messages.unauthorized ?? message;
  } else if (normalized.status === 404) {
    message = messages.notFound ?? message;
  } else if (normalized.status === 409) {
    const backendMessage = axios.isAxiosError(error)
      ? responseMessage(error.response?.data)
      : undefined;
    message = backendMessage ?? messages.conflict ?? message;
  } else if (normalized.status === 400) {
    message = messages.badRequest ?? 'Перевірте введені дані.';
  }
  return { ...normalized, message };
}

export const isAdminApiError = isApiError;

export function adminApiErrorMessage(value: unknown, fallback: string): string {
  return isApiError(value) ? value.message : value instanceof Error ? value.message : fallback;
}
