import type { CatalogSpecGroup } from '@site/catalog/model';

/** Characteristics of a product as name and value rows, grouped the way the catalog groups them. */
export function CatalogProductSpecs({ groups }: { groups: readonly CatalogSpecGroup[] }) {
  return (
    <div className="grid max-w-[48rem] gap-6">
      {groups.map((group, index) => (
        <table key={`${group.title}-${index}`} className="w-full border-collapse text-left">
          {group.title ? (
            <caption className="pb-2 text-left font-mono text-[0.8125rem] font-semibold text-brand-text uppercase">
              {group.title}
            </caption>
          ) : null}
          <tbody>
            {group.rows.map((row) => (
              <tr key={row.name} className="border-t last:border-b">
                <th
                  scope="row"
                  className="w-2/5 py-3 pr-4 align-top font-normal text-muted-foreground"
                >
                  {row.name}
                </th>
                <td className="py-3 font-semibold">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}
