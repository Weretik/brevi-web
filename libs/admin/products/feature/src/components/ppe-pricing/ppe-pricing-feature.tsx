import { useGetPpeProductPricesQuery, useGetProductAccessQuery } from '@admin/products/data-access';
import { PpePricingPanel } from '@admin/products/ui';
import { Alert, Button, CircularProgress, Stack } from '@mui/material';
import { useState } from 'react';

import { PpePricingInputsEditor } from './ppe-pricing-inputs-editor';
import { pricingErrorMessage } from '../../model/pricing/pricing-error-message';

export function PpePricingFeature({
  productId,
  initialSupplierCost,
}: {
  productId: number;
  initialSupplierCost?: number;
}) {
  const result = useGetPpeProductPricesQuery([productId]);
  const access = useGetProductAccessQuery();
  const [reloadKey, setReloadKey] = useState(0);
  const pricing = result.currentData?.find((x) => x.productId === productId);
  const reload = () => {
    void result.refetch().then(() => setReloadKey((x) => x + 1));
  };
  return (
    <Stack sx={{ gap: 2 }}>
      {result.isFetching && <CircularProgress aria-label="Завантаження цін ЗІЗ" />}
      {result.isError && (
        <Alert severity="error" action={<Button onClick={reload}>Повторити</Button>}>
          {pricingErrorMessage(result.error, 'Не вдалося завантажити ціни ЗІЗ.')}
        </Alert>
      )}
      {!pricing && !result.isFetching && !result.isError && (
        <Alert severity="warning">Дані ціноутворення товару не знайдено.</Alert>
      )}
      {pricing && (
        <>
          {!result.isFetching && !result.isError && <PpePricingPanel pricing={pricing} />}
          {access.isError && (
            <Alert
              severity="warning"
              action={
                <Button
                  onClick={() => {
                    void access.refetch();
                  }}
                >
                  Повторити перевірку доступу
                </Button>
              }
            >
              Не вдалося перевірити право редагування цін.
            </Alert>
          )}
          {access.currentData?.canManage && !access.isError && !access.isFetching && (
            <PpePricingInputsEditor
              key={`${productId}:${reloadKey}`}
              pricing={pricing}
              initialSupplierCost={initialSupplierCost}
              onReload={reload}
              blocked={result.isFetching || result.isError}
            />
          )}
        </>
      )}
    </Stack>
  );
}
