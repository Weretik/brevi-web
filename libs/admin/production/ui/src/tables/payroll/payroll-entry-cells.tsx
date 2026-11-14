import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { IconButton, Tooltip } from '@mui/material';

export const mono = { fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' } as const;

export const cancelled = (row: { voidedByName: string | null; voidReason: string | null }) =>
  `Скасовано${row.voidedByName ? ` · ${row.voidedByName}` : ''}${row.voidReason ? `: ${row.voidReason}` : ''}`;

export interface PayrollEntryCancelProps<Row> {
  /** Absent: the person may not cancel. */
  onCancel?: (row: Row) => void;
  busy?: boolean;
  /** Show the worker: the month lists everyone, a worker's card one person. */
  showEmployee?: boolean;
}

export function PayrollEntryCancelButton({
  label,
  busy,
  onClick,
}: {
  label: string;
  busy: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip title="Скасувати">
      <span>
        <IconButton size="small" aria-label={label} disabled={busy} onClick={onClick}>
          <UndoOutlinedIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  );
}
