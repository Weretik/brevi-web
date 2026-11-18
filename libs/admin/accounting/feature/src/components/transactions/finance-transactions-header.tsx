import { ReferencePageHeader } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Button, Stack } from '@mui/material';

import type { CategoryDirection } from '@admin/accounting/model';

/** Header of «Операції» with «Надходження» and «Витрата» for those who may create. */
export function FinanceTransactionsHeader({ onAdd }: { onAdd: (type: CategoryDirection) => void }) {
  const { canCreate } = usePageRights();
  return (
    <ReferencePageHeader
      overline="Бухгалтерія"
      title="Операції"
      subtitle="Надходження й витрати. Перекази між своїми рахунками — окремо"
      actions={
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
          {canCreate && (
            <Button
              variant="outlined"
              startIcon={<AddOutlinedIcon />}
              onClick={() => onAdd('Income')}
            >
              Надходження
            </Button>
          )}
          {canCreate && (
            <Button
              variant="contained"
              startIcon={<RemoveOutlinedIcon />}
              onClick={() => onAdd('Expense')}
            >
              Витрата
            </Button>
          )}
        </Stack>
      }
    />
  );
}
