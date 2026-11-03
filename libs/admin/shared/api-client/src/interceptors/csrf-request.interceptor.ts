import { csrfHeaderName, needsCsrfToken, readCsrfToken } from '../csrf/csrf-token';

import type { TimedRequestConfig } from './api-logging.interceptor';

export function attachCsrfHeader(config: TimedRequestConfig): TimedRequestConfig {
  const csrfToken = needsCsrfToken(config.method) ? readCsrfToken() : null;

  if (csrfToken) {
    config.headers.set(csrfHeaderName, csrfToken);
  }

  return config;
}
