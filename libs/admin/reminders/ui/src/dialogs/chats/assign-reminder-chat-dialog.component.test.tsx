import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AssignReminderChatDialog } from './assign-reminder-chat-dialog';

import type { ReminderChat } from '@admin/reminders/model';

afterEach(cleanup);

const chat: ReminderChat = {
  id: 3,
  kind: 'group',
  telegramTitle: 'Бухгалтерія',
  displayName: null,
  isApproved: true,
  isBotMember: true,
  receivesSiteRequests: false,
  discoveredAt: '2026-11-01T10:00:00Z',
};

describe('AssignReminderChatDialog', () => {
  it('assigns the chosen organizations', () => {
    const onAssign = vi.fn();
    render(
      <AssignReminderChatDialog
        chat={chat}
        saving={false}
        error={null}
        onClose={vi.fn()}
        onAssign={onAssign}
      />,
    );
    const submit = screen.getByRole('button', { name: 'Призначити' });
    expect(submit).toBeDisabled();
    fireEvent.click(screen.getByRole('checkbox', { name: 'ПП «Бреві»' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'ФОП Согоконь' }));
    fireEvent.click(submit);
    expect(onAssign).toHaveBeenCalledWith(['ppBrevi', 'fopSohokon']);
  });
});
