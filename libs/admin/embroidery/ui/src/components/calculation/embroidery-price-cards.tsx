import { formatEmbroideryMoney, formatEmbroideryNumber } from '@admin/embroidery/model';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Alert,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import type { EmbroideryPrice } from '@admin/embroidery/model';
import type { ReactNode } from 'react';

interface Props {
  prices: readonly EmbroideryPrice[];
  quantity: number | null;
  /** The server's reason why there is no price. */
  error: string | null;
  /** Ticked costs without a rate: the prices are «Орієнтовна». */
  missing: readonly string[];
  /** What to do about missing rates: a link for Director and Admin, a hint for a Manager. */
  missingAction: ReactNode;
  /** Quantity or stitches are still empty. */
  waiting: boolean;
  fetching: boolean;
  onCopy: (price: EmbroideryPrice | null) => void;
  /** «Зберегти розрахунок»; absent where there is nothing to save. */
  onSave?: () => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** The right column of «Розрахунок»: a price per unit of each category with the order and repeat. */
export function EmbroideryPriceCards({
  prices,
  quantity,
  error,
  missing,
  missingAction,
  waiting,
  fetching,
  onCopy,
  onSave,
}: Props) {
  const ready = !waiting && !error && prices.length > 0;
  return (
    <Paper variant="outlined" component="section" aria-label="Ціна" sx={{ overflow: 'hidden' }}>
      <Box sx={{ height: 4 }}>{fetching && <LinearProgress aria-label="Рахуємо ціну" />}</Box>
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}
        >
          <Typography component="h2" variant="h6">
            Ціна за 1 шт
          </Typography>
          {quantity !== null && !waiting && (
            <Typography variant="body2" color="text.secondary" sx={mono}>
              {formatEmbroideryNumber(quantity)} шт
            </Typography>
          )}
        </Stack>

        {waiting ? (
          <Typography variant="body2" color="text.secondary">
            Вкажіть кількість і стежки — ціна з’явиться тут.
          </Typography>
        ) : error ? (
          <Alert severity="warning">{error}</Alert>
        ) : (
          <Stack sx={{ gap: 1 }}>
            {missing.length > 0 && (
              <Alert severity="warning">
                <b>Орієнтовна ціна.</b> Не задано: {missing.map((name) => `«${name}»`).join(', ')}.{' '}
                {missingAction}
              </Alert>
            )}
            {prices.map((price, index) => (
              <Box
                key={price.name}
                sx={{
                  p: 1.5,
                  borderRadius: 1.5,
                  border: 1,
                  borderColor: index === 0 ? 'primary.main' : 'divider',
                  bgcolor: index === 0 ? 'primary.light' : 'background.paper',
                }}
              >
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="subtitle2">
                    {price.name}
                    {price.markupPercent !== null && (
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={mono}
                      >
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
                        onClick={() => onCopy(price)}
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
            ))}
            <Typography variant="caption" color="text.secondary">
              Ціни з податком, грн. Повтор — та сама вишивка з готовою програмою.
            </Typography>
          </Stack>
        )}

        {ready && (
          <Button
            variant="contained"
            fullWidth
            startIcon={<ContentCopyOutlinedIcon />}
            onClick={() => onCopy(null)}
            sx={{ mt: 2 }}
          >
            Копіювати ціни
          </Button>
        )}
        {ready && onSave && (
          <Button
            variant="outlined"
            fullWidth
            startIcon={<SaveOutlinedIcon />}
            onClick={onSave}
            sx={{ mt: 1 }}
          >
            Зберегти розрахунок
          </Button>
        )}
      </Box>
    </Paper>
  );
}
