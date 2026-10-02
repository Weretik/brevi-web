import { Stack, TextField, Typography } from '@mui/material';

import { SewingAccessoryFields } from './sewing-accessory-fields';
import { SewingFabricFields } from './sewing-fabric-fields';
import { SewingOperationFields } from './sewing-operation-fields';

import type { ProductLookups } from '../core/product-lookups';
import type { ProductDraft } from '@admin/products/model';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  draft: ProductDraft;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  errors: Record<string, string>;
  lookups: ProductLookups;
}

export function SewingProductFields({ draft, setDraft, errors, lookups }: Props) {
  if (draft.type !== 'Sewing') return null;
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h6">Швейний товар</Typography>
      <TextField
        label="Метрів на виріб"
        type="number"
        value={draft.metersPerProduct}
        error={Boolean(errors['metersPerProduct'])}
        helperText={errors['metersPerProduct']}
        onChange={(event) =>
          setDraft((current) =>
            current.type === 'Sewing'
              ? { ...current, metersPerProduct: Number(event.target.value) }
              : current,
          )
        }
        slotProps={{ htmlInput: { min: 0, step: 'any' } }}
      />
      <SewingFabricFields
        draft={draft}
        setDraft={setDraft}
        errors={errors}
        fabrics={lookups.fabrics}
      />
      <SewingAccessoryFields
        draft={draft}
        setDraft={setDraft}
        errors={errors}
        accessories={lookups.accessories}
      />
      <SewingOperationFields
        draft={draft}
        setDraft={setDraft}
        errors={errors}
        operations={lookups.operations}
      />
    </Stack>
  );
}
