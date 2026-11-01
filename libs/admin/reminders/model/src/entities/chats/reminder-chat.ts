export const reminderChatKinds = ['group', 'private'] as const;
export type ReminderChatKind = (typeof reminderChatKinds)[number];

export const reminderChatKindLabels: Record<ReminderChatKind, string> = {
  group: 'Група',
  private: 'Особистий чат',
};

export const reminderChatNameMaxLength = 200;

export interface ReminderChat {
  id: number;
  kind: ReminderChatKind;
  telegramTitle: string;
  displayName: string | null;
  isApproved: boolean;
  isBotMember: boolean;
  /** ISO date-time when the bot first saw the chat. */
  discoveredAt: string;
}

export interface ReminderChatInput {
  displayName: string | null;
  isApproved: boolean;
}

export function reminderChatName(
  chat: Pick<ReminderChat, 'displayName' | 'telegramTitle'>,
): string {
  return chat.displayName?.trim() || chat.telegramTitle;
}
