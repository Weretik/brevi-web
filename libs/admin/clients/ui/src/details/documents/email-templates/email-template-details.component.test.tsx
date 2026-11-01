import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { EmailTemplateDetails } from './email-template-details';

afterEach(cleanup);
const detail = {
  id: 'v1',
  label: 'Пропозиція',
  number: 1,
  subject: 'КП',
  body: '<script>plain text</script>',
  createdAt: '2026-11-01T12:00:00Z',
};

it('renders immutable message content as plain text with Manager read-only actions', () => {
  const { container } = render(
    <EmailTemplateDetails
      value={detail}
      canManage={false}
      canActivate={false}
      disabled={false}
      onCopy={vi.fn()}
      onActivate={vi.fn()}
    />,
  );
  expect(screen.getByText(detail.body)).toBeInTheDocument();
  expect(container.querySelector('script')).toBeNull();
  expect(screen.queryByRole('button', { name: /Активувати/ })).not.toBeInTheDocument();
});
