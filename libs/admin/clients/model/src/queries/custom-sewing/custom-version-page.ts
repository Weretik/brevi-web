export interface CustomVersionPage {
  readonly rows: readonly { readonly id: string; readonly number: number; readonly name: string }[];
  readonly page: number;
  readonly totalPages: number;
}
