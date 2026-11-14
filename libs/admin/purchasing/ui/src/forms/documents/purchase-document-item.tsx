import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';

import type { PurchaseDocumentFormItem } from '@admin/purchasing/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** One position of the original: name, quantity, unit, price and sum, with its reason or discount. */
export function PurchaseDocumentItem({
  item,
  index,
  single,
  itemError,
  discount,
  disabled,
  onChange,
  onRemove,
}: {
  item: PurchaseDocumentFormItem;
  index: number;
  /** The only position cannot be removed. */
  single: boolean;
  itemError: string | undefined;
  discount: number | undefined;
  disabled: boolean;
  onChange: (change: Partial<PurchaseDocumentFormItem>) => void;
  onRemove: () => void;
}) {
  return (
    <Box
      sx={{
        p: 1,
        border: 1,
        borderRadius: 1,
        borderColor: itemError ? 'error.main' : 'divider',
        bgcolor: itemError ? 'error.light' : 'background.paper',
      }}
    >
      <Stack sx={{ gap: 1 }}>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
          <Typography variant="body2" sx={{ ...mono, color: 'text.secondary', minWidth: 20 }}>
            {index + 1}
          </Typography>
          <TextField
            label="Назва"
            size="small"
            value={item.name}
            disabled={disabled}
            onChange={(event) => onChange({ name: event.target.value })}
            sx={{ flex: 1 }}
          />
          <IconButton
            size="small"
            aria-label={`Видалити позицію ${index + 1}`}
            disabled={disabled || single}
            onClick={onRemove}
          >
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Stack direction="row" sx={{ gap: 1, pl: 3.5, flexWrap: 'wrap' }}>
          {(
            [
              ['quantity', 'Кількість', 1],
              ['unit', 'Од.', 0.7],
              ['price', 'Ціна', 1],
              ['sum', 'Сума', 1.2],
            ] as const
          ).map(([field, label, grow]) => (
            <TextField
              key={field}
              label={label}
              size="small"
              inputMode={field === 'unit' ? 'text' : 'decimal'}
              value={item[field]}
              disabled={disabled}
              onChange={(event) => onChange({ [field]: event.target.value })}
              sx={{ flex: grow, minWidth: 80 }}
              slotProps={{ htmlInput: { 'aria-label': `${label} ${index + 1}` } }}
            />
          ))}
        </Stack>
        {(itemError || discount !== undefined) && (
          <Typography
            variant="caption"
            color={itemError ? 'error.main' : 'text.secondary'}
            sx={{ pl: 3.5 }}
          >
            {itemError ?? `Знижка ${discount} %`}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
