import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SupplierEditorDialog } from './supplier-editor-dialog';

import type { SupplierDraft } from '@admin/references/model';

const draft: SupplierDraft = {
  id: 101,
  name: 'Атлас',
  contactPerson: '',
  phoneNumber: '',
  notes: '',
  link: 'supplier.example',
  email: '',
  purchaseCategories: '',
  isActive: true,
};

afterEach(cleanup);

describe('SupplierEditorDialog without API providers', () => {
  it('passes field changes and Enter submission to the feature callbacks', () => {
    const onChange = vi.fn();
    const onSave = vi.fn();
    render(
      <SupplierEditorDialog
        mode="create"
        draft={draft}
        errors={{}}
        message={null}
        saving={false}
        onChange={onChange}
        onSave={onSave}
        onClose={vi.fn()}
        onEnableEditing={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'Назва' }), {
      target: { value: 'Текстиль' },
    });
    expect(onChange).toHaveBeenCalledWith('name', 'Текстиль');
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Назва' }), { key: 'Enter' });
    expect(onSave).toHaveBeenCalledOnce();
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Нотатки' }), { key: 'Enter' });
    expect(onSave).toHaveBeenCalledOnce();
  });

  it('shows read-only data and requests editing without owning its state', async () => {
    const user = userEvent.setup();
    const onEnableEditing = vi.fn();
    render(
      <SupplierEditorDialog
        mode="view"
        draft={draft}
        errors={{}}
        message={null}
        saving={false}
        onChange={vi.fn()}
        onSave={vi.fn()}
        onClose={vi.fn()}
        onEnableEditing={onEnableEditing}
      />,
    );
    expect(screen.getByRole('textbox', { name: 'Назва' })).toBeDisabled();
    expect(screen.getByRole('spinbutton', { name: 'ID' })).toBeDisabled();
    expect(screen.getByRole('link', { name: 'supplier.example' })).toHaveAttribute(
      'href',
      'https://supplier.example/',
    );
    await user.click(screen.getByRole('button', { name: 'Редагувати' }));
    expect(onEnableEditing).toHaveBeenCalledOnce();
    expect(screen.getByRole('textbox', { name: 'Назва' })).toBeDisabled();
  });

  it('renders feature errors and disables submission while saving', () => {
    render(
      <SupplierEditorDialog
        mode="edit"
        draft={draft}
        errors={{ name: 'Назва вже існує.' }}
        message="Не вдалося зберегти постачальника."
        saving
        onChange={vi.fn()}
        onSave={vi.fn()}
        onClose={vi.fn()}
        onEnableEditing={vi.fn()}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Не вдалося зберегти постачальника.');
    expect(screen.getByRole('textbox', { name: 'Назва' })).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Назва вже існує.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Зберегти' })).toBeDisabled();
  });
});
