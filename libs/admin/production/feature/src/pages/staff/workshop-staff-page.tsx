import { parseStaffImportFile } from '@admin/production/model';
import {
  ProductionConfirmDialog,
  WorkshopStaffGrid,
  WorkshopTabHeader,
} from '@admin/production/ui';
import { ReferenceListAlerts } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Box, Button, Paper } from '@mui/material';

import { WorkshopStaffFilters } from './workshop-staff-filters';
import { ProductionImportDrawer } from '../../components/import/production-import-drawer';
import { WorkshopEmployeeDrawer } from '../../components/staff/workshop-employee-drawer';
import { useWorkshopStaffPage } from '../../hooks/staff/use-workshop-staff-page';

/** «Швейний цех › Персонал цеху › Працівники»: the list the head of the workshop records work and pay for. */
export function WorkshopStaffPage() {
  const { canCreate } = usePageRights();
  const page = useWorkshopStaffPage();
  const {
    loading,
    error,
    reload,
    status,
    active,
    setActive,
    importing,
    setImporting,
    message,
    setMessage,
    activation,
    importStaff,
    filtered,
    inStatus,
  } = page;
  return (
    <Box sx={{ minWidth: 0 }}>
      <WorkshopTabHeader
        subtitle="Швачки, закрійники, майстер. Вони не входять у систему: роботу за них вносить начальник цеху"
        actions={
          <>
            {canCreate && (
              <Button
                variant="outlined"
                startIcon={<UploadFileOutlinedIcon />}
                disabled={loading || Boolean(error)}
                onClick={() => setImporting(true)}
              >
                Імпорт
              </Button>
            )}
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                disabled={loading || Boolean(error)}
                onClick={() => setActive({ mode: 'create', employee: null })}
              >
                Додати працівника
              </Button>
            )}
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
      <WorkshopStaffFilters page={page} />
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
