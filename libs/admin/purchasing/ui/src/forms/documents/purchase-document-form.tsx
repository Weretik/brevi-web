import { emptyPurchaseDocumentItem, formatPurchaseKopecks } from '@admin/purchasing/model';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

import type {
  PurchaseDocumentCheck,
  PurchaseDocumentFormItem,
  PurchaseDocumentFormValues,
} from '@admin/purchasing/model';

interface Props {
  values: PurchaseDocumentFormValues;
  check: PurchaseDocumentCheck;
  /** Show field reasons only after the first «Зберегти». */
  showErrors: boolean;
  disabled: boolean;
  onChange: (values: PurchaseDocumentFormValues) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/**
 * «Виправити»: the facts of one original as the AI read them. Wrong lines are highlighted, the
 * sum of the positions is counted while typing and compared with «До оплати» to the kopeck.
 */
export function PurchaseDocumentForm({ values, check, showErrors, disabled, onChange }: Props) {
  const set = <K extends keyof PurchaseDocumentFormValues>(
    field: K,
    value: PurchaseDocumentFormValues[K],
  ) => onChange({ ...values, [field]: value });
  const setItem = (key: string, change: Partial<PurchaseDocumentFormItem>) =>
    set(
      'items',
      values.items.map((item) => (item.key === key ? { ...item, ...change } : item)),
    );
  const error = (field: keyof PurchaseDocumentCheck['errors']) =>
    showErrors ? check.errors[field] : undefined;
  const withVat = values.vat === 'WithVat';

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5 }}>
        <TextField
          label="Вид документа"
          size="small"
          value={values.documentType}
          error={Boolean(error('documentType'))}
          helperText={error('documentType')}
          disabled={disabled}
          onChange={(event) => set('documentType', event.target.value)}
          sx={{ flex: 2 }}
        />
        <TextField
          label="Номер"
          size="small"
          value={values.documentNumber}
          error={Boolean(error('documentNumber'))}
          helperText={error('documentNumber')}
          disabled={disabled}
          onChange={(event) => set('documentNumber', event.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Дата"
          type="date"
          size="small"
          value={values.documentDate}
          error={Boolean(error('documentDate'))}
          helperText={error('documentDate')}
          disabled={disabled}
          onChange={(event) => set('documentDate', event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ flex: 1 }}
        />
      </Stack>
      <TextField
        label="Постачальник (як у рахунку)"
        size="small"
        value={values.supplierName}
        error={Boolean(error('supplierName'))}
        helperText={error('supplierName')}
        disabled={disabled}
        onChange={(event) => set('supplierName', event.target.value)}
      />
      <Stack direction="row" sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={values.vat}
          disabled={disabled}
          aria-label="ПДВ"
          onChange={(_, value) => value && set('vat', value)}
        >
          <ToggleButton value="WithoutVat">Без ПДВ</ToggleButton>
          <ToggleButton value="WithVat">З ПДВ</ToggleButton>
        </ToggleButtonGroup>
        {withVat && (
          <FormControlLabel
            control={
              <Checkbox
                checked={values.pricesIncludeVat}
                disabled={disabled}
                onChange={(event) => set('pricesIncludeVat', event.target.checked)}
              />
            }
            label="Ціни вже з ПДВ"
          />
        )}
      </Stack>

      <Stack sx={{ gap: 1 }}>
        <Typography variant="subtitle2">Позиції</Typography>
        {showErrors && check.errors.items && <Alert severity="error">{check.errors.items}</Alert>}
        {values.items.map((item, index) => {
          const itemError = check.itemErrors[item.key];
          const discount = check.discounts[item.key];
          return (
            <Box
              key={item.key}
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
                  <Typography
                    variant="body2"
                    sx={{ ...mono, color: 'text.secondary', minWidth: 20 }}
                  >
                    {index + 1}
                  </Typography>
                  <TextField
                    label="Назва"
                    size="small"
                    value={item.name}
                    disabled={disabled}
                    onChange={(event) => setItem(item.key, { name: event.target.value })}
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    size="small"
                    aria-label={`Видалити позицію ${index + 1}`}
                    disabled={disabled || values.items.length === 1}
                    onClick={() =>
                      set(
                        'items',
                        values.items.filter((x) => x.key !== item.key),
                      )
                    }
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
                      onChange={(event) => setItem(item.key, { [field]: event.target.value })}
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
        })}
        <Box>
          <Button
            size="small"
            startIcon={<AddIcon />}
            disabled={disabled}
            onClick={() => set('items', [...values.items, emptyPurchaseDocumentItem()])}
          >
            Позиція
          </Button>
        </Box>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5 }}>
        {withVat && (
          <TextField
            label="Сума ПДВ"
            size="small"
            inputMode="decimal"
            value={values.vatAmount}
            error={Boolean(error('vatAmount'))}
            helperText={error('vatAmount')}
            disabled={disabled}
            onChange={(event) => set('vatAmount', event.target.value)}
            sx={{ flex: 1 }}
          />
        )}
        <TextField
          label="До оплати"
          size="small"
          inputMode="decimal"
          value={values.totalPayable}
          error={Boolean(error('totalPayable'))}
          helperText={error('totalPayable')}
          disabled={disabled}
          onChange={(event) => set('totalPayable', event.target.value)}
          sx={{ flex: 1 }}
        />
      </Stack>
      <Alert severity={check.balanced ? 'success' : 'warning'} sx={mono}>
        {check.linesKopecks === null
          ? 'Сума позицій порахується, коли всі суми будуть числами.'
          : `${withVat && !values.pricesIncludeVat ? 'Позиції + ПДВ' : 'Сума позицій'}: ${formatPurchaseKopecks(
              check.linesKopecks,
            )} грн${check.balanced ? ' — збігається з «До оплати».' : ' — не збігається з «До оплати».'}`}
      </Alert>
    </Stack>
  );
}
