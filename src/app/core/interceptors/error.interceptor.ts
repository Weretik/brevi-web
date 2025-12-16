import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import type { ApiError } from '@app/core/errors/api-error';
import { inject } from '@angular/core';
import { AppLogger } from '@core/logging/app-logger';

function mapHttpError(errorResponse: HttpErrorResponse): ApiError {
  if (errorResponse.status === 0) {
    return { code: 'Network', status: 0, message: 'Network error. Check connection.' };
  }

  if (errorResponse.status === 401)
    return { code: 'Unauthorized', status: 401, message: 'Unauthorized' };

  if (errorResponse.status === 403) return { code: 'Forbidden', status: 403, message: 'Forbidden' };

  if (errorResponse.status === 404) return { code: 'NotFound', status: 404, message: 'Not found' };

  if (errorResponse.status >= 500)
    return { code: 'Server', status: errorResponse.status, message: 'Server error' };

  const body: any = errorResponse.error;
  const fieldErrors =
    body?.errors && typeof body.errors === 'object'
      ? (body.errors as Record<string, string[]>)
      : undefined;

  const message = body?.message ?? body?.title ?? errorResponse.message ?? 'Request failed';

  return {
    code: fieldErrors ? 'Validation' : 'Unknown',
    status: errorResponse.status,
    message,
    fieldErrors,
    traceId: body?.traceId,
  };
}

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const logger = inject(AppLogger);

  return next(request).pipe(
    catchError((errorResponse: HttpErrorResponse) => {
      logger.logError({
        method: request.method,
        url: request.url,
        status: errorResponse.status,
        durationMs: 0,
        error: errorResponse,
      });
      return throwError(() => mapHttpError(errorResponse));
    }),
  );
};
