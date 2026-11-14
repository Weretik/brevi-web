import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useQuoteSettingsPreview } from './use-quote-settings-preview';

describe('useQuoteSettingsPreview', () => {
  it('follows the focused field: letter fields show the letter, PDF fields the PDF', () => {
    const { result } = renderHook(() => useQuoteSettingsPreview());

    expect(result.current.view).toBe('pdf');
    act(() => result.current.form.onFocusField('email.subject'));
    expect(result.current.view).toBe('letter');
    expect(result.current.focused).toBe('email.subject');
    act(() => result.current.form.onFocusField('company.name'));
    expect(result.current.view).toBe('pdf');
  });

  it('keeps the view for a field outside the preview', () => {
    const { result } = renderHook(() => useQuoteSettingsPreview());

    act(() => result.current.setView('letter'));
    act(() => result.current.form.onFocusField('managers.order'));

    expect(result.current.view).toBe('letter');
  });

  it('opening a letter row shows the letter', () => {
    const { result } = renderHook(() => useQuoteSettingsPreview());

    act(() => result.current.openLetterRow('main'));

    expect(result.current.view).toBe('letter');
    expect(result.current.openLetter).not.toBeNull();
  });
});
