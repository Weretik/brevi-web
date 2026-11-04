import { variantOptionDraft } from '@admin/quotes/model';
import { QuoteCatalogProductRow } from '@admin/quotes/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';

import { useQuoteCatalogPicker } from '../../hooks/picker/use-quote-catalog-picker';

import type { QuoteItemDraft, QuoteOptionDraft } from '@admin/quotes/model';

interface Props {
  item: QuoteItemDraft;
  onClose: () => void;
  onAdd: (options: QuoteOptionDraft[]) => void;
}

/** «Додати тканину»: the other active fabric variants of this model. */
export function QuoteFabricPickerDrawer({ item, onClose, onAdd }: Props) {
  const picker = useQuoteCatalogPicker({
    onlyProductId: item.productId ?? undefined,
    code: item.code ?? item.name,
  });
  const already = new Set(
    item.options.flatMap((option) => (option.articleId === null ? [] : [option.articleId])),
  );
  const product = picker.products[0];
  return (
    <ReferenceEditorDrawer
      titleId="quote-fabric-picker-title"
      title="Додати тканину"
      description={`Варіанти тканини моделі «${item.name}» з опублікованими цінами.`}
      formId="quote-fabric-picker-form"
      paperWidth={640}
      readOnly={false}
      saving={false}
      saveDisabled={picker.count === 0}
      submitLabel={picker.count > 0 ? `Додати (${picker.count})` : 'Додати'}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() =>
        onAdd(
          product
            ? picker.variantsOf(product.productId).map((variant) => variantOptionDraft(variant))
            : [],
        )
      }
    >
      {picker.error && <Alert severity="error">{picker.error}</Alert>}
      {picker.loading && !product ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} aria-label="Завантаження" />
        </Box>
      ) : product ? (
        <QuoteCatalogProductRow
          product={product}
          chosen={picker.chosen}
          alreadyAdded={already}
          onToggle={(id) => picker.toggle(product, id)}
        />
      ) : (
        <Typography color="text.secondary">Модель не знайдено в каталозі.</Typography>
      )}
    </ReferenceEditorDrawer>
  );
}
