import { Alert, MenuItem, Stack, TextField, Typography } from '@mui/material';

import type { ProductLookups } from '../hooks/use-product-lookups';
import type { ProductDraft } from '@admin/products/data-access';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  draft: ProductDraft;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  errors: Record<string, string>;
  lookups: ProductLookups;
}

export function PpeProductFields({ draft, setDraft, errors, lookups }: Props) {
  if (draft.type !== 'Ppe') return null;
  const percentField = (field: 'retailPercent' | 'wholesalePercent', label: string) => {
    const value = draft[field];
    return (
      <Stack key={field} direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1 }}>
        <TextField
          select
          label={label}
          value={value.source}
          sx={{ minWidth: 170 }}
          onChange={(event) =>
            setDraft((current) =>
              current.type === 'Ppe'
                ? {
                    ...current,
                    [field]:
                      event.target.value === 'Reference'
                        ? { source: 'Reference', additionalReferenceId: 0 }
                        : { source: 'Custom', customPercent: 0 },
                  }
                : current,
            )
          }
        >
          <MenuItem value="Custom">Власний %</MenuItem>
          <MenuItem value="Reference">З довідника</MenuItem>
        </TextField>
        {value.source === 'Custom' ? (
          <TextField
            label="Відсоток"
            type="number"
            value={value.customPercent}
            error={Boolean(errors[field])}
            helperText={errors[field]}
            onChange={(event) =>
              setDraft((current) =>
                current.type === 'Ppe'
                  ? {
                      ...current,
                      [field]: { source: 'Custom', customPercent: Number(event.target.value) },
                    }
                  : current,
              )
            }
          />
        ) : (
          <Stack sx={{ gap: 1 }}>
            <TextField
              select
              label="Додатковий довідник"
              value={value.additionalReferenceId}
              error={Boolean(errors[field])}
              helperText={errors[field]}
              sx={{ minWidth: 200 }}
              onChange={(event) =>
                setDraft((current) =>
                  current.type === 'Ppe'
                    ? {
                        ...current,
                        [field]: {
                          source: 'Reference',
                          additionalReferenceId: Number(event.target.value),
                        },
                      }
                    : current,
                )
              }
            >
              <MenuItem value={0}>Оберіть</MenuItem>
              {lookups.references
                .filter((item) => item.unit === '%')
                .map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </TextField>
            {value.additionalReferenceId > 0 &&
              !lookups.references.some(
                (item) => item.id === value.additionalReferenceId && item.unit === '%',
              ) && (
                <Alert severity="error">Обраний довідник недоступний або не має одиниці %.</Alert>
              )}
          </Stack>
        )}
      </Stack>
    );
  };
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
        label="Базова ціна"
        type="number"
        value={draft.basePrice}
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
      {percentField('retailPercent', 'Роздрібний відсоток')}
      {percentField('wholesalePercent', 'Оптовий відсоток')}
    </Stack>
  );
}
