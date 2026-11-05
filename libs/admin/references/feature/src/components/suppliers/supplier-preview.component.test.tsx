import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useSupplierPreview } from './supplier-preview';

vi.mock('@admin/references/data-access', () => ({
  useListSuppliersQuery: (_arg: unknown, { skip }: { skip: boolean }) =>
    skip
      ? { data: undefined, isSuccess: false, isError: false }
      : {
          data: [{ id: 5, name: 'АВ-Центр' }],
          isSuccess: true,
          isError: false,
        },
}));
vi.mock('./supplier-drawer', () => ({
  SupplierDrawer: ({ supplier, mode }: { supplier: { name: string }; mode: string }) => (
    <div role="dialog" aria-label={`${mode}: ${supplier.name}`} />
  ),
}));

afterEach(cleanup);

function Page({ name, id }: { name?: string; id?: number }) {
  const preview = useSupplierPreview();
  return (
    <>
      <button type="button" onClick={() => preview.open({ id, name })}>
        Відкрити
      </button>
      {preview.element}
    </>
  );
}

describe('Supplier preview (CAT-019)', () => {
  it('opens the supplier card found by name, ignoring case', async () => {
    render(<Page name=" ав-центр" />);
    await userEvent.click(screen.getByRole('button', { name: 'Відкрити' }));
    expect(screen.getByRole('dialog', { name: 'view: АВ-Центр' })).toBeInTheDocument();
  });

  it('opens it by ID when the name differs', async () => {
    render(<Page id={5} name="Інша назва" />);
    await userEvent.click(screen.getByRole('button', { name: 'Відкрити' }));
    expect(screen.getByRole('dialog', { name: 'view: АВ-Центр' })).toBeInTheDocument();
  });

  it('says when the supplier is not in «Контрагенти»', async () => {
    render(<Page name="Невідомий" />);
    await userEvent.click(screen.getByRole('button', { name: 'Відкрити' }));
    expect(screen.getByText(/Постачальника «Невідомий» немає/)).toBeInTheDocument();
  });
});
