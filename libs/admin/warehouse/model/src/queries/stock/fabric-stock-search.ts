import type { FabricStockColor, FabricStockFabric } from '../../entities/stock/fabric-stock';

/** The server's colour key: NFC, trimmed, inner spaces collapsed, lower case. */
export const stockColorKey = (color: string) =>
  color.normalize('NFC').trim().split(/\s+/).join(' ').toLocaleLowerCase('uk-UA');

const searchKey = (value: string) => stockColorKey(value);

/**
 * «Залишки» filtered by a case-insensitive search over the codes, name, composition, density and
 * colours. A fabric that matches by itself keeps every colour; otherwise only matching colours stay.
 */
export function searchFabricStock(
  fabrics: readonly FabricStockFabric[],
  search: string,
): FabricStockFabric[] {
  const words = searchKey(search).split(' ').filter(Boolean);
  if (words.length === 0) return [...fabrics];
  const result: FabricStockFabric[] = [];
  for (const fabric of fabrics) {
    const own = searchKey(
      [...fabric.codes, fabric.fabricName, fabric.composition ?? '', fabric.density ?? ''].join(
        ' ',
      ),
    );
    const colors = fabric.colors.filter((color) => {
      const text = `${own} ${color.colorKey}`;
      return words.every((word) => text.includes(word));
    });
    if (colors.length > 0)
      result.push(colors.length === fabric.colors.length ? fabric : { ...fabric, colors });
  }
  return result;
}

/** The pair of a fabric (any of its codes) and colour, if the stock holds it. */
export function findStockPair(
  fabrics: readonly FabricStockFabric[],
  fabricCode: string | null,
  colorKey: string | null,
): { fabric: FabricStockFabric; color: FabricStockColor } | null {
  if (!fabricCode || !colorKey) return null;
  const fabric = fabrics.find((x) => x.codes.includes(fabricCode));
  const color = fabric?.colors.find((x) => x.colorKey === colorKey);
  return fabric && color ? { fabric, color } : null;
}
