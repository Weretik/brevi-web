import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ReferenceEditorDrawer } from './reference-editor-drawer';

describe('ReferenceEditorDrawer', () => {
  it('exposes read-only content and switches to editing through its callback', () => {
    const onEdit = vi.fn();

    render(
      <ReferenceEditorDrawer
        titleId="reference-title"
        title="Тканина"
        description="Перегляд довідника"
        formId="reference-form"
        paperWidth={480}
        readOnly
        saving={false}
        onClose={vi.fn()}
        onEdit={onEdit}
        onSubmit={vi.fn()}
      >
        <div>Основна тканина</div>
      </ReferenceEditorDrawer>,
    );

    expect(screen.getByRole('dialog', { name: 'Тканина' })).toBeInTheDocument();
    expect(screen.getByText('Основна тканина')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати' }));
    expect(onEdit).toHaveBeenCalledOnce();
  });
});
