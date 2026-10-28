import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CustomerContactDialog } from './customer-contact-dialog';

import type { CustomerDetail } from '@admin/clients/model';

const transport = vi.hoisted(() => ({ save: vi.fn() }));
vi.mock('@admin/clients/data-access', () => ({
  useSaveCustomerContactMutation: () => [transport.save, { isLoading: false }],
}));
const customer: CustomerDetail = {
  publicId: '11111111-1111-4111-8111-111111111111',
  kind: 'person',
  displayName: 'Synthetic',
  legalName: null,
  taxIdentity: null,
  ownerId: 17,
  active: true,
  revision: 5,
  updatedAt: '2026-10-26T12:00:00Z',
  canEdit: true,
  canMerge: false,
  externalIdentities: [],
  contacts: [
    {
      publicId: '22222222-2222-4222-8222-222222222222',
      name: 'Synthetic contact',
      position: null,
      active: true,
      isPrimary: true,
      channels: [{ kind: 'email', value: 'synthetic@example.test' }],
    },
  ],
};
describe('customer contact editor', () => {
  afterEach(cleanup);
  beforeEach(() => {
    transport.save.mockReset();
    transport.save.mockReturnValue({ unwrap: () => Promise.resolve(customer) });
  });
  it('deactivates primary explicitly and saves under the current customer revision', async () => {
    const close = vi.fn();
    render(
      <CustomerContactDialog
        customer={customer}
        contact={customer.contacts[0]}
        onClose={close}
        onDirty={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Активний контакт' }));
    expect(screen.getByRole('checkbox', { name: 'Основний контакт' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Основний контакт' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти контакт' }));
    await waitFor(() => expect(close).toHaveBeenCalledOnce());
    expect(transport.save).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: customer.publicId,
        contactId: customer.contacts[0]?.publicId,
        revision: 5,
        requestId: expect.any(String),
        draft: expect.objectContaining({ active: false, isPrimary: false }),
      }),
    );
  });
  it('preserves invalid channel input and does not send it', () => {
    render(
      <CustomerContactDialog
        customer={customer}
        contact={customer.contacts[0]}
        onClose={vi.fn()}
        onDirty={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'Значення каналу 1' }), {
      target: { value: 'invalid' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти контакт' }));
    expect(screen.getByText('Перевірте email.')).toBeInTheDocument();
    expect(transport.save).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'Значення каналу 1' })).toHaveValue('invalid');
  });
});
