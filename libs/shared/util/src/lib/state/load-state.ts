import type { ApiError } from '../errors/api-error';

export type LoadState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadableState<T> {
  state: LoadState;
  data: T;
  error: ApiError | null;
}
