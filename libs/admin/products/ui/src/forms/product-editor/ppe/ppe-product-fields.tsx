import { Alert, MenuItem, Stack, TextField, Typography } from '@mui/material';

import type { ProductLookups } from '../core/product-lookups';
import type { ProductDraft } from '@admin/products/model';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  draft: ProductDraft;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  errors: Record<string, string>;
  lookups: ProductLookups;
  existingProduct?: boolean;
}
export function PpeProductFields({
  draft,
  setDraft,
  errors,
  lookups,
  existingProduct = false,
}: Props) {
  if (draft.type !== 'Ppe') return null;
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h6">Засіб індивідуального захисту</Typography>
      <TextField
        select
        label="Постачальник"
        value={draft.supplierId}
        error={Boolean(errors['supplierId'])}
        helperText={errors['supplierId']}
        onChange={(event) =>
          setDraft((current) =>
            current.type === 'Ppe'
              ? { ...current, supplierId: Number(event.target.value) }
              : current,
          )
        }
      >
        <MenuItem value={0}>Оберіть</MenuItem>
        {lookups.suppliers.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label={
          existingProduct ? 'Початкова ціна постачальника (архів)' : 'Початкова ціна постачальника'
        }
        type="number"
        value={draft.basePrice}
        disabled={existingProduct}
        error={Boolean(errors['basePrice'])}
        helperText={errors['basePrice']}
        onChange={(event) =>
          setDraft((current) =>
            current.type === 'Ppe'
              ? { ...current, basePrice: Number(event.target.value) }
              : current,
          )
        }
      />
      <Alert severity="info">
        Поточні ціни й націнки налаштовуються та підтверджуються в розділі «Розрахунок цін ЗІЗ»
        картки товару. Початкова ціна не активує розрахунок автоматично.
      </Alert>
    </Stack>
  );
}
