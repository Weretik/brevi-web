import { usePreviewPpePricesQuery } from '@admin/products/data-access';
import { parsePpeSupplierPrice, ppeBlockerReasons } from '@admin/products/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';

import { useDebouncedValue } from '../debounce/use-debounced-value';

/** The three prices of a PPE product before it is saved, from the rule and the supplier price. */
export function usePpePricePreview(ruleCode: string, supplierPrice: string, priceValid: boolean) {
  const price = priceValid ? parsePpeSupplierPrice(supplierPrice) : null;
  const ready = Boolean(ruleCode) && price !== null && price > 0;
  const askedRule = useDebouncedValue(ruleCode);
  const askedPrice = useDebouncedValue(price);
  const settled = ready && askedRule === ruleCode && askedPrice === price;
  const preview = usePreviewPpePricesQuery(
    { ruleCode: askedRule, supplierPrice: askedPrice ?? 0 },
    { skip: !settled },
  );
  const data = settled ? preview.currentData : undefined;

  return {
    waiting: !ready,
    loading: ready && (!settled || preview.isFetching),
    prices: data?.prices ?? null,
    reasons: data ? ppeBlockerReasons(data.blockers) : [],
    error:
      settled && preview.isError
        ? adminApiErrorMessage(preview.error, 'Не вдалося порахувати ціни.')
        : null,
  };
}
