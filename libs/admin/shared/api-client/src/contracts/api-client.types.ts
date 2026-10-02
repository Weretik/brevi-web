import type { AxiosRequestConfig } from 'axios';

export interface ApiRequest {
  readonly url: string;
  readonly method?: AxiosRequestConfig['method'];
  readonly body?: AxiosRequestConfig['data'];
  readonly data?: AxiosRequestConfig['data'];
  readonly params?: AxiosRequestConfig['params'];
  readonly headers?: AxiosRequestConfig['headers'];
}

export type ApiErrorCode =
  | 'Unknown'
  | 'Network'
  | 'Timeout'
  | 'Unauthorized'
  | 'Forbidden'
  | 'NotFound'
  | 'Conflict'
  | 'Validation'
  | 'Server';

export interface ApiError {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly message: string;
  readonly fieldErrors: Record<string, string>;
  readonly traceId?: string;
}

export interface ApiErrorMessages {
  readonly unauthorized?: string;
  readonly notFound?: string;
  readonly conflict?: string;
  readonly badRequest?: string;
  readonly fallback?: string;
}

export interface AuthSessionAdapter {
  readonly getAccessToken: () => string | null | Promise<string | null>;
  readonly refreshAccessToken?: () => Promise<string | null>;
  readonly onUnauthenticated?: () => void | Promise<void>;
}

export type ApiErrorNotifier = (error: ApiError) => void;

export interface ApiClientOptions {
  readonly authSession?: AuthSessionAdapter;
}
