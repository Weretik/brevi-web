/** Who may record stock operations and who sees the prices of «Тканини». */
export interface FabricStockPermissions {
  canMove: boolean;
  seesValue: boolean;
}

/** A stock line inside a pair: its own fabric code and balance. */
export interface FabricStockSource {
  id: number;
  fabricCode: string;
  meters: number;
}

/** A fabric and colour on the shelf: every line of the alias group with that colour summed. */
export interface FabricStockColor {
  color: string;
  colorKey: string;
  /** May be below zero: a real issue is never refused for a shortage. */
  meters: number;
  /** Changes whenever any line of the pair changes; «Уточнити» and «Разова витрата» send it back. */
  version: string;
  sources: FabricStockSource[];
}

/** A fabric by its canonical code (FAB-067 → FAB-023, FAB-077 → FAB-078). */
export interface FabricStockFabric {
  fabricCode: string;
  /** Codes of «Тканини» that are this fabric, the canonical first. */
  codes: string[];
  fabricName: string;
  composition: string | null;
  density: string | null;
  meters: number;
  colors: FabricStockColor[];
}

/** «Залишки»: only fabrics and colours that have stock lines, zero and negative included. */
export interface FabricStockList {
  fabrics: FabricStockFabric[];
  meters: number;
  pairs: number;
  /** Pairs below zero. */
  negative: number;
  permissions: FabricStockPermissions;
}

/** A fabric and colour picked on a form, with what the shelf holds now. */
export interface FabricStockPair {
  fabric: FabricStockFabric;
  color: FabricStockColor;
}
