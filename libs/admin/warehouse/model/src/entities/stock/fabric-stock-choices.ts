/** An active offer of «Тканини» with a FAB- code. */
export interface FabricStockFabricChoice {
  id: number;
  code: string;
  /** Offers with the same group code are the same fabric on the shelf. */
  groupCode: string;
  name: string;
  composition: string | null;
  density: string | null;
  supplier: string | null;
  /** UAH per metre; null for people who do not see prices. */
  price: number | null;
}

export interface FabricStockChoices {
  fabrics: FabricStockFabricChoice[];
  /** Names of «Постачальники» and of the suppliers of «Тканини»; empty for people who cannot move stock. */
  suppliers: string[];
  /** Active colours of «Кольори» in list order; a stock pair takes one of them. */
  colors: string[];
}
