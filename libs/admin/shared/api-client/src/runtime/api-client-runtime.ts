import type {
  ApiClientOptions,
  ApiError,
  ApiErrorNotifier,
  AuthSessionAdapter,
} from '../contracts/api-client.types';

let authSession: AuthSessionAdapter | undefined;
let apiErrorNotifier: ApiErrorNotifier | undefined;

export function configureApiClient({ authSession: nextAuthSession }: ApiClientOptions): void {
  authSession = nextAuthSession;
}

export function configureApiErrorNotifier(nextNotifier: ApiErrorNotifier | undefined): void {
  apiErrorNotifier = nextNotifier;
}

export function getAuthSession(): AuthSessionAdapter | undefined {
  return authSession;
}

export function notifyApiError(error: ApiError): void {
  apiErrorNotifier?.(error);
}
