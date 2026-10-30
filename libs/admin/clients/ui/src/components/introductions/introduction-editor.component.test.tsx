import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IntroductionModelPicker } from './introduction-selection-pickers';
import { IntroductionTemplateForm } from './introduction-template-form';
import { IntroductionTemplatesList } from './introduction-templates-list';

afterEach(cleanup);

describe('first-contact selection editing (SC-I01–02)', () => {
  it('delegates paged search and selects the exact model without inventing its season', () => {
    const onSelect = vi.fn();
    const onSearchChange = vi.fn();
    render(
      <IntroductionModelPicker
        open
        options={[{ productId: 42, label: 'Модель' }]}
        loading={false}
        search="SKU"
        onSearchChange={onSearchChange}
        page={1}
        totalPages={3}
        onPageChange={vi.fn()}
        onClose={vi.fn()}
        onSelect={onSelect}
      />,
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'Пошук у списку' }), {
      target: { value: 'Артикул' },
    });
    expect(onSearchChange).toHaveBeenCalledWith('Артикул');
    expect(screen.queryByText('Зима')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Модель'));
    expect(onSelect).toHaveBeenCalledWith(42);
    expect(screen.getByRole('navigation', { name: 'Сторінки варіантів' })).toBeInTheDocument();
  });

  it('blocks saving without a template reference and preserves a stored reference', () => {
    const onSave = vi.fn();
    const common = { disabled: false, submitLabel: 'Зберегти', onChange: vi.fn(), onSave };
    const view = render(
      <IntroductionTemplateForm
        {...common}
        value={{ name: 'Добірка', format: 'summer', emailTemplateVersionId: '' }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Зберегти' })).toBeDisabled();
    expect(screen.getByText(/Немає доступної версії/)).toBeInTheDocument();
    view.rerender(
      <IntroductionTemplateForm
        {...common}
        value={{ name: 'Добірка', format: 'summer', emailTemplateVersionId: 'stored-reference' }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(onSave).toHaveBeenCalledOnce();
    view.rerender(
      <IntroductionTemplateForm
        {...common}
        value={{
          name: 'X'.repeat(301),
          format: 'summer',
          emailTemplateVersionId: 'stored-reference',
        }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Зберегти' })).toBeDisabled();
    expect(screen.getByText('Назва має містити не більше 300 символів.')).toBeInTheDocument();
  });

  it('does not reuse archived selections and emits the selected template identity for restore', () => {
    const onSelect = vi.fn();
    const onArchive = vi.fn();
    const onReuse = vi.fn();
    render(
      <IntroductionTemplatesList
        rows={[{ id: 'template-1', name: 'Архівна добірка', revision: 3, archived: true }]}
        onSelect={onSelect}
        onArchive={onArchive}
        onReuse={onReuse}
      />,
    );
    expect(screen.getByRole('button', { name: 'Використати' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Відкрити' }));
    fireEvent.click(screen.getByRole('button', { name: 'Відновити' }));
    expect(onSelect).toHaveBeenCalledWith('template-1');
    expect(onArchive).toHaveBeenCalledWith('template-1');
    expect(onReuse).not.toHaveBeenCalled();
  });
});
