import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Autocomplete, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';

/** A choice in an «Додати…» search: a reference row with its hint (price, norm). */
export interface QuoteCustomChoice {
  readonly id: number;
  readonly label: string;
  readonly hint: string;
}

/** One row of the panel: a name, its quantity field and, for an operation without a norm, minutes. */
export interface QuoteCustomRow {
  readonly key: string;
  readonly name: string;
  readonly quantity: string;
  readonly quantityLabel: string;
  readonly minutes?: string;
}

interface Props {
  title: string;
  /** The title only names the section for screen readers (a variant card shows its own heading). */
  hideTitle?: boolean;
  rows: readonly QuoteCustomRow[];
  /** Without choices the section only edits the rows it has (services and extra fabrics of a model). */
  choices?: readonly QuoteCustomChoice[];
  addLabel?: string;
  loading?: boolean;
  onAdd?: (choice: QuoteCustomChoice) => void;
  onQuantity: (key: string, value: string) => void;
  onMinutes?: (key: string, value: string) => void;
  onRemove: (key: string) => void;
}

/** «Тканини», «Фурнітура» or «Операції» of a «Виріб з нуля»: chosen rows and a search to add one more. */
export function QuoteCustomRows({
  title,
  hideTitle = false,
  rows,
  choices,
  addLabel,
  loading = false,
  onAdd,
  onQuantity,
  onMinutes,
  onRemove,
}: Props) {
  return (
    <Stack component="section" aria-label={title} sx={{ gap: 1 }}>
      {!hideTitle && (
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      )}
      {rows.map((row) => (
        <Stack
          key={row.key}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ gap: 1, alignItems: { sm: 'center' } }}
        >
          <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
            {row.name}
          </Typography>
          <TextField
            size="small"
            label={row.quantityLabel}
            value={row.quantity}
            onChange={(event) => onQuantity(row.key, event.target.value)}
            slotProps={{
              htmlInput: {
                inputMode: 'decimal',
                'aria-label': `${row.quantityLabel}: ${row.name}`,
              },
            }}
            sx={{ width: { sm: 120 } }}
          />
          {row.minutes !== undefined && onMinutes && (
            <TextField
              size="small"
              label="Хвилин"
              value={row.minutes}
              onChange={(event) => onMinutes(row.key, event.target.value)}
              slotProps={{
                htmlInput: { inputMode: 'decimal', 'aria-label': `Хвилин: ${row.name}` },
              }}
              sx={{ width: { sm: 100 } }}
            />
          )}
          <Tooltip title="Прибрати">
            <IconButton aria-label={`Прибрати: ${row.name}`} onClick={() => onRemove(row.key)}>
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ))}
      {choices && onAdd && (
        <Autocomplete
          size="small"
          options={choices as QuoteCustomChoice[]}
          loading={loading}
          value={null}
          blurOnSelect
          clearOnBlur
          getOptionLabel={(choice) => choice.label}
          renderOption={(props, choice) => (
            <li {...props} key={choice.id}>
              <Stack>
                <Typography variant="body2">{choice.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {choice.hint}
                </Typography>
              </Stack>
            </li>
          )}
          onChange={(_event, choice) => {
            if (choice) onAdd(choice);
          }}
          renderInput={(params) => <TextField {...params} label={addLabel} />}
        />
      )}
    </Stack>
  );
}
