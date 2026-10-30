import { emptyCustomConfiguration } from '@admin/clients/model';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CustomSuggestionsPanel } from './custom-suggestions-panel';

const api = vi.hoisted(() => ({
  query: {
    currentData: undefined as unknown,
    error: undefined as unknown,
    isFetching: false,
    refetch: vi.fn(),
  },
  read: vi.fn(),
}));
vi.mock('@admin/clients/data-access', () => ({
  useGetCustomSuggestionsQuery: (...args: unknown[]) => {
    api.read(...args);
    return api.query;
  },
}));
const configuration = {
  ...emptyCustomConfiguration(),
  name: 'Виріб',
  productType: 'Куртка',
  internalNote: 'Не змінювати',
  accessories: [{ referenceId: 99, quantity: 1, unit: 'Piece' }],
};
const response = {
  productType: 'Куртка',
  season: 'summer',
  sampleSize: 3,
  sourceLimitReached: false,
  norms: [
    {
      kind: 'accessory',
      referenceId: 3,
      quantity: 2,
      unit: 'Piece',
      manualMinutes: null,
      minimumQuantity: 1,
      maximumQuantity: 4,
      sampleSize: 3,
      varyingNorm: true,
    },
  ],
};
afterEach(cleanup);
beforeEach(() => {
  api.query.currentData = response;
  api.query.error = undefined;
  api.query.isFetching = false;
  vi.clearAllMocks();
});
describe('explicit suggestion review', () => {
  it('does not change configuration on read or cancel and applies only after confirmation', () => {
    const onApply = vi.fn();
    render(
      <CustomSuggestionsPanel configuration={configuration} disabled={false} onApply={onApply} />,
    );
    expect(onApply).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути підказки' }));
    expect(screen.getByText(/Норма відрізняється між моделями/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Скасувати' }));
    expect(onApply).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути підказки' }));
    expect(screen.getByText(/Буде створено нову конфігурацію/)).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'Створити нову конфігурацію за підказками' }),
    );
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        internalNote: 'Не змінювати',
        accessories: [{ referenceId: 3, quantity: 2, unit: 'Piece' }],
      }),
    );
  });
  it('blocks a reviewed selection if the editor changed meanwhile', () => {
    const onApply = vi.fn();
    const view = render(
      <CustomSuggestionsPanel configuration={configuration} disabled={false} onApply={onApply} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути підказки' }));
    view.rerender(
      <CustomSuggestionsPanel
        configuration={{ ...configuration, clientComment: 'New value' }}
        disabled={false}
        onApply={onApply}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Створити нову конфігурацію за підказками' }),
    ).toBeDisabled();
    expect(onApply).not.toHaveBeenCalled();
  });
  it.each([403, 404])('hides cached norms on access loss %s', (status) => {
    api.query.error = { status };
    render(
      <CustomSuggestionsPanel configuration={configuration} disabled={false} onApply={vi.fn()} />,
    );
    expect(screen.queryByRole('button', { name: 'Переглянути підказки' })).not.toBeInTheDocument();
    expect(screen.queryByText(/Вибірка:/)).not.toBeInTheDocument();
  });
  it('does not offer partial norms after a source limit', () => {
    api.query.currentData = { ...response, sourceLimitReached: true };
    render(
      <CustomSuggestionsPanel configuration={configuration} disabled={false} onApply={vi.fn()} />,
    );
    expect(screen.queryByRole('button', { name: 'Переглянути підказки' })).not.toBeInTheDocument();
    expect(screen.getByText(/Часткові норми не застосовуються/)).toBeInTheDocument();
  });
  it('skips unsupported model groups and blocks writes when disabled', () => {
    const view = render(
      <CustomSuggestionsPanel
        configuration={{ ...configuration, productType: 'Інше' }}
        disabled={false}
        onApply={vi.fn()}
      />,
    );
    expect(api.read).toHaveBeenLastCalledWith(expect.anything(), { skip: true });
    view.rerender(
      <CustomSuggestionsPanel configuration={configuration} disabled onApply={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Переглянути підказки' })).toBeDisabled();
  });
});
