import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { EmailTemplateFields } from './email-template-fields';

afterEach(cleanup);

it('submits a new version separately and respects the write lock', () => {
  const save = vi.fn();
  const change = vi.fn();
  const view = render(
    <EmailTemplateFields
      value={{ name: '', subject: '', body: '' }}
      errors={{}}
      disabled={false}
      onSave={save}
      onChange={change}
    />,
  );
  fireEvent.change(screen.getByLabelText(/Назва шаблону/), { target: { value: 'Лист' } });
  expect(change).toHaveBeenCalledWith({ name: 'Лист', subject: '', body: '' });
  fireEvent.submit(screen.getByRole('form', { name: 'Нова версія шаблону листа' }));
  expect(save).toHaveBeenCalledTimes(1);
  view.rerender(
    <EmailTemplateFields
      value={{ name: 'Лист', subject: 'КП', body: 'Текст' }}
      errors={{}}
      disabled
      onSave={save}
      onChange={change}
    />,
  );
  expect(screen.getByRole('button', { name: 'Створити нову версію' })).toBeDisabled();
  expect(screen.getByLabelText(/Текст листа/)).toBeDisabled();
});
