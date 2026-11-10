import { filterModelCompositions } from '@admin/production/model';
import { ModelCompositionBlock } from '@admin/production/ui';
import { ReferenceListAlerts, ReferenceSearchBar } from '@admin/references/ui';
import { Box, CircularProgress, Pagination, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { useModelCompositions } from '../../hooks/norms/use-model-compositions';

const PAGE_SIZE = 10;

/** The «Комплектація» tab of the model card in «Товари», where the composition is edited. */
const editHref = (productId: number | null) =>
  productId === null ? null : `/references/products/${productId}?tab=materials`;

/**
 * «Комплектація моделей»: lining, insulation, fleece and the full composition of every sewing
 * model, read from «Товари». Nothing is edited here.
 */
export function ModelCompositionsTab() {
  const { rows, loading, error, reload } = useModelCompositions();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => filterModelCompositions(rows, search), [rows, search]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Підкладка, утеплювач, фліс і повна комплектація з «Товари». Автоматична бронь на складі
        стосується лише верху; інші матеріали мають окремий план.
      </Typography>
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={() => void reload()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      <ReferenceSearchBar
        placeholder="Назва або MOD"
        label="Пошук моделей"
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />
      {loading && rows.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress aria-label="Завантаження комплектації" />
        </Box>
      ) : (
        <Stack spacing={2}>
          {visible.length === 0 && !error && (
            <Typography color="text.secondary">
              {rows.length === 0
                ? 'Швейних моделей у «Товари» поки немає.'
                : 'Моделей не знайдено.'}
            </Typography>
          )}
          {visible.map((model) => (
            <ModelCompositionBlock
              key={model.modelCode}
              model={model}
              editHref={editHref(model.productId)}
            />
          ))}
          {pages > 1 && (
            <Pagination
              count={pages}
              page={current}
              onChange={(_, next) => setPage(next)}
              sx={{ alignSelf: 'flex-end' }}
              aria-label="Сторінки комплектації"
            />
          )}
        </Stack>
      )}
    </Box>
  );
}
