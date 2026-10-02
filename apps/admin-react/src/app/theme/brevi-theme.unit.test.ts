import { afterEach, describe, expect, it, vi } from 'vitest';

import { darkTheme, lightTheme } from './brevi-theme';
import { readColorMode, saveColorMode } from './color-mode';

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('Brevi theme', () => {
  it('uses the Brevi brand in both schemes', () => {
    expect(lightTheme.palette.primary.main).toBe('#fd9600');
    expect(darkTheme.palette.primary.main).toBe('#fd9600');
    expect(lightTheme.palette.background.default).toBe('#e6e6e6');
    expect(darkTheme.palette.background.default).toBe('#09090b');
  });

  it('provides Ukrainian labels for Material UI and the data grid in both schemes', () => {
    for (const theme of [lightTheme, darkTheme]) {
      const dataGridLocale = theme.components?.MuiDataGrid?.defaultProps?.localeText;
      const paginationLocale = theme.components?.MuiTablePagination?.defaultProps;

      expect(dataGridLocale?.columnMenuSortAsc).toBe('Сортувати за зростанням');
      expect(dataGridLocale?.columnMenuFilter).toBe('Фільтр');
      expect(dataGridLocale?.columnMenuAriaLabel?.('Назва')).toBe('Меню стовпця Назва');
      expect(dataGridLocale?.footerTotalVisibleRows?.(2, 5)).toBe('2 з 5');
      expect(paginationLocale?.labelRowsPerPage).toBe('Рядків на сторінці:');
    }
  });

  it('reads the existing Angular preference and falls back to system', () => {
    window.localStorage.setItem('theme', 'dark');
    expect(readColorMode()).toBe('dark');

    window.localStorage.setItem('theme', 'unknown');
    expect(readColorMode()).toBe('system');
  });

  it('keeps working when browser storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(readColorMode()).toBe('system');
    expect(() => saveColorMode('dark')).not.toThrow();
  });
});
