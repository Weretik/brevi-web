import { formatQuotePrice } from '@admin/quotes/model';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  ButtonBase,
  Card,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { QuoteCatalogProduct, QuoteIntroSlotDraft } from '@admin/quotes/model';

interface Props {
  slot: QuoteIntroSlotDraft;
  /** «Головна модель · фіксована» or «Модель 1 · обов’язково». */
  label: string;
  isMain: boolean;
  seasonHint: string;
  /** The Catalog data of the model: its fabrics; undefined while loading. */
  product: QuoteCatalogProduct | undefined;
  price: number | null;
  error: string | undefined;
  onPick: () => void;
  onFabric: (articleId: number | null) => void;
  onClear: () => void;
}

/** One model of a page: photo, name, fabric select and the від 41 шт. price. */
export function QuoteIntroSlotCard({
  slot,
  label,
  isMain,
  seasonHint,
  product,
  price,
  error,
  onPick,
  onFabric,
  onClear,
}: Props) {
  const head = (
    <Typography
      variant="overline"
      sx={{ color: isMain ? 'primary.main' : 'text.secondary', fontWeight: 700, lineHeight: 1.6 }}
    >
      {label}
    </Typography>
  );

  if (slot.productId === null)
    return (
      <Card
        variant="outlined"
        sx={{ p: 1.5, borderStyle: 'dashed', display: 'flex', flexDirection: 'column' }}
      >
        {head}
        <ButtonBase
          onClick={onPick}
          disabled={isMain}
          sx={{ flex: 1, minHeight: 160, flexDirection: 'column', gap: 0.5, borderRadius: 1 }}
        >
          <AddIcon />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {isMain ? 'Головну модель не знайдено' : 'Обрати модель'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {seasonHint}
          </Typography>
        </ButtonBase>
        {(error ?? slot.problem) && (
          <Typography variant="caption" color="error.main">
            {error ?? slot.problem}
          </Typography>
        )}
      </Card>
    );

  const variants = product?.variants ?? [];
  const known = variants.some((variant) => variant.articleId === slot.articleId);
  return (
    <Card
      variant="outlined"
      sx={{
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        borderColor: isMain ? 'primary.main' : error ? 'error.main' : 'divider',
      }}
    >
      {head}
      {slot.photoUrl ? (
        <Box
          component="img"
          src={slot.photoUrl}
          alt=""
          sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 1 }}
        />
      ) : (
        <Box sx={{ height: 140, borderRadius: 1, bgcolor: 'action.hover' }} />
      )}
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {slot.name}
      </Typography>
      <TextField
        select
        size="small"
        label="Тканина"
        value={slot.articleId !== null && (known || !product) ? slot.articleId : ''}
        error={Boolean(error)}
        helperText={error}
        onChange={(event) =>
          onFabric(event.target.value === '' ? null : Number(event.target.value))
        }
        slotProps={{ select: { displayEmpty: false } }}
      >
        {!known && slot.articleId !== null && !product && (
          <MenuItem value={slot.articleId}>{slot.fabricTitle}</MenuItem>
        )}
        {variants.map((variant) => (
          <MenuItem
            key={variant.articleId}
            value={variant.articleId}
            disabled={Boolean(variant.problem)}
          >
            {variant.title}
            {variant.problem ? ` — ${variant.problem}` : ''}
          </MenuItem>
        ))}
      </TextField>
      <Typography variant="caption" color="text.secondary">
        від 41 шт. з ПДВ:{' '}
        <Box component="span" sx={{ fontFamily: 'var(--admin-font-mono)', color: 'text.primary' }}>
          {formatQuotePrice(price)}
        </Box>
      </Typography>
      {!isMain && (
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button size="small" onClick={onPick}>
            Змінити
          </Button>
          <Button size="small" color="inherit" onClick={onClear}>
            Прибрати
          </Button>
        </Stack>
      )}
    </Card>
  );
}
