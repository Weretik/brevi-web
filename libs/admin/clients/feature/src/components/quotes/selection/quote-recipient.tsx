import { useGetCustomerQuery, useListCustomersQuery } from '@admin/clients/data-access';
import { Alert, MenuItem, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { quoteError } from '../../../errors/quotes/quote-error';

import type { QuoteDraft } from '@admin/clients/model';

export function QuoteRecipient({
  draft,
  disabled,
  onChange,
}: {
  draft: QuoteDraft;
  disabled: boolean;
  onChange: (draft: QuoteDraft) => void;
}) {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSearch(input.trim()), 250);
    return () => clearTimeout(timer);
  }, [input]);
  const customers = useListCustomersQuery({ search, active: true, page: 1, pageSize: 25 });
  const customer = useGetCustomerQuery(draft.customerId ?? '', { skip: !draft.customerId });
  const rows = customers.currentData?.rows ?? [];
  return (
    <Stack spacing={2}>
      <TextField
        label="Пошук клієнта КП"
        value={input}
        disabled={disabled}
        onChange={(event) => setInput(event.target.value)}
      />
      {customers.error && <Alert severity="error">{quoteError(customers.error)}</Alert>}
      <TextField
        select
        label="Клієнт КП"
        value={draft.customerId ?? ''}
        disabled={disabled || customers.isFetching}
        onChange={(event) => {
          const id = event.target.value;
          const selected = rows.find((row) => row.publicId === id);
          onChange({
            ...draft,
            customerId: id || null,
            contactId: null,
            recipientName: selected?.displayName ?? '',
          });
        }}
      >
        <MenuItem value="">Без картки клієнта</MenuItem>
        {draft.customerId && !rows.some((row) => row.publicId === draft.customerId) && (
          <MenuItem value={draft.customerId}>{draft.recipientName}</MenuItem>
        )}
        {rows.map((row) => (
          <MenuItem key={row.publicId} value={row.publicId}>
            {row.displayName}
          </MenuItem>
        ))}
      </TextField>
      {customer.error && <Alert severity="error">{quoteError(customer.error)}</Alert>}
      {draft.customerId ? (
        <TextField
          select
          label="Контакт КП"
          value={draft.contactId ?? ''}
          disabled={disabled || customer.isFetching}
          onChange={(event) => onChange({ ...draft, contactId: event.target.value || null })}
        >
          <MenuItem value="">Без контакту</MenuItem>
          {customer.currentData?.contacts
            .filter((contact) => contact.active)
            .map((contact) => (
              <MenuItem key={contact.publicId} value={contact.publicId}>
                {contact.name}
              </MenuItem>
            ))}
        </TextField>
      ) : (
        <TextField
          label="Одержувач КП"
          required
          value={draft.recipientName}
          disabled={disabled}
          onChange={(event) => onChange({ ...draft, recipientName: event.target.value })}
        />
      )}
      {customers.currentData && !rows.length && (
        <Alert severity="info">
          Клієнтів за цим пошуком не знайдено. Можна вказати одержувача без картки.
        </Alert>
      )}
    </Stack>
  );
}
