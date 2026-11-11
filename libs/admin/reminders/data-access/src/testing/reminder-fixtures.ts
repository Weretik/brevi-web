export const taskResponse = {
  id: 14,
  title: 'Декларація єдиного податку',
  organization: 'fopSohokon',
  schedule: {
    periodicity: 'quarterly',
    dueRule: 'daysAfterPeriodEnd',
    day: 40,
    monthOffset: 0,
    leadDays: 5,
  },
  chatId: null,
  chatName: null,
  activeFrom: '2026-11-01',
  isEnabled: true,
  nextDueDates: [{ period: 'III квартал 2026', dueDate: '2026-11-09', remindFrom: '2026-11-04' }],
  createdAt: '2026-11-01T11:58:53.880058+00:00',
  updatedAt: null,
};

export const occurrenceResponse = {
  id: 5,
  taskId: 14,
  taskTitle: 'Декларація єдиного податку',
  organization: 'fopSohokon',
  period: 'III квартал 2026',
  dueDate: '2026-11-09',
  remindFrom: '2026-11-04',
  status: 'done',
  snoozedUntil: null,
  closedBy: { name: 'Олена Бух', telegramUserId: 42, adminUserId: null },
  closedAt: '2026-11-05T07:10:00+00:00',
  actions: [
    {
      kind: 'done',
      actor: { name: 'Олена Бух', telegramUserId: 42, adminUserId: null },
      at: '2026-11-05T07:10:00+00:00',
      snoozedUntil: null,
    },
  ],
};

export const chatResponse = {
  id: 3,
  telegramChatId: -100123,
  kind: 'group',
  telegramTitle: 'Бухгалтерія Бреві',
  displayName: null,
  isApproved: false,
  isBotMember: true,
  receivesSiteRequests: true,
  discoveredAt: '2026-11-01T10:00:00+00:00',
};
