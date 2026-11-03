import { ProductOverviewDetails, ProductOverviewForm } from '@admin/products/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { ProductOverviewPriceBlock } from './product-overview-price-block';
import { useProductOverviewEditor } from '../../hooks/product-overview/use-product-overview-editor';

import type { ProductOverviewEditorMode } from '../../hooks/product-overview/use-product-overview-editor';
import type { ProductOverview, ProductOverviewPrices } from '@admin/products/model';
import type { ProductSectionOption } from '@admin/products/ui';

interface Props {
  mode: ProductOverviewEditorMode;
  row: ProductOverview;
  sections: ProductSectionOption[];
  sectionNames: ReadonlyMap<number, string>;
  onClose: () => void;
  onSaved: () => void;
  /** False inside the card itself. */
  showCardLink?: boolean;
  /** List prices of the row (CAT-011); the price block is shown only with them. */
  prices?: ProductOverviewPrices | null;
}

export function ProductOverviewDrawer({
  mode: initialMode,
  row,
  sections,
  sectionNames,
  onClose,
  onSaved,
  showCardLink = true,
  prices,
}: Props) {
  const editor = useProductOverviewEditor(initialMode, row, onSaved);
  const readOnly = editor.mode === 'view';

  return (
    <ReferenceEditorDrawer
      titleId="product-overview-drawer-title"
      title={readOnly ? row.name : `Редагування: ${row.name}`}
      description={
        readOnly
          ? 'Ціни, собівартість і дані для КП. Склад — у повній картці.'
          : 'Розділ, статус, перевірка і дані для КП.'
      }
      formId="product-overview-form"
      paperWidth={560}
      readOnly={readOnly}
      saving={editor.saving}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {readOnly ? (
          <>
            {prices !== undefined && (
              <ProductOverviewPriceBlock row={row} prices={prices} />
            )}
            <ProductOverviewDetails
              row={row}
              sectionName={
                row.sectionId === null ? null : (sectionNames.get(row.sectionId) ?? null)
              }
            />
          </>
        ) : (
          <ProductOverviewForm
            type={row.type}
            values={editor.values}
            errors={editor.errors}
            sections={sections}
            verifiedOn={row.verifiedOn}
            onChange={editor.change}
          />
        )}
        {showCardLink && (
          <Button component={RouterLink} to={`/references/products/${row.id}`} variant="outlined">
            Відкрити повну картку
          </Button>
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
