import SearchIcon from '@mui/icons-material/Search';
import { Box, ButtonBase, IconButton, Popover, Typography } from '@mui/material';
import { useState, type MouseEvent } from 'react';

import { topBarIconButtonSx } from './top-bar-icon-button';

/** Search entry point. Global search has no backend yet, so it explains that instead of searching. */
export function TopBarSearch() {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const open = (event: MouseEvent<HTMLElement>) => setAnchorElement(event.currentTarget);

  return (
    <>
      <ButtonBase
        aria-label="Пошук"
        onClick={open}
        sx={{
          alignItems: 'center',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1.5,
          color: 'text.secondary',
          display: { xs: 'none', md: 'flex' },
          fontSize: 14,
          gap: 1,
          height: 40,
          justifyContent: 'flex-start',
          px: 1.5,
          width: { md: 260, xl: 340 },
          '&:hover': { borderColor: 'text.secondary' },
        }}
      >
        <SearchIcon fontSize="small" />
        <Box
          component="span"
          sx={{
            flex: 1,
            overflow: 'hidden',
            textAlign: 'left',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          Пошук клієнтів, КП, товарів…
        </Box>
        <Box
          aria-hidden="true"
          component="kbd"
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            fontFamily: 'inherit',
            fontSize: 11,
            px: 0.75,
          }}
        >
          Ctrl K
        </Box>
      </ButtonBase>
      <IconButton
        aria-label="Пошук"
        onClick={open}
        sx={{ ...topBarIconButtonSx, display: { md: 'none' } }}
      >
        <SearchIcon fontSize="small" />
      </IconButton>
      <Popover
        anchorEl={anchorElement}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={() => setAnchorElement(null)}
        open={Boolean(anchorElement)}
        slotProps={{ paper: { sx: { maxWidth: 300, mt: 1, p: 2 } } }}
      >
        <Typography sx={{ fontWeight: 700 }}>Пошук скоро з'явиться</Typography>
        <Typography color="text.secondary" variant="body2">
          Тут можна буде знайти клієнта, КП або товар з будь-якої сторінки.
        </Typography>
      </Popover>
    </>
  );
}
