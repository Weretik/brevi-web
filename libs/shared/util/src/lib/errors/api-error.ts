export type ApiErrorCode =
  | 'Unknown'
  | 'Network'
  | 'Timeout'
  | 'Unauthorized'
  | 'Forbidden'
  | 'NotFound'
  | 'Validation'
  | 'ChunkLoad'
  | 'Server';

export interface ApiError {
  code: ApiErrorCode;
  status?: number;
  message: string;

  fieldErrors?: Record<string, string[]>;
  traceId?: string;
}
