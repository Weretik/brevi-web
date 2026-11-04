import {
  PriceSourceDetails,
  PriceSourceDiscountForm,
  ReferenceEditorDrawer,
} from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { PriceFileUpload } from './price-file-upload';
import { usePriceSourceDiscount } from '../../hooks/price-import/use-price-source-discount';

import type { PriceImportResult, PriceSource } from '@admin/references/model';

interface Props {
  source: PriceSource;
  canChangeDiscounts: boolean;
  onClose: () => void;
  onDiscountSaved: () => void;
  onApplied: (result: PriceImportResult) => void;
}

/** Side panel of an «Імпорт цін» row: logic and last update, file upload, discount edit for admins. */
export function PriceSourceDrawer({
  source,
  canChangeDiscounts,
  onClose,
  onDiscountSaved,
  onApplied,
}: Props) {
  const discount = usePriceSourceDiscount(source, onDiscountSaved);
  const readOnly = !discount.editing;

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
      paperWidth={source.fileKind === 'None' ? 560 : 920}
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
        {readOnly && source.fileKind !== 'None' && source.supplierName && (
          <PriceFileUpload source={source} onApplied={onApplied} />
        )}
        <PriceSourceDetails source={source} />
      </Stack>
    </ReferenceEditorDrawer>
  );
}
