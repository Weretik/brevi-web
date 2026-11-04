import { isSewingKind, hasManualPrice, quoteTiers } from '@admin/quotes/model';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import { Alert, Box, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';

import { QuotePriceBox } from './quote-price-box';

import type { QuoteItemKind, QuoteOptionDraft, QuoteTier } from '@admin/quotes/model';

interface Props {
  itemName: string;
  kind: QuoteItemKind;
  option: QuoteOptionDraft;
  error: string | undefined;
  canRemove: boolean;
  onTierChange: (tier: QuoteTier, patch: { shown?: boolean; manual?: string }) => void;
  onReasonChange: (reason: string) => void;
  onRecommend: () => void;
  onRemove: () => void;
}

/** A fabric variant of a model, or the single price row of a PPE. */
export function QuoteOptionRow({
  itemName,
  kind,
  option,
  error,
  canRemove,
  onTierChange,
  onReasonChange,
  onRecommend,
  onRemove,
}: Props) {
  const sewing = isSewingKind(kind);
  const manual = kind === 'Ppe' && hasManualPrice(option);
  return (
    <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 1.5, mt: 1.5 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ gap: 1.5 }}>
        <Box sx={{ flex: '1 1 220px', minWidth: 0 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {sewing ? option.title : 'Ціна'}
            </Typography>
            {sewing && (
              <Tooltip
                title={option.isRecommended ? 'Рекомендований варіант' : 'Зробити рекомендованим'}
              >
                <IconButton
                  size="small"
                  aria-pressed={option.isRecommended}
                  aria-label={`Рекомендований варіант: ${option.title}`}
                  onClick={onRecommend}
                  sx={{
                    width: 32,
                    height: 32,
                    color: option.isRecommended ? 'primary.dark' : 'text.secondary',
                  }}
                >
                  {option.isRecommended ? (
                    <StarOutlinedIcon fontSize="small" />
                  ) : (
                    <StarBorderOutlinedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}
            {canRemove && (
              <Tooltip title="Прибрати варіант">
                <IconButton
                  size="small"
                  aria-label={`Прибрати варіант: ${option.title}`}
                  onClick={onRemove}
                  sx={{ width: 32, height: 32, ml: 'auto' }}
                >
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          {option.isRecommended && (
            <Typography variant="caption" color="primary.dark" sx={{ fontWeight: 600 }}>
              Рекомендований варіант
            </Typography>
          )}
          {option.details && (
            <Typography variant="body2" color="text.secondary">
              {option.details}
            </Typography>
          )}
          {option.fabricInfo && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {option.fabricInfo}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            flex: '2 1 420px',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
            gap: 1,
          }}
        >
          {quoteTiers.map((tier) => (
            <QuotePriceBox
              key={tier}
              tier={tier}
              price={option.prices[tier]}
              editable={!sewing}
              label={`${itemName}, ${option.title}`}
              onShownChange={(shown) => onTierChange(tier, { shown })}
              onManualChange={(value) => onTierChange(tier, { manual: value })}
            />
          ))}
        </Box>
      </Stack>
      {kind === 'Ppe' && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Ціну можна виправити вручну; порожнє поле — ціна з каталогу.
        </Typography>
      )}
      {manual && (
        <TextField
          size="small"
          fullWidth
          required
          label="Причина ручної ціни"
          value={option.manualReason}
          onChange={(event) => onReasonChange(event.target.value)}
          helperText={option.manualBy ? `Ручну ціну встановив(-ла): ${option.manualBy}` : ' '}
          slotProps={{ htmlInput: { maxLength: 500 } }}
          sx={{ mt: 1 }}
        />
      )}
      {error && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
