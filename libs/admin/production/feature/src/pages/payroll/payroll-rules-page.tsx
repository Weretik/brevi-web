import { PayrollParametersTable } from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Alert, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { usePayrollParameters } from '../../hooks/payroll/use-payroll-parameters';

/** Where the coefficients are edited: the same values build the price. */
export const pricingParametersPath = '/references/pricing-parameters';

/** «Швейний цех › Правила зарплати»: the coefficients the workshop pays by, read-only. */
export function PayrollRulesPage() {
  const { rows, loading, error, reload } = usePayrollParameters();
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Правила зарплати"
        subtitle="Відсотки й ставки, за якими рахується зарплата цеху"
        actions={
          <Button
            variant="outlined"
            component={RouterLink}
            to={pricingParametersPath}
            startIcon={<OpenInNewOutlinedIcon />}
          >
            Параметри ціноутворення
          </Button>
        }
      />
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={() => void reload()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      <Alert severity="info" sx={{ mb: 2 }}>
        Значення змінюються в «Параметри ціноутворення»: ціна виробу і зарплата цеху рахуються з
        одних і тих самих цифр.
      </Alert>
      <PayrollParametersTable rows={rows} loading={loading} />
    </Box>
  );
}

export default PayrollRulesPage;
