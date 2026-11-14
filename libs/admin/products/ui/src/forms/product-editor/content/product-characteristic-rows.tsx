import { moveOrdered, removeOrdered } from '@admin/products/model';
import { Box, Button, Stack, TextField } from '@mui/material';

import type { ProductDraft } from '@admin/products/model';
import type { Dispatch, SetStateAction } from 'react';

type Rows = NonNullable<ProductDraft['characteristicTables']>[number]['rows'];

interface Props {
  tableIndex: number;
  rows: Rows;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
}

export function ProductCharacteristicRows({ tableIndex, rows, setDraft }: Props) {
  function updateRows(update: (current: Rows) => Rows) {
    setDraft((current) => ({
      ...current,
      characteristicTables: (current.characteristicTables ?? []).map((table, index) =>
        index === tableIndex ? { ...table, rows: update(table.rows) } : table,
      ),
    }));
  }

  function updateField(
    index: number,
    field: 'labelUk' | 'labelRu' | 'valueUk' | 'valueRu',
    value: string,
  ) {
    updateRows((current) =>
      current.map((row, position) => (position === index ? { ...row, [field]: value } : row)),
    );
  }

  return (
    <>
      {rows.map((row, rowIndex) => (
        <Box key={rowIndex} sx={{ border: 1, borderColor: 'divider', p: 1 }}>
          <Stack sx={{ gap: 1 }}>
            <TextField
              label="Ознака українською"
              value={row.labelUk}
              onChange={(event) => updateField(rowIndex, 'labelUk', event.target.value)}
            />
            <TextField
              label="Ознака російською"
              value={row.labelRu}
              onChange={(event) => updateField(rowIndex, 'labelRu', event.target.value)}
            />
            <TextField
              label="Значення українською"
              value={row.valueUk}
              onChange={(event) => updateField(rowIndex, 'valueUk', event.target.value)}
            />
            <TextField
              label="Значення російською"
              value={row.valueRu}
              onChange={(event) => updateField(rowIndex, 'valueRu', event.target.value)}
            />
            <Stack direction="row">
              <Button
                disabled={rowIndex === 0}
                onClick={() => updateRows((current) => moveOrdered(current, rowIndex, -1))}
              >
                Вгору
              </Button>
              <Button
                disabled={rowIndex === rows.length - 1}
                onClick={() => updateRows((current) => moveOrdered(current, rowIndex, 1))}
              >
                Вниз
              </Button>
            </Stack>
            <Button
              color="error"
              onClick={() => updateRows((current) => removeOrdered(current, rowIndex))}
            >
              Прибрати рядок
            </Button>
          </Stack>
        </Box>
      ))}
      <Button
        onClick={() =>
          updateRows((current) => [
            ...current,
            {
              labelUk: '',
              labelRu: '',
              valueUk: '',
              valueRu: '',
              sortOrder: current.length,
            },
          ])
        }
      >
        Додати рядок
      </Button>
    </>
  );
}
