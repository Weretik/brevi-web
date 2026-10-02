import { toApiError } from '../errors/api-error';
import { getAuthSession, notifyApiError } from '../runtime/api-client-runtime';

import type { TimedRequestConfig } from './api-logging.interceptor';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

interface RetriableRequestConfig extends TimedRequestConfig {
  _retryAfterRefresh?: boolean;
}

let refreshPromise: Promise<string | null> | undefined;

const isAuthSessionRequest = (url: string | undefined): boolean =>
  url?.includes('/api/auth/session/') ?? false;

const refreshAccessToken = (): Promise<string | null> => {
  const authSession = getAuthSession();
  if (!authSession?.refreshAccessToken) return Promise.resolve(null);
  refreshPromise ??= authSession.refreshAccessToken().finally(() => {
    refreshPromise = undefined;
  });
  return refreshPromise;
};

export async function retryAfterAuthRefresh(
  client: AxiosInstance,
  error: AxiosError,
): Promise<AxiosResponse> {
  const requestConfig = error.config as RetriableRequestConfig | undefined;
  if (
    error.response?.status !== 401 ||
    !requestConfig ||
    requestConfig._retryAfterRefresh ||
    isAuthSessionRequest(requestConfig.url)
  ) {
    notifyApiError(toApiError(error));
    return Promise.reject(error);
  }

  requestConfig._retryAfterRefresh = true;
  try {
    const accessToken = await refreshAccessToken();
    if (!accessToken) throw error;
    requestConfig.headers.set('Authorization', `Bearer ${accessToken}`);
    return await client.request(requestConfig);
  } catch (refreshError) {
    await getAuthSession()?.onUnauthenticated?.();
    notifyApiError(toApiError(refreshError));
    return Promise.reject(refreshError);
  }
}
