import { canRefreshPriceSource } from '@admin/references/model';
import {
  PriceSourceDetails,
  PriceSourceDiscountForm,
  ReferenceEditorDrawer,
} from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { PriceFileUpload } from './price-file-upload';
import { PriceRefresh } from './price-refresh';
import { usePriceSourceDiscount } from '../../hooks/price-import/use-price-source-discount';
import { useSupplierPreview } from '../suppliers/supplier-preview';

import type { PriceImportResult, PriceSource } from '@admin/references/model';

interface Props {
  source: PriceSource;
  canChangeDiscounts: boolean;
  onClose: () => void;
  onDiscountSaved: () => void;
  onApplied: (result: PriceImportResult) => void;
}

/** Side panel of an «Імпорт цін» row: logic and last update, file upload or «Оновити зараз», discount edit for admins. */
export function PriceSourceDrawer({
  source,
  canChangeDiscounts,
  onClose,
  onDiscountSaved,
  onApplied,
}: Props) {
  const supplierPreview = useSupplierPreview();
  const discount = usePriceSourceDiscount(source, onDiscountSaved);
  const readOnly = !discount.editing;
  const upload = source.fileKind !== 'None' && Boolean(source.supplierName);
  const refresh = canRefreshPriceSource(source) && Boolean(source.supplierName);

  return (
    <ReferenceEditorDrawer
      titleId="price-source-drawer-title"
      title={source.title}
      description={
        readOnly
          ? 'Як оновлюються ціни ЗІЗ цього постачальника.'
          : 'Нова знижка діє з наступного оновлення цін.'
      }
      formId="price-source-form"
      paperWidth={upload || refresh ? 920 : 560}
      readOnly={readOnly}
      saving={discount.saving}
      editLabel={canChangeDiscounts ? 'Змінити знижку' : null}
      onClose={onClose}
      onEdit={discount.start}
      onSubmit={discount.save}
    >
      <Stack sx={{ gap: 2 }}>
        {discount.message && <Alert severity="error">{discount.message}</Alert>}
        {discount.editing && (
          <PriceSourceDiscountForm
            value={discount.value}
            defaultPercent={source.defaultDiscountPercent}
            error={discount.error}
            onChange={discount.change}
          />
        )}
        {readOnly && refresh && <PriceRefresh source={source} onApplied={onApplied} />}
        {readOnly && upload && <PriceFileUpload source={source} onApplied={onApplied} />}
        <PriceSourceDetails
          source={source}
          onOpenSupplier={() =>
            supplierPreview.open({ id: source.supplierId, name: source.supplierName })
          }
        />
        {supplierPreview.element}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
