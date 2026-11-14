import { payrollCsv } from '@admin/production/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Button, Stack } from '@mui/material';

import { downloadCsv } from '../../../hooks/files/download-csv';

import type { PayrollMonth, PayrollMonthRights } from '@admin/production/model';
import type { ReactNode } from 'react';

/** The period switch and the month actions: mark a day, add a payment, Excel, close. */
export function PayrollMonthToolbar({
  month,
  permissions,
  stepper,
  onMarkDay,
  onAddPayment,
  onClose,
}: {
  month: PayrollMonth;
  permissions: PayrollMonthRights;
  stepper: ReactNode;
  onMarkDay?: () => void;
  onAddPayment: () => void;
  onClose: () => void;
}) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ gap: 1, justifyContent: 'space-between', alignItems: { md: 'center' } }}
    >
      {stepper}
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
        {onMarkDay && (
          <Button variant="outlined" onClick={onMarkDay}>
            Відмітити день
          </Button>
        )}
        {permissions.canPay && (
          <Button variant="outlined" startIcon={<AddOutlinedIcon />} onClick={onAddPayment}>
            Додати виплату
          </Button>
        )}
        <Button
          variant="outlined"
          startIcon={<DownloadOutlinedIcon />}
          disabled={month.lines.length === 0}
          onClick={() => downloadCsv(payrollCsv(month), `zarplata-${month.month}.csv`)}
        >
          Excel
        </Button>
        {permissions.canClose && (
          <Button variant="contained" startIcon={<LockOutlinedIcon />} onClick={onClose}>
            Закрити місяць
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
