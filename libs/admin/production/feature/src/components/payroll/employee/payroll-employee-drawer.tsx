import { useGetPayrollEmployeeQuery } from '@admin/production/data-access';
import { PayrollEmployeeDetails } from '@admin/production/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Typography } from '@mui/material';

import type { PayrollLine } from '@admin/production/model';

interface Props {
  month: string;
  monthLabel: string;
  line: PayrollLine;
  onClose: () => void;
}

/** A worker's month in detail, read-only. */
export function PayrollEmployeeDrawer({ month, monthLabel, line, onClose }: Props) {
  const detail = useGetPayrollEmployeeQuery({ month, employeeId: line.employeeId });
  return (
    <ReferenceEditorDrawer
      titleId="payroll-employee-title"
      title={line.name}
      description={`${line.position} · ${monthLabel}`}
      formId="payroll-employee"
      paperWidth={720}
      readOnly
      editLabel={null}
      saving={false}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      {detail.error ? (
        <Alert severity="error">
          {adminApiErrorMessage(detail.error, 'Не вдалося завантажити деталізацію.')}
        </Alert>
      ) : detail.data ? (
        <PayrollEmployeeDetails detail={detail.data} />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Завантаження…
        </Typography>
      )}
    </ReferenceEditorDrawer>
  );
}
