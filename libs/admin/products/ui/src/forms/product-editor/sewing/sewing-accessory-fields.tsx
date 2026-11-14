import { moveOrdered, removeOrdered } from '@admin/products/model';
import { Alert, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';

import type { ProductLookups } from '../core/product-lookups';
import type { ProductDraft } from '@admin/products/model';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  draft: Extract<ProductDraft, { type: 'Sewing' }>;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  errors: Record<string, string>;
  accessories: ProductLookups['accessories'];
}

export function SewingAccessoryFields({ draft, setDraft, errors, accessories }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography>Фурнітура</Typography>
      {errors['accessories'] && <Alert severity="error">{errors['accessories']}</Alert>}
      {draft.accessories.map((accessory, index) => (
        <Stack key={index} direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1 }}>
          <TextField
            select
            label="Фурнітура"
            value={accessory.garmentAccessoryId}
            sx={{ minWidth: 180 }}
            onChange={(event) =>
              setDraft((current) =>
                current.type === 'Sewing'
                  ? {
                      ...current,
                      accessories: current.accessories.map((item, position) =>
                        position === index
                          ? { ...item, garmentAccessoryId: Number(event.target.value) }
                          : item,
                      ),
                    }
                  : current,
              )
            }
          >
            <MenuItem value={0}>Оберіть</MenuItem>
            {accessories.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Кількість"
            type="number"
            value={accessory.quantity}
            onChange={(event) =>
              setDraft((current) =>
                current.type === 'Sewing'
                  ? {
                      ...current,
                      accessories: current.accessories.map((item, position) =>
                        position === index
                          ? { ...item, quantity: Number(event.target.value) }
                          : item,
                      ),
                    }
                  : current,
              )
            }
          />
          <Button
            disabled={index === 0}
            onClick={() =>
              setDraft((current) =>
                current.type === 'Sewing'
                  ? { ...current, accessories: moveOrdered(current.accessories, index, -1) }
                  : current,
              )
            }
          >
            Вгору
          </Button>
          <Button
            disabled={index === draft.accessories.length - 1}
            onClick={() =>
              setDraft((current) =>
                current.type === 'Sewing'
                  ? { ...current, accessories: moveOrdered(current.accessories, index, 1) }
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
                      accessories: removeOrdered(current.accessories, index),
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
                  accessories: [
                    ...current.accessories,
                    { garmentAccessoryId: 0, quantity: 1, sortOrder: current.accessories.length },
                  ],
                }
              : current,
          )
        }
      >
        Додати фурнітуру
      </Button>
    </Stack>
  );
}
