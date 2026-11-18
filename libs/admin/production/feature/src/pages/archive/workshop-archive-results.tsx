import { ProductionOrdersGrid, WorkshopArchiveGrid } from '@admin/production/ui';
import { ReferenceSearchBar } from '@admin/references/ui';
import { Alert, Paper, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import type { useWorkshopArchive } from '../../hooks/archive/use-workshop-archive';
import type { WorkshopArchiveRow } from '@admin/production/model';

interface Props {
  list: ReturnType<typeof useWorkshopArchive>;
  onOpen: (row: WorkshopArchiveRow) => void;
}

function DayField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <TextField
      label={label}
      type="date"
      size="small"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{ inputLabel: { shrink: true } }}
      sx={{ width: 170 }}
    />
  );
}

/** Search, the period of the old books and the grid of the chosen archive view. */
export function WorkshopArchiveResults({ list, onOpen }: Props) {
  const navigate = useNavigate();
  const closed = list.view === 'Closed';
  return (
    <>
      <ReferenceSearchBar
        placeholder={
          closed
            ? 'Знайти за номером, клієнтом, КП або моделлю'
            : 'Знайти за замовником, виробом, тканиною чи приміткою'
        }
        label="Пошук в архіві"
        value={list.search}
        onChange={list.setSearch}
      />
      {!closed && (
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
          <DayField label="Від" value={list.from} onChange={list.setFrom} />
          <DayField label="До" value={list.to} onChange={list.setTo} />
        </Stack>
      )}
      {list.wrongPeriod && !closed && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Дата «Від» пізніша за «До».
        </Alert>
      )}
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        {closed ? (
          <ProductionOrdersGrid
            rows={list.closed?.items ?? []}
            rowCount={list.closed?.total ?? 0}
            loading={list.loading}
            searching={list.search !== ''}
            today={list.today}
            paginationModel={list.pagination}
            onPaginationModelChange={list.setPagination}
            onOpen={(row) => navigate(`/production/orders/${row.id}`)}
          />
        ) : (
          <WorkshopArchiveGrid
            rows={list.archive?.items ?? []}
            rowCount={list.archive?.total ?? 0}
            loading={list.loading}
            searching={list.search !== '' || list.from !== '' || list.to !== ''}
            paginationModel={list.pagination}
            onPaginationModelChange={list.setPagination}
            onOpen={onOpen}
          />
        )}
      </Paper>
    </>
  );
}
