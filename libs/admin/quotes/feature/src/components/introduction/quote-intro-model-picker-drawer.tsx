import { useSearchQuoteCatalogQuery } from '@admin/quotes/data-access';
import { quoteIntroSeasonLabels } from '@admin/quotes/model';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  CircularProgress,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from '@mui/material';
import { useDeferredValue, useState } from 'react';

import { QuoteIntroModelOption } from './quote-intro-model-option';

import type {
  QuoteCatalogProduct,
  QuoteCatalogVariant,
  QuoteIntroSeason,
} from '@admin/quotes/model';

interface Props {
  season: QuoteIntroSeason;
  /** Models already on the pages: they cannot be chosen twice. */
  usedProductIds: ReadonlySet<number>;
  onClose: () => void;
  onChoose: (product: QuoteCatalogProduct, variant: QuoteCatalogVariant) => void;
}

const pageSize = 20;

/** «Обрати модель»: only sewing models of the page's season; a fabric is chosen right away. */
export function QuoteIntroModelPickerDrawer({ season, usedProductIds, onClose, onChoose }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const deferred = useDeferredValue(search);
  const query = useSearchQuoteCatalogQuery({
    kind: 'Sewing',
    search: deferred,
    season,
    page,
    pageSize,
  });
  const products = query.data?.items ?? [];
  const pageCount = Math.max(1, Math.ceil((query.data?.total ?? 0) / pageSize));

  return (
    <ReferenceEditorDrawer
      titleId="quote-intro-picker-title"
      title="Обрати модель"
      description={`${quoteIntroSeasonLabels[season]}: оберіть модель і тканину. Ціна — від 41 шт. з ПДВ.`}
      formId="quote-intro-picker-form"
      paperWidth={680}
      readOnly
      editLabel={null}
      saving={false}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      <TextField
        fullWidth
        size="small"
        type="search"
        placeholder="Знайти за назвою, кодом або тканиною"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
        slotProps={{
          htmlInput: { 'aria-label': 'Пошук моделей' },
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
      {query.isError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {(query.error as { message?: string }).message ?? 'Не вдалося завантажити каталог.'}
        </Alert>
      )}
      {query.isFetching && products.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} aria-label="Завантаження" />
        </Box>
      ) : products.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 3 }}>
          Нічого не знайдено.
        </Typography>
      ) : (
        products.map((product) => {
          const used = usedProductIds.has(product.productId);
          return (
            <QuoteIntroModelOption
              key={product.productId}
              product={product}
              used={used}
              onChoose={onChoose}
            />
          );
        })
      )}
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_event, next) => setPage(next)}
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
      )}
    </ReferenceEditorDrawer>
  );
}
