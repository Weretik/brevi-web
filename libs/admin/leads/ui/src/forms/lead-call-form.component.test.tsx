import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LeadCallForm } from './lead-call-form';

import type { LeadCallFormValues, LeadCallResult } from '@admin/leads/model';

const results: LeadCallResult[] = [
  { id: 1, name: 'Не дозвонились', outcome: 'Retry', retryDays: 1, isActive: true, position: 0 },
  {
    id: 2,
    name: 'Передзвонити',
    outcome: 'Callback',
    retryDays: null,
    isActive: true,
    position: 1,
  },
  { id: 3, name: 'Відмова', outcome: 'Closed', retryDays: null, isActive: true, position: 2 },
];

afterEach(cleanup);

function renderForm(values: LeadCallFormValues, onChange = vi.fn(), onSubmit = vi.fn()) {
  render(
    <LeadCallForm
      company="L&S Distributions"
      results={results}
      values={values}
      errors={{}}
      showErrors={false}
      saving={false}
      now={new Date(2026, 10, 9, 10, 0)}
      onChange={onChange}
      onSubmit={onSubmit}
    />,
  );
  return { onChange, onSubmit };
}

describe('LeadCallForm', () => {
  it('picks a result with one press and shows its hint', () => {
    const { onChange } = renderForm({ resultId: null, nextContactAt: '', comment: '' });
    expect(screen.getByText('повтор через 1 дн')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Передзвонити/ }));
    expect(onChange).toHaveBeenCalledWith({ resultId: 2, nextContactAt: '', comment: '' });
  });

  it('asks for a date with quick picks after «Передзвонити» and says a task will appear', () => {
    const { onChange } = renderForm({ resultId: 2, nextContactAt: '', comment: '' });
    expect(screen.getByLabelText('Коли зв’язатися')).toBeVisible();
    fireEvent.click(screen.getByText('Завтра'));
    expect(onChange).toHaveBeenCalledWith({
      resultId: 2,
      nextContactAt: '2026-11-10T10:00',
      comment: '',
    });
    expect(screen.getByText(/задачею «Подзвонити: L&S Distributions»/)).toBeVisible();
  });

  it('hides the date for a result that closes the lead', () => {
    renderForm({ resultId: 3, nextContactAt: '', comment: '' });
    expect(screen.queryByLabelText('Коли зв’язатися')).toBeNull();
  });

  it('saves and moves on', () => {
    const { onSubmit } = renderForm({ resultId: 3, nextContactAt: '', comment: '' });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти → наступний' }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
