import { appConfig } from '@admin/shared/config';

import { axiosClient } from './axios-client';
import { toApiError } from '../errors/api-error';

import type { ApiRequest } from '../contracts/api-client.types';

/** Authenticated, uncached binary response; callers own its short-lived URL. */
export async function requestApiBlob(request: ApiRequest, signal?: AbortSignal): Promise<Blob> {
  try {
    const response = await axiosClient.request<Blob>({
      url: `${appConfig.apiBaseUrl}${request.url}`,
      method: request.method ?? 'GET',
      params: request.params,
      headers: request.headers,
      responseType: 'blob',
      signal,
    });
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}
