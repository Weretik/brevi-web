import { MenuItem, Stack, TextField, Typography } from '@mui/material';

import type { ProductLookups } from '../hooks/use-product-lookups';
import type { ProductDraft } from '@admin/products/data-access';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  draft: ProductDraft;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  errors: Record<string, string>;
  lookups: ProductLookups;
  onTypeChange: (type: ProductDraft['type']) => void;
}

export function ProductBaseFields({ draft, setDraft, errors, lookups, onTypeChange }: Props) {
  function update(field: 'name' | 'ruName', value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h6">Основна інформація</Typography>
      <TextField
        label="Назва українською"
        value={draft.name}
        onChange={(event) => update('name', event.target.value)}
        error={Boolean(errors['name'])}
        helperText={errors['name']}
        required
      />
      <TextField
        label="Назва російською"
        value={draft.ruName}
        onChange={(event) => update('ruName', event.target.value)}
        error={Boolean(errors['ruName'])}
        helperText={errors['ruName']}
        required
      />
      <TextField
        select
        label="Тип товару"
        value={draft.type}
        onChange={(event) => {
          const type = event.target.value as ProductDraft['type'];
          onTypeChange(type);
        }}
      >
        <MenuItem value="Sewing">Швейний товар</MenuItem>
        <MenuItem value="Ppe">ЗІЗ</MenuItem>
      </TextField>
      <TextField
        select
        slotProps={{ select: { multiple: true } }}
        label="Категорії"
        value={draft.categoryIds}
        onChange={(event) => {
          const value: unknown = event.target.value;
          setDraft((current) => ({
            ...current,
            categoryIds:
              typeof value === 'string'
                ? value.split(',').map(Number)
                : (value as number[]).map(Number),
          }));
        }}
        error={Boolean(errors['categoryIds'])}
        helperText={errors['categoryIds']}
      >
        {lookups.categories
          .filter((item) => item.isActive || draft.categoryIds.includes(item.id))
          .map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
      </TextField>
    </Stack>
  );
}
