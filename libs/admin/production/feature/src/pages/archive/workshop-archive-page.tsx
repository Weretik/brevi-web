import { useImportWorkshopArchiveMutation } from '@admin/production/data-access';
import { parseWorkshopArchiveImportFile, workshopArchiveKindLabels } from '@admin/production/model';
import {
  ProductionOrdersGrid,
  WorkshopArchiveDetails,
  WorkshopArchiveGrid,
} from '@admin/production/ui';
import {
  ReferenceEditorDrawer,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Alert, Box, Button, Paper, Stack, Tab, Tabs, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProductionImportDrawer } from '../../components/import/production-import-drawer';
import { useWorkshopArchive } from '../../hooks/archive/use-workshop-archive';

import type { WorkshopArchiveView } from '../../hooks/archive/use-workshop-archive';
import type { ProductionOrderActor, WorkshopArchiveRow } from '@admin/production/model';

interface Props {
  useOrderActor: () => ProductionOrderActor;
}

const views: { value: WorkshopArchiveView; label: string }[] = [
  { value: 'Schedule', label: workshopArchiveKindLabels.Schedule },
  { value: 'Request', label: workshopArchiveKindLabels.Request },
  { value: 'Closed', label: 'Закриті завдання' },
];

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

/** «Швейний цех › Архів цеху»: the old books of the «Цех» and the closed orders, read only. */
export function WorkshopArchivePage({ useOrderActor }: Props) {
  const actor = useOrderActor();
  const navigate = useNavigate();
  const list = useWorkshopArchive();
  const [opened, setOpened] = useState<WorkshopArchiveRow | null>(null);
  const [importing, setImporting] = useState(false);
  const [importArchive] = useImportWorkshopArchiveMutation();
  const closed = list.view === 'Closed';

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Архів цеху"
        subtitle="Старий «Графік роботи», старі заявки й закриті завдання. Лише перегляд."
        actions={
          actor.canImport ? (
            <Button
              variant="outlined"
              startIcon={<UploadFileOutlinedIcon />}
              onClick={() => setImporting(true)}
            >
              Імпорт
            </Button>
          ) : null
        }
      />
      <Tabs
        value={list.view}
        onChange={(_event, next: WorkshopArchiveView) => list.setView(next)}
        variant="scrollable"
        sx={{ mb: 2 }}
      >
        {views.map((item) => (
          <Tab key={item.value} value={item.value} label={item.label} />
        ))}
      </Tabs>
      <ReferenceListAlerts
        error={list.error}
        loading={list.loading}
        onRetry={() => void list.reload()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
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
            onOpen={setOpened}
          />
        )}
      </Paper>
      {opened && (
        <ReferenceEditorDrawer
          titleId="workshop-archive-title"
          title={opened.client ?? opened.product ?? 'Запис архіву'}
          description={workshopArchiveKindLabels[list.view === 'Request' ? 'Request' : 'Schedule']}
          formId="workshop-archive-form"
          paperWidth={560}
          readOnly
          editLabel={null}
          saving={false}
          onClose={() => setOpened(null)}
          onEdit={() => undefined}
          onSubmit={() => undefined}
        >
          <WorkshopArchiveDetails row={opened} />
        </ReferenceEditorDrawer>
      )}
      {importing && (
        <ProductionImportDrawer
          title="Імпорт архіву"
          description="Файл workshop-archive.json зі старого «Цеху»: «Графік роботи» і старі заявки. Те, що вже перенесено, пропускаємо. Спершу перевіримо, потім збережемо."
          keyLabel="Рядок"
          detailLabel="Запис"
          parse={parseWorkshopArchiveImportFile}
          send={(rows, dryRun) => importArchive({ rows, dryRun }).unwrap()}
          onClose={() => setImporting(false)}
        />
      )}
    </Box>
  );
}

export default WorkshopArchivePage;
