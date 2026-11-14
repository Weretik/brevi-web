import { formatProductionDate } from '@admin/production/model';
import { ReferenceDataGrid } from '@admin/references/ui';

import type { WorkshopEmployee } from '@admin/production/model';
import type { GridColDef } from '@mui/x-data-grid';

type Row = WorkshopEmployee & { name: string };

interface Props {
  rows: WorkshopEmployee[];
  archived: boolean;
  loading: boolean;
  searching: boolean;
  unavailable: boolean;
  onView: (employee: WorkshopEmployee) => void;
  onEdit: (employee: WorkshopEmployee) => void;
  /** Archives an active worker or returns an archived one. */
  onToggleActive: (employee: WorkshopEmployee) => void;
}

const columns: GridColDef<Row>[] = [
  {
    field: 'fullName',
    headerName: 'ПІБ',
    flex: 1,
    minWidth: 220,
    cellClassName: 'reference-strong',
  },
  { field: 'position', headerName: 'Посада', flex: 0.8, minWidth: 180 },
  {
    field: 'updatedAt',
    headerName: 'Змінено',
    width: 130,
    cellClassName: 'reference-mono',
    valueFormatter: (value: string) => formatProductionDate(value),
  },
];

/** «Працівники цеху»: workers in a «Цех» table; archive instead of delete. */
export function WorkshopStaffGrid({ rows, archived, onToggleActive, ...props }: Props) {
  const gridRows = rows.map((row) => ({ ...row, name: row.fullName }));
  return (
    <ReferenceDataGrid
      ariaLabel={archived ? 'Архів працівників' : 'Працівники цеху'}
      rows={gridRows}
      columns={columns}
      emptyLabel={archived ? 'В архіві нікого немає' : 'Працівників поки немає'}
      notFoundLabel="Працівників не знайдено"
      menuLabel="Дії працівника"
      selectable={false}
      selection={{ type: 'include', ids: new Set() }}
      onSelectionChange={() => undefined}
      deleteLabel={archived ? 'Повернути в цех' : 'В архів'}
      deleteRight="edit"
      onDelete={(id) => {
        const employee = rows.find((row) => row.id === id);
        if (employee) onToggleActive(employee);
      }}
      {...props}
    />
  );
}
