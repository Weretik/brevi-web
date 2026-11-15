import { csrfHeaderName, needsCsrfToken, readCsrfToken } from '../csrf/csrf-token';

import type { Middleware } from 'openapi-fetch';

/** The API checks the CSRF header on every request that can change data. */
export const csrfMiddleware: Middleware = {
  onRequest({ request }) {
    const csrfToken = needsCsrfToken(request.method) ? readCsrfToken() : null;
    if (csrfToken) request.headers.set(csrfHeaderName, csrfToken);

    return request;
  },
};
