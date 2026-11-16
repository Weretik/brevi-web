import { appConfig } from '@admin/shared/config';

/**
 * The request class of `apiClient`. The API address is read on every call, so `configureAppConfig` may run after the
 * client is created; an empty address means the API is on the page origin.
 */
export class ApiRequest extends Request {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(typeof input === 'string' ? apiUrl(input) : input, init);
  }
}

function apiUrl(path: string): string {
  const url = `${appConfig.apiBaseUrl}${path}`;

  return /^https?:\/\//.test(url) ? url : new URL(url, globalThis.location?.origin).toString();
}
