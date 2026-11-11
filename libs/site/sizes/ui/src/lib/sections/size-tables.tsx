import { CLOTHING_ROWS, HEIGHT_ROWS, SHOE_ROWS, formatFoot, range } from '../data/size-chart';

import type { SizesDictionary } from '../i18n/sizes-dictionary';
import type { ReactNode } from 'react';

function Table({
  caption,
  head,
  children,
}: {
  caption: string;
  head: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-64 border-collapse text-left text-sm">
        <caption className="border-b border-border px-4 py-3 text-left font-extrabold">
          {caption}
        </caption>
        <thead className="bg-muted text-muted-foreground">
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col" className="px-4 py-2.5 font-bold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono">{children}</tbody>
      </table>
    </div>
  );
}

function Row({ cells }: { cells: string[] }) {
  return (
    <tr className="border-t border-border">
      {cells.map((cell, index) =>
        index === 0 ? (
          <th key={cell} scope="row" className="px-4 py-2.5 font-semibold">
            {cell}
          </th>
        ) : (
          <td key={cell} className="px-4 py-2.5">
            {cell}
          </td>
        ),
      )}
    </tr>
  );
}

/** The three charts as real tables: clothing and height for both figures, and shoes. */
export function SizeTables({
  dictionary,
  showShoes = true,
}: {
  dictionary: SizesDictionary['tables'];
  showShoes?: boolean;
}) {
  const figures = [
    { key: 'men', title: dictionary.men },
    { key: 'women', title: dictionary.women },
  ] as const;

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 md:grid-cols-2">
        {figures.map(({ key, title }) => (
          <Table
            key={key}
            caption={`${dictionary.clothingTitle}: ${title.toLowerCase()}`}
            head={[dictionary.size, dictionary.chest]}
          >
            {CLOTHING_ROWS[key].map((row) => (
              <Row key={row.size} cells={[row.size, range(row.chest)]} />
            ))}
          </Table>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {figures.map(({ key, title }) => (
          <Table
            key={key}
            caption={`${dictionary.heightTitle}: ${title.toLowerCase()}`}
            head={[dictionary.heightGroup, dictionary.heightRange]}
          >
            {HEIGHT_ROWS[key].map((row) => (
              <Row key={row.group} cells={[row.group, range(row.height)]} />
            ))}
          </Table>
        ))}
      </div>
      {showShoes ? (
        <Table caption={dictionary.shoesTitle} head={[dictionary.foot, dictionary.shoeSize]}>
          {SHOE_ROWS.map((row) => (
            <Row key={row.size} cells={[formatFoot(row.foot), String(row.size)]} />
          ))}
        </Table>
      ) : null}
    </div>
  );
}
