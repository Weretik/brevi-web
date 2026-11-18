import { quoteTiers } from '@admin/quotes/model';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import { Box, IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';

import { QuoteFabricLine } from './quote-fabric-line';
import { QuotePriceCell } from './quote-price-cell';


import type { QuoteFabricFacts, QuoteOptionDraft, QuoteTier } from '@admin/quotes/model';

interface Props {
  option: QuoteOptionDraft;
  sewing: boolean;
  embroidery: boolean;
  /** Manual prices can be typed (not a fixed-price item). */
  editable: boolean;
  /** «Прибрати тканину» shows. */
  removable: boolean;
  /** Item and option name for screen readers. */
  label: string;
  fabricFacts: ReadonlyMap<number, QuoteFabricFacts>;
  onOpenSupplier?: (facts: QuoteFabricFacts) => void;
  onRecommend: () => void;
  onTierChange: (tier: QuoteTier, patch: { shown?: boolean; manual?: string }) => void;
  onRemove: () => void;
}

/**
 * A price row of an item: the «рекомендуємо» star, the option title and its fabric or details, a price per
 * quantity tier and «Прибрати тканину».
 */
export function QuoteOptionRow({
  option,
  sewing,
  embroidery,
  editable,
  removable,
  label,
  fabricFacts,
  onOpenSupplier,
  onRecommend,
  onTierChange,
  onRemove,
}: Props) {
  return (
    <TableRow>
      <TableCell sx={{ verticalAlign: 'top' }}>
        <Stack direction="row" sx={{ gap: 0.5, alignItems: 'flex-start' }}>
          {sewing && (
            <IconButton
              size="small"
              aria-pressed={option.isRecommended}
              aria-label={
                option.isRecommended
                  ? `Не рекомендувати: ${label}`
                  : `Рекомендувати клієнту: ${label}`
              }
              title={option.isRecommended ? 'Не рекомендувати' : 'Рекомендувати клієнту'}
              onClick={onRecommend}
              sx={{
                ml: -0.75,
                mt: -0.25,
                flexShrink: 0,
                color: option.isRecommended ? 'primary.dark' : 'text.disabled',
              }}
            >
              {option.isRecommended ? (
                <StarOutlinedIcon fontSize="small" />
              ) : (
                <StarBorderOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          )}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
              {sewing || embroidery ? option.title : 'За одиницю'}
            </Typography>
            {option.isRecommended && (
              <Typography
                variant="caption"
                component="span"
                sx={{ color: 'primary.dark', fontWeight: 600, ml: 0.75 }}
              >
                рекомендуємо
              </Typography>
            )}
            {sewing && (
              <QuoteFabricLine
                option={option}
                fabricFacts={fabricFacts}
                onOpenSupplier={onOpenSupplier}
              />
            )}
            {!sewing && option.details && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {option.details}
              </Typography>
            )}
          </Box>
        </Stack>
      </TableCell>
      {quoteTiers.map((tier) => (
        <TableCell key={tier} align="right" sx={{ verticalAlign: 'top' }}>
          <QuotePriceCell
            tier={tier}
            price={option.prices[tier]}
            editable={editable}
            label={label}
            onManualChange={(manual) => onTierChange(tier, { manual })}
            onShownChange={(shown) => onTierChange(tier, { shown })}
          />
        </TableCell>
      ))}
      <TableCell align="right" sx={{ verticalAlign: 'top' }}>
        {removable && (
          <Tooltip title="Прибрати тканину">
            <IconButton size="small" aria-label={`Прибрати тканину: ${label}`} onClick={onRemove}>
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
}
