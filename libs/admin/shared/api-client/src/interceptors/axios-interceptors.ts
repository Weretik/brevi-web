import { logRequest, logResponse } from './api-logging.interceptor';
import { attachCsrfHeader } from './csrf-request.interceptor';
import { handleUnauthorized } from './unauthorized.interceptor';

import type { TimedRequestConfig } from './api-logging.interceptor';
import type { AxiosError, AxiosInstance } from 'axios';

export function installAxiosInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    const timedConfig = attachCsrfHeader(config as TimedRequestConfig);
    timedConfig.requestStartedAt = Date.now();
    logRequest(timedConfig);
    return timedConfig;
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
      return handleUnauthorized(error);
    },
  );
}
