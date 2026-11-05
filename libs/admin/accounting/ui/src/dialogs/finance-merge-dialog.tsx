import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import type { FinanceCounterparty } from '@admin/accounting/model';

interface Props {
  open: boolean;
  /** The duplicate that goes into the target. */
  sourceName: string;
  /** Active finance counterparties matching the search, without the duplicate. */
  options: FinanceCounterparty[];
  loading: boolean;
  merging: boolean;
  onSearch: (text: string) => void;
  onClose: () => void;
  onConfirm: (target: FinanceCounterparty) => void;
}

/** «Обʼєднати»: pick the counterparty that keeps the operations. */
export function FinanceMergeDialog({
  open,
  sourceName,
  options,
  loading,
  merging,
  onSearch,
  onClose,
  onConfirm,
}: Props) {
  const [target, setTarget] = useState<FinanceCounterparty | null>(null);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="finance-merge-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="finance-merge-title">Обʼєднати «{sourceName}»</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2, pt: 1 }}>
          <DialogContentText>
            Усі операції «{sourceName}», також анульовані, перейдуть до обраного контрагента, а його
            назва стане іншою назвою. «{sourceName}» залишиться в архіві, змінити його вже не можна.
          </DialogContentText>
          <Autocomplete
            options={options}
            value={target}
            loading={loading}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(all) => all}
            noOptionsText="Почніть вводити назву"
            onInputChange={(_event, text, reason) => {
              if (reason === 'input') onSearch(text);
            }}
            onChange={(_event, option) => setTarget(option)}
            renderInput={(params) => <TextField {...params} label="Залишити контрагента" />}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={merging} onClick={onClose}>
          Скасувати
        </Button>
        <Button
          disabled={merging || !target}
          color="error"
          variant="contained"
          onClick={() => target && onConfirm(target)}
        >
          Обʼєднати
        </Button>
      </DialogActions>
    </Dialog>
  );
}
