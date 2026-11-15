import { HttpError, toApiError } from '../errors/api-error';
import { notifyApiError } from '../runtime/api-client-runtime';

import type { ApiError } from '../contracts/api-client-contract';

/** What an `apiClient` call resolves to: the typed body on success, the parsed error body otherwise. */
type ApiResponse = { data?: unknown; error?: unknown; response: Response };

/** The body type of the success branch of an `apiClient` response. */
type SuccessData<R> = R extends { error?: never; data: infer Data } ? Data : never;

export type ApiCallResult<Result> = { data: Result } | { error: ApiError };

/** Turns the normalized error into the one the feature shows, for example with `toAdminApiError(error, messages)`. */
export type ApiErrorMapper = (error: ApiError) => ApiError;

/**
 * Runs one `apiClient` call for an RTK Query `queryFn`: maps the typed body with `map`, or returns the normalized
 * `ApiError` passed through `mapError`. The mapper receives the response type of the contract, so it is checked
 * against it. An empty success body becomes `null`, since RTK Query needs a value.
 */
export function apiCall<R extends ApiResponse>(
  request: Promise<R>,
): Promise<ApiCallResult<SuccessData<R>>>;
export function apiCall<R extends ApiResponse, Result>(
  request: Promise<R>,
  map: (data: SuccessData<R>) => Result,
  mapError?: ApiErrorMapper,
): Promise<ApiCallResult<Result>>;
export function apiCall<R extends ApiResponse>(
  request: Promise<R>,
  map: undefined,
  mapError: ApiErrorMapper,
): Promise<ApiCallResult<SuccessData<R>>>;
export async function apiCall<R extends ApiResponse, Result>(
  request: Promise<R>,
  map?: (data: SuccessData<R>) => Result,
  mapError?: ApiErrorMapper,
): Promise<ApiCallResult<Result | SuccessData<R>>> {
  try {
    const { data, error, response } = await request;
    if (!response.ok) throw new HttpError(response.status, error, response.statusText);

    const body = (data ?? null) as SuccessData<R>;
    if (!map) return { data: body };

    try {
      return { data: map(body) };
    } catch (mapping) {
      // A body the mapper rejects is the backend's fault: the feature shows the mapper's message as it is.
      throw new InvalidResponseError(response.status, mapping);
    }
  } catch (error) {
    if (error instanceof InvalidResponseError) {
      const invalid = error.toApiError();
      notifyApiError(invalid);

      return { error: invalid };
    }

    const apiError = toApiError(error);
    notifyApiError(apiError);

    return { error: mapError ? mapError(apiError) : apiError };
  }
}

class InvalidResponseError extends Error {
  constructor(
    readonly status: number,
    cause: unknown,
  ) {
    super(cause instanceof Error ? cause.message : 'Некоректна відповідь сервера.', { cause });
  }

  toApiError(): ApiError {
    return { ...toApiError(this.cause), status: this.status, message: this.message };
  }
}

/** The same call for code outside RTK Query: returns the mapped body or throws the `ApiError`. */
export function apiRequest<R extends ApiResponse>(request: Promise<R>): Promise<SuccessData<R>>;
export function apiRequest<R extends ApiResponse, Result>(
  request: Promise<R>,
  map: (data: SuccessData<R>) => Result,
): Promise<Result>;
export async function apiRequest<R extends ApiResponse, Result>(
  request: Promise<R>,
  map?: (data: SuccessData<R>) => Result,
): Promise<Result | SuccessData<R>> {
  const result = map ? await apiCall(request, map) : await apiCall(request);
  if ('error' in result) throw result.error;

  return result.data;
}
