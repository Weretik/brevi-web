import { introductionLayout } from '@admin/clients/model';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { IntroductionSelectionPanel } from './introduction-selection-panel';

import type { IntroductionSelectionPanelProps } from './introduction-selection-panel';
import type { IntroductionSlotView } from '@admin/clients/model';

const slots = (): IntroductionSlotView[] =>
  introductionLayout('summer').map((slot) => ({
    slot,
    productLabel: slot.position === 1 ? 'Серверна головна модель' : null,
    fabricLabel: null,
    blockers: [],
  }));
const props = (
  overrides: Partial<IntroductionSelectionPanelProps> = {},
): IntroductionSelectionPanelProps => ({
  format: 'summer',
  slots: slots(),
  selectionToken: 'selection-1',
  disabled: false,
  onFormatChange: vi.fn(),
  onChooseProduct: vi.fn(),
  onChooseFabric: vi.fn(),
  onCheck: vi.fn(async () => ({ approved: true, blockers: [] })),
  onApply: vi.fn(async () => undefined),
  ...overrides,
});
const applyButton = () => screen.getByRole('button', { name: 'Застосувати як нову чернетку' });

afterEach(cleanup);

describe('first-contact selection UI (SC-I01–03 partial)', () => {
  it('shows server blockers and requires a clean, explicit check before apply', async () => {
    const onCheck = vi
      .fn()
      .mockResolvedValueOnce({
        approved: false,
        blockers: ['Модель не відповідає сезону', 'Повтор моделі'],
      })
      .mockResolvedValueOnce({ approved: true, blockers: [] });
    const onApply = vi.fn(async () => undefined);
    render(<IntroductionSelectionPanel {...props({ onCheck, onApply })} />);
    expect(applyButton()).toBeDisabled();
    expect(screen.getAllByText(/головна модель/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Перевірити добірку' }));
    expect(await screen.findByText('Модель не відповідає сезону')).toBeInTheDocument();
    expect(screen.getByText('Повтор моделі')).toBeInTheDocument();
    expect(applyButton()).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Перевірити добірку' }));
    await waitFor(() => expect(applyButton()).toBeEnabled());
    expect(onApply).not.toHaveBeenCalled();
    fireEvent.click(applyButton());
    await waitFor(() => expect(onApply).toHaveBeenCalledWith('selection-1'));
  });

  it('discards approval returned after the selection changes', async () => {
    let finish: ((value: { approved: boolean; blockers: string[] }) => void) | undefined;
    const onCheck = vi.fn(
      () =>
        new Promise<{ approved: boolean; blockers: string[] }>((resolve) => {
          finish = resolve;
        }),
    );
    const view = render(<IntroductionSelectionPanel {...props({ onCheck })} />);
    fireEvent.click(screen.getByRole('button', { name: 'Перевірити добірку' }));
    view.rerender(
      <IntroductionSelectionPanel {...props({ onCheck, selectionToken: 'selection-2' })} />,
    );
    finish?.({ approved: true, blockers: [] });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Перевірити добірку' })).toBeEnabled(),
    );
    expect(applyButton()).toBeDisabled();
  });

  it('blocks apply when a server slot reports missing fabric metadata', async () => {
    const blocked = slots();
    blocked[0] = { ...blocked[0], blockers: ['Немає метаданих тканини'] };
    const onCheck = vi.fn(async () => ({ approved: true, blockers: [] }));
    render(<IntroductionSelectionPanel {...props({ slots: blocked, onCheck })} />);
    fireEvent.click(screen.getByRole('button', { name: 'Перевірити добірку' }));
    await waitFor(() => expect(onCheck).toHaveBeenCalledWith('selection-1'));
    expect(applyButton()).toBeDisabled();
    expect(screen.getAllByText('Немає метаданих тканини')).toHaveLength(2);
  });
});
