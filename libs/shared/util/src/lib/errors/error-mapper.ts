import { HttpErrorResponse } from '@angular/common/http';

import { AppErrorFactory } from './api-error.factory';

import type { ApiError } from './api-error';

function isChunkLoadError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : typeof e === 'string' ? e : '';
  return /ChunkLoadError|Loading chunk \d+ failed|Failed to fetch dynamically imported module/i.test(
    msg,
  );
}

function tryGetFieldErrors(err: HttpErrorResponse): Record<string, string[]> | null {
  const body: unknown = err.error;

  if (!body || typeof body !== 'object') return null;

  const errors = (body as { errors?: unknown }).errors;
  if (!errors || typeof errors !== 'object') return null;

  return errors as Record<string, string[]>;
}

function tryGetTraceId(err: HttpErrorResponse): string | undefined {
  const body: unknown = err.error;

  if (!body || typeof body !== 'object') return undefined;

  const traceId = (body as { traceId?: unknown }).traceId;
  return typeof traceId === 'string' ? traceId : undefined;
}

export function mapToApiError(error: unknown): ApiError {
  // Http
  if (error instanceof HttpErrorResponse) {
    const fieldErrors = tryGetFieldErrors(error);
    const traceId = tryGetTraceId(error);

    if (fieldErrors) {
      return { ...AppErrorFactory.validation(fieldErrors, error.status), traceId };
    }

    return { ...AppErrorFactory.fromHttpStatus(error.status, error), traceId };
  }

  // Chunk load
  if (isChunkLoadError(error)) {
    return {
      code: 'Unknown',
      message: 'Оновлення застосунку. Перезавантажте сторінку.',
    };
  }

  // Timeout по RxJS (else throwError(() => new TimeoutError()))
  if (error instanceof Error && error.name === 'TimeoutError') {
    return AppErrorFactory.timeout(error);
  }

  // Default
  return AppErrorFactory.unknown(error);
}
