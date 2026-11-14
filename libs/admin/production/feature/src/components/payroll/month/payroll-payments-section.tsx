import { PayrollAdjustmentsTable, PayrollPaymentsTable } from '@admin/production/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';

import type { usePayrollMonthActions } from '../../../hooks/payroll/use-payroll-month-actions';
import type { PayrollMonth, PayrollMonthRights } from '@admin/production/model';

/** «Виплати»: the payments and the other accruals and deductions, each cancellable with a reason. */
export function PayrollPaymentsSection({
  month,
  permissions,
  cancel,
  onAddAdjustment,
}: {
  month: PayrollMonth;
  permissions: PayrollMonthRights;
  cancel: ReturnType<typeof usePayrollMonthActions>['cancel'];
  onAddAdjustment: () => void;
}) {
  const canChange = permissions.canChange;
  return (
    <>
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Виплати
        </Typography>
        <PayrollPaymentsTable
          rows={month.payments}
          busy={cancel.busy}
          onCancel={canChange ? (row) => cancel.request({ kind: 'payment', row }) : undefined}
        />
      </Box>
      <Box>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
        >
          <Typography variant="h6">Інше нарахування / утримання</Typography>
          {permissions.canPay && (
            <Button startIcon={<AddOutlinedIcon />} onClick={onAddAdjustment}>
              Додати
            </Button>
          )}
        </Stack>
        <PayrollAdjustmentsTable
          rows={month.adjustments}
          busy={cancel.busy}
          onCancel={canChange ? (row) => cancel.request({ kind: 'adjustment', row }) : undefined}
        />
      </Box>
    </>
  );
}
