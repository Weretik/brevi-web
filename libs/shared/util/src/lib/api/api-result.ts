import type { ApiError } from '../errors/api-error';

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };
