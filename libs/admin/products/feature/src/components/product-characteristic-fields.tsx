import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';

import { ProductCharacteristicRows } from './product-characteristic-rows';
import { moveOrdered, removeOrdered } from '../model/product-order';

import type { ProductDraft } from '@admin/products/data-access';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  draft: ProductDraft;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  errors: Record<string, string>;
}
export function ProductCharacteristicFields({ draft, setDraft, errors }: Props) {
  function tableField(index: number, field: 'titleUk' | 'titleRu', value: string) {
    setDraft((current) => ({
      ...current,
      characteristicTables: (current.characteristicTables ?? []).map((item, position) =>
        position === index ? { ...item, [field]: value } : item,
      ),
    }));
  }
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h6">Таблиці характеристик</Typography>
      {errors['characteristicTables'] && (
        <Alert severity="error">{errors['characteristicTables']}</Alert>
      )}
      {(draft.characteristicTables ?? []).map((table, tableIndex) => (
        <Box key={tableIndex} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
          <Stack sx={{ gap: 1 }}>
            <TextField
              label="Назва таблиці українською"
              value={table.titleUk}
              onChange={(event) => tableField(tableIndex, 'titleUk', event.target.value)}
            />
            <TextField
              label="Назва таблиці російською"
              value={table.titleRu}
              onChange={(event) => tableField(tableIndex, 'titleRu', event.target.value)}
            />
            <ProductCharacteristicRows
              tableIndex={tableIndex}
              rows={table.rows}
              setDraft={setDraft}
            />
            <Button
              disabled={tableIndex === 0}
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  characteristicTables: moveOrdered(
                    current.characteristicTables ?? [],
                    tableIndex,
                    -1,
                  ),
                }))
              }
            >
              Вгору
            </Button>
            <Button
              disabled={tableIndex === (draft.characteristicTables ?? []).length - 1}
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  characteristicTables: moveOrdered(
                    current.characteristicTables ?? [],
                    tableIndex,
                    1,
                  ),
                }))
              }
            >
              Вниз
            </Button>
            <Button
              color="error"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  characteristicTables: removeOrdered(
                    current.characteristicTables ?? [],
                    tableIndex,
                  ),
                }))
              }
            >
              Прибрати таблицю
            </Button>
          </Stack>
        </Box>
      ))}
      <Button
        onClick={() =>
          setDraft((current) => ({
            ...current,
            characteristicTables: [
              ...(current.characteristicTables ?? []),
              {
                titleUk: '',
                titleRu: '',
                sortOrder: (current.characteristicTables ?? []).length,
                rows: [],
              },
            ],
          }))
        }
      >
        Додати таблицю
      </Button>
    </Stack>
  );
}
