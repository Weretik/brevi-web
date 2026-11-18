import { useImportWorkshopArchiveMutation } from '@admin/production/data-access';
import { parseWorkshopArchiveImportFile, workshopArchiveKindLabels } from '@admin/production/model';
import { WorkshopArchiveDetails } from '@admin/production/ui';
import {
  ReferenceEditorDrawer,
  ReferenceListAlerts,
  ReferencePageHeader,
} from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { WorkshopArchiveResults } from './workshop-archive-results';
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

/** «Швейний цех › Архів цеху»: the old books of the «Цех» and the closed orders, read only. */
export function WorkshopArchivePage({ useOrderActor }: Props) {
  const { canEdit } = usePageRights();
  const actor = useOrderActor();
  const list = useWorkshopArchive();
  const [opened, setOpened] = useState<WorkshopArchiveRow | null>(null);
  const [importing, setImporting] = useState(false);
  const [importArchive] = useImportWorkshopArchiveMutation();

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Архів цеху"
        subtitle="Старий «Графік роботи», старі заявки й закриті завдання. Лише перегляд."
        actions={
          actor.canImport && canEdit ? (
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
      <WorkshopArchiveResults list={list} onOpen={setOpened} />
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
