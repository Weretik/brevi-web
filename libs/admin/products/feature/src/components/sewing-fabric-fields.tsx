import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { removeFabric, setPrimaryFabric } from '../model/product-fabrics';
import { moveOrdered } from '../model/product-order';

import type { ProductLookups } from '../hooks/use-product-lookups';
import type { ProductDraft } from '@admin/products/data-access';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  draft: Extract<ProductDraft, { type: 'Sewing' }>;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  errors: Record<string, string>;
  fabrics: ProductLookups['fabrics'];
}

export function SewingFabricFields({ draft, setDraft, errors, fabrics }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography>Тканини</Typography>
      {errors['fabrics'] && <Alert severity="error">{errors['fabrics']}</Alert>}
      {draft.fabrics.map((fabric, index) => (
        <Stack key={index} direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1 }}>
          <TextField
            select
            label="Тканина"
            value={fabric.fabricId}
            sx={{ minWidth: 180 }}
            onChange={(event) =>
              setDraft((current) =>
                current.type === 'Sewing'
                  ? {
                      ...current,
                      fabrics: current.fabrics.map((item, position) =>
                        position === index
                          ? { ...item, fabricId: Number(event.target.value) }
                          : item,
                      ),
                    }
                  : current,
              )
            }
          >
            <MenuItem value={0}>Оберіть</MenuItem>
            {fabrics.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={fabric.isPrimary}
                disabled={
                  !fabric.isPrimary && draft.fabrics.filter((item) => item.isPrimary).length >= 2
                }
                onChange={(_, checked) =>
                  setDraft((current) =>
                    current.type === 'Sewing'
                      ? {
                          ...current,
                          fabrics: setPrimaryFabric(current.fabrics, index, checked),
                        }
                      : current,
                  )
                }
              />
            }
            label="Основна"
          />
          <Button
            disabled={index === 0 || draft.fabrics[index - 1]?.isPrimary !== fabric.isPrimary}
            onClick={() =>
              setDraft((current) =>
                current.type === 'Sewing'
                  ? { ...current, fabrics: moveOrdered(current.fabrics, index, -1) }
                  : current,
              )
            }
          >
            Вгору
          </Button>
          <Button
            disabled={
              index === draft.fabrics.length - 1 ||
              draft.fabrics[index + 1]?.isPrimary !== fabric.isPrimary
            }
            onClick={() =>
              setDraft((current) =>
                current.type === 'Sewing'
                  ? { ...current, fabrics: moveOrdered(current.fabrics, index, 1) }
                  : current,
              )
            }
          >
            Вниз
          </Button>
          <Button
            color="error"
            onClick={() =>
              setDraft((current) =>
                current.type === 'Sewing'
                  ? {
                      ...current,
                      fabrics: removeFabric(current.fabrics, index),
                    }
                  : current,
              )
            }
          >
            Прибрати
          </Button>
        </Stack>
      ))}
      <Button
        onClick={() =>
          setDraft((current) =>
            current.type === 'Sewing'
              ? {
                  ...current,
                  fabrics: [
                    ...current.fabrics,
                    {
                      fabricId: 0,
                      isPrimary: current.fabrics.length === 0,
                      sortOrder: current.fabrics.length,
                    },
                  ],
                }
              : current,
          )
        }
      >
        Додати тканину
      </Button>
    </Stack>
  );
}
