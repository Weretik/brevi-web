import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FinanceHistoryList } from './finance-history-list';

describe('finance history list', () => {
  it('shows each change with who made it, newest first as given', () => {
    render(
      <FinanceHistoryList
        loading={false}
        error={null}
        entries={[
          {
            id: 2,
            entity: 'Account',
            entityId: 'a1',
            action: 'CutoverConfirm',
            by: 'director@brevi.com.ua',
            at: '2026-11-05T08:00:00+00:00',
            beforeJson: '{}',
            afterJson: '{}',
          },
          {
            id: 1,
            entity: 'Account',
            entityId: 'a1',
            action: 'Create',
            by: 'director@brevi.com.ua',
            at: '2026-11-04T08:00:00+00:00',
            beforeJson: null,
            afterJson: '{}',
          },
        ]}
      />,
    );

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Підтверджено залишок на 01.10');
    expect(items[0]).toHaveTextContent('05.11.26');
    expect(items[1]).toHaveTextContent('Створено');
  });

  it('names the file an added or deleted file entry is about', () => {
    render(
      <FinanceHistoryList
        loading={false}
        error={null}
        entries={[
          {
            id: 3,
            entity: 'Transaction',
            entityId: 't1',
            action: 'AttachmentDelete',
            by: 'director@brevi.com.ua',
            at: '2026-11-05T09:00:00+00:00',
            beforeJson: '{"fileName":"Рахунок 12.pdf"}',
            afterJson: null,
          },
        ]}
      />,
    );
    expect(screen.getByText('Видалено файл · Рахунок 12.pdf')).toBeVisible();
  });

  it('says when there are no changes yet', () => {
    render(<FinanceHistoryList loading={false} error={null} entries={[]} />);
    expect(screen.getByText('Змін ще немає.')).toBeVisible();
  });
});
