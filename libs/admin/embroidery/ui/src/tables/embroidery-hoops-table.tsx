import { formatEmbroideryMoney, formatEmbroideryNumber } from '@admin/embroidery/model';
import { Typography } from '@mui/material';

import { EmbroiderySettingsTable } from './embroidery-settings-table';

import type { EmbroiderySettingsColumn } from './embroidery-settings-table';
import type { EmbroideryHoopDraft } from '@admin/embroidery/model';

interface Props {
  hoops: readonly EmbroideryHoopDraft[];
  error?: string;
  rowsWithErrors: ReadonlySet<string>;
  onOpen: (hoop: EmbroideryHoopDraft) => void;
  onAdd: () => void;
}

const size = (value: number | null) => (value === null ? '—' : formatEmbroideryNumber(value));

const columns: EmbroiderySettingsColumn<EmbroideryHoopDraft>[] = [
  { title: 'П’яльця', cell: (hoop) => hoop.label || '—' },
  {
    title: 'Заготовка, см',
    numeric: true,
    cell: (hoop) => `${size(hoop.blankWidthCm)} × ${size(hoop.blankLengthCm)}`,
  },
  {
    title: 'Клей, грн',
    numeric: true,
    cell: (hoop) =>
      hoop.glueRate === null ? (
        <Typography component="span" variant="body2" color="text.secondary">
          загальний
        </Typography>
      ) : (
        formatEmbroideryMoney(hoop.glueRate)
      ),
  },
];

/** «П’яльця»: the blank size of each hoop and its own glue rate. */
export function EmbroideryHoopsTable(props: Props) {
  return (
    <EmbroiderySettingsTable
      id="embroidery-settings-hoops"
      title="П’яльця"
      addLabel="Додати п’яльця"
      rows={props.hoops}
      columns={columns}
      {...props}
    />
  );
}
