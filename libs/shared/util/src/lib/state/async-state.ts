import type { ApiError } from '@shared/util';

export type AsyncStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: ApiError | null;
}
