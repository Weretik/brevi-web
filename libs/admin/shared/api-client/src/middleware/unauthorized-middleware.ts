import { getAuthSession } from '../runtime/api-client-runtime';

import type { Middleware } from 'openapi-fetch';

const isAuthRequest = (url: string) => new URL(url).pathname.startsWith('/api/auth/');

/**
 * A 401 means the browser session ended (expired, signed out elsewhere, or blocked):
 * the auth layer sends the user to the login page. Sign-in calls handle their own 401.
 */
export const unauthorizedMiddleware: Middleware = {
  async onResponse({ request, response }) {
    if (response.status === 401 && !isAuthRequest(request.url)) {
      await getAuthSession()?.onUnauthenticated?.();
    }
  },
};
