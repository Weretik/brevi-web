import { ApiError } from '../errors/api-error';

export type AsyncStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: ApiError | null;
}
