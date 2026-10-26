import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SewingCompositionEditor } from './sewing-composition-editor';

const lookups = { fabrics: [], accessories: [], operations: [] };

afterEach(cleanup);

describe('SewingCompositionEditor', () => {
  it('keeps Article materials separate from the shared operations editor', () => {
    render(
      <SewingCompositionEditor
        scope="Article"
        articleSku="246"
        version={3}
        materials={[]}
        operations={[
          {
            clientId: 'shared-op',
            operationId: 1,
            quantity: 1,
            manualMinutes: null,
            sortOrder: 0,
            reviewed: true,
          },
        ]}
        lookups={lookups}
        canManage
        dirty={false}
        onMaterialsChange={vi.fn()}
        onOperationsChange={vi.fn()}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Склад артикулу 246' })).toBeInTheDocument();
    expect(screen.getByText(/спільні рядки не дублюються/)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Спільні операції' })).not.toBeInTheDocument();
  });

  it('uses reference lookups for fabric and shows review blockers', () => {
    const onMaterialsChange = vi.fn();
    render(
      <SewingCompositionEditor
        scope="Model"
        version={0}
        materials={[
          {
            clientId: 'fabric',
            kind: 'Fabric',
            referenceId: null,
            costCode: null,
            quantity: 1,
            unit: 'Metre',
            required: true,
            sortOrder: 0,
            reviewed: true,
          },
        ]}
        operations={[
          {
            clientId: 'operation-11',
            operationId: 11,
            quantity: 1,
            manualMinutes: null,
            sortOrder: 0,
            reviewed: true,
          },
        ]}
        lookups={{
          ...lookups,
          fabrics: [{ id: 3, name: 'Бавовна', providerName: 'Постачальник', price: 10 }],
          operations: [{ id: 11, name: 'Пошиття', garmentPartName: 'Куртка', min: 4 }],
        }}
        canManage
        dirty
        blockers={['Операцію не перевірено']}
        onMaterialsChange={onMaterialsChange}
        onOperationsChange={vi.fn()}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole('alert', { name: 'Причини блокування розрахунку' })).toHaveTextContent(
      'Операцію не перевірено',
    );
    expect(screen.getByText('Нормативний час: 4 хв')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Тканина' }));
    expect(screen.getByRole('option', { name: 'Бавовна' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: 'Бавовна' }));
    expect(onMaterialsChange).toHaveBeenCalledWith([
      expect.objectContaining({ referenceId: 3, reviewed: false }),
    ]);
    fireEvent.click(screen.getByRole('button', { name: 'Додати матеріал' }));
    expect(onMaterialsChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'Fabric',
          unit: 'Metre',
          clientId: expect.stringMatching(/^new-material-/),
        }),
      ]),
    );
  });

  it('blocks saving a reference that is not present in the lookup data', () => {
    const onSave = vi.fn();
    render(
      <SewingCompositionEditor
        scope="Model"
        version={2}
        materials={[
          {
            clientId: 'missing-fabric',
            kind: 'Fabric',
            referenceId: 99,
            costCode: null,
            quantity: 1,
            unit: 'Metre',
            required: true,
            sortOrder: 0,
            reviewed: false,
          },
        ]}
        operations={[]}
        lookups={lookups}
        canManage
        dirty
        onMaterialsChange={vi.fn()}
        onOperationsChange={vi.fn()}
        onSave={onSave}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Зберегти склад' }));

    expect(screen.getByText('Тканину не знайдено в довіднику.')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('blocks saving a reference that is not present in the lookup data', () => {
    const onSave = vi.fn();
    render(
      <SewingCompositionEditor
        scope="Model"
        version={2}
        materials={[
          {
            clientId: 'missing-fabric',
            kind: 'Fabric',
            referenceId: 99,
            costCode: null,
            quantity: 1,
            unit: 'Metre',
            required: true,
            sortOrder: 0,
            reviewed: false,
          },
        ]}
        operations={[]}
        lookups={lookups}
        canManage
        dirty
        onMaterialsChange={vi.fn()}
        onOperationsChange={vi.fn()}
        onSave={onSave}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Зберегти склад' }));

    expect(screen.getByText('Тканину не знайдено в довіднику.')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});
