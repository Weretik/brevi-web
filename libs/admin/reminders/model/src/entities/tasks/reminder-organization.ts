export const reminderOrganizations = ['ppBrevi', 'fopSohokon', 'none'] as const;
export type ReminderOrganization = (typeof reminderOrganizations)[number];

export const reminderOrganizationLabels: Record<ReminderOrganization, string> = {
  ppBrevi: 'ПП «Бреві»',
  fopSohokon: 'ФОП Согоконь',
  none: 'Особисте',
};
