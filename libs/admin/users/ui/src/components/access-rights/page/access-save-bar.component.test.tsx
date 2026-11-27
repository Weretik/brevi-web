import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AccessSaveBar } from './access-save-bar';

describe('AccessSaveBar', () => {
  it('counts the changes, names the pages and saves', () => {
    const onSave = vi.fn();
    const onShowChanges = vi.fn();
    render(
      <AccessSaveBar
        changedTitles={['КП', 'Ціна вишивки', 'Залишки', 'Ліди']}
        onDiscard={vi.fn()}
        onSave={onSave}
        onShowChanges={onShowChanges}
        roleTitle="Менеджер"
        saving={false}
      />,
    );

    expect(screen.getByRole('region', { name: 'Незбережені зміни' })).toHaveTextContent(
      '4 зміни у ролі «Менеджер»: КП, Ціна вишивки, Залишки і ще 1',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Показати зміни' }));
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(onShowChanges).toHaveBeenCalled();
    expect(onSave).toHaveBeenCalled();
  });
});
