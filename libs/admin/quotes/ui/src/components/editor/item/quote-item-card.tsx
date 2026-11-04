import { quoteTextMaxLength } from '@admin/quotes/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import {
  Alert,
  Box,
  Button,
  Card,
  Collapse,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { QuoteCustomComposition } from './quote-custom-composition';
import { QuoteItemMenu } from './quote-item-menu';
import { QuoteItemPhoto } from './quote-item-photo';
import { QuoteItemPrices } from './quote-item-prices';

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
  /** «Змінити склад» of a «Виріб з нуля» or a Catalog model. */
  onEditComposition: () => void;
  /** «Змінити фото»: another photo of the item's product (CAT-018). */
  onChangePhoto?: () => void;
  onMove: (offset: -1 | 1) => void;
  onRemove: () => void;
}

/** The anchor the «Перед надсиланням» links scroll to. */
export const quoteItemAnchor = (key: string) => `quote-item-${key}`;

const kindLabel = (item: QuoteItemDraft) => {
  if (item.kind === 'Sewing') return 'Модель';
  if (item.kind === 'CustomSewing') return item.productId ? 'Змінена модель' : 'Новий виріб';
  return item.kind === 'Ppe' ? 'ЗІЗ' : 'Разовий ЗІЗ';
};

/** A compact КП item: header, the price table and the description, always open for editing. */
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
  onEditComposition,
  onChangePhoto,
  onMove,
  onRemove,
}: Props) {
  const oneOff = item.kind === 'OneOffPpe';
  const custom = item.kind === 'CustomSewing';
  const ppe = item.kind === 'Ppe' || oneOff;
  const label = oneOff ? item.name || 'Разова позиція' : item.name;
  const [supplier, setSupplier] = useState(false);
  const meta = [item.season, item.code].filter(Boolean).join(' · ');
  const changePhoto = item.productId !== null && onChangePhoto ? onChangePhoto : undefined;
  return (
    <Card
      variant="outlined"
      id={quoteItemAnchor(item.key)}
      aria-label={`Позиція ${position}: ${label}`}
      sx={{ scrollMarginTop: 96, borderColor: itemError ? 'warning.main' : undefined }}
    >
      <Stack direction="row" sx={{ gap: 2, alignItems: 'center', p: 2, pb: 1.5 }}>
        <QuoteItemPhoto photoUrl={item.photoUrl} label={label} onChange={changePhoto} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: 'var(--admin-font-mono)' }}
            >
              {String(position).padStart(2, '0')}
            </Typography>
            {oneOff ? (
              <TextField
                size="small"
                required
                label="Назва позиції"
                value={item.name}
                onChange={(event) => onChange({ name: event.target.value })}
                slotProps={{ htmlInput: { maxLength: 200 } }}
                sx={{ flex: '1 1 260px' }}
              />
            ) : (
              <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 700 }}>
                {item.name}
              </Typography>
            )}
            <Box
              component="span"
              sx={{
                typography: 'caption',
                fontWeight: 600,
                px: 1,
                py: 0.25,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'action.hover',
              }}
            >
              {kindLabel(item)}
            </Box>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {meta}
            {meta && item.siteUrl ? ' · ' : ''}
            {item.siteUrl && (
              <Link href={item.siteUrl} target="_blank" rel="noreferrer" color="primary.dark">
                на сайті <OpenInNewOutlinedIcon sx={{ fontSize: 13, verticalAlign: 'middle' }} />
              </Link>
            )}
          </Typography>
        </Box>
        {(item.kind === 'Sewing' || custom) && (
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={onEditComposition}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Змінити склад
          </Button>
        )}
        <QuoteItemMenu
          label={label}
          onChangePhoto={changePhoto}
          isFirst={isFirst}
          isLast={isLast}
          onMove={onMove}
          onRemove={onRemove}
        />
      </Stack>

      {custom && item.lines.length > 0 && (
        <Box sx={{ px: 2, pb: 1.5, mt: -2 }}>
          <QuoteCustomComposition lines={item.lines} />
        </Box>
      )}
      <QuoteItemPrices
        item={item}
        itemName={label}
        optionErrors={optionErrors}
        onTierChange={onTierChange}
        onReasonChange={(optionKey, reason) =>
          onOptionChange(optionKey, (current) => ({ ...current, manualReason: reason }))
        }
        onRecommend={onRecommend}
        onRemoveOption={onRemoveOption}
      />

      <Box sx={{ px: 2, pt: 1.5 }}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          size="small"
          label="Опис позиції у КП"
          placeholder="Короткий опис для клієнта: що це за виріб, для кого, переваги"
          value={item.description}
          onChange={(event) => onChange({ description: event.target.value })}
          helperText={
            oneOff || custom
              ? 'Бачить клієнт у КП.'
              : 'Підтягується з «Короткого опису для КП» у товарі. Зміна діє лише в цьому КП.'
          }
          slotProps={{ htmlInput: { maxLength: quoteTextMaxLength } }}
        />
      </Box>
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
      {itemError && (
        <Alert severity="warning" sx={{ m: 2, mt: 0 }}>
          {itemError}
        </Alert>
      )}
    </Card>
  );
}
