/** Which «Склад тканин» parts the signed-in person's «Права доступу» open; each tab keeps its own page. */
export interface WarehouseAccess {
  /** «Склад тканин»: stock, movements and «Витрата за період». */
  stock: boolean;
  planFact: boolean;
  booking: boolean;
  valuation: boolean;
  hardware: boolean;
}
