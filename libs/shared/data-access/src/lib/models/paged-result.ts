import type { PagedInfo } from './paged-info';

export interface PagedResult<T> {
  pagedInfo: PagedInfo;

  value: T[] | null;

  status?: number;
  isSuccess: boolean;

  successMessage?: string | null;
  correlationId?: string | null;
  location?: string | null;
  errors?: string[] | null;

  validationErrors?: unknown[] | null;
}
