export interface CustomerListQuery {
  search?: string;
  active?: boolean;
  page: number;
  pageSize: number;
}
