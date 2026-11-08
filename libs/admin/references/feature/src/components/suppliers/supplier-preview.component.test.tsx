import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useSupplierPreview } from './supplier-preview';

vi.mock('@admin/references/data-access', () => ({
  useListSuppliersQuery: (_arg: unknown, { skip }: { skip: boolean }) =>
    skip
      ? { data: undefined, isSuccess: false, isError: false }
      : {
          data: [
            {
              id: 5,
              name: 'АВ-Центр',
              link: 'av-centr.ua',
              contactPerson: 'Олена',
              phoneNumber: '+380 67 000-00-00',
              email: 'sales@av.ua',
              purchaseCategories: 'Тканини',
              tags: null,
              isActive: true,
              notes: 'Рулон мінімум',
              keepinCrmId: null,
              keepinSyncedAt: null,
            },
          ],
          isSuccess: true,
          isError: false,
        },
}));

afterEach(cleanup);

function Page({ name, id, canOpen }: { name?: string; id?: number; canOpen?: boolean }) {
  const preview = useSupplierPreview({ canOpenCounterparties: canOpen });
  return (
    <>
      <button
        type="button"
        onClick={() =>
          preview.open({
            id,
            name,
            related: {
              title: 'Тканини в КП',
              rows: [{ key: 1, label: 'Саржа', value: '182 грн/м' }],
            },
          })
        }
      >
        Відкрити
      </button>
      {preview.element}
    </>
  );
}

function Where() {
  const location = useLocation();
  return <p>{`${location.pathname}${location.search}`}</p>;
}

function renderPage(props: { name?: string; id?: number; canOpen?: boolean }) {
  return render(
    <MemoryRouter initialEntries={['/crm/quotes/1']}>
      <Routes>
        <Route path="/crm/quotes/1" element={<Page {...props} />} />
        <Route path="/references/counterparties" element={<Where />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Supplier preview (CAT-019)', () => {
  it('opens the supplier card found by name, ignoring case', async () => {
    renderPage({ name: ' ав-центр' });
    await userEvent.click(screen.getByRole('button', { name: 'Відкрити' }));
    expect(screen.getByRole('dialog', { name: 'АВ-Центр' })).toBeInTheDocument();
  });

  it('opens it by ID when the name differs', async () => {
    renderPage({ id: 5, name: 'Інша назва' });
    await userEvent.click(screen.getByRole('button', { name: 'Відкрити' }));
    expect(screen.getByRole('dialog', { name: 'АВ-Центр' })).toBeInTheDocument();
  });

  it('says when the supplier is not in «Контрагенти»', async () => {
    renderPage({ name: 'Невідомий' });
    await userEvent.click(screen.getByRole('button', { name: 'Відкрити' }));
    expect(screen.getByText(/Постачальника «Невідомий» немає/)).toBeInTheDocument();
  });

  it('shows the read-only card with contact links and the extra section', async () => {
    renderPage({ id: 5 });
    await userEvent.click(screen.getByRole('button', { name: 'Відкрити' }));
    expect(screen.getByRole('link', { name: '+380 67 000-00-00' })).toHaveAttribute(
      'href',
      'tel:+380670000000',
    );
    expect(screen.getByRole('link', { name: 'sales@av.ua' })).toHaveAttribute(
      'href',
      'mailto:sales@av.ua',
    );
    expect(screen.getByRole('link', { name: 'Сайт постачальника' })).toHaveAttribute(
      'href',
      'https://av-centr.ua/',
    );
    expect(screen.getByText('Саржа')).toBeInTheDocument();
    expect(screen.getByText('Рулон мінімум')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('opens the supplier in «Контрагенти»', async () => {
    renderPage({ id: 5 });
    await userEvent.click(screen.getByRole('button', { name: 'Відкрити' }));
    await userEvent.click(screen.getByRole('button', { name: 'Відкрити в контрагентах' }));
    expect(await screen.findByText('/references/counterparties?supplier=5')).toBeInTheDocument();
  });

  it('hides «Відкрити в контрагентах» without access', async () => {
    renderPage({ id: 5, canOpen: false });
    await userEvent.click(screen.getByRole('button', { name: 'Відкрити' }));
    expect(
      screen.queryByRole('button', { name: 'Відкрити в контрагентах' }),
    ).not.toBeInTheDocument();
  });
});
