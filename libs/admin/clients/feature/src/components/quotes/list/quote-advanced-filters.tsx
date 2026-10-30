import { Alert, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import { QuoteAssigneePicker } from '../selection/quote-assignee-picker';

import type { QuoteAssignee, QuoteListQuery } from '@admin/clients/model';

const localInput = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  const part = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${part(date.getMonth() + 1)}-${part(date.getDate())}T${part(date.getHours())}:${part(date.getMinutes())}`;
};
export function QuoteAdvancedFilters({
  query,
  onApply,
}: {
  query: QuoteListQuery;
  onApply: (values: Record<string, string>) => void;
}) {
  const [owner, setOwner] = useState<QuoteAssignee | null>(
    query.ownerId
      ? { userId: query.ownerId, displayName: 'Відповідальний #' + query.ownerId }
      : null,
  );
  const [from, setFrom] = useState(localInput(query.createdFrom));
  const [before, setBefore] = useState(localInput(query.createdBefore));
  const [error, setError] = useState('');
  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={(event) => {
        event.preventDefault();
        const fromTime = from ? new Date(from).getTime() : null;
        const beforeTime = before ? new Date(before).getTime() : null;
        if (
          (fromTime !== null && !Number.isFinite(fromTime)) ||
          (beforeTime !== null && !Number.isFinite(beforeTime)) ||
          (fromTime !== null && beforeTime !== null && fromTime >= beforeTime)
        ) {
          setError('Початок періоду має бути раніше завершення.');
          return;
        }
        setError('');
        onApply({
          ownerId: owner ? String(owner.userId) : '',
          createdFrom: fromTime !== null ? new Date(fromTime).toISOString() : '',
          createdBefore: beforeTime !== null ? new Date(beforeTime).toISOString() : '',
        });
      }}
    >
      <QuoteAssigneePicker value={owner} onChange={setOwner} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          type="datetime-local"
          label="Створено від"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          helperText="Включно, за часом вашого пристрою"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          type="datetime-local"
          label="Створено до"
          value={before}
          onChange={(event) => setBefore(event.target.value)}
          helperText="Не включно, за часом вашого пристрою"
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      <Button type="submit">Застосувати додаткові фільтри</Button>
    </Stack>
  );
}
