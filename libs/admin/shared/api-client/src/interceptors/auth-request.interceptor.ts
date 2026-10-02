import { getAuthSession } from '../runtime/api-client-runtime';

import type { TimedRequestConfig } from './api-logging.interceptor';

export async function attachAuthorizationHeader(
  config: TimedRequestConfig,
): Promise<TimedRequestConfig> {
  const accessToken = await getAuthSession()?.getAccessToken();
  if (accessToken) config.headers.set('Authorization', `Bearer ${accessToken}`);
  return config;
}
