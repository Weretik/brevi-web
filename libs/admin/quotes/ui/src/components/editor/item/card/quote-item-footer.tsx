import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Collapse, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import type { QuoteItemDraft } from '@admin/quotes/model';

/** «Тканина», «Змінити склад» on a phone, and the supplier link of a PPE item that only the manager sees. */
export function QuoteItemFooter({
  item,
  onChange,
  onAddFabric,
  onEditComposition,
}: {
  item: QuoteItemDraft;
  onChange: (patch: Partial<QuoteItemDraft>) => void;
  onAddFabric: () => void;
  onEditComposition: () => void;
}) {
  const custom = item.kind === 'CustomSewing';
  const ppe = item.kind === 'Ppe' || item.kind === 'OneOffPpe';
  const [supplier, setSupplier] = useState(false);
  return (
    <>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap', px: 1, py: 1 }}>
        {item.kind === 'Sewing' && (
          <Button startIcon={<AddOutlinedIcon />} onClick={onAddFabric}>
            Тканина
          </Button>
        )}
        {(item.kind === 'Sewing' || custom) && (
          <Button onClick={onEditComposition} sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
            Змінити склад
          </Button>
        )}
        {ppe && (
          <Button
            onClick={() => setSupplier((open) => !open)}
            aria-expanded={supplier}
            sx={{ ml: 'auto' }}
          >
            {supplier ? 'Сховати посилання' : 'Посилання на постачальника'}
          </Button>
        )}
      </Stack>
      {ppe && (
        <Collapse in={supplier} unmountOnExit>
          <Box sx={{ px: 2, pb: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Посилання на постачальника"
              value={item.supplierUrl}
              onChange={(event) => onChange({ supplierUrl: event.target.value })}
              helperText="Бачите лише ви."
              slotProps={{ htmlInput: { maxLength: 1000 } }}
            />
          </Box>
        </Collapse>
      )}
    </>
  );
}
