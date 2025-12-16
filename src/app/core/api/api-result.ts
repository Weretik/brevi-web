import type { ApiError } from '@app/core/errors/api-error';

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };
