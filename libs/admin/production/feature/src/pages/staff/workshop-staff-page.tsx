import { useImportWorkshopStaffMutation } from '@admin/production/data-access';
import {
  countWorkshopPositions,
  filterWorkshopStaff,
  parseStaffImportFile,
} from '@admin/production/model';
import {
  ProductionConfirmDialog,
  WorkshopStaffChips,
  WorkshopStaffGrid,
} from '@admin/production/ui';
import {
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Box, Button, Paper } from '@mui/material';
import { useMemo, useState } from 'react';

import { ProductionImportDrawer } from '../../components/import/production-import-drawer';
import { WorkshopEmployeeDrawer } from '../../components/staff/workshop-employee-drawer';
import { useWorkshopEmployeeActivation } from '../../hooks/staff/use-workshop-employee-activation';
import { useWorkshopStaff } from '../../hooks/staff/use-workshop-staff';

import type { ProductionEditorMode } from '../../hooks/staff/use-workshop-employee-editor';
import type { WorkshopEmployee, WorkshopStaffStatus } from '@admin/production/model';

/** «Швейний цех › Працівники цеху»: the list the head of the workshop records work and pay for. */
export function WorkshopStaffPage() {
  const { rows, loading, error, reload } = useWorkshopStaff();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<WorkshopStaffStatus>('active');
  const [position, setPosition] = useState<string | null>(null);
  const [active, setActive] = useState<{
    mode: ProductionEditorMode;
    employee: WorkshopEmployee | null;
  } | null>(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const activation = useWorkshopEmployeeActivation(setMessage);
  const [importStaff] = useImportWorkshopStaffMutation();
  const filtered = useMemo(
    () => filterWorkshopStaff(rows, search, status, position),
    [rows, search, status, position],
  );
  const inStatus = rows.filter((row) => row.isActive === (status === 'active')).length;
  const activeCount = rows.filter((row) => row.isActive).length;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Працівники цеху"
        subtitle="Швачки, закрійники, майстер. Вони не входять у систему: роботу за них вносить начальник цеху"
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<UploadFileOutlinedIcon />}
              disabled={loading || Boolean(error)}
              onClick={() => setImporting(true)}
            >
              Імпорт
            </Button>
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              disabled={loading || Boolean(error)}
              onClick={() => setActive({ mode: 'create', employee: null })}
            >
              Додати працівника
            </Button>
          </>
        }
      />
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={() => void reload()}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      <ReferenceSearchBar
        placeholder="Знайти за ПІБ або посадою"
        label="Пошук працівників"
        value={search}
        onChange={setSearch}
      />
      <ReferenceFilterRow
        filters={
          <WorkshopStaffChips
            status={status}
            activeCount={activeCount}
            archivedCount={rows.length - activeCount}
            positions={countWorkshopPositions(rows, status)}
            position={position}
            onStatusChange={(next) => {
              setStatus(next);
              setPosition(null);
            }}
            onPositionChange={setPosition}
          />
        }
        count={filtered.length}
        total={inStatus}
        countLabel="Кількість працівників"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <WorkshopStaffGrid
          rows={filtered}
          archived={status === 'archived'}
          loading={loading}
          searching={inStatus > 0}
          unavailable={Boolean(error)}
          onView={(employee) => setActive({ mode: 'view', employee })}
          onEdit={(employee) => setActive({ mode: 'edit', employee })}
          onToggleActive={activation.request}
        />
      </Paper>
      {active && (
        <WorkshopEmployeeDrawer
          key={`${active.mode}-${active.employee?.id ?? 'new'}`}
          mode={active.mode}
          employee={active.employee}
          onClose={() => setActive(null)}
          onSaved={(employee) => {
            setActive(null);
            setMessage(`${employee.fullName}: збережено.`);
          }}
        />
      )}
      {importing && (
        <ProductionImportDrawer
          title="Імпорт працівників"
          description="Файл workshop-staff.json зі старого «Цеху». Нові працівники додаються, у знайдених за ПІБ оновлюється посада."
          keyLabel="ПІБ"
          detailLabel="Посада"
          parse={parseStaffImportFile}
          send={(importRows, dryRun) => importStaff({ rows: importRows, dryRun }).unwrap()}
          onClose={() => setImporting(false)}
        />
      )}
      <ProductionConfirmDialog
        open={activation.pending !== null}
        title={activation.pending?.isActive ? 'Перенести в архів?' : 'Повернути в цех?'}
        text={
          activation.pending?.isActive
            ? `${activation.pending.fullName} зникне зі списку для нових записів. Старі роботи й зарплата залишаться з цим ім'ям.`
            : `${activation.pending?.fullName ?? ''} знову з'явиться в списку працівників.`
        }
        confirmLabel={activation.pending?.isActive ? 'В архів' : 'Повернути'}
        busy={activation.busy}
        onClose={activation.cancel}
        onConfirm={() => void activation.confirm()}
      />
    </Box>
  );
}

export default WorkshopStaffPage;
