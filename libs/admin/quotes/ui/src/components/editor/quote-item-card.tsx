import { quoteTextMaxLength } from '@admin/quotes/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { QuoteOptionRow } from './quote-option-row';

import type { QuoteItemDraft, QuoteOptionDraft, QuoteTier } from '@admin/quotes/model';

interface Props {
  item: QuoteItemDraft;
  position: number;
  isFirst: boolean;
  isLast: boolean;
  itemError: string | undefined;
  optionErrors: Readonly<Record<string, string>>;
  onChange: (patch: Partial<QuoteItemDraft>) => void;
  onTierChange: (
    optionKey: string,
    tier: QuoteTier,
    patch: { shown?: boolean; manual?: string },
  ) => void;
  onOptionChange: (
    optionKey: string,
    change: (option: QuoteOptionDraft) => QuoteOptionDraft,
  ) => void;
  onRecommend: (optionKey: string) => void;
  onRemoveOption: (optionKey: string) => void;
  onAddFabric: () => void;
  onMove: (offset: -1 | 1) => void;
  onRemove: () => void;
}

/** «Позиція 01»: a model with fabric variants, a PPE, or a one-off PPE with its prices. */
export function QuoteItemCard({
  item,
  position,
  isFirst,
  isLast,
  itemError,
  optionErrors,
  onChange,
  onTierChange,
  onOptionChange,
  onRecommend,
  onRemoveOption,
  onAddFabric,
  onMove,
  onRemove,
}: Props) {
  const oneOff = item.kind === 'OneOffPpe';
  const label = oneOff ? item.name || 'Разова позиція' : item.name;
  return (
    <Card variant="outlined" sx={{ p: 2 }} aria-label={`Позиція ${position}: ${label}`}>
      <Stack direction="row" sx={{ gap: 2, alignItems: 'flex-start' }}>
        {item.photoUrl ? (
          <Box
            component="img"
            src={item.photoUrl}
            alt=""
            sx={{
              width: 72,
              height: 72,
              objectFit: 'cover',
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
            }}
          />
        ) : (
          <Box
            sx={{ width: 72, height: 72, borderRadius: 1, bgcolor: 'action.hover', flexShrink: 0 }}
          />
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary">
            Позиція {String(position).padStart(2, '0')}
          </Typography>
          {oneOff ? (
            <TextField
              size="small"
              fullWidth
              required
              label="Назва позиції"
              value={item.name}
              onChange={(event) => onChange({ name: event.target.value })}
              slotProps={{ htmlInput: { maxLength: 200 } }}
              sx={{ mt: 0.5 }}
            />
          ) : (
            <Typography variant="h6" component="h3">
              {item.name}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            {[item.subtitle, item.season, item.code].filter(Boolean).join(' · ')}
          </Typography>
          {item.siteUrl && (
            <Link
              href={item.siteUrl}
              target="_blank"
              rel="noreferrer"
              variant="body2"
              color="primary.dark"
            >
              Відкрити на сайті{' '}
              <OpenInNewOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} />
            </Link>
          )}
        </Box>
        <Stack direction="row" sx={{ gap: 0.5 }}>
          <Tooltip title="Вище">
            <span>
              <IconButton
                aria-label={`Перемістити вище: ${label}`}
                disabled={isFirst}
                onClick={() => onMove(-1)}
              >
                <ArrowUpwardOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Нижче">
            <span>
              <IconButton
                aria-label={`Перемістити нижче: ${label}`}
                disabled={isLast}
                onClick={() => onMove(1)}
              >
                <ArrowDownwardOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Видалити позицію">
            <IconButton aria-label={`Видалити позицію: ${label}`} onClick={onRemove}>
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <TextField
        fullWidth
        multiline
        minRows={2}
        size="small"
        label="Опис позиції у КП"
        value={item.description}
        onChange={(event) => onChange({ description: event.target.value })}
        helperText={oneOff ? ' ' : 'Підтягується з каталогу. Зміна діє лише в цьому КП.'}
        slotProps={{ htmlInput: { maxLength: quoteTextMaxLength } }}
        sx={{ mt: 2 }}
      />
      {item.kind !== 'Sewing' && (
        <TextField
          fullWidth
          size="small"
          label="Посилання на постачальника"
          value={item.supplierUrl}
          onChange={(event) => onChange({ supplierUrl: event.target.value })}
          helperText="Лише для менеджера."
          slotProps={{ htmlInput: { maxLength: 1000 } }}
          sx={{ mt: 1 }}
        />
      )}

      {item.kind === 'Sewing' && (
        <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 700 }}>
          Варіанти тканини
        </Typography>
      )}
      {item.options.map((option) => (
        <QuoteOptionRow
          key={option.key}
          itemName={label}
          kind={item.kind}
          option={option}
          error={optionErrors[`option:${option.key}`]}
          canRemove={item.kind === 'Sewing' && item.options.length > 1}
          onTierChange={(tier, patch) => onTierChange(option.key, tier, patch)}
          onReasonChange={(reason) =>
            onOptionChange(option.key, (current) => ({ ...current, manualReason: reason }))
          }
          onRecommend={() => onRecommend(option.key)}
          onRemove={() => onRemoveOption(option.key)}
        />
      ))}
      {item.kind === 'Sewing' && (
        <Button startIcon={<AddOutlinedIcon />} onClick={onAddFabric} sx={{ mt: 1.5 }}>
          Додати тканину
        </Button>
      )}
      {itemError && (
        <Alert severity="warning" sx={{ mt: 1.5 }}>
          {itemError}
        </Alert>
      )}
    </Card>
  );
}
