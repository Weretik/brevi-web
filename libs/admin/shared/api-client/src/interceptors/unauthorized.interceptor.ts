import { toApiError } from '../errors/api-error';
import { getAuthSession, notifyApiError } from '../runtime/api-client-runtime';

import type { AxiosError } from 'axios';

/**
 * A 401 means the browser session ended (expired, signed out elsewhere, or blocked):
 * the auth layer sends the user to the login page. Sign-in calls handle their own 401.
 */
export async function handleUnauthorized(error: AxiosError): Promise<never> {
  if (error.response?.status === 401 && !isAuthRequest(error.config?.url)) {
    await getAuthSession()?.onUnauthenticated?.();
  }

  notifyApiError(toApiError(error));
  return Promise.reject(error);
}

function isAuthRequest(url: string | undefined): boolean {
  return url?.includes('/api/auth/') ?? false;
}
