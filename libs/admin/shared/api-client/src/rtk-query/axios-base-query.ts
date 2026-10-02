import { appConfig } from '@admin/shared/config';

import { axiosClient } from '../client/axios-client';
import { toApiError } from '../errors/api-error';

import type { ApiError, ApiRequest } from '../contracts/api-client.types';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

export const axiosBaseQuery: BaseQueryFn<string | ApiRequest, unknown, ApiError> = async (
  request,
  { signal },
) => {
  const args: ApiRequest = typeof request === 'string' ? { url: request } : request;
  try {
    const response = await axiosClient.request({
      url: `${appConfig.apiBaseUrl}${args.url}`,
      method: args.method,
      data: args.data ?? args.body,
      params: args.params,
      headers: args.headers,
      signal,
    });
    return { data: response.data };
  } catch (error) {
    return { error: toApiError(error) };
  }
};
