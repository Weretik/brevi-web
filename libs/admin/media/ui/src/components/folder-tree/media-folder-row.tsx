import { Box, ButtonBase, Typography } from '@mui/material';

import type { ReactNode } from 'react';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** One 40 px line of the folder tree: expander, icon, name, photo count and menu. */
export function MediaFolderRow({
  label,
  count,
  depth,
  selected,
  icon,
  expander,
  menu,
  onClick,
}: {
  label: string;
  count: number | null;
  depth: number;
  selected: boolean;
  icon: ReactNode;
  expander?: ReactNode;
  menu?: ReactNode;
  onClick: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: 40,
        pl: depth * 1.5,
        pr: 0.5,
        borderRadius: 1,
        bgcolor: selected ? 'primary.light' : 'transparent',
        '&:hover': { bgcolor: selected ? 'primary.light' : 'action.hover' },
      }}
    >
      <Box sx={{ width: 32, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        {expander}
      </Box>
      <ButtonBase
        onClick={onClick}
        aria-current={selected ? 'true' : undefined}
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 40,
          justifyContent: 'flex-start',
          gap: 1,
          borderRadius: 1,
          color: selected ? 'primary.dark' : 'text.primary',
          fontWeight: selected ? 700 : 400,
        }}
      >
        {icon}
        <Typography
          variant="body2"
          noWrap
          sx={{ flex: 1, textAlign: 'left', fontWeight: 'inherit' }}
        >
          {label}
        </Typography>
        {count !== null && (
          <Typography variant="caption" color="text.secondary" sx={mono}>
            {count}
          </Typography>
        )}
      </ButtonBase>
      <Box sx={{ width: 40, flexShrink: 0 }}>{menu}</Box>
    </Box>
  );
}
