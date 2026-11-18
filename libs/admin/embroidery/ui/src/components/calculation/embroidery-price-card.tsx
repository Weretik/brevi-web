import { formatEmbroideryMoney, formatEmbroideryNumber } from '@admin/embroidery/model';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import type { EmbroideryPrice } from '@admin/embroidery/model';

/** Money in a fixed-width font. */
export const priceMono = {
  fontFamily: 'var(--admin-font-mono)',
  fontVariantNumeric: 'tabular-nums',
};
const mono = priceMono;

interface Props {
  price: EmbroideryPrice;
  /** The first category is highlighted. */
  first: boolean;
  onCopy: () => void;
}

/** One category: the price per unit with its markup, the order total and the repeat price. */
export function EmbroideryPriceCard({ price, first, onCopy }: Props) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        border: 1,
        borderColor: first ? 'primary.main' : 'divider',
        bgcolor: first ? 'primary.light' : 'background.paper',
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2">
          {price.name}
          {price.markupPercent !== null && (
            <Typography component="span" variant="caption" color="text.secondary" sx={mono}>
              {' '}
              +{formatEmbroideryNumber(price.markupPercent)}%
            </Typography>
          )}
        </Typography>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ ...mono, fontSize: 22, fontWeight: 600 }}>
            {formatEmbroideryMoney(price.unit)}
          </Typography>
          <Tooltip title="Копіювати ціну за 1 шт">
            <IconButton
              size="small"
              aria-label={`Копіювати ціну за 1 шт: ${price.name}`}
              onClick={onCopy}
            >
              <ContentCopyOutlinedIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        Замовлення{' '}
        <Box component="span" sx={{ ...mono, color: 'text.primary' }}>
          {formatEmbroideryMoney(price.total)}
        </Box>{' '}
        · повтор{' '}
        <Box component="span" sx={{ ...mono, color: 'text.primary' }}>
          {formatEmbroideryMoney(price.repeatUnit)}
        </Box>
      </Typography>
    </Box>
  );
}
