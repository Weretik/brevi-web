import { emptyPurchaseDocumentItem } from '@admin/purchasing/model';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import { PurchaseDocumentItem } from './purchase-document-item';

import type { PurchaseDocumentCheck, PurchaseDocumentFormItem } from '@admin/purchasing/model';

/** «Позиції» of the original: every position with its check, and «+ Позиція». */
export function PurchaseDocumentItems({
  items,
  check,
  showErrors,
  disabled,
  onChange,
}: {
  items: readonly PurchaseDocumentFormItem[];
  check: PurchaseDocumentCheck;
  showErrors: boolean;
  disabled: boolean;
  onChange: (items: PurchaseDocumentFormItem[]) => void;
}) {
  const setItem = (key: string, change: Partial<PurchaseDocumentFormItem>) =>
    onChange(items.map((item) => (item.key === key ? { ...item, ...change } : item)));
  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="subtitle2">Позиції</Typography>
      {showErrors && check.errors.items && <Alert severity="error">{check.errors.items}</Alert>}
      {items.map((item, index) => (
        <PurchaseDocumentItem
          key={item.key}
          item={item}
          index={index}
          single={items.length === 1}
          itemError={check.itemErrors[item.key]}
          discount={check.discounts[item.key]}
          disabled={disabled}
          onChange={(change) => setItem(item.key, change)}
          onRemove={() => onChange(items.filter((x) => x.key !== item.key))}
        />
      ))}
      <Box>
        <Button
          size="small"
          startIcon={<AddIcon />}
          disabled={disabled}
          onClick={() => onChange([...items, emptyPurchaseDocumentItem()])}
        >
          Позиція
        </Button>
      </Box>
    </Stack>
  );
}
