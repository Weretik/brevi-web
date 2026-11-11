import type { FabricColor } from '../../entities/fabric-colors/fabric-color';

/** Local search over the colour name. */
export function filterFabricColors(rows: FabricColor[], search: string): FabricColor[] {
  const query = search.trim().toLocaleLowerCase('uk');
  return query ? rows.filter((row) => row.name.toLocaleLowerCase('uk').includes(query)) : rows;
}
