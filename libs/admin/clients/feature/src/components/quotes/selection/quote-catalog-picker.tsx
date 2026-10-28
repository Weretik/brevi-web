import { useListProductsQuery, useListSewingArticlesQuery } from '@admin/products/data-access';
import { Alert, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { quoteError } from '../../../errors/quotes/quote-error';

import type { QuotePriceSelection } from '@admin/clients/model';

export function QuoteCatalogPicker({
  selection,
  disabled,
  onChange,
}: {
  selection: QuotePriceSelection;
  disabled: boolean;
  onChange: (selection: QuotePriceSelection) => void;
}) {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(input.trim());
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [input]);
  const products = useListProductsQuery(
    { search, page, pageSize: 10, type: selection.kind === 'sewing' ? 'Sewing' : 'Ppe' },
    { skip: selection.kind === 'oneOffPpe' },
  );
  const productId = selection.kind === 'oneOffPpe' ? 0 : selection.productId;
  const articles = useListSewingArticlesQuery(productId, {
    skip: selection.kind !== 'sewing' || productId <= 0,
  });
  const rows = products.currentData?.value ?? [];
  return (
    <Stack spacing={2}>
      <TextField
        select
        label="Тип варіанта"
        value={selection.kind}
        disabled={disabled}
        onChange={(event) => {
          const kind = event.target.value;
          setPage(1);
          setInput('');
          onChange(
            kind === 'sewing'
              ? { kind, productId: 0, articleId: 0 }
              : kind === 'ppe'
                ? { kind, productId: 0 }
                : {
                    kind: 'oneOffPpe',
                    prices: { retail: 0, wholesale: 0, largeWholesale: 0, reason: '' },
                  },
          );
        }}
      >
        <MenuItem value="sewing">Пошиття з Catalog</MenuItem>
        <MenuItem value="ppe">СІЗ з Catalog</MenuItem>
        <MenuItem value="oneOffPpe">Разові СІЗ</MenuItem>
      </TextField>
      {selection.kind !== 'oneOffPpe' && (
        <>
          <TextField
            label="Пошук товару КП"
            value={input}
            disabled={disabled}
            onChange={(event) => setInput(event.target.value)}
          />
          {products.error && (
            <Alert severity="error">
              {quoteError(products.error)}{' '}
              <Button onClick={() => void products.refetch()}>Повторити пошук</Button>
            </Alert>
          )}
          <TextField
            select
            label="Товар КП"
            value={productId || ''}
            disabled={disabled || products.isFetching}
            onChange={(event) =>
              onChange(
                selection.kind === 'sewing'
                  ? { kind: 'sewing', productId: Number(event.target.value), articleId: 0 }
                  : { kind: 'ppe', productId: Number(event.target.value) },
              )
            }
          >
            <MenuItem value="">Оберіть товар</MenuItem>
            {productId > 0 && !rows.some((row) => row.id === productId) && (
              <MenuItem value={productId}>Збережений товар #{productId}</MenuItem>
            )}
            {rows.map((row) => (
              <MenuItem key={row.id} value={row.id}>
                {row.name}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              disabled={disabled || page <= 1 || products.isFetching}
              onClick={() => setPage(page - 1)}
            >
              Попередні товари
            </Button>
            <Typography>Сторінка {page}</Typography>
            <Button
              disabled={
                disabled ||
                products.isFetching ||
                page >= (products.currentData?.pagedInfo.totalPages ?? 0)
              }
              onClick={() => setPage(page + 1)}
            >
              Наступні товари
            </Button>
          </Stack>
        </>
      )}
      {selection.kind === 'sewing' && productId > 0 && (
        <>
          {articles.error && (
            <Alert severity="error">
              {quoteError(articles.error)}{' '}
              <Button onClick={() => void articles.refetch()}>
                Повторити завантаження артикулів
              </Button>
            </Alert>
          )}
          <TextField
            select
            label="Артикул КП"
            value={selection.articleId || ''}
            disabled={disabled || articles.isFetching}
            onChange={(event) => onChange({ ...selection, articleId: Number(event.target.value) })}
          >
            <MenuItem value="">Оберіть артикул</MenuItem>
            {selection.articleId > 0 &&
              !articles.currentData?.articles.some(
                (article) => article.id === selection.articleId,
              ) && (
                <MenuItem value={selection.articleId}>
                  Збережений артикул #{selection.articleId}
                </MenuItem>
              )}
            {articles.currentData?.articles.map((article) => (
              <MenuItem key={article.id} value={article.id} disabled={!article.active}>
                {article.saleSku}
                {article.active ? '' : ' — неактивний'}
              </MenuItem>
            ))}
          </TextField>
        </>
      )}
    </Stack>
  );
}
