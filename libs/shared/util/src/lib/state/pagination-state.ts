export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationState;
}
