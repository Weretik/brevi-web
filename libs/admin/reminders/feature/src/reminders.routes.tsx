import { lazy } from 'react';

const ReminderTasksPage = lazy(() => import('./pages/tasks/reminder-tasks-page'));
const ReminderOccurrencesPage = lazy(() => import('./pages/occurrences/reminder-occurrences-page'));
const ReminderChatsPage = lazy(() => import('./pages/chats/reminder-chats-page'));
const NonWorkingDaysPage = lazy(() => import('./pages/calendar/non-working-days-page'));

export const remindersRoutes = [
  { path: '/reminders/tasks', element: <ReminderTasksPage /> },
  { path: '/reminders/periods', element: <ReminderOccurrencesPage /> },
  { path: '/reminders/chats', element: <ReminderChatsPage /> },
  { path: '/reminders/non-working-days', element: <NonWorkingDaysPage /> },
] as const;
