import { useSearchQuoteCatalogQuery } from '@admin/quotes/data-access';
import { formatQuotePrice, quoteIntroSeasonLabels } from '@admin/quotes/model';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useDeferredValue, useState } from 'react';

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
            <Box key={product.productId} sx={{ borderBottom: 1, borderColor: 'divider', py: 1.5 }}>
              <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                {product.photoUrl ? (
                  <Box
                    component="img"
                    src={product.photoUrl}
                    alt=""
                    sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 1 }}
                  />
                ) : (
                  <Box sx={{ width: 48, height: 48, borderRadius: 1, bgcolor: 'action.hover' }} />
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {product.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={used || product.problem ? 'error.main' : 'text.secondary'}
                  >
                    {used ? 'Вже є в добірці' : (product.problem ?? product.code ?? '')}
                  </Typography>
                </Box>
              </Stack>
              <Stack sx={{ pl: { xs: 0, sm: 7.5 }, mt: 0.5, gap: 0.5 }}>
                {product.variants.map((variant) => (
                  <Stack
                    key={variant.articleId}
                    direction="row"
                    sx={{ alignItems: 'center', gap: 1 }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2">{variant.title}</Typography>
                      {variant.problem && (
                        <Typography variant="caption" color="error.main">
                          {variant.problem}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' }}
                    >
                      {formatQuotePrice(variant.prices?.large)}
                    </Typography>
                    <Button
                      size="small"
                      disabled={used || Boolean(product.problem) || Boolean(variant.problem)}
                      onClick={() => onChoose(product, variant)}
                      aria-label={`Обрати: ${product.name}, ${variant.title}`}
                    >
                      Обрати
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Box>
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
