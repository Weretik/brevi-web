import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';

import type { QuoteItemDraft } from '@admin/quotes/model';

const kindLabel = (item: QuoteItemDraft) => {
  if (item.kind === 'Sewing') return 'Модель';
  if (item.kind === 'CustomSewing') return item.productId ? 'Змінена модель' : 'Новий виріб';
  if (item.kind === 'Embroidery') return 'Вишивка';
  return item.kind === 'Ppe' ? 'ЗІЗ' : 'Разовий ЗІЗ';
};

/** Position, name (typed for a one-off item), kind, «Що змінено», season and code, and the site link. */
export function QuoteItemTitle({
  item,
  position,
  onChange,
  onShowChanges,
}: {
  item: QuoteItemDraft;
  position: number;
  onChange: (patch: Partial<QuoteItemDraft>) => void;
  onShowChanges?: () => void;
}) {
  const oneOff = item.kind === 'OneOffPpe';
  const meta =
    item.kind === 'Embroidery'
      ? (item.subtitle ?? '')
      : [item.season, item.code].filter(Boolean).join(' · ');
  return (
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
        {onShowChanges && item.kind === 'CustomSewing' && item.productId !== null && (
          <Button
            size="small"
            startIcon={<HistoryOutlinedIcon />}
            onClick={onShowChanges}
            sx={{ py: 0, minHeight: 0 }}
          >
            Що змінено
          </Button>
        )}
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
  );
}
