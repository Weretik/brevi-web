import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button, Paper, Stack, Typography } from '@mui/material';

interface Props {
  empty: boolean;
  onAddProduct: () => void;
  onAddOneOff: () => void;
  onAddCustom: () => void;
}

/**
 * The add buttons inside the products block: with a hint while the КП is empty,
 * then as «Додати ще…» under the last item.
 */
export function QuoteAddItems({ empty, onAddProduct, onAddOneOff, onAddCustom }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: empty ? 3 : 1.5, textAlign: 'center', borderStyle: empty ? 'solid' : 'dashed' }}
    >
      {empty && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Додайте модель з варіантами тканини, виріб з нуля, товар ЗІЗ або разову позицію.
        </Typography>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1, justifyContent: 'center' }}>
        <Button
          variant={empty ? 'contained' : 'outlined'}
          startIcon={<AddOutlinedIcon />}
          onClick={onAddProduct}
        >
          {empty ? 'Додати товар' : 'Додати ще товар'}
        </Button>
        <Button variant="outlined" startIcon={<AddOutlinedIcon />} onClick={onAddCustom}>
          {empty ? 'Додати виріб з нуля' : 'Додати ще виріб з нуля'}
        </Button>
        <Button variant="outlined" startIcon={<AddOutlinedIcon />} onClick={onAddOneOff}>
          {empty ? 'Додати разовий ЗІЗ' : 'Додати ще разовий ЗІЗ'}
        </Button>
      </Stack>
    </Paper>
  );
}
