import { useListPriceSourcesQuery } from '@admin/references/data-access';
import { PriceSourcesTable, ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Box } from '@mui/material';
import { useState } from 'react';

import { PriceSourceDrawer } from '../../components/price-import/price-source-drawer';

/** «Імпорт цін»: how PPE supplier prices reach Brevi, their discounts and file updates (CAT-017). */
export function PriceImportPage() {
  const { data, isFetching, error, refetch } = useListPriceSourcesQuery();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const sources = data?.sources ?? [];
  const open = sources.find((source) => source.key === openKey) ?? null;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Імпорт цін"
        subtitle="Ціни постачальників ЗІЗ: звідки беремо, коли оновлюємо і яку знижку віднімаємо"
        actions={null}
      />
      <ReferenceListAlerts
        error={error ? adminApiErrorMessage(error, 'Не вдалося завантажити постачальників.') : null}
        loading={isFetching}
        onRetry={() => void refetch()}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      <PriceSourcesTable
        sources={sources}
        loading={isFetching}
        onOpen={(source) => setOpenKey(source.key)}
      />
      {open && (
        <PriceSourceDrawer
          key={open.key}
          source={open}
          canChangeDiscounts={data?.canChangeDiscounts ?? false}
          onClose={() => setOpenKey(null)}
          onDiscountSaved={() => setActionMessage(`Знижку «${open.title}» збережено.`)}
          onApplied={(result) => {
            setOpenKey(null);
            setActionMessage(`Ціни «${open.title}» оновлено: змінено ${result.changed}.`);
          }}
        />
      )}
    </Box>
  );
}

export default PriceImportPage;
