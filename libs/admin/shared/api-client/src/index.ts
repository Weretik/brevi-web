export { adminApi, baseApi } from './rtk-query/base-api';
export {
  AdminApiProvider,
  createAdminApiStore,
  resetAdminApiState,
} from './rtk-query/admin-api-provider';
export {
  adminApiErrorMessage,
  isAdminApiError,
  toAdminApiError,
  toApiError,
} from './errors/api-error';
export { configureApiClient, configureApiErrorNotifier } from './runtime/api-client-runtime';
export type {
  ApiClientOptions,
  ApiError,
  ApiErrorCode,
  ApiErrorMessages,
  ApiErrorNotifier,
  ApiRequest,
  AuthSessionAdapter,
} from './contracts/api-client.types';
export type {
  ApiError as AdminApiError,
  ApiErrorMessages as AdminApiErrorMessages,
} from './contracts/api-client.types';
