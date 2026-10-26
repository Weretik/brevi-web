import { Button, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import type { SewingArticleCreateDraft } from '@admin/products/model';

interface Props {
  version: number;
  nextSortOrder: number;
  creating: boolean;
  onCreate: (draft: SewingArticleCreateDraft) => void;
}
export function SewingArticleCreateForm({ version, nextSortOrder, creating, onCreate }: Props) {
  const [saleSku, setSaleSku] = useState('');
  const [active, setActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(nextSortOrder);
  const normalizedSku = saleSku.trim();
  return (
    <Stack
      component="form"
      aria-label="Створити артикул"
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ gap: 1, alignItems: { sm: 'center' } }}
      onSubmit={(event) => {
        event.preventDefault();
        if (!normalizedSku || creating) return;
        onCreate({ saleSku: normalizedSku, active, sortOrder, expectedVersion: version });
      }}
    >
      <TextField
        label="SKU артикулу"
        value={saleSku}
        onChange={(event) => setSaleSku(event.target.value)}
        slotProps={{ htmlInput: { maxLength: 80 } }}
        required
        disabled={creating}
      />
      <TextField
        label="Порядок"
        type="number"
        value={sortOrder}
        onChange={(event) => setSortOrder(Math.max(0, Number(event.target.value)))}
        slotProps={{ htmlInput: { min: 0, step: 1 } }}
        disabled={creating}
        sx={{ minWidth: 130 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={active}
            onChange={(_, checked) => setActive(checked)}
            disabled={creating}
          />
        }
        label="Активний"
      />
      <Button type="submit" variant="outlined" disabled={!normalizedSku || creating}>
        {creating ? 'Створення…' : 'Додати артикул'}
      </Button>
    </Stack>
  );
}
