import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import type { ApiError } from '@shared/util';
import { AppLogger } from '@shared/logging';

type ApiProblemDetails = {
  message?: string;
  title?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toProblemDetails(value: unknown): ApiProblemDetails | undefined {
  if (!isRecord(value)) return undefined;

  const errors = value['errors'];

  return {
    message: typeof value['message'] === 'string' ? value['message'] : undefined,
    title: typeof value['title'] === 'string' ? value['title'] : undefined,
    traceId: typeof value['traceId'] === 'string' ? value['traceId'] : undefined,
    errors: isRecord(errors) ? (errors as Record<string, string[]>) : undefined,
  };
}

function mapHttpError(err: HttpErrorResponse): ApiError {
  if (err.status === 0) {
    return { code: 'Network', status: 0, message: 'Network error. Check connection.' };
  }

  if (err.status === 401) return { code: 'Unauthorized', status: 401, message: 'Unauthorized' };
  if (err.status === 403) return { code: 'Forbidden', status: 403, message: 'Forbidden' };
  if (err.status === 404) return { code: 'NotFound', status: 404, message: 'Not found' };
  if (err.status >= 500) return { code: 'Server', status: err.status, message: 'Server error' };

  const body = toProblemDetails(err.error);
  const fieldErrors = body?.errors && typeof body.errors === 'object' ? body.errors : undefined;

  const message = body?.message ?? body?.title ?? err.message ?? 'Request failed';

  return {
    code: fieldErrors ? 'Validation' : 'Unknown',
    status: err.status,
    message,
    fieldErrors,
    traceId: body?.traceId,
  };
}

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const logger = inject(AppLogger);

  return next(request).pipe(
    catchError((e: unknown) => {
      const err = e instanceof HttpErrorResponse ? e : new HttpErrorResponse({ error: e });

      logger.logError({
        method: request.method,
        url: request.url,
        status: err.status ?? 0,
        durationMs: 0,
        error: err,
      });

      return throwError(() => mapHttpError(err));
    }),
  );
};
