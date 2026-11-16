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

/** The browser session lives in an HttpOnly cookie; the client only hears that it ended. */
export interface AuthSessionAdapter {
  readonly onUnauthenticated?: () => void | Promise<void>;
}

export type ApiErrorNotifier = (error: ApiError) => void;

export interface ApiClientOptions {
  readonly authSession?: AuthSessionAdapter;
}
