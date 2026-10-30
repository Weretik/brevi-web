import { useGetQuoteAssigneesQuery } from '@admin/clients/data-access';
import { Alert, Autocomplete, Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { quoteError } from '../../../errors/quotes/quote-error';

import type { QuoteAssignee } from '@admin/clients/model';

export function QuoteAssigneePicker({
  value,
  onChange,
  disabled = false,
  excludeId,
}: {
  value: QuoteAssignee | null;
  onChange: (value: QuoteAssignee | null) => void;
  disabled?: boolean;
  excludeId?: number;
}) {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(input.trim().slice(0, 200));
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [input]);
  const query = useGetQuoteAssigneesQuery({ search, page, pageSize: 25 });
  const data = query.currentData;
  return (
    <Stack spacing={1}>
      <Autocomplete
        options={query.error ? [] : (data?.rows ?? []).filter((row) => row.userId !== excludeId)}
        value={value}
        disabled={disabled}
        loading={query.isFetching}
        filterOptions={(options) => options}
        getOptionLabel={(option) => option.displayName}
        isOptionEqualToValue={(left, right) => left.userId === right.userId}
        onChange={(_event, selected) => onChange(selected)}
        onInputChange={(_event, text, reason) => {
          if (reason === 'input' || reason === 'clear') setInput(text);
        }}
        loadingText="Пошук відповідальних…"
        noOptionsText="Відповідальних не знайдено"
        renderInput={(params) => (
          <TextField {...params} label="Відповідальний" helperText="Пошук за ім’ям" />
        )}
      />
      {query.error && (
        <Alert
          severity="error"
          action={<Button onClick={() => void query.refetch()}>Повторити</Button>}
        >
          {quoteError(query.error)}
        </Alert>
      )}
      {data && data.totalPages > 1 && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button
            disabled={disabled || query.isFetching || page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Попередні відповідальні
          </Button>
          <Typography variant="caption">Сторінка {page}</Typography>
          <Button
            disabled={disabled || query.isFetching || page >= data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Наступні відповідальні
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
