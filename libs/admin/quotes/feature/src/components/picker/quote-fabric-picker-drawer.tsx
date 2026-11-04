import { variantOptionDraft } from '@admin/quotes/model';
import { QuoteCatalogProductRow } from '@admin/quotes/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Box, CircularProgress, Divider, Stack, Typography } from '@mui/material';

import { QuoteOtherFabricSection } from './quote-other-fabric-section';
import { useQuoteCatalogPicker } from '../../hooks/picker/use-quote-catalog-picker';
import { useQuoteOtherFabric } from '../../hooks/picker/use-quote-other-fabric';

import type { QuoteItemDraft, QuoteOptionDraft } from '@admin/quotes/model';

interface Props {
  item: QuoteItemDraft;
  onClose: () => void;
  onAdd: (options: QuoteOptionDraft[]) => void;
}

/** «Додати тканину»: the other active fabric variants of this model, or any fabric from the Reference (R-27). */
export function QuoteFabricPickerDrawer({ item, onClose, onAdd }: Props) {
  const picker = useQuoteCatalogPicker({
    onlyProductId: item.productId ?? undefined,
    code: item.code ?? item.name,
  });
  const already = new Set(
    item.options.flatMap((option) => (option.articleId === null ? [] : [option.articleId])),
  );
  const product = picker.products[0];
  const other = useQuoteOtherFabric(item);
  const count = picker.count + (other.ready ? 1 : 0);
  return (
    <ReferenceEditorDrawer
      titleId="quote-fabric-picker-title"
      title="Додати тканину"
      description={`Варіанти тканини моделі «${item.name}» з каталогу або інша тканина з довідника.`}
      formId="quote-fabric-picker-form"
      paperWidth={640}
      readOnly={false}
      saving={false}
      saveDisabled={count === 0 || (other.started && !other.ready)}
      submitLabel={count > 0 ? `Додати (${count})` : 'Додати'}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => {
        const custom = other.option();
        onAdd([
          ...(product
            ? picker.variantsOf(product.productId).map((variant) => variantOptionDraft(variant))
            : []),
          ...(custom ? [custom] : []),
        ]);
      }}
    >
      <Stack sx={{ gap: 2 }}>
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
        <Divider />
        <QuoteOtherFabricSection other={other} />
      </Stack>
    </ReferenceEditorDrawer>
  );
}
