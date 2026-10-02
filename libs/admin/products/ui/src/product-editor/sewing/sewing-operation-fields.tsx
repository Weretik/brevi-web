import { MenuItem, TextField } from '@mui/material';

import type { ProductLookups } from '../core/product-lookups';
import type { ProductDraft } from '@admin/products/model';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  draft: Extract<ProductDraft, { type: 'Sewing' }>;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  errors: Record<string, string>;
  operations: ProductLookups['operations'];
}

export function SewingOperationFields({ draft, setDraft, errors, operations }: Props) {
  return (
    <TextField
      select
      slotProps={{ select: { multiple: true } }}
      label="Операції"
      value={draft.operationIds}
      onChange={(event) => {
        const value: unknown = event.target.value;
        setDraft((current) =>
          current.type === 'Sewing'
            ? {
                ...current,
                operationIds:
                  typeof value === 'string'
                    ? value.split(',').map(Number)
                    : (value as number[]).map(Number),
              }
            : current,
        );
      }}
      error={Boolean(errors['operationIds'])}
      helperText={errors['operationIds']}
    >
      {operations.map((item) => (
        <MenuItem key={item.id} value={item.id}>
          {item.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
