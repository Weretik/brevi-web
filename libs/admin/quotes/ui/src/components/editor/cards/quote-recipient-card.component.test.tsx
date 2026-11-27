import { emptyQuoteDraft } from '@admin/quotes/model';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { QuoteRecipientCard } from './quote-recipient-card';

import type { QuoteDraft } from '@admin/quotes/model';

afterEach(cleanup);

function Card({ onDraft }: { onDraft: (draft: QuoteDraft) => void }) {
  const [draft, setDraft] = useState(emptyQuoteDraft());
  return (
    <QuoteRecipientCard
      draft={draft}
      clients={[
        {
          publicId: 'c-1',
          name: 'Агроресурс',
          companyName: 'ТОВ «Агроресурс»',
          contactName: 'Марина',
        },
      ]}
      headerError={undefined}
      onChange={(patch) =>
        setDraft((current) => {
          const next = { ...current, ...patch };
          onDraft(next);
          return next;
        })
      }
      onClientSearch={() => undefined}
    />
  );
}

describe('«Кому» links the КП to the chosen client (CARD-001)', () => {
  it('stores the client id when a client is chosen and drops it when the name is typed again', async () => {
    const onDraft = vi.fn();
    render(<Card onDraft={onDraft} />);
    const field = screen.getByRole('combobox', { name: /Клієнт або запит/ });
    await userEvent.type(field, 'Агро');
    await userEvent.click(await screen.findByRole('option', { name: /Агроресурс/ }));
    expect(onDraft).toHaveBeenLastCalledWith(
      expect.objectContaining({ internalName: 'Агроресурс', customerPublicId: 'c-1' }),
    );
    expect(screen.getByText('Пов’язано з клієнтом: КП буде в його картці.')).toBeInTheDocument();
    fireEvent.change(field, { target: { value: 'Агроресурс 2' } });
    expect(onDraft).toHaveBeenLastCalledWith(
      expect.objectContaining({ internalName: 'Агроресурс 2', customerPublicId: null }),
    );
  });
});
