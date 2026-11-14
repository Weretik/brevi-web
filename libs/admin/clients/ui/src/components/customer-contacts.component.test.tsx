import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CustomerContacts } from './customer-contacts';

import type { CustomerContact } from '@admin/clients/model';

const contact: CustomerContact = {
  publicId: '22222222-2222-4222-8222-222222222222',
  name: 'Олена',
  position: 'Закупівлі',
  active: true,
  isPrimary: true,
  channels: [{ kind: 'email', value: 'olena@example.test' }],
};

afterEach(cleanup);

describe('CustomerContacts', () => {
  it('lists contacts and edits one when editing is allowed', () => {
    const onEdit = vi.fn();
    render(<CustomerContacts contacts={[contact]} canEdit onEdit={onEdit} />);
    expect(screen.getByText('Олена · основний')).toBeVisible();
    expect(screen.getByText('Закупівлі · olena@example.test')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати контакт Олена' }));
    expect(onEdit).toHaveBeenCalledWith(contact);
  });

  it('shows the empty state without edit buttons for a read-only client', () => {
    render(<CustomerContacts contacts={[]} canEdit={false} onEdit={vi.fn()} />);
    expect(screen.getByText('Контактів ще немає.')).toBeVisible();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
