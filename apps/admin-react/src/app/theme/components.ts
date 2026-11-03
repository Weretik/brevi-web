import { motion } from './motion';
import { monoFontFamily } from './typography';

import type { Components, Theme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

const alertTones = ['success', 'info', 'warning', 'error'] as const;

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      ':root': {
        '--admin-font-mono': monoFontFamily,
        // Admin tables: own fixed height with an inner scroll, sized to the screen (laptop and desktop).
        '--admin-table-height': 'clamp(420px, calc(100dvh - 160px), 820px)',
      },
      // Native scrollbars (tables, panels, page) follow the light/dark theme instead of the light system one.
      html: { colorScheme: theme.palette.mode },
      '*': { scrollbarColor: `${theme.palette.action.disabled} transparent` },
      body: { minWidth: 320 },
      ':focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
      '@media (prefers-reduced-motion: reduce)': {
        '*, *::before, *::after': {
          animationDuration: '0.01ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.01ms !important',
          scrollBehavior: 'auto !important',
        },
      },
    }),
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        borderRadius: 6,
        minHeight: 40,
        paddingInline: 16,
        transition: `transform ${motion.duration.fast}ms ${motion.easing.out}, background-color ${motion.duration.fast}ms`,
        '&:active': { transform: 'scale(0.98)' },
      },
      sizeSmall: { minHeight: 32, paddingInline: 12 },
      outlined: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        color: theme.palette.text.primary,
        '&:hover': {
          borderColor: theme.palette.text.secondary,
          backgroundColor: theme.palette.action.hover,
        },
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        transition: `transform ${motion.duration.fast}ms ${motion.easing.out}`,
        '&:active': { transform: 'scale(0.94)' },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      rounded: { borderRadius: 8 },
      outlined: ({ theme }) => ({ borderColor: theme.palette.divider }),
    },
  },
  MuiCard: { defaultProps: { variant: 'outlined' } },
  MuiChip: {
    styleOverrides: { root: { borderRadius: 6, fontWeight: 600 } },
  },
  MuiOutlinedInput: {
    styleOverrides: { root: { borderRadius: 6 } },
  },
  MuiTabs: {
    styleOverrides: { indicator: { height: 3, borderRadius: 3 } },
  },
  MuiTab: {
    styleOverrides: { root: { minHeight: 44, fontWeight: 600 } },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        padding: '6px 10px',
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 8,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.14)',
      }),
    },
  },
  MuiMenuItem: {
    styleOverrides: { root: { borderRadius: 6, marginInline: 6, fontSize: 14 } },
  },
  MuiDialog: {
    styleOverrides: { paper: { borderRadius: 10 } },
  },
  MuiDialogTitle: {
    styleOverrides: { root: { fontSize: 18, fontWeight: 700 } },
  },
  MuiAlert: {
    styleOverrides: {
      root: { borderRadius: 8, alignItems: 'center' },
      ...Object.fromEntries(
        alertTones.map((tone) => [
          `standard${tone[0].toUpperCase()}${tone.slice(1)}`,
          ({ theme }: { theme: Theme }) => ({
            backgroundColor: theme.palette[tone].light,
            color: theme.palette.text.primary,
            '& .MuiAlert-icon': { color: theme.palette[tone].main },
          }),
        ]),
      ),
    },
  },
  MuiDataGrid: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.palette.divider,
        borderRadius: 8,
        backgroundColor: theme.palette.background.paper,
        '--DataGrid-rowBorderColor': theme.palette.divider,
        '--DataGrid-containerBackground': theme.palette.background.paper,
      }),
      columnHeaderTitle: ({ theme }) => ({
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: theme.palette.text.secondary,
      }),
      row: ({ theme }) => ({ '&:hover': { backgroundColor: theme.palette.action.hover } }),
      cell: { '&:focus, &:focus-within': { outlineColor: '#fd9600' } },
    },
  },
};
