import { useSearchQuoteCatalogQuery } from '@admin/quotes/data-access';
import { useQuoteSettingsForm } from '@admin/quotes/ui';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { useDeferredValue, useState } from 'react';

import type { QuoteCatalogProduct, QuoteIntroSeason } from '@admin/quotes/model';

interface Props {
  season: QuoteIntroSeason;
  label: string;
  /** Model code, such as MOD-166; empty means the default model. */
  value: string;
  error: string | undefined;
  path: string;
  onChange: (code: string) => void;
}

/** The main model of a season page: found in the Catalog by name or code, saved by its code. */
export function QuoteMainModelField({ season, label, value, error, path, onChange }: Props) {
  const { onFocusField } = useQuoteSettingsForm();
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const search = useDeferredValue(open ? input : value);
  const found = useSearchQuoteCatalogQuery(
    { kind: 'Sewing', search, season, page: 1, pageSize: 20 },
    { skip: !open && !value },
  );
  const options = (found.data?.items ?? []).filter((product) => product.code);
  const selected = options.find((product) => product.code === value) ?? null;

  return (
    <Autocomplete<QuoteCatalogProduct, false, false, false>
      size="small"
      options={options}
      value={selected}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      loading={found.isFetching}
      filterOptions={(items) => items}
      getOptionLabel={(product) => `${product.name} · ${product.code ?? ''}`}
      isOptionEqualToValue={(option, chosen) => option.productId === chosen.productId}
      inputValue={open ? input : selected ? `${selected.name} · ${selected.code}` : value}
      onInputChange={(_, next, reason) => {
        if (reason === 'input') setInput(next);
      }}
      onChange={(_, product) => onChange(product?.code ?? '')}
      noOptionsText={found.isFetching ? 'Шукаємо…' : 'Нічого не знайдено'}
      renderOption={({ key, ...props }, product) => (
        <Box component="li" key={key} {...props} sx={{ gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              flexShrink: 0,
              borderRadius: 0.5,
              bgcolor: 'action.hover',
              backgroundImage: product.photoUrl ? `url("${product.photoUrl}")` : undefined,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap>
              {product.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: 'var(--admin-font-mono)' }}
            >
              {product.code}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Типова модель"
          error={Boolean(error)}
          helperText={error ?? 'Пошук виробу каталогу за назвою або кодом.'}
          onFocus={() => onFocusField(path)}
          slotProps={{ ...params.slotProps, inputLabel: { shrink: true } }}
        />
      )}
    />
  );
}
