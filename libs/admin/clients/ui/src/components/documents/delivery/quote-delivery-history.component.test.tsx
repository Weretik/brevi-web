import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';

import { QuoteDeliveryHistory } from './quote-delivery-history';

afterEach(cleanup);

it('asks for manual Gmail inspection without claiming an automatic check or offering resend', () => {
  render(
    <QuoteDeliveryHistory
      currentVersionId="version"
      rows={[
        {
          id: 'delivery',
          quoteId: 'quote',
          versionId: 'version',
          pdfId: 'pdf',
          templateId: 'template',
          recipient: 'recipient@example.test',
          state: 'unknown',
          attempt: 1,
          error: 'gmail_send_outcome_unknown',
          createdAt: '2026-11-01T12:00:00Z',
          updatedAt: '2026-11-01T12:00:01Z',
          confirmedAt: null,
        },
      ]}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Перевірте папку «Надіслані» у Gmail вручну');
  expect(screen.getByRole('alert')).toHaveTextContent('Не створюйте повторну відправку');
  expect(screen.queryByText(/Результат перевіряється/)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /повтор/i })).not.toBeInTheDocument();
});

it('distinguishes operator evidence from Gmail API acceptance', () => {
  render(
    <QuoteDeliveryHistory
      currentVersionId="version"
      rows={[
        {
          id: 'delivery',
          quoteId: 'quote',
          versionId: 'version',
          pdfId: 'pdf',
          templateId: 'template',
          recipient: 'recipient@example.test',
          state: 'succeeded',
          attempt: 1,
          error: null,
          createdAt: '2026-11-01T12:00:00Z',
          updatedAt: '2026-11-01T12:01:00Z',
          confirmedAt: '2026-11-01T12:01:00Z',
          manualResolution: {
            outcome: 'sent',
            actorId: 17,
            attempt: 1,
            evidenceNote: 'Checked message and recipient.',
            createdAt: '2026-11-01T12:01:00Z',
          },
        },
      ]}
    />,
  );
  expect(screen.getByText('Надсилання підтверджено вручну')).toBeInTheDocument();
  expect(screen.getByText('Checked message and recipient.')).toBeInTheDocument();
  expect(screen.queryByText('Прийнято поштовим провайдером')).not.toBeInTheDocument();
});
