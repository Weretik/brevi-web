import { QuoteCatalogProductRow } from '@admin/quotes/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  CircularProgress,
  InputAdornment,
  Pagination,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

import { useQuoteCatalogPicker } from '../../hooks/picker/use-quote-catalog-picker';

import type { QuoteItemDraft } from '@admin/quotes/model';

interface Props {
  onClose: () => void;
  onAdd: (items: QuoteItemDraft[]) => void;
}

const none = new Set<number>();

/** «Додати товар»: models with their fabric variants or PPE from the Catalog, with current prices. */
export function QuoteCatalogPickerDrawer({ onClose, onAdd }: Props) {
  const picker = useQuoteCatalogPicker();
  return (
    <ReferenceEditorDrawer
      titleId="quote-catalog-picker-title"
      title="Додати товар"
      description="Позначте варіанти тканини моделей або товари ЗІЗ. Ціни беруться з каталогу."
      formId="quote-catalog-picker-form"
      paperWidth={760}
      readOnly={false}
      saving={false}
      saveDisabled={picker.count === 0}
      submitLabel={picker.count > 0 ? `Додати (${picker.count})` : 'Додати'}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => onAdd(picker.items())}
    >
      <Tabs
        value={picker.kind}
        onChange={(_event, value) => picker.setKind(value)}
        sx={{ mb: 1.5 }}
      >
        <Tab value="Sewing" label="Швейна продукція" />
        <Tab value="Ppe" label="ЗІЗ" />
      </Tabs>
      <TextField
        fullWidth
        size="small"
        type="search"
        placeholder="Знайти за назвою, кодом або тканиною"
        value={picker.search}
        onChange={(event) => picker.setSearch(event.target.value)}
        slotProps={{
          htmlInput: { 'aria-label': 'Пошук товарів' },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 1 }}
      />
      {picker.error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {picker.error}
        </Alert>
      )}
      {picker.loading && picker.products.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} aria-label="Завантаження" />
        </Box>
      ) : picker.products.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 3 }}>
          Нічого не знайдено.
        </Typography>
      ) : (
        picker.products.map((product) => (
          <QuoteCatalogProductRow
            key={product.productId}
            product={product}
            chosen={picker.chosen}
            alreadyAdded={none}
            onToggle={(id) => picker.toggle(product, id)}
          />
        ))
      )}
      {picker.pageCount > 1 && (
        <Pagination
          count={picker.pageCount}
          page={picker.page}
          onChange={(_event, page) => picker.setPage(page)}
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
      )}
    </ReferenceEditorDrawer>
  );
}
