import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { EmailTemplateVersionsList } from './email-template-versions-list';

afterEach(cleanup);
const detail = {
  id: 'v1',
  label: 'Пропозиція',
  number: 1,
  subject: 'КП',
  body: '<script>plain text</script>',
  createdAt: '2026-11-01T12:00:00Z',
};

it('identifies the active immutable version and selects an exact version', () => {
  const select = vi.fn();
  render(
    <EmailTemplateVersionsList rows={[detail]} activeId="v1" disabled={false} onSelect={select} />,
  );
  expect(screen.getByText('Активна')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Переглянути версію 1' }));
  expect(select).toHaveBeenCalledWith('v1');
});
