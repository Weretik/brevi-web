import { logRequest, logResponse } from './api-logging.interceptor';
import { retryAfterAuthRefresh } from './auth-refresh.interceptor';
import { attachAuthorizationHeader } from './auth-request.interceptor';
import { toApiError } from '../errors/api-error';
import { notifyApiError } from '../runtime/api-client-runtime';

import type { TimedRequestConfig } from './api-logging.interceptor';
import type { AxiosError, AxiosInstance } from 'axios';

export function installAxiosInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(async (config) => {
    const timedConfig = config as TimedRequestConfig;
    timedConfig.requestStartedAt = Date.now();
    const authorizedConfig = await attachAuthorizationHeader(timedConfig);
    logRequest(authorizedConfig);
    return authorizedConfig;
  });

  client.interceptors.response.use(
    (response) => {
      logResponse(response.config as TimedRequestConfig, response.status);
      return response;
    },
    async (error: AxiosError) => {
      if (error.config) {
        logResponse(error.config as TimedRequestConfig, error.response?.status ?? 0);
      }
      if (error.response?.status === 401) return retryAfterAuthRefresh(client, error);
      notifyApiError(toApiError(error));
      return Promise.reject(error);
    },
  );
}
