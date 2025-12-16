import type { ApiError } from './api-error';

export class AppErrorFactory {
  static unknown(error?: unknown): ApiError {
    const technical =
      error instanceof Error ? error.message : error != null ? String(error) : undefined;

    return {
      code: 'Unknown',
      message: technical ? `Unknown error: ${technical}` : 'Unknown error',
    };
  }

  static network(error?: unknown): ApiError {
    return {
      code: 'Network',
      status: 0,
      message: `Network error ${error}. Check connection.`,
    };
  }

  static timeout(error?: unknown): ApiError {
    return {
      code: 'Timeout',
      message: `Request timeout ${error}. Try again.`,
    };
  }

  static unauthorized(): ApiError {
    return { code: 'Unauthorized', status: 401, message: 'Unauthorized' };
  }

  static forbidden(): ApiError {
    return { code: 'Forbidden', status: 403, message: 'Forbidden' };
  }

  static notFound(): ApiError {
    return { code: 'NotFound', status: 404, message: 'Not found' };
  }

  static server(status = 500): ApiError {
    return { code: 'Server', status, message: 'Server error' };
  }

  static validation(
    fieldErrors: Record<string, string[]>,
    status = 400,
    message = 'Validation error',
  ): ApiError {
    return { code: 'Validation', status, message, fieldErrors };
  }

  static fromHttpStatus(status: number, error?: unknown): ApiError {
    if (status === 0) return this.network(error);
    if (status === 401) return this.unauthorized();
    if (status === 403) return this.forbidden();
    if (status === 404) return this.notFound();
    if (status >= 500) return this.server(status);
    return { code: 'Unknown', status, message: 'Request failed' };
  }
}
