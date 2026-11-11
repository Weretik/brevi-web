/** A colour of «Кольори»: the workshop picks item and stock colours only from the active ones. */
export interface FabricColor {
  id: number;
  name: string;
  isActive: boolean;
  sortOrder: number;
}
