import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { ApiError, ApiErrorCode, ArdalisValidationError } from '@shared/util';
import { catchError, throwError } from 'rxjs';

export class AppApiError extends Error implements ApiError {
  constructor(
    public code: ApiErrorCode,
    public override message: string,
    public status?: number,
    public fieldErrors?: Record<string, string[]>,
    public traceId?: string,
  ) {
    super(message);
    this.name = 'AppApiError';
  }
}

type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
};

function isProgressEventLike(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'constructor' in value &&
    (value as { constructor?: { name?: string } }).constructor?.name === 'ProgressEvent'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((x) => typeof x === 'string');
}

function toFieldErrorsFromArdalisArray(value: unknown): Record<string, string[]> | undefined {
  if (!Array.isArray(value)) return undefined;

  const mapped: Record<string, string[]> = {};

  for (const item of value) {
    if (!isRecord(item)) continue;

    const id = (item['identifier'] ?? item['Identifier']) as ArdalisValidationError['identifier'];

    const msg = (item['errorMessage'] ??
      item['ErrorMessage']) as ArdalisValidationError['errorMessage'];

    if (typeof id !== 'string' || typeof msg !== 'string') continue;

    if (!mapped[id]) mapped[id] = [];
    mapped[id].push(msg);
  }

  return Object.keys(mapped).length ? mapped : undefined;
}

function toProblemDetails(value: unknown): ProblemDetails | undefined {
  if (!isRecord(value)) return undefined;

  const errorsRaw = value['errors'];
  let errors: Record<string, string[]> | undefined;

  if (isRecord(errorsRaw)) {
    const mapped: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(errorsRaw)) {
      if (isStringArray(v)) mapped[k] = v;
    }
    if (Object.keys(mapped).length > 0) errors = mapped;
  }

  return {
    type: typeof value['type'] === 'string' ? value['type'] : undefined,
    title: typeof value['title'] === 'string' ? value['title'] : undefined,
    status: typeof value['status'] === 'number' ? value['status'] : undefined,
    detail: typeof value['detail'] === 'string' ? value['detail'] : undefined,
    instance: typeof value['instance'] === 'string' ? value['instance'] : undefined,
    traceId: typeof value['traceId'] === 'string' ? value['traceId'] : undefined,
    errors,
  };
}

function mapHttpError(err: HttpErrorResponse): AppApiError {
  if (err.status === 0) {
    const message = isProgressEventLike(err.error)
      ? 'Network error (blocked/aborted/offline).'
      : 'Network error. Check connection.';
    return new AppApiError('Network', message, 0);
  }
  if (err.status === 401) return new AppApiError('Unauthorized', 'Unauthorized', 401);
  if (err.status === 403) return new AppApiError('Forbidden', 'Forbidden', 403);
  if (err.status === 404) return new AppApiError('NotFound', 'Not found', 404);

  const ardalisFieldErrors = toFieldErrorsFromArdalisArray(err.error);

  const pd = toProblemDetails(err.error);
  const fieldErrors = ardalisFieldErrors ?? pd?.errors;

  const message = pd?.detail?.trim() || pd?.title?.trim() || err.message || 'Request failed';

  if (fieldErrors && err.status >= 400 && err.status < 500) {
    return new AppApiError(
      'Validation',
      message || 'Validation failed',
      err.status,
      fieldErrors,
      pd?.traceId,
    );
  }

  if (err.status >= 500) {
    return new AppApiError('Server', message || 'Server error', err.status, undefined, pd?.traceId);
  }

  return new AppApiError('Unknown', message, err.status, undefined, pd?.traceId);
}

export const errorInterceptor: HttpInterceptorFn = (_req, next) =>
  next(_req).pipe(
    catchError((e: unknown) => {
      const httpErr = e instanceof HttpErrorResponse ? e : new HttpErrorResponse({ error: e });

      return throwError(() => mapHttpError(httpErr));
    }),
  );
