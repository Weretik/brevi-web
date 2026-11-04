import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { Box, ButtonBase, Paper, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  empty: boolean;
  onAddProduct: () => void;
  onAddOneOff: () => void;
  onAddCustom: () => void;
}

interface Tile {
  title: string;
  text: string;
  icon: ReactNode;
  onClick: () => void;
}

/** «Додати позицію»: three ways to add an item, each with a line on when to use it. */
export function QuoteAddItems({ empty, onAddProduct, onAddOneOff, onAddCustom }: Props) {
  const tiles: Tile[] = [
    {
      title: 'З каталогу',
      text: 'Моделі пошиву з тканинами й товари ЗІЗ. Можна обрати кілька одразу.',
      icon: <CategoryOutlinedIcon />,
      onClick: onAddProduct,
    },
    {
      title: 'Новий виріб',
      text: 'Немає в каталозі: оберіть тканину, фурнітуру й операції, ціна порахується сама.',
      icon: <ContentCutOutlinedIcon />,
      onClick: onAddCustom,
    },
    {
      title: 'Разовий товар ЗІЗ',
      text: 'Закупимо під клієнта: назва, посилання постачальника, ціна вручну.',
      icon: <Inventory2OutlinedIcon />,
      onClick: onAddOneOff,
    },
  ];
  return (
    <Paper variant="outlined" sx={{ p: 2, borderStyle: 'dashed' }} aria-label="Додати позицію">
      <Typography variant="overline" color="text.secondary" component="h2">
        {empty ? 'Додайте першу позицію' : 'Додати позицію'}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          mt: 1,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        {tiles.map((tile) => (
          <ButtonBase
            key={tile.title}
            onClick={tile.onClick}
            aria-label={tile.title}
            sx={(theme) => ({
              display: 'block',
              textAlign: 'left',
              p: 1.75,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              transition: theme.transitions.create(['border-color', 'background-color'], {
                duration: theme.transitions.duration.shortest,
              }),
              '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light' },
              '&.Mui-focusVisible': { outline: 2, outlineColor: 'primary.main' },
            })}
          >
            <Box sx={{ color: 'primary.dark', display: 'flex' }}>{tile.icon}</Box>
            <Typography sx={{ fontWeight: 700, mt: 0.75 }}>{tile.title}</Typography>
            <Typography variant="caption" color="text.secondary" component="p" sx={{ m: 0 }}>
              {tile.text}
            </Typography>
          </ButtonBase>
        ))}
      </Box>
    </Paper>
  );
}
