import { payrollClosedBy } from '@admin/production/model';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert, Box, Button, Typography } from '@mui/material';

import type { PayrollMonth, PayrollMonthRights } from '@admin/production/model';

/** A closed month with who closed it, and the calculation warnings that block closing. */
export function PayrollMonthNotices({
  month,
  permissions,
  onReopen,
}: {
  month: PayrollMonth;
  permissions: PayrollMonthRights;
  onReopen: () => void;
}) {
  const closedBy = payrollClosedBy(month);
  return (
    <>
      {month.isClosed && (
        <Alert
          severity="info"
          icon={<LockOutlinedIcon />}
          action={
            permissions.canReopen && (
              <Button color="inherit" size="small" onClick={onReopen}>
                Відкрити
              </Button>
            )
          }
        >
          Місяць закрито{closedBy ? ` (${closedBy})` : ''}. Показано розрахунок на момент закриття;
          робота, години й виплати в ньому не змінюються.
        </Alert>
      )}
      {month.warnings.length > 0 && (
        <Alert severity="warning">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {permissions.canPay && !permissions.canClose
              ? 'Місяць не можна закрити, доки є попередження:'
              : 'Попередження розрахунку:'}
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {month.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </Box>
        </Alert>
      )}
    </>
  );
}
