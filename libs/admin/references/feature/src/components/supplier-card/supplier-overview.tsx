import { SupplierContacts } from '@admin/references/ui';
import { CardMetricStrip, CardSection } from '@admin/shared/ui';
import { Box, Stack, Typography } from '@mui/material';

import { useSupplierOverview } from '../../hooks/supplier-card/use-supplier-overview';

import type { SupplierTab } from '../../hooks/supplier-card/use-supplier-tab';
import type { SupplierCardAccess } from '../../references.routes';
import type { Supplier } from '@admin/references/model';
import type { CardMetric } from '@admin/shared/ui';

interface Props {
  supplier: Supplier;
  access: SupplierCardAccess;
  fabrics: number | undefined;
  accessories: number | undefined;
  from?: string;
  to?: string;
  onTab: (tab: SupplierTab) => void;
}

/** «Огляд» of a supplier card (CARD-001): what we buy, receipts and invoices of the period, contacts. */
export function SupplierOverview(props: Props) {
  const { supplier, access, fabrics, accessories, from, to, onTab } = props;
  const overview = useSupplierOverview({ supplierId: supplier.id, from, to, access });
  const metrics = (
    [
      access.materials && { label: 'Тканини', value: fabrics, onOpen: () => onTab('fabrics') },
      access.materials && {
        label: 'Фурнітура',
        value: accessories,
        onOpen: () => onTab('accessories'),
      },
      access.products && {
        label: 'Товари',
        value: overview.products,
        onOpen: () => onTab('products'),
      },
      access.fabricStock && {
        label: 'Приходи за період',
        value: overview.receipts,
        onOpen: () => onTab('receipts'),
      },
      access.purchaseInvoices && {
        label: 'Рахунки за період',
        value: overview.invoices,
        onOpen: () => onTab('invoices'),
      },
    ] as (CardMetric | false)[]
  ).filter((metric): metric is CardMetric => !!metric);
  const notes = supplier.notes?.trim();

  return (
    <Stack spacing={2}>
      {!!metrics.length && <CardMetricStrip metrics={metrics} />}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(320px, 1fr)' },
          alignItems: 'start',
        }}
      >
        <CardSection title="Що закуповуємо">
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {supplier.purchaseCategories?.trim() || 'Не вказано.'}
          </Typography>
          {supplier.tags && (
            <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1 }}>
              Теги KeepinCRM: {supplier.tags}
            </Typography>
          )}
          {notes && (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 2 }}>
              {notes}
            </Typography>
          )}
        </CardSection>
        <CardSection title="Контакти">
          <SupplierContacts supplier={supplier} />
        </CardSection>
      </Box>
    </Stack>
  );
}
